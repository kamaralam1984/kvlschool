'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Camera, CameraOff, AlertTriangle, Shield, ShieldAlert, ShieldOff } from 'lucide-react'

export type ViolationType = 'no_face' | 'multiple_faces' | 'face_turned'
export interface Violation {
  id: string
  type: ViolationType
  label: string
  timestamp: Date
  screenshot: string
}

interface Props {
  onViolation?: (v: Violation) => void
  onAutoSubmit?: () => void
  examId: string
  studentName: string
}

const VIOLATION_LABELS: Record<ViolationType, string> = {
  no_face: 'No face detected',
  multiple_faces: 'Multiple faces detected',
  face_turned: 'Face turned away',
}

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights'
const DETECTION_INTERVAL_MS = 3000
const WARNING_THRESHOLD = 3
const AUTO_SUBMIT_THRESHOLD = 5

export default function ExamProctor({ onViolation, onAutoSubmit, examId, studentName }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const faceapiRef = useRef<typeof import('face-api.js') | null>(null)

  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [violations, setViolations] = useState<Violation[]>([])
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [status, setStatus] = useState<'loading' | 'monitored' | 'warning' | 'flagged'>('loading')
  const [lastDetection, setLastDetection] = useState<string>('Initializing…')

  // Load face-api.js models from CDN
  useEffect(() => {
    let cancelled = false
    async function loadModels() {
      try {
        const faceapi = await import('face-api.js')
        faceapiRef.current = faceapi
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ])
        if (!cancelled) setModelsLoaded(true)
      } catch (err) {
        console.error('Face-api model load error:', err)
        if (!cancelled) setCameraError('Failed to load face detection models.')
      }
    }
    loadModels()
    return () => { cancelled = true }
  }, [])

  // Start webcam after models are loaded
  useEffect(() => {
    if (!modelsLoaded) return
    let cancelled = false
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' },
          audio: false,
        })
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setStatus('monitored')
        }
      } catch (err: any) {
        if (!cancelled) setCameraError(err?.message ?? 'Camera access denied.')
      }
    }
    startCamera()
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [modelsLoaded])

  const captureScreenshot = useCallback((): string => {
    if (!videoRef.current) return ''
    const canvas = document.createElement('canvas')
    canvas.width = 160
    canvas.height = 120
    const ctx = canvas.getContext('2d')
    if (ctx && videoRef.current.readyState >= 2) {
      ctx.drawImage(videoRef.current, 0, 0, 160, 120)
    }
    return canvas.toDataURL('image/jpeg', 0.6)
  }, [])

  const addViolation = useCallback((type: ViolationType) => {
    const screenshot = captureScreenshot()
    const v: Violation = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      label: VIOLATION_LABELS[type],
      timestamp: new Date(),
      screenshot,
    }
    setViolations(prev => {
      const next = [...prev, v]
      const count = next.length
      if (count >= AUTO_SUBMIT_THRESHOLD) {
        setStatus('flagged')
        onAutoSubmit?.()
      } else if (count >= WARNING_THRESHOLD) {
        setStatus('warning')
        setShowWarningModal(true)
      }
      return next
    })
    onViolation?.(v)
  }, [captureScreenshot, onViolation, onAutoSubmit])

  // Face detection loop
  useEffect(() => {
    if (!modelsLoaded || cameraError) return
    const faceapi = faceapiRef.current
    if (!faceapi) return

    intervalRef.current = setInterval(async () => {
      const video = videoRef.current
      if (!video || video.readyState < 2) return
      try {
        const detections = await faceapi.detectAllFaces(
          video,
          new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
        ).withFaceLandmarks()

        if (detections.length === 0) {
          setLastDetection('No face detected')
          addViolation('no_face')
        } else if (detections.length > 1) {
          setLastDetection(`${detections.length} faces detected`)
          addViolation('multiple_faces')
        } else {
          // Check if face is turned away using nose tip vs chin horizontal offset
          const landmarks = detections[0].landmarks
          const noseTip = landmarks.getNose()[3]
          const chin = landmarks.getJawOutline()[8]
          const offset = Math.abs(noseTip.x - chin.x)
          const faceWidth = landmarks.getJawOutline()[16].x - landmarks.getJawOutline()[0].x
          if (faceWidth > 0 && offset / faceWidth > 0.22) {
            setLastDetection('Face turned away')
            addViolation('face_turned')
          } else {
            setLastDetection('Face detected ✓')
            setStatus(prev => prev === 'loading' ? 'monitored' : prev === 'flagged' ? 'flagged' : violations.length >= WARNING_THRESHOLD ? 'warning' : 'monitored')
          }
        }
      } catch (err) {
        console.error('Detection error:', err)
      }
    }, DETECTION_INTERVAL_MS)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [modelsLoaded, cameraError, addViolation, violations.length])

  const statusConfig = {
    loading:   { color: 'bg-gray-400',   icon: <Camera className="w-3 h-3" />,      label: 'Loading…' },
    monitored: { color: 'bg-green-500',  icon: <Shield className="w-3 h-3" />,      label: 'Monitored' },
    warning:   { color: 'bg-yellow-500', icon: <ShieldAlert className="w-3 h-3" />, label: 'Warning' },
    flagged:   { color: 'bg-red-500',    icon: <ShieldOff className="w-3 h-3" />,   label: 'Flagged' },
  }[status]

  return (
    <>
      {/* Proctor overlay — fixed bottom-right */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        {/* Status badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-medium shadow-lg ${statusConfig.color}`}>
          {statusConfig.icon}
          {statusConfig.label}
          {violations.length > 0 && (
            <span className="ml-1 bg-white/30 rounded-full px-1.5 py-0.5 text-[10px] font-bold">
              {violations.length}
            </span>
          )}
        </div>

        {/* Webcam feed */}
        <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black"
          style={{ width: 160, height: 120 }}>
          {cameraError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-gray-400 text-center p-2">
              <CameraOff className="w-6 h-6 mb-1" />
              <span className="text-[9px]">{cameraError}</span>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover scale-x-[-1]"
              muted
              playsInline
              autoPlay
            />
          )}
          {!modelsLoaded && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-[10px]">
              Loading models…
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />

          {/* Detection label */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1.5 py-0.5 truncate">
            {lastDetection}
          </div>
        </div>

        {/* Proctor label */}
        <p className="text-[10px] text-gray-400 font-medium tracking-wide">AI PROCTOR</p>
      </div>

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Proctoring Warning</h3>
                <p className="text-xs text-gray-500">Suspicious activity detected</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              You have <strong>{violations.length} violation{violations.length > 1 ? 's' : ''}</strong> recorded.
              After <strong>{AUTO_SUBMIT_THRESHOLD} violations</strong>, your exam will be <strong>auto-submitted</strong> and flagged for review.
            </p>
            <ul className="text-xs text-gray-500 space-y-1 mb-4 bg-gray-50 rounded-xl p-3">
              <li>• Keep your face visible and centered in the camera</li>
              <li>• Do not allow other people in front of the camera</li>
              <li>• Do not look away from the screen for extended periods</li>
            </ul>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
              I Understand — Continue Exam
            </button>
          </div>
        </div>
      )}
    </>
  )
}
