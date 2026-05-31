'use client'

import { useState } from 'react'
import { Plus, Upload, Eye, CheckCircle2, Clock, X, FileText, Star } from 'lucide-react'

const assignments = [
  {
    id: 1,
    title: 'Chapter 5 — Quadratic Equations',
    class: 'Class 10A',
    dueDate: '31 May 2026',
    maxMarks: 20,
    submitted: 38,
    total: 42,
    status: 'active',
  },
  {
    id: 2,
    title: 'Trigonometry Practice Set',
    class: 'Class 10B',
    dueDate: '30 May 2026',
    maxMarks: 15,
    submitted: 40,
    total: 40,
    status: 'closed',
  },
  {
    id: 3,
    title: 'Algebra Worksheet 3',
    class: 'Class 9A',
    dueDate: '2 Jun 2026',
    maxMarks: 10,
    submitted: 12,
    total: 38,
    status: 'active',
  },
]

const submissions: Record<number, { id: number; student: string; class: string; roll: string; submittedAt: string; file: string; marks: number | null; feedback: string }[]> = {
  1: [
    { id: 1, student: 'Priya Sharma', class: '10A', roll: '10A01', submittedAt: '31 May, 10:15 AM', file: 'priya_ch5.pdf', marks: null, feedback: '' },
    { id: 2, student: 'Rohan Verma', class: '10A', roll: '10A02', submittedAt: '31 May, 09:45 AM', file: 'rohan_ch5.pdf', marks: 18, feedback: 'Excellent work!' },
    { id: 3, student: 'Ananya Singh', class: '10A', roll: '10A03', submittedAt: '31 May, 11:02 AM', file: 'ananya_ch5.pdf', marks: null, feedback: '' },
    { id: 4, student: 'Kabir Mehta', class: '10A', roll: '10A04', submittedAt: '30 May, 08:30 PM', file: 'kabir_ch5.pdf', marks: 14, feedback: 'Good effort, review section 3' },
  ],
  2: [
    { id: 5, student: 'Arjun Mehta', class: '10B', roll: '10B01', submittedAt: '30 May, 10:00 AM', file: 'arjun_trig.pdf', marks: 13, feedback: 'Well done' },
    { id: 6, student: 'Kavya Nair', class: '10B', roll: '10B02', submittedAt: '30 May, 11:30 AM', file: 'kavya_trig.pdf', marks: 15, feedback: 'Perfect score!' },
  ],
  3: [
    { id: 7, student: 'Sneha Patel', class: '9A', roll: '9A01', submittedAt: '31 May, 08:00 AM', file: 'sneha_alg3.pdf', marks: null, feedback: '' },
  ],
}

export default function AssignmentsPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null)
  const [localMarks, setLocalMarks] = useState<Record<number, { marks: string; feedback: string }>>({})
  const [form, setForm] = useState({ title: '', class: 'Class 10A', dueDate: '', maxMarks: '20', description: '' })

  const selected = assignments.find(a => a.id === selectedAssignment)
  const subs = selectedAssignment ? (submissions[selectedAssignment] || []) : []

  const getLocal = (id: number) => localMarks[id] || { marks: '', feedback: '' }

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Assignments</h2>
          <p className="text-sm text-gray-500 mt-0.5">Create and grade student assignments</p>
        </div>
        <button onClick={() => setShowCreate(o => !o)} className="btn-primary">
          <Plus size={15} /> Create Assignment
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="card border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">New Assignment</h3>
            <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                placeholder="Assignment title"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label">Class</label>
              <select
                className="form-input"
                value={form.class}
                onChange={e => setForm(f => ({ ...f, class: e.target.value }))}
              >
                <option>Class 10A</option>
                <option>Class 10B</option>
                <option>Class 9A</option>
              </select>
            </div>
            <div>
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label">Max Marks</label>
              <input
                type="number"
                className="form-input"
                value={form.maxMarks}
                onChange={e => setForm(f => ({ ...f, maxMarks: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label">Attachment (optional)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:border-indigo-300 transition-colors">
                <Upload size={18} className="mx-auto text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">Upload PDF, DOCX</p>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="form-label">Description / Instructions</label>
              <textarea
                rows={3}
                className="form-input resize-none"
                placeholder="Assignment instructions..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="btn-primary">Publish Assignment</button>
            <button className="btn-secondary">Save Draft</button>
          </div>
        </div>
      )}

      {/* Assignment Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map(a => {
          const pct = Math.round((a.submitted / a.total) * 100)
          return (
            <div key={a.id} className="card hover:shadow-card-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm leading-snug">{a.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{a.class}</p>
                </div>
                <span className={`badge ml-2 ${a.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {a.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Submissions</span>
                  <span className="font-medium text-gray-700">{a.submitted}/{a.total}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Due: {a.dueDate}</span>
                  <span>Max: {a.maxMarks} marks</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedAssignment(a.id === selectedAssignment ? null : a.id)}
                className="w-full btn-secondary justify-center"
              >
                <Eye size={14} />
                {a.id === selectedAssignment ? 'Hide Submissions' : 'View Submissions'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Submissions Panel */}
      {selectedAssignment && selected && (
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-3 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
            <h3 className="font-semibold text-indigo-900">{selected.title} — Submissions</h3>
            <button onClick={() => setSelectedAssignment(null)} className="text-indigo-400 hover:text-indigo-600">
              <X size={16} />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {subs.length === 0 && (
              <p className="text-center py-8 text-gray-400 text-sm">No submissions yet</p>
            )}
            {subs.map(sub => {
              const local = getLocal(sub.id)
              const currentMarks = local.marks !== '' ? local.marks : (sub.marks !== null ? String(sub.marks) : '')
              const currentFeedback = local.feedback !== '' ? local.feedback : sub.feedback

              return (
                <div key={sub.id} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {sub.student.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-gray-800">{sub.student}</p>
                        <span className="text-xs text-gray-400">({sub.roll})</span>
                        <span className="badge bg-gray-100 text-gray-600 text-xs">{sub.submittedAt}</span>
                      </div>
                      <a href="#" className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline mt-1">
                        <FileText size={11} /> {sub.file}
                      </a>
                    </div>
                    {sub.marks !== null && !local.marks && (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                        <CheckCircle2 size={13} /> Graded
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 ml-12">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Marks /{selected.maxMarks}</label>
                      <input
                        type="number"
                        min={0}
                        max={selected.maxMarks}
                        value={currentMarks}
                        onChange={e => setLocalMarks(prev => ({ ...prev, [sub.id]: { ...getLocal(sub.id), marks: e.target.value } }))}
                        className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="—"
                      />
                    </div>
                    <div className="flex-1 min-w-[180px]">
                      <label className="text-xs text-gray-500 mb-1 block">Feedback</label>
                      <input
                        type="text"
                        value={currentFeedback}
                        onChange={e => setLocalMarks(prev => ({ ...prev, [sub.id]: { ...getLocal(sub.id), feedback: e.target.value } }))}
                        className="form-input text-xs"
                        placeholder="Write feedback..."
                      />
                    </div>
                    <div className="flex items-end">
                      <button className="btn-primary text-xs py-1.5">
                        <Star size={12} /> Save Grade
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {subs.some(s => s.marks === null) && (
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
              <Clock size={14} className="text-amber-500" />
              <p className="text-xs text-gray-500">{subs.filter(s => s.marks === null).length} submission(s) awaiting grades</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
