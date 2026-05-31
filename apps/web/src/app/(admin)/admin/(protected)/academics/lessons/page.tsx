'use client'
import React, { useState, useMemo } from 'react'
import { Search, Plus, Edit2, Trash2, X, BookOpen, ChevronDown } from 'lucide-react'

type LessonStatus = 'Planned' | 'In Progress' | 'Completed'

interface Lesson {
  id: string
  subject: string
  class: string
  section: string
  chapter: string
  topic: string
  duration: number
  method: string
  resources: string
  status: LessonStatus
}

const MOCK: Lesson[] = [
  { id: '1', subject: 'Mathematics', class: '10', section: 'A', chapter: 'Chapter 4', topic: 'Quadratic Equations', duration: 8, method: 'Lecture + Practice', resources: 'NCERT, Worksheets', status: 'Completed' },
  { id: '2', subject: 'Mathematics', class: '10', section: 'A', chapter: 'Chapter 5', topic: 'Arithmetic Progressions', duration: 7, method: 'Lecture + Problem Solving', resources: 'NCERT, Board Problems', status: 'In Progress' },
  { id: '3', subject: 'Physics', class: '11', section: 'A', chapter: 'Chapter 5', topic: 'Laws of Motion', duration: 10, method: 'Demonstration + Lecture', resources: 'Lab equipment, NCERT', status: 'Completed' },
  { id: '4', subject: 'Physics', class: '11', section: 'A', chapter: 'Chapter 6', topic: 'Work, Energy & Power', duration: 9, method: 'Conceptual + Numerical', resources: 'NCERT, Reference books', status: 'In Progress' },
  { id: '5', subject: 'Chemistry', class: '12', section: 'A', chapter: 'Chapter 3', topic: 'Electrochemistry', duration: 12, method: 'Lecture + Lab', resources: 'Lab chemicals, NCERT', status: 'Planned' },
  { id: '6', subject: 'English', class: '9', section: 'B', chapter: 'Chapter 2', topic: 'The Sound of Music', duration: 5, method: 'Reading + Discussion', resources: 'Textbook, Audio clips', status: 'Completed' },
  { id: '7', subject: 'English', class: '9', section: 'B', chapter: 'Chapter 3', topic: 'The Little Girl', duration: 4, method: 'Reading + Analysis', resources: 'Textbook', status: 'In Progress' },
  { id: '8', subject: 'Social Science', class: '9', section: 'A', chapter: 'History Ch 2', topic: 'Socialism in Europe & Russian Revolution', duration: 8, method: 'Lecture + Map work', resources: 'Atlas, NCERT', status: 'Completed' },
  { id: '9', subject: 'Computer Science', class: '12', section: 'A', chapter: 'Chapter 2', topic: 'Object Oriented Programming in Python', duration: 14, method: 'Practical + Theory', resources: 'Lab computers, Python docs', status: 'In Progress' },
  { id: '10', subject: 'Biology', class: '11', section: 'A', chapter: 'Chapter 10', topic: 'Cell Cycle and Cell Division', duration: 10, method: 'Diagram-based + Lecture', resources: 'Charts, NCERT, Microscope', status: 'Planned' },
  { id: '11', subject: 'Hindi', class: '8', section: 'A', chapter: 'Gadya Khand Ch 1', topic: 'Dhwani', duration: 4, method: 'Reading + Recitation', resources: 'Textbook', status: 'Completed' },
  { id: '12', subject: 'Accountancy', class: '11', section: 'A', chapter: 'Chapter 4', topic: 'Recording of Transactions', duration: 10, method: 'Problem Solving + Lecture', resources: 'Practice books, NCERT', status: 'Planned' },
]

const STATUS_COLORS: Record<LessonStatus, string> = {
  Planned: 'bg-gray-100 text-gray-600',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
}

const METHODS = ['Lecture + Practice', 'Lecture + Problem Solving', 'Demonstration + Lecture', 'Conceptual + Numerical', 'Lecture + Lab', 'Reading + Discussion', 'Reading + Analysis', 'Lecture + Map work', 'Practical + Theory', 'Diagram-based + Lecture', 'Problem Solving + Lecture', 'Reading + Recitation']
const SUBJECTS = ['All', 'Mathematics', 'Physics', 'Chemistry', 'English', 'Hindi', 'Social Science', 'Computer Science', 'Biology', 'Accountancy']
const CLASSES = ['All', '7', '8', '9', '10', '11', '12']
const STATUSES: ('All' | LessonStatus)[] = ['All', 'Planned', 'In Progress', 'Completed']

