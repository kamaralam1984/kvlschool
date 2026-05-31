'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Clock, AlertTriangle, CheckCircle2, Maximize2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { Violation } from '@/components/admin/exams/ExamProctor'

// Dynamically import ExamProctor to avoid SSR issues with face-api.js
const ExamProctor = dynamic(() => import('@/components/admin/exams/ExamProctor'), { ssr: false })

// ── Mock Exam Data ──────────────────────────────────────────────────────────
interface MCQOption { id: string; text: string }
interface MCQQuestion { id: string; text: string; options: MCQOption[]; correct: string; marks: number }
interface ExamData {
  id: string; title: string; subject: string; class: string; section: string
  duration: number; totalMarks: number; questions: MCQQuestion[]
}

const MOCK_EXAM: ExamData = {
  id: '1',
  title: 'Mid-Term Mathematics',
  subject: 'Mathematics',
  class: '10',
  section: 'A',
  duration: 60,
  totalMarks: 60,
  questions: [
    { id: 'q1',  text: 'What is the value of π (pi) to two decimal places?', options: [{ id: 'a', text: '3.14' }, { id: 'b', text: '3.16' }, { id: 'c', text: '3.12' }, { id: 'd', text: '3.18' }], correct: 'a', marks: 5 },
    { id: 'q2',  text: 'If x² = 49, what are the possible values of x?', options: [{ id: 'a', text: '7 only' }, { id: 'b', text: '-7 only' }, { id: 'c', text: '±7' }, { id: 'd', text: '±49' }], correct: 'c', marks: 5 },
    { id: 'q3',  text: 'What is the sum of angles in a triangle?', options: [{ id: 'a', text: '90°' }, { id: 'b', text: '180°' }, { id: 'c', text: '270°' }, { id: 'd', text: '360°' }], correct: 'b', marks: 5 },
    { id: 'q4',  text: 'Simplify: (2³ × 2⁴)', options: [{ id: 'a', text: '2⁷' }, { id: 'b', text: '2¹²' }, { id: 'c', text: '4⁷' }, { id: 'd', text: '2⁶' }], correct: 'a', marks: 5 },
    { id: 'q5',  text: 'What is the HCF of 36 and 48?', options: [{ id: 'a', text: '6' }, { id: 'b', text: '12' }, { id: 'c', text: '18' }, { id: 'd', text: '24' }], correct: 'b', marks: 5 },
    { id: 'q6',  text: 'A rectangle has length 8 cm and width 5 cm. What is its area?', options: [{ id: 'a', text: '30 cm²' }, { id: 'b', text: '35 cm²' }, { id: 'c', text: '40 cm²' }, { id: 'd', text: '45 cm²' }], correct: 'c', marks: 5 },
    { id: 'q7',  text: 'What is the slope of a horizontal line?', options: [{ id: 'a', text: 'Undefined' }, { id: 'b', text: '1' }, { id: 'c', text: '-1' }, { id: 'd', text: '0' }], correct: 'd', marks: 5 },
    { id: 'q8',  text: 'What is 15% of 200?', options: [{ id: 'a', text: '25' }, { id: 'b', text: '30' }, { id: 'c', text: '35' }, { id: 'd', text: '40' }], correct: 'b', marks: 5 },
    { id: 'q9',  text: 'In a right triangle with legs 3 and 4, what is the hypotenuse?', options: [{ id: 'a', text: '5' }, { id: 'b', text: '6' }, { id: 'c', text: '7' }, { id: 'd', text: '8' }], correct: 'a', marks: 5 },
    { id: 'q10', text: 'What is the LCM of 4 and 6?', options: [{ id: 'a', text: '12' }, { id: 'b', text: '18' }, { id: 'c', text: '24' }, { id: 'd', text: '6' }], correct: 'a', marks: 5 },
    { id: 'q11', text: 'Which of the following is a prime number?', options: [{ id: 'a', text: '15' }, { id: 'b', text: '21' }, { id: 'c', text: '29' }, { id: 'd', text: '33' }], correct: 'c', marks: 5 },
    { id: 'q12', text: 'If 2x + 3 = 11, what is x?', options: [{ id: 'a', text: '3' }, { id: 'b', text: '4' }, { id: 'c', text: '5' }, { id: 'd', text: '6' }], correct: 'b', marks: 5 },
  ],
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function TakeExamPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params?.examId as string

  const exam = MOCK_EXAM // In production, fetch by examId
  const TOTAL_SECONDS = exam.duration * 60

  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS)
  const [submitted, setSubmitted] = useState(false)
  const [violations, setViolations] = useState<Violation[]>([])
  const [tabSwitches, setTabSwitches] = useState(0)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Anti-cheat: disable keyboard shortcuts + copy/paste + right-click ──
  useEffect(() => {
    if (!started || submitted) return
    function onKeyDown(e: KeyboardEvent) {
      const blocked = [
        e.key === 'F12',
        e.ctrlKey && ['c', 'v', 'a', 'u', 's', 'p'].includes(e.key.toLowerCase()),
        e.metaKey && ['c', 'v', 'a', 'u', 's', 'p'].includes(e.key.toLowerCase()),
        e.key === 'PrintScreen',
      ]
      if (blocked.some(Boolean)) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    function onContextMenu(e: MouseEvent) { e.preventDefault() }
    function onCopy(e: ClipboardEvent) { e.preventDefault() }
    function onPaste(e: ClipboardEvent) { e.preventDefault() }
    function onVisibilityChange() {
      if (document.hidden) {
        setTabSwitches(n => n + 1)
        setViolations(prev => [...prev, {
          id: `tab-${Date.now()}`,
          type: 'face_turned' as any,
          label: 'Tab/window switched',
          timestamp: new Date(),
          screenshot: '',
        }])
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('copy', onCopy)
    document.addEventListener('paste', onPaste)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('copy', onCopy)
      document.removeEventListener('paste', onPaste)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [started, submitted])

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!started || submitted) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { handleAutoSubmit(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [started, submitted])

  // ── Submit handlers ────────────────────────────────────────────────────────
  const handleAutoSubmit = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setSubmitted(true)
    setShowSubmitConfirm(false)
  }, [])

  function handleSubmit() {
    if (timerRef.current) clearInterval(timerRef.current)
    setSubmitted(true)
    setShowSubmitConfirm(false)
  }

  // ── Score ─────────────────────────────────────────────────────────────────
  const score = exam.questions.reduce((acc, q) => acc + (answers[q.id] === q.correct ? q.marks : 0), 0)
  const answered = Object.keys(answers).length
  const progress = Math.round((answered / exam.questions.length) * 100)

  // ── Fullscreen ────────────────────────────────────────────────────────────
  function requestFullscreen() {
    document.documentElement.requestFullscreen?.().catch(() => {})
  }

  // ── Start Screen ──────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
        <div className="bg-[#1e293b] rounded-2xl max-w-lg w-full p-8 text-center shadow-2xl border border-white/10">
          <div className="w-16 h-16 bg-[#1e3a5f] rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-blue-300" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{exam.title}</h1>
          <p className="text-slate-400 text-sm mb-6">{exam.subject} · Class {exam.class}–{exam.section}</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Questions', value: exam.questions.length },
              { label: 'Duration', value: `${exam.duration} min` },
              { label: 'Total Marks', value: exam.totalMarks },
            ].map(item => (
              <div key={item.label} className="bg-[#0f172a] rounded-xl p-3">
                <p className="text-xl font-bold text-white">{item.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="text-left bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 space-y-1.5">
            <p className="text-yellow-400 font-semibold text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Important Instructions</p>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
              <li>Your webcam will be active throughout the exam for proctoring.</li>
              <li>Keep your face clearly visible in the camera at all times.</li>
              <li>Tab switching, copy-paste, and right-click are disabled.</li>
              <li>After 3 violations you will receive a warning.</li>
              <li>After 5 violations the exam will be auto-submitted.</li>
            </ul>
          </div>

          <button
            onClick={() => { requestFullscreen(); setStarted(true) }}
            className="w-full py-3.5 bg-[#1e3a5f] hover:bg-[#163050] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2">
            <Maximize2 className="w-4 h-4" /> Start Exam (Full Screen)
          </button>
        </div>
      </div>
    )
  }

  // ── Results Screen ────────────────────────────────────────────────────────
  if (submitted) {
    const percentage = Math.round((score / exam.totalMarks) * 100)
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
        <div className="bg-[#1e293b] rounded-2xl max-w-md w-full p-8 text-center shadow-2xl border border-white/10">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${percentage >= 60 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <CheckCircle2 className={`w-8 h-8 ${percentage >= 60 ? 'text-green-400' : 'text-red-400'}`} />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Exam Submitted</h2>
          <p className="text-slate-400 text-sm mb-6">{exam.title}</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Score', value: `${score}/${exam.totalMarks}` },
              { label: 'Percentage', value: `${percentage}%` },
              { label: 'Violations', value: violations.length },
            ].map(item => (
              <div key={item.label} className="bg-[#0f172a] rounded-xl p-3">
                <p className="text-xl font-bold text-white">{item.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
          {violations.length >= 5 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-xs text-red-300">
              This exam has been <strong>flagged for review</strong> due to {violations.length} proctoring violations.
            </div>
          )}
          <button onClick={() => router.push('/admin/exams/online')}
            className="w-full py-3 bg-[#1e3a5f] hover:bg-[#163050] text-white rounded-xl font-semibold text-sm transition-colors">
            Back to Exams
          </button>
        </div>
      </div>
    )
  }

  // ── Exam UI ───────────────────────────────────────────────────────────────
  const q = exam.questions[currentQ]
  const isLowTime = timeLeft < 600

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col select-none" onContextMenu={e => e.preventDefault()}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#1e293b] border-b border-white/10 flex-shrink-0">
        <div>
          <p className="text-white font-semibold text-sm">{exam.title}</p>
          <p className="text-slate-400 text-xs">{exam.subject} · Class {exam.class}–{exam.section}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>{answered}/{exam.questions.length} answered</span>
              <span>{progress}%</span>
            </div>
            <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono font-bold text-sm ${isLowTime ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'}`}>
            <Clock className="w-3.5 h-3.5" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Question Navigation Sidebar */}
        <aside className="w-56 flex-shrink-0 bg-[#1e293b] border-r border-white/10 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Questions</p>
          <div className="grid grid-cols-4 gap-1.5">
            {exam.questions.map((question, i) => {
              const isAnswered = !!answers[question.id]
              const isCurrent = i === currentQ
              return (
                <button
                  key={question.id}
                  onClick={() => setCurrentQ(i)}
                  className={`w-full aspect-square rounded-lg text-xs font-semibold transition-colors ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isAnswered
                      ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}>
                  {i + 1}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-1.5 text-[10px] text-slate-500">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-600 flex-shrink-0" />Current</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-green-600/20 border border-green-600/30 flex-shrink-0" />Answered</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-white/5 flex-shrink-0" />Not answered</div>
          </div>

          {/* Violations indicator */}
          {violations.length > 0 && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-2.5">
              <p className="text-red-400 text-[10px] font-semibold">{violations.length} violation{violations.length > 1 ? 's' : ''}</p>
              <p className="text-red-300/60 text-[9px] mt-0.5">
                {5 - violations.length > 0 ? `${5 - violations.length} until auto-submit` : 'Exam will be submitted'}
              </p>
            </div>
          )}
        </aside>

        {/* Question Area */}
        <main className="flex-1 overflow-y-auto p-6 pb-32">
          <div className="max-w-2xl mx-auto">
            {/* Question header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Question {currentQ + 1} of {exam.questions.length}
              </span>
              <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
                {q.marks} mark{q.marks > 1 ? 's' : ''}
              </span>
            </div>

            {/* Question text */}
            <div className="bg-[#1e293b] rounded-2xl p-6 mb-4 border border-white/10">
              <p className="text-white text-base leading-relaxed">{q.text}</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {q.options.map(opt => {
                const selected = answers[q.id] === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                      selected
                        ? 'border-blue-500 bg-blue-500/10 text-white'
                        : 'border-white/10 bg-[#1e293b] text-slate-300 hover:border-white/20 hover:bg-white/5'
                    }`}>
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                      selected ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-400'
                    }`}>
                      {opt.id.toUpperCase()}
                    </span>
                    <span className="text-sm">{opt.text}</span>
                  </button>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setCurrentQ(i => Math.max(0, i - 1))}
                disabled={currentQ === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-slate-400 text-sm hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {currentQ < exam.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQ(i => Math.min(exam.questions.length - 1, i + 1))}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors">
                  <CheckCircle2 className="w-4 h-4" /> Submit Exam
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Submit Confirm Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] rounded-2xl max-w-sm w-full p-6 border border-white/10 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Submit Exam?</h3>
            <p className="text-slate-400 text-sm mb-1">
              You have answered <strong className="text-white">{answered}</strong> of <strong className="text-white">{exam.questions.length}</strong> questions.
            </p>
            {exam.questions.length - answered > 0 && (
              <p className="text-yellow-400 text-xs mb-4">
                <AlertTriangle className="w-3 h-3 inline mr-1" />
                {exam.questions.length - answered} question{exam.questions.length - answered > 1 ? 's' : ''} left unanswered.
              </p>
            )}
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors">
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Proctor overlay */}
      <ExamProctor
        examId={examId}
        studentName="Current Student"
        onViolation={v => setViolations(prev => [...prev, v])}
        onAutoSubmit={handleAutoSubmit}
      />
    </div>
  )
}
