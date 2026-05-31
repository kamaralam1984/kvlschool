'use client'
import React, { useState, useMemo } from 'react'
import { Search, Plus, Edit2, Trash2, X, ClipboardList, AlertCircle, ChevronDown } from 'lucide-react'

type HWStatus = 'Pending' | 'Submitted' | 'Graded'

interface Homework {
  id: string
  subject: string
  class: string
  section: string
  topic: string
  assignedDate: string
  dueDate: string
  teacher: string
  status: HWStatus
  submissionRate?: number
}

const today = '2025-05-31'

const MOCK: Homework[] = [
  { id: '1', subject: 'Mathematics', class: '10', section: 'A', topic: 'Quadratic Equations – Practice Set 3', assignedDate: '2025-05-28', dueDate: '2025-06-02', teacher: 'Mr. Rajesh Kumar', status: 'Pending', submissionRate: 0 },
  { id: '2', subject: 'Physics', class: '11', section: 'A', topic: 'Laws of Motion – Numerical Problems', assignedDate: '2025-05-27', dueDate: '2025-05-30', teacher: 'Mrs. Sunita Sharma', status: 'Submitted', submissionRate: 88 },
  { id: '3', subject: 'English', class: '9', section: 'B', topic: 'Write a letter to the editor', assignedDate: '2025-05-26', dueDate: '2025-05-29', teacher: 'Mrs. Priya Mehta', status: 'Graded', submissionRate: 95 },
  { id: '4', subject: 'Chemistry', class: '12', section: 'A', topic: 'Electrochemistry – Short Notes', assignedDate: '2025-05-25', dueDate: '2025-05-28', teacher: 'Mr. Anil Verma', status: 'Graded', submissionRate: 92 },
  { id: '5', subject: 'Hindi', class: '8', section: 'A', topic: 'संधि-विच्छेद अभ्यास', assignedDate: '2025-05-29', dueDate: '2025-06-03', teacher: 'Mr. Dinesh Tiwari', status: 'Pending', submissionRate: 0 },
  { id: '6', subject: 'Social Science', class: '9', section: 'A', topic: 'Map work – Political Map of India', assignedDate: '2025-05-24', dueDate: '2025-05-27', teacher: 'Mrs. Kavita Singh', status: 'Graded', submissionRate: 80 },
  { id: '7', subject: 'Computer Science', class: '12', section: 'A', topic: 'Python OOPs – Write a class for Bank Account', assignedDate: '2025-05-30', dueDate: '2025-06-04', teacher: 'Mr. Rahul Gupta', status: 'Pending', submissionRate: 0 },
  { id: '8', subject: 'Biology', class: '11', section: 'A', topic: 'Cell Division – Diagram labelling', assignedDate: '2025-05-28', dueDate: '2025-05-31', teacher: 'Mrs. Anita Joshi', status: 'Submitted', submissionRate: 76 },
  { id: '9', subject: 'Mathematics', class: '7', section: 'B', topic: 'Fractions – Word Problems', assignedDate: '2025-05-20', dueDate: '2025-05-23', teacher: 'Mr. Rajesh Kumar', status: 'Graded', submissionRate: 98 },
  { id: '10', subject: 'Accountancy', class: '11', section: 'A', topic: 'Journal Entries – 20 transactions', assignedDate: '2025-05-29', dueDate: '2025-06-01', teacher: 'Mr. Vikas Agarwal', status: 'Submitted', submissionRate: 64 },
  { id: '11', subject: 'English', class: '10', section: 'B', topic: 'Comprehension Passage Practice', assignedDate: '2025-05-19', dueDate: '2025-05-22', teacher: 'Mrs. Priya Mehta', status: 'Graded', submissionRate: 91 },
  { id: '12', subject: 'Physics', class: '12', section: 'A', topic: 'Capacitors – Derivations', assignedDate: '2025-05-30', dueDate: '2025-06-05', teacher: 'Mrs. Sunita Sharma', status: 'Pending', submissionRate: 0 },
]

const STATUS_COLORS: Record<HWStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Submitted: 'bg-blue-100 text-blue-700',
  Graded: 'bg-green-100 text-green-700',
}

const SUBJECTS = ['All', 'Mathematics', 'Physics', 'Chemistry', 'English', 'Hindi', 'Social Science', 'Computer Science', 'Biology', 'Accountancy']
const CLASSES = ['All', '7', '8', '9', '10', '11', '12']
const STATUSES: ('All' | HWStatus)[] = ['All', 'Pending', 'Submitted', 'Graded']
const TEACHERS = ['Mr. Rajesh Kumar', 'Mrs. Sunita Sharma', 'Mr. Anil Verma', 'Mrs. Priya Mehta', 'Mr. Dinesh Tiwari', 'Mrs. Kavita Singh', 'Mr. Rahul Gupta', 'Mrs. Anita Joshi', 'Mr. Vikas Agarwal', 'Mrs. Rekha Yadav']

const emptyForm: Omit<Homework, 'id'> = {
  subject: 'Mathematics', class: '10', section: 'A', topic: '', assignedDate: today,
  dueDate: '', teacher: TEACHERS[0], status: 'Pending', submissionRate: 0,
}

