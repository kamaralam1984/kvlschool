'use client'
import React, { useState, useMemo } from 'react'
import { Search, Plus, Printer, Download, X, ChevronDown, Ticket, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface HallTicket {
  id: string
  studentName: string
  rollNo: string
  class: string
  section: string
  exam: string
  hallTicketNo: string
  center: string
  status: 'Generated' | 'Printed' | 'Distributed'
  selected: boolean
}

const MOCK: HallTicket[] = [
  { id: '1', studentName: 'Aarav Sharma', rollNo: 'KVL-001', class: '10', section: 'A', exam: 'Annual Exam 2025', hallTicketNo: 'HT-2025-0001', center: 'Block A – Room 101', status: 'Distributed', selected: false },
  { id: '2', studentName: 'Priya Singh', rollNo: 'KVL-002', class: '10', section: 'A', exam: 'Annual Exam 2025', hallTicketNo: 'HT-2025-0002', center: 'Block A – Room 101', status: 'Distributed', selected: false },
  { id: '3', studentName: 'Rohan Verma', rollNo: 'KVL-003', class: '10', section: 'A', exam: 'Annual Exam 2025', hallTicketNo: 'HT-2025-0003', center: 'Block A – Room 102', status: 'Printed', selected: false },
  { id: '4', studentName: 'Ananya Gupta', rollNo: 'KVL-004', class: '10', section: 'B', exam: 'Annual Exam 2025', hallTicketNo: 'HT-2025-0004', center: 'Block B – Room 201', status: 'Generated', selected: false },
  { id: '5', studentName: 'Arjun Mishra', rollNo: 'KVL-005', class: '10', section: 'B', exam: 'Annual Exam 2025', hallTicketNo: 'HT-2025-0005', center: 'Block B – Room 201', status: 'Generated', selected: false },
  { id: '6', studentName: 'Kavya Patel', rollNo: 'KVL-006', class: '9', section: 'A', exam: 'Annual Exam 2025', hallTicketNo: 'HT-2025-0006', center: 'Block A – Room 103', status: 'Distributed', selected: false },
  { id: '7', studentName: 'Dev Agarwal', rollNo: 'KVL-007', class: '9', section: 'B', exam: 'Annual Exam 2025', hallTicketNo: 'HT-2025-0007', center: 'Block C – Room 301', status: 'Printed', selected: false },
  { id: '8', studentName: 'Sneha Yadav', rollNo: 'KVL-008', class: '11', section: 'A', exam: 'Annual Exam 2025', hallTicketNo: 'HT-2025-0008', center: 'Block C – Room 302', status: 'Generated', selected: false },
  { id: '9', studentName: 'Rahul Tiwari', rollNo: 'KVL-009', class: '12', section: 'A', exam: 'Annual Exam 2025', hallTicketNo: 'HT-2025-0009', center: 'Block D – Room 401', status: 'Distributed', selected: false },
  { id: '10', studentName: 'Meera Joshi', rollNo: 'KVL-010', class: '8', section: 'A', exam: 'Annual Exam 2025', hallTicketNo: 'HT-2025-0010', center: 'Block A – Room 104', status: 'Generated', selected: false },
]

const STATUS_OPTS = ['All', 'Generated', 'Printed', 'Distributed']
const CLASS_OPTS = ['All', '7', '8', '9', '10', '11', '12']
const EXAM_OPTS = ['All', 'Annual Exam 2025', 'Mid-Term 2025', 'Unit Test 1']

const statusColor: Record<string, string> = {
  Generated: 'bg-blue-100 text-blue-700',
  Printed: 'bg-yellow-100 text-yellow-700',
  Distributed: 'bg-green-100 text-green-700',
}
const statusIcon: Record<string, React.ReactNode> = {
  Generated: <AlertCircle className="w-3.5 h-3.5" />,
  Printed: <Clock className="w-3.5 h-3.5" />,
  Distributed: <CheckCircle className="w-3.5 h-3.5" />,
}

export default function HallTicketsPage() {
  const [tickets, setTickets] = useState<HallTicket[]>(MOCK)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [classFilter, setClassFilter] = useState('All')
  const [examFilter, setExamFilter] = useState('All')
  const [preview, setPreview] = useState<HallTicket | null>(null)

  const filtered = useMemo(() => tickets.filter(t => {
    const matchSearch = t.studentName.toLowerCase().includes(search.toLowerCase()) ||
      t.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      t.hallTicketNo.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || t.status === statusFilter
    const matchClass = classFilter === 'All' || t.class === classFilter
    const matchExam = examFilter === 'All' || t.exam === examFilter
    return matchSearch && matchStatus && matchClass && matchExam
  }), [tickets, search, statusFilter, classFilter, examFilter])

  const selectedCount = tickets.filter(t => t.selected).length

  function toggleSelect(id: string) {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t))
  }
  function toggleAll() {
    const allSelected = filtered.every(t => t.selected)
    const ids = new Set(filtered.map(t => t.id))
    setTickets(prev => prev.map(t => ids.has(t.id) ? { ...t, selected: !allSelected } : t))
  }
  function generateAll() {
    setTickets(prev => prev.map(t => t.status === 'Generated' ? { ...t, status: 'Printed' } : t))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hall Tickets</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and distribute exam hall tickets</p>
        </div>
        <div className="flex gap-2">
          {selectedCount > 0 && (
            <button onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              <Printer className="w-4 h-4" /> Print ({selectedCount})
            </button>
          )}
          <button onClick={generateAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
            <Plus className="w-4 h-4" /> Generate All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: '4,218', icon: Ticket, color: 'text-[#1e3a5f]', bg: 'bg-[#1e3a5f]/10' },
          { label: 'Generated', value: '3,980', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Printed', value: '3,602', icon: Printer, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Pending', value: '238', icon: Clock, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, roll no, ticket no…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
          </div>
          {[
            { label: 'Status', val: statusFilter, set: setStatusFilter, opts: STATUS_OPTS },
            { label: 'Class', val: classFilter, set: setClassFilter, opts: CLASS_OPTS },
            { label: 'Exam', val: examFilter, set: setExamFilter, opts: EXAM_OPTS },
          ].map(f => (
            <div key={f.label} className="relative">
              <select value={f.val} onChange={e => f.set(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#1e3a5f]/40 bg-white cursor-pointer">
                {f.opts.map(o => <option key={o} value={o}>{f.label}: {o}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3.5">
                  <input type="checkbox" checked={filtered.length > 0 && filtered.every(t => t.selected)}
                    onChange={toggleAll} className="rounded" />
                </th>
                {['Student Name', 'Roll No', 'Class', 'Exam', 'Hall Ticket No', 'Center', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <input type="checkbox" checked={t.selected} onChange={() => toggleSelect(t.id)} className="rounded" />
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-gray-900">{t.studentName}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-mono text-gray-600">{t.rollNo}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">Class {t.class}–{t.section}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{t.exam}</td>
                  <td className="px-5 py-3.5 text-sm font-mono text-[#1e3a5f] font-medium">{t.hallTicketNo}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{t.center}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[t.status]}`}>
                      {statusIcon[t.status]} {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setPreview(t)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors" title="Preview">
                        <Ticket className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => window.print()} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Download PDF">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-sm text-gray-400">No hall tickets match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Hall Ticket Preview</h2>
              <button onClick={() => setPreview(null)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="text-center bg-[#1e3a5f] text-white rounded-xl py-4 px-6">
                <p className="text-lg font-bold">KVL International School</p>
                <p className="text-sm opacity-80 mt-0.5">Lucknow, Uttar Pradesh</p>
                <p className="text-base font-semibold mt-2 bg-white/20 rounded-lg py-1">{preview.exam}</p>
              </div>
              {/* Photo placeholder + details */}
              <div className="flex gap-4">
                <div className="w-24 h-28 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center flex-shrink-0">
                  <p className="text-xs text-gray-400 text-center">Photo</p>
                </div>
                <div className="flex-1 space-y-2 text-sm">
                  {[
                    { label: 'Student Name', value: preview.studentName },
                    { label: 'Roll Number', value: preview.rollNo },
                    { label: 'Class & Section', value: `Class ${preview.class} – ${preview.section}` },
                    { label: 'Hall Ticket No', value: preview.hallTicketNo },
                    { label: 'Exam Center', value: preview.center },
                  ].map(row => (
                    <div key={row.label} className="flex gap-2">
                      <span className="text-gray-500 w-32 flex-shrink-0">{row.label}:</span>
                      <span className="font-semibold text-gray-900">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-xs font-bold text-yellow-800 mb-2 uppercase tracking-wide">Instructions</p>
                <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
                  <li>Carry this hall ticket to the examination hall.</li>
                  <li>Arrive 30 minutes before the exam begins.</li>
                  <li>No electronic devices are permitted in the exam hall.</li>
                  <li>This ticket is non-transferable.</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setPreview(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Close</button>
              <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] transition-colors">
                <Printer className="w-4 h-4" /> Print
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#1e3a5f] text-[#1e3a5f] text-sm font-medium hover:bg-[#1e3a5f]/5 transition-colors">
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
