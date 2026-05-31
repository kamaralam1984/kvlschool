'use client'
import React, { useState } from 'react'
import { UserCheck, CheckCircle2, Clock, ChevronRight, X, Search } from 'lucide-react'

type Step = 'Fee Payment' | 'Doc Verification' | 'Roll Number' | 'Class Assign' | 'Complete'

const STEPS: Step[] = ['Fee Payment', 'Doc Verification', 'Roll Number', 'Class Assign', 'Complete']

interface Applicant {
  id: string
  name: string
  appNo: string
  applyingClass: string
  approvedDate: string
  currentStep: number // 0-indexed, 5 = done
  enrolledRoll?: string
}

const MOCK: Applicant[] = [
  { id: '1', name: 'Aarav Sharma',    appNo: 'APP-2025-001', applyingClass: '6',  approvedDate: '2025-01-28', currentStep: 4, enrolledRoll: 'KVL-6A-054' },
  { id: '2', name: 'Meera Joshi',     appNo: 'APP-2025-002', applyingClass: '4',  approvedDate: '2025-01-29', currentStep: 3 },
  { id: '3', name: 'Rohan Gupta',     appNo: 'APP-2025-003', applyingClass: '9',  approvedDate: '2025-01-30', currentStep: 2 },
  { id: '4', name: 'Ananya Singh',    appNo: 'APP-2025-005', applyingClass: '7',  approvedDate: '2025-01-30', currentStep: 4, enrolledRoll: 'KVL-7B-051' },
  { id: '5', name: 'Karan Verma',     appNo: 'APP-2025-006', applyingClass: '10', approvedDate: '2025-01-31', currentStep: 1 },
  { id: '6', name: 'Siddharth Nair',  appNo: 'APP-2025-008', applyingClass: '8',  approvedDate: '2025-01-31', currentStep: 4, enrolledRoll: 'KVL-8A-052' },
  { id: '7', name: 'Kavya Reddy',     appNo: 'APP-2025-011', applyingClass: '3',  approvedDate: '2025-02-01', currentStep: 0 },
  { id: '8', name: 'Arjun Patel',     appNo: 'APP-2025-012', applyingClass: '5',  approvedDate: '2025-02-01', currentStep: 0 },
  { id: '9', name: 'Ishaan Tiwari',   appNo: 'APP-2025-014', applyingClass: '2',  approvedDate: '2025-02-02', currentStep: 1 },
  { id: '10', name: 'Shruti Malhotra', appNo: 'APP-2025-015', applyingClass: '11', approvedDate: '2025-02-02', currentStep: 2 },
  { id: '11', name: 'Dev Kapoor',     appNo: 'APP-2025-017', applyingClass: '1',  approvedDate: '2025-02-03', currentStep: 0 },
  { id: '12', name: 'Nisha Pandey',   appNo: 'APP-2025-018', applyingClass: '6',  approvedDate: '2025-02-03', currentStep: 3 },
]

export default function EnrollmentPage() {
  const [applicants, setApplicants] = useState<Applicant[]>(MOCK)
  const [search, setSearch] = useState('')
  const [enrollModal, setEnrollModal] = useState<Applicant | null>(null)

  const filtered = applicants.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.appNo.toLowerCase().includes(search.toLowerCase())
  )

  const pendingCount = applicants.filter(a => a.currentStep < 4).length
  const enrolledToday = 3
  const totalEnrolled = 54

  function advanceStep(id: string) {
    setApplicants(prev => prev.map(a =>
      a.id === id && a.currentStep < 4 ? { ...a, currentStep: a.currentStep + 1 } : a
    ))
    setEnrollModal(null)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Enrollment Management</h1>
          <p className="text-sm text-gray-500 mt-1">Process approved applicants through enrollment steps</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Enrollment', value: pendingCount, icon: Clock, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
          { label: 'Enrolled Today', value: enrolledToday, icon: UserCheck, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
          { label: 'Total Enrolled', value: totalEnrolled, icon: CheckCircle2, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
        ].map(s => (
          <div key={s.label} className={`bg-white border ${s.border} rounded-2xl p-5`}>
            <div className={`inline-flex p-2.5 rounded-xl ${s.color} mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold text-[#1e3a5f]">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Steps legend */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Enrollment Steps</p>
        <div className="flex items-center gap-2 flex-wrap">
          {STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-[#1e3a5f] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-xs text-gray-600">{step}</span>
              </div>
              {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-gray-300" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or application number..."
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]"
        />
      </div>

      {/* Applicant cards */}
      <div className="space-y-3">
        {filtered.map(a => {
          const isComplete = a.currentStep >= 4
          return (
            <div key={a.id} className={`bg-white border ${isComplete ? 'border-green-100' : 'border-gray-100'} rounded-2xl p-5`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800">{a.name}</span>
                    <span className="text-xs text-gray-400 font-mono">{a.appNo}</span>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Class {a.applyingClass}</span>
                    {isComplete && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        Enrolled · {a.enrolledRoll}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Approved: {a.approvedDate}</p>

                  {/* Stepper */}
                  <div className="flex items-center gap-1 mt-3 flex-wrap">
                    {STEPS.map((step, i) => {
                      const done = i < a.currentStep
                      const active = i === a.currentStep
                      return (
                        <React.Fragment key={step}>
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              done ? 'bg-green-500 text-white' :
                              active ? 'bg-[#1e3a5f] text-white' :
                              'bg-gray-100 text-gray-400'
                            }`}>
                              {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                            </div>
                            <span className={`text-[10px] text-center leading-tight max-w-[52px] ${
                              done ? 'text-green-600' : active ? 'text-[#1e3a5f] font-medium' : 'text-gray-400'
                            }`}>{step}</span>
                          </div>
                          {i < STEPS.length - 1 && (
                            <div className={`h-0.5 w-6 flex-shrink-0 mb-4 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
                          )}
                        </React.Fragment>
                      )
                    })}
                  </div>
                </div>

                {!isComplete && (
                  <button
                    onClick={() => setEnrollModal(a)}
                    className="flex-shrink-0 bg-[#1e3a5f] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#16304f] transition-colors"
                  >
                    Process
                  </button>
                )}
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 text-sm">
            No applicants found
          </div>
        )}
      </div>

      {/* Process Modal */}
      {enrollModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#1e3a5f]">Process Enrollment</h3>
              <button onClick={() => setEnrollModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div className="text-sm text-gray-700">
                <strong>{enrollModal.name}</strong> · {enrollModal.appNo}
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
                Next step: <strong>{STEPS[enrollModal.currentStep]}</strong>
              </div>
              <p className="text-xs text-gray-500">
                Marking this step as complete will advance the student to the next enrollment stage.
              </p>
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => advanceStep(enrollModal.id)}
                className="flex-1 bg-[#1e3a5f] text-white py-2 rounded-xl text-sm font-medium hover:bg-[#16304f] transition-colors"
              >
                Mark Complete & Advance
              </button>
              <button onClick={() => setEnrollModal(null)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