function isOverdue(hw: Homework) {
  return hw.status === 'Pending' && hw.dueDate < today
}

export default function HomeworkPage() {
  const [homeworks, setHomeworks] = useState<Homework[]>(MOCK)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('All')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState<'All' | HWStatus>('All')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [selected, setSelected] = useState<Homework | null>(null)
  const [form, setForm] = useState<Omit<Homework, 'id'>>(emptyForm)

  const filtered = useMemo(() => homeworks.filter(h => {
    const q = search.toLowerCase()
    const matchSearch = h.topic.toLowerCase().includes(q) || h.subject.toLowerCase().includes(q) || h.teacher.toLowerCase().includes(q)
    const matchClass = classFilter === 'All' || h.class === classFilter
    const matchSubject = subjectFilter === 'All' || h.subject === subjectFilter
    const matchStatus = statusFilter === 'All' || h.status === statusFilter
    return matchSearch && matchClass && matchSubject && matchStatus
  }), [homeworks, search, classFilter, subjectFilter, statusFilter])

  const overdueCount = homeworks.filter(isOverdue).length
  const thisWeek = homeworks.filter(h => h.assignedDate >= '2025-05-26').length
  const totalSubmitted = homeworks.filter(h => h.status !== 'Pending')
  const avgRate = totalSubmitted.length > 0
    ? Math.round(totalSubmitted.reduce((a, h) => a + (h.submissionRate ?? 0), 0) / totalSubmitted.length)
    : 0

  function openAdd() { setForm(emptyForm); setModal('add') }
  function openEdit(h: Homework) { setSelected(h); setForm({ ...h }); setModal('edit') }
  function closeModal() { setModal(null); setSelected(null) }

  function handleSave() {
    if (modal === 'add') setHomeworks(prev => [...prev, { ...form, id: String(Date.now()) }])
    else if (modal === 'edit' && selected) setHomeworks(prev => prev.map(h => h.id === selected.id ? { ...form, id: h.id } : h))
    closeModal()
  }

  function handleDelete(id: string) {
    if (confirm('Delete this homework?')) setHomeworks(prev => prev.filter(h => h.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homework</h1>
          <p className="text-gray-500 text-sm mt-1">Track assignments, due dates, and submission status.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#162d4a] transition-colors">
          <Plus size={16} /> Assign Homework
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Assigned This Week', value: thisWeek, color: 'text-[#1e3a5f]', bg: 'bg-blue-50' },
          { label: 'Submission Rate', value: `${avgRate}%`, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Overdue', value: overdueCount, color: 'text-red-700', bg: 'bg-red-50' },
          { label: 'Total Assignments', value: homeworks.length, color: 'text-purple-700', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Overdue Alert */}
      {overdueCount > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-3">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium">{overdueCount} assignment{overdueCount > 1 ? 's are' : ' is'} overdue and still pending.</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search topic, subject, teacher..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
        </div>
        {([
          { val: classFilter, set: setClassFilter, opts: CLASSES, label: (v: string) => v === 'All' ? 'All Classes' : `Class ${v}` },
          { val: subjectFilter, set: setSubjectFilter, opts: SUBJECTS, label: (v: string) => v === 'All' ? 'All Subjects' : v },
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
        <div className="text-sm text-gray-500 self-center">{filtered.length} records</div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Subject / Class</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Topic</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Assigned</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Due Date</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Teacher</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Submission</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(h => {
                const overdue = isOverdue(h)
                return (
                  <tr key={h.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${overdue ? 'bg-red-50/40' : ''}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <ClipboardList size={14} className={overdue ? 'text-red-400' : 'text-gray-400'} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{h.subject}</p>
                          <p className="text-xs text-gray-400">Class {h.class}{h.section}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 max-w-xs">
                      <p className="text-sm text-gray-700 truncate">{h.topic}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">{new Date(h.assignedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-5 py-3">
                      <span className={`text-sm font-medium ${overdue ? 'text-red-600' : 'text-gray-700'}`}>
                        {new Date(h.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        {overdue && <span className="ml-1 text-xs">(Overdue)</span>}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">{h.teacher}</td>
                    <td className="px-5 py-3">
                      {h.status !== 'Pending' && h.submissionRate != null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${h.submissionRate}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{h.submissionRate}%</span>
                        </div>
                      ) : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[h.status]}`}>{h.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(h)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 size={13} /></button>
                        <button onClick={() => handleDelete(h.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400 text-sm">No homework records found.</td></tr>
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
              <h2 className="text-base font-semibold text-gray-900">{modal === 'add' ? 'Assign Homework' : 'Edit Homework'}</h2>
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
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Topic / Assignment</label>
                <input value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" placeholder="e.g. Quadratic Equations – Practice Set 3" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Teacher</label>
                <select value={form.teacher} onChange={e => setForm(f => ({ ...f, teacher: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white">
                  {TEACHERS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Assigned Date</label>
                  <input type="date" value={form.assignedDate} onChange={e => setForm(f => ({ ...f, assignedDate: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as HWStatus }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white">
                    <option>Pending</option><option>Submitted</option><option>Graded</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={closeModal} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-[#1e3a5f] text-white rounded-xl hover:bg-[#162d4a]">{modal === 'add' ? 'Assign' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
