'use client'
import React, { useState } from 'react'
import { Plus, X, Trash2, Clock, Users, BookOpen, CheckCircle2, PlayCircle, BarChart2, ChevronDown, Play, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import ViolationReport from '@/components/admin/exams/ViolationReport'
import type { Violation } from '@/components/admin/exams/ExamProctor'

// Mock violation data per exam (in production this would come from backend)
const MOCK_VIOLATIONS: Record<string, Violation[]> = {
  '2': [
    { id: 'v1', type: 'no_face',        label: 'No face detected',        timestamp: new Date('2025-01-25T11:08:23'), screenshot: '' },
    { id: 'v2', type: 'face_turned',    label: 'Face turned away',         timestamp: new Date('2025-01-25T11:22:11'), screenshot: '' },
    { id: 'v3', type: 'multiple_faces', label: 'Multiple faces detected',  timestamp: new Date('2025-01-25T11:35:47'), screenshot: '' },
  ],
}

interface MCQOption { id: string; text: string }
interface MCQQuestion { id: string; text: string; options: MCQOption[]; correct: string; marks: number }
interface Exam {
  id: string; title: string; subject: string; class: string; section: string;
  duration: number; totalMarks: number; startDate: string; startTime: string;
  status: 'Draft' | 'Scheduled' | 'Live' | 'Completed'; questions: MCQQuestion[]
}

const MOCK_EXAMS: Exam[] = [
  {
    id: '1', title: 'Mid-Term Mathematics', subject: 'Mathematics', class: '10', section: 'A',
    duration: 90, totalMarks: 50, startDate: '2025-02-10', startTime: '09:00',
    status: 'Scheduled', questions: [],
  },
  {
    id: '2', title: 'Science Unit Test', subject: 'Science', class: '9', section: 'B',
    duration: 60, totalMarks: 30, startDate: '2025-01-25', startTime: '11:00',
    status: 'Completed', questions: [],
  },
  {
    id: '3', title: 'English Grammar Quiz', subject: 'English', class: '8', section: 'A',
    duration: 45, totalMarks: 25, startDate: '2025-02-01', startTime: '10:00',
    status: 'Draft', questions: [],
  },
]

const statusStyle: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-600',
  Scheduled: 'bg-blue-100 text-blue-700',
  Live: 'bg-green-100 text-green-700',
  Completed: 'bg-purple-100 text-purple-700',
}
const statusIcon: Record<string, React.ReactNode> = {
  Draft: <BookOpen className="w-3.5 h-3.5" />,
  Scheduled: <Clock className="w-3.5 h-3.5" />,
  Live: <PlayCircle className="w-3.5 h-3.5" />,
  Completed: <CheckCircle2 className="w-3.5 h-3.5" />,
}

function newQ(): MCQQuestion {
  return {
    id: String(Date.now()),
    text: '',
    options: [
      { id: 'a', text: '' }, { id: 'b', text: '' },
      { id: 'c', text: '' }, { id: 'd', text: '' },
    ],
    correct: 'a',
    marks: 1,
  }
}