const emptyForm: Omit<Lesson, 'id'> = {
  subject: 'Mathematics', class: '10', section: 'A', chapter: '', topic: '',
  duration: 5, method: METHODS[0], resources: '', status: 'Planned',
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>(MOCK)
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [classFilter, setClassFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState<'All' | LessonStatus>('All')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [selected, setSelected] = useState<Lesson | null>(null)
  const [form, setForm] = useState<Omit<Lesson, 'id'>>(emptyForm)

  const filtered = useMemo(() => lessons.filter(l => {
    const q = search.toLowerCase()
    const matchSearch = l.topic.toLowerCase().includes(q) || l.chapter.toLowerCase().includes(q) || l.subject.toLowerCase().includes(q)
    const matchSubject = subjectFilter === 'All' || l.subject === subjectFilter
    const matchClass = classFilter === 'All' || l.class === classFilter
    const matchStatus = statusFilter === 'All' || l.status === statusFilter
    return matchSearch && matchSubject && matchClass && matchStatus
  }), [lessons, search, subjectFilter, classFilter, statusFilter])

  const total = lessons.length
  const completed = lessons.filter(l => l.status === 'Completed').length
  const inProgress = lessons.filter(l => l.status === 'In Progress').length
  const planned = lessons.filter(l => l.status === 'Planned').length
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0
  const totalPeriods = lessons.reduce((a, l) => a + l.duration, 0)
  const completedPeriods = lessons.filter(l => l.status === 'Completed').reduce((a, l) => a + l.duration, 0)

  function openAdd() { setForm(emptyForm); setModal('add') }
  function openEdit(l: Lesson) { setSelected(l); setForm({ ...l }); setModal('edit') }
  function closeModal() { setModal(null); setSelected(null) }

  function handleSave() {
    if (modal === 'add') setLessons(prev => [...prev, { ...form, id: String(Date.now()) }])
    else if (modal === 'edit' && selected) setLessons(prev => prev.map(l => l.id === selected.id ? { ...form, id: l.id } : l))
    closeModal()
  }

  function handleDelete(id: string) {
    if (confirm('Delete this lesson plan?')) setLessons(prev => prev.filter(l => l.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lesson Plans</h1>
          <p className="text-gray-500 text-sm mt-1">Plan, track, and manage curriculum delivery across all subjects.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#162d4a] transition-colors">
          <Plus size={16} /> Add Lesson Plan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Plans', value: total, color: 'text-[#1e3a5f]', bg: 'bg-blue-50' },
          { label: 'Completed', value: completed, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'In Progress', value: inProgress, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Planned', value: planned, color: 'text-gray-600', bg: 'bg-gray-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Curriculum Progress Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Overall Curriculum Completion</h3>
            <p className="text-xs text-gray-400">{completedPeriods} of {totalPeriods} periods delivered</p>
          </div>
          <span className="text-2xl font-bold text-[#1e3a5f]">{completionPct}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] rounded-full transition-all duration-500" style={{ width: `${completionPct}%` }} />
        </div>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Completed</div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> In Progress</div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" /> Planned</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search topic, chapter, subject..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
        </div>
        {([
          { val: subjectFilter, set: setSubjectFilter, opts: SUBJECTS, label: (v: string) => v === 'All' ? 'All Subjects' : v },
          { val: classFilter, set: setClassFilter, opts: CLASSES, label: (v: string) => v === 'All' ? 'All Classes' : `Class ${v}` },
          { val: statusFilter, set: (v: string) => setStatusFilter(v as typeof statusFilter), opts: STATUSES, label: (v: string) => v === 'All' ? 'All Status' : v },
        ]).map((f, i) => (
          <div key={i} className="relative">
            <select value={f.val} onChange={e => f.set(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white">
              {f.opts.map((o: string) => <option key={o} value={o}>{f.label(o)}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        ))}
        <div className="text-sm text-gray-500 self-center">{filtered.length} plans</div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Subject / Class</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Chapter</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Topic</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Duration</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Method</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Resources</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen size={13} className="text-[#1e3a5f]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{l.subject}</p>
                        <p className="text-xs text-gray-400">Class {l.class}{l.section}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{l.chapter}</td>
                  <td className="px-5 py-3 max-w-xs">
                    <p className="text-sm text-gray-700 truncate">{l.topic}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700 text-center">{l.duration}P</td>
                  <td className="px-5 py-3 text-sm text-gray-600 max-w-xs">
                    <p className="truncate">{l.method}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500 max-w-xs">
                    <p className="truncate text-xs">{l.resources}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[l.status]}`}>{l.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(l)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 size={13} /></button>
                      <button onClick={() => handleDelete(l.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400 text-sm">No lesson plans found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">{modal === 'add' ? 'Add Lesson Plan' : 'Edit Lesson Plan'}</h2>
              <button onClick={closeModal} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={16} /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Subject</label>
                  <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white">
                    {SUBJECTS.slice(1).map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Class</label>
                  <select value={form.class} onChange={e => setForm(f => ({ ...f, class: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white">
                    {['7','8','9','10','11','12'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Section</label>
                  <select value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white">
                    {['A','B','C'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Chapter</label>
                  <input value={form.chapter} onChange={e => setForm(f => ({ ...f, chapter: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" placeholder="e.g. Chapter 4" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Duration (periods)</label>
                  <input type="number" min={1} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Topic</label>
                <input value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" placeholder="e.g. Quadratic Equations" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Teaching Method</label>
                <select value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white">
                  {METHODS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Resources</label>
                  <input value={form.resources} onChange={e => setForm(f => ({ ...f, resources: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" placeholder="e.g. NCERT, Worksheets" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as LessonStatus }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white">
                    <option>Planned</option><option>In Progress</option><option>Completed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={closeModal} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-[#1e3a5f] text-white rounded-xl hover:bg-[#162d4a]">{modal === 'add' ? 'Add Plan' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
