'use client'
import React, { useState, useMemo } from 'react'
import { Plus, Search, Filter, X, Calendar, Clock } from 'lucide-react'

type ExamStatus = 'Upcoming' | 'Ongoing' | 'Completed'

interface ScheduledExam {
  id: string
  name: string
  class: string
  subject: string
  date: string
  startTime: string
  duration: string
  venue: string
  invigilator: string
  status: ExamStatus
}

const MOCK: ScheduledExam[] = [
  { id: '1',  name: 'Mid-Term Examination', class: '10', subject: 'Mathematics',         date: '2025-02-10', startTime: '09:00', duration: '3 hrs', venue: 'Hall A',    invigilator: 'Mr. Sharma',   status: 'Completed' },
  { id: '2',  name: 'Unit Test 3',           class: '8',  subject: 'Science',             date: '2025-02-14', startTime: '10:00', duration: '2 hrs', venue: 'Room 204',  invigilator: 'Ms. Verma',    status: 'Completed' },
  { id: '3',  name: 'Chapter Quiz',          class: '9',  subject: 'English Literature',  date: '2025-02-18', startTime: '11:00', duration: '1 hr',  venue: 'Lab 1',     invigilator: 'Mrs. Rao',     status: 'Completed' },
  { id: '4',  name: 'Pre-Board Exam',        class: '12', subject: 'Physics',             date: '2025-02-22', startTime: '09:00', duration: '3 hrs', venue: 'Hall B',    invigilator: 'Dr. Gupta',    status: 'Ongoing' },
  { id: '5',  name: 'Pre-Board Exam',        class: '12', subject: 'Chemistry',           date: '2025-02-25', startTime: '09:00', duration: '3 hrs', venue: 'Hall B',    invigilator: 'Dr. Mehta',    status: 'Upcoming' },
  { id: '6',  name: 'Annual Examination',    class: '7',  subject: 'Hindi',               date: '2025-03-01', startTime: '10:00', duration: '2.5 hrs',venue: 'Hall A',   invigilator: 'Ms. Joshi',    status: 'Upcoming' },
  { id: '7',  name: 'Practice Test',         class: '6',  subject: 'Social Studies',      date: '2025-03-05', startTime: '11:30', duration: '1.5 hrs',venue: 'Room 101', invigilator: 'Mr. Singh',    status: 'Upcoming' },
  { id: '8',  name: 'Final Term Paper',      class: '5',  subject: 'Mathematics',         date: '2025-03-10', startTime: '09:30', duration: '2 hrs', venue: 'Room 202',  invigilator: 'Ms. Nair',     status: 'Upcoming' },
  { id: '9',  name: 'Final Term Paper',      class: '4',  subject: 'EVS',                 date: '2025-03-12', startTime: '10:00', duration: '2 hrs', venue: 'Room 103',  invigilator: 'Mr. Pandey',   status: 'Upcoming' },
  { id: '10', name: 'Annual Examination',    class: '11', subject: 'Biology',             date: '2025-03-15', startTime: '09:00', duration: '3 hrs', venue: 'Hall C',    invigilator: 'Dr. Kapoor',   status: 'Upcoming' },
]

const statusConfig: Record<ExamStatus, { color: string; bg: string; border: string }> = {
  Upcoming:  { color: 'text-blue-700',   bg: 'bg-blue-100',   border: 'border-blue-200' },
  Ongoing:   { color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200' },
  Completed: { color: 'text-green-700',  bg: 'bg-green-100',  border: 'border-green-200' },
}

const CLASSES = ['All', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const STATUSES: ('All' | ExamStatus)[] = ['All', 'Upcoming', 'Ongoing', 'Completed']

const emptyForm = {
  name: '', class: '10', subject: '', date: '', startTime: '', duration: '', venue: '', invigilator: '',
}

export default function ExamSchedulePage() {
  const [exams, setExams] = useState<ScheduledExam[]>(MOCK)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState<'All' | ExamStatus>('All')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const filtered = useMemo(() => exams.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.invigilator.toLowerCase().includes(search.toLowerCase())
    const matchClass  = classFilter === 'All' || e.class === classFilter
    const matchStatus = statusFilter === 'All' || e.status === statusFilter
    return matchSearch && matchClass && matchStatus
  }), [exams, search, classFilter, statusFilter])

  function handleAdd() {
    if (!form.name || !form.subject || !form.date) return
    const newExam: ScheduledExam = {
      ...form, id: String(Date.now()), status: 'Upcoming',
    }
    setExams(prev => [...prev, newExam])
    setForm(emptyForm)
    setShowModal(false)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Exam Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">Term 2 · Feb–Mar 2025</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#16304f] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add to Schedule
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search exam, subject, invigilator..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={classFilter}
            onChange={e => setClassFilter(e.target.value)}
            className="pl-9 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f] appearance-none bg-white"
          >
            {CLASSES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Classes' : `Class ${c}`}</option>)}
          </select>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
            className="pl-9 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f] appearance-none bg-white"
          >
            {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Exam Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Class</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Subject</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Start Time</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Duration</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Venue</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Invigilator</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => {
                const sc = statusConfig[e.status]
                return (
                  <tr key={e.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                    <td className="px-4 py-3 font-medium text-gray-800">{e.name}</td>
                    <td className="px-4 py-3 text-gray-600">Class {e.class}</td>
                    <td className="px-4 py-3 text-gray-600">{e.subject}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {e.date}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {e.startTime}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{e.duration}</td>
                    <td className="px-4 py-3 text-gray-600">{e.venue}</td>
                    <td className="px-4 py-3 text-gray-600">{e.invigilator}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${sc.color} ${sc.bg} ${sc.border}`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">No exams found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#1e3a5f]">Add to Schedule</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Exam Name', key: 'name', type: 'text', placeholder: 'e.g. Mid-Term Exam' },
                { label: 'Subject', key: 'subject', type: 'text', placeholder: 'e.g. Mathematics' },
                { label: 'Date', key: 'date', type: 'date', placeholder: '' },
                { label: 'Start Time', key: 'startTime', type: 'time', placeholder: '' },
                { label: 'Duration', key: 'duration', type: 'text', placeholder: 'e.g. 2 hrs' },
                { label: 'Venue', key: 'venue', type: 'text', placeholder: 'e.g. Hall A' },
                { label: 'Invigilator', key: 'invigilator', type: 'text', placeholder: 'Name' },
              ].map(f => (
                <div key={f.key} className="col-span-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={(form as Record<string, string>)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]"
                  />
                </div>
              ))}
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Class</label>
                <select
                  value={form.class}
                  onChange={e => setForm(prev => ({ ...prev, class: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f] appearance-none bg-white"
                >
                  {['1','2','3','4','5','6','7','8','9','10','11','12'].map(c => (
                    <option key={c} value={c}>Class {c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 bg-[#1e3a5f] text-white py-2 rounded-xl text-sm font-medium hover:bg-[#16304f] transition-colors"
              >
                Add Exam
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