export default function OnlineExamsPage() {
  const [exams, setExams] = useState<Exam[]>(MOCK_EXAMS)
  const [showCreate, setShowCreate] = useState(false)
  const [editingExam, setEditingExam] = useState<Exam | null>(null)
  const [reportExam, setReportExam] = useState<Exam | null>(null)

  const [form, setForm] = useState({
    title: '', subject: '', class: '10', section: 'A',
    duration: 60, totalMarks: 50, startDate: '', startTime: '09:00',
  })
  const [questions, setQuestions] = useState<MCQQuestion[]>([newQ()])

  function addQuestion() { setQuestions(q => [...q, newQ()]) }
  function removeQuestion(id: string) { setQuestions(q => q.filter(x => x.id !== id)) }
  function updateQ(id: string, patch: Partial<MCQQuestion>) {
    setQuestions(q => q.map(x => x.id === id ? { ...x, ...patch } : x))
  }
  function updateOption(qId: string, optId: string, text: string) {
    setQuestions(q => q.map(x =>
      x.id === qId ? { ...x, options: x.options.map(o => o.id === optId ? { ...o, text } : o) } : x
    ))
  }

  function handleCreate() {
    const exam: Exam = {
      id: String(Date.now()),
      ...form,
      status: 'Draft',
      questions,
    }
    setExams(prev => [exam, ...prev])
    setShowCreate(false)
    setQuestions([newQ()])
    setForm({ title: '', subject: '', class: '10', section: 'A', duration: 60, totalMarks: 50, startDate: '', startTime: '09:00' })
  }

  function deleteExam(id: string) {
    if (confirm('Delete this exam?')) setExams(prev => prev.filter(e => e.id !== id))
  }

  function publishExam(id: string) {
    setExams(prev => prev.map(e => e.id === id ? { ...e, status: 'Scheduled' } : e))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Online Exams</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage MCQ-based online exams</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Plus className="w-4 h-4" /> Create Exam
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Exams', value: exams.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Scheduled', value: exams.filter(e => e.status === 'Scheduled').length, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Live Now', value: exams.filter(e => e.status === 'Live').length, icon: PlayCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Completed', value: exams.filter(e => e.status === 'Completed').length, icon: BarChart2, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Exam Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {exams.map(e => (
          <div key={e.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[e.status]}`}>
                {statusIcon[e.status]}{e.status}
              </span>
              <div className="flex gap-1">
                {e.status === 'Draft' && (
                  <button onClick={() => publishExam(e.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                    Publish
                  </button>
                )}
                <button onClick={() => deleteExam(e.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{e.title}</h3>
            <p className="text-xs text-gray-500 mb-3">{e.subject} · Class {e.class} – {e.section}</p>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{e.duration} min</span>
              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{e.totalMarks} marks</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{e.questions.length} Qs</span>
            </div>
            {e.startDate && (
              <p className="text-xs text-gray-400 mt-2">{e.startDate} at {e.startTime}</p>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              {(e.status === 'Scheduled' || e.status === 'Live') && (
                <Link
                  href={`/admin/exams/take/${e.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] text-white rounded-lg text-xs font-medium hover:bg-[#163050] transition-colors">
                  <Play className="w-3 h-3" /> Start Exam
                </Link>
              )}
              {e.status === 'Completed' && (
                <Link
                  href={`/admin/exams/take/${e.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
                  <Play className="w-3 h-3" /> Preview
                </Link>
              )}
              {e.status === 'Draft' && (
                <Link
                  href={`/admin/exams/take/${e.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
                  <Play className="w-3 h-3" /> Preview
                </Link>
              )}
              <button
                onClick={() => setReportExam(e)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                <ShieldAlert className="w-3 h-3" />
                {MOCK_VIOLATIONS[e.id]?.length
                  ? <span className="text-orange-600 font-semibold">{MOCK_VIOLATIONS[e.id].length} flags</span>
                  : 'Proctor'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Violation Report Modal */}
      {reportExam && (
        <ViolationReport
          studentName="Demo Student"
          examTitle={reportExam.title}
          examDate={reportExam.startDate || new Date().toISOString().slice(0, 10)}
          violations={MOCK_VIOLATIONS[reportExam.id] ?? []}
          onClose={() => setReportExam(null)}
        />
      )}

      {/* Create Exam Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-6 shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">Create Online Exam</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Exam Title</label>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Mid-Term Mathematics" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
                {[
                  { label: 'Subject', key: 'subject', type: 'text', placeholder: 'Mathematics' },
                  { label: 'Duration (minutes)', key: 'duration', type: 'number', placeholder: '60' },
                  { label: 'Total Marks', key: 'totalMarks', type: 'number', placeholder: '50' },
                  { label: 'Start Date', key: 'startDate', type: 'date', placeholder: '' },
                  { label: 'Start Time', key: 'startTime', type: 'time', placeholder: '' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                    <input type={f.type} value={(form as any)[f.key]} placeholder={f.placeholder}
                      onChange={e => setForm(p => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                  </div>
                ))}
                {[
                  { label: 'Class', key: 'class', opts: ['7','8','9','10','11','12'] },
                  { label: 'Section', key: 'section', opts: ['A','B','C','D','All'] },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                    <select value={(form as any)[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 bg-white">
                      {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {/* Questions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">MCQ Questions ({questions.length})</h3>
                  <button onClick={addQuestion}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1e3a5f]/30 text-[#1e3a5f] rounded-lg text-xs font-medium hover:bg-[#1e3a5f]/5 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                  {questions.map((q, qi) => (
                    <div key={q.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500">Q{qi + 1}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-500">Marks:</span>
                            <input type="number" min={1} value={q.marks}
                              onChange={e => updateQ(q.id, { marks: Number(e.target.value) })}
                              className="w-12 px-2 py-1 border border-gray-200 rounded-lg text-xs text-center focus:outline-none" />
                          </div>
                          {questions.length > 1 && (
                            <button onClick={() => removeQuestion(q.id)} className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <input value={q.text} onChange={e => updateQ(q.id, { text: e.target.value })}
                        placeholder="Enter question…"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map(opt => (
                          <div key={opt.id} className={`flex items-center gap-2 border rounded-lg px-2.5 py-2 cursor-pointer transition-colors ${q.correct === opt.id ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                            onClick={() => updateQ(q.id, { correct: opt.id })}>
                            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${q.correct === opt.id ? 'border-green-500 text-green-600' : 'border-gray-300 text-gray-500'}`}>
                              {opt.id.toUpperCase()}
                            </span>
                            <input value={opt.text} onClick={e => e.stopPropagation()}
                              onChange={e => updateOption(q.id, opt.id, e.target.value)}
                              placeholder={`Option ${opt.id.toUpperCase()}`}
                              className="flex-1 text-xs bg-transparent focus:outline-none text-gray-700 min-w-0" />
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-400">Click an option to mark it as correct answer</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowCreate(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleCreate} className="px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] transition-colors">
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
