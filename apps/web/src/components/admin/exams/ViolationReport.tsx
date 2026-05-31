'use client'
import React from 'react'
import { X, Printer, AlertTriangle, CheckCircle2, ShieldAlert, Shield, Camera, Clock, User } from 'lucide-react'
import type { Violation } from './ExamProctor'

interface Props {
  studentName: string
  examTitle: string
  examDate: string
  violations: Violation[]
  onClose: () => void
}

function getSeverity(count: number): { label: string; color: string; icon: React.ReactNode } {
  if (count === 0) return { label: 'Clear', color: 'text-green-600 bg-green-50', icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> }
  if (count < 3)   return { label: 'Suspicious', color: 'text-yellow-700 bg-yellow-50', icon: <ShieldAlert className="w-4 h-4 text-yellow-500" /> }
  return              { label: 'Flagged for Review', color: 'text-red-700 bg-red-50', icon: <AlertTriangle className="w-4 h-4 text-red-500" /> }
}

const VIOLATION_COLOR: Record<string, string> = {
  no_face:        'bg-red-100 text-red-700',
  multiple_faces: 'bg-orange-100 text-orange-700',
  face_turned:    'bg-yellow-100 text-yellow-700',
}

export default function ViolationReport({ studentName, examTitle, examDate, violations, onClose }: Props) {
  const counts = {
    no_face:        violations.filter(v => v.type === 'no_face').length,
    multiple_faces: violations.filter(v => v.type === 'multiple_faces').length,
    face_turned:    violations.filter(v => v.type === 'face_turned').length,
  }
  const severity = getSeverity(violations.length)

  function handlePrint() {
    window.print()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-6 shadow-2xl print:shadow-none print:my-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl print:static">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center">
              <Shield className="w-4.5 h-4.5 text-[#1e3a5f]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Proctoring Report</h2>
              <p className="text-xs text-gray-500">AI-based exam monitoring summary</p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Student & Exam Info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <User className="w-3.5 h-3.5 text-gray-400" />, label: 'Student', value: studentName },
              { icon: <Shield className="w-3.5 h-3.5 text-gray-400" />, label: 'Exam', value: examTitle },
              { icon: <Clock className="w-3.5 h-3.5 text-gray-400" />, label: 'Date', value: examDate },
              { icon: <Camera className="w-3.5 h-3.5 text-gray-400" />, label: 'Total Violations', value: String(violations.length) },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                {item.icon}
                <div>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Severity */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${severity.color}`}>
            {severity.icon}
            <div>
              <p className="text-sm font-bold">Assessment: {severity.label}</p>
              <p className="text-xs opacity-80">
                {violations.length === 0
                  ? 'No suspicious activity detected during the exam.'
                  : violations.length < 3
                  ? 'Some minor anomalies detected. Manual review recommended.'
                  : 'Multiple violations detected. This exam is flagged for manual review.'}
              </p>
            </div>
          </div>

          {/* Violation Counts by Type */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Violations by Type</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'no_face',        label: 'No Face',        count: counts.no_face },
                { key: 'multiple_faces', label: 'Multiple Faces', count: counts.multiple_faces },
                { key: 'face_turned',    label: 'Face Turned',    count: counts.face_turned },
              ].map(item => (
                <div key={item.key} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          {violations.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Violation Timeline</h3>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {violations.map((v, i) => (
                  <div key={v.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                    <span className="text-xs text-gray-400 font-mono w-5 flex-shrink-0">#{i + 1}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${VIOLATION_COLOR[v.type]}`}>
                      {v.label}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {v.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Screenshots Grid */}
          {violations.some(v => v.screenshot) && (
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Captured Frames</h3>
              <div className="grid grid-cols-4 gap-2">
                {violations.filter(v => v.screenshot).slice(0, 8).map((v, i) => (
                  <div key={v.id} className="relative rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-100">
                    {v.screenshot ? (
                      <img
                        src={v.screenshot}
                        alt={`Violation ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="w-4 h-4 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] px-1 py-0.5 truncate">
                      {v.label}
                    </div>
                  </div>
                ))}
              </div>
              {violations.length > 8 && (
                <p className="text-xs text-gray-400 mt-2 text-center">+{violations.length - 8} more frames</p>
              )}
            </div>
          )}

          {violations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <p className="font-semibold text-gray-800">No violations recorded</p>
              <p className="text-xs text-gray-400 mt-1">The student completed this exam without any proctoring flags.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
