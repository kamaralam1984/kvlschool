'use client'
import React, { useState, useMemo } from 'react'
import { Search, Upload, X, Filter, CheckCircle2, Clock, FileText } from 'lucide-react'

type ExamStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Results Pending'

interface OfflineExam {
  id: string
  title: string
  class: string
  subject: string
  date: string
  maxMarks: number
  answerSheetsReceived: number
  sheetsChecked: number
  status: ExamStatus
}

const MOCK: OfflineExam[] = [
  { id: '1', title: 'Mid-Term Examination', class: '10', subject: 'Mathematics',       date: '2025-02-10', maxMarks: 100, answerSheetsReceived: 38, sheetsChecked: 38, status: 'Completed' },
  { id: '2', title: 'Unit Test 3',           class: '8',  subject: 'Science',           date: '2025-02-14', maxMarks: 50,  answerSheetsReceived: 42, sheetsChecked: 35, status: 'Results Pending' },
  { id: '3', title: 'Pre-Board Exam',        class: '12', subject: 'Physics',           date: '2025-02-22', maxMarks: 70,  answerSheetsReceived: 30, sheetsChecked: 12, status: 'Results Pending' },
  { id: '4', title: 'Annual Examination',    class: '7',  subject: 'Hindi',             date: '2025-03-01', maxMarks: 80,  answerSheetsReceived: 0,  sheetsChecked: 0,  status: 'Upcoming' },
  { id: '5', title: 'Final Term Paper',      class: '5',  subject: 'Mathematics',       date: '2025-03-10', maxMarks: 100, answerSheetsReceived: 0,  sheetsChecked: 0,  status: 'Upcoming' },
  { id: '6', title: 'Final Term Paper',      class: '4',  subject: 'EVS',               date: '2025-03-12', maxMarks: 50,  answerSheetsReceived: 0,  sheetsChecked: 0,  status: 'Upcoming' },
]

const statusConfig: Record<ExamStatus, { color: string; bg: string; border: string }> = {
  Upcoming:        { color: 'text-blue-700',   bg: 'bg-blue-100',   border: 'border-blue-200' },
  Ongoing:         { color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200' },
  'Results Pending': { color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200' },
  Completed:       { color: 'text-green-700',  bg: 'bg-green-100',  border: 'border-green-200' },
}

interface MarkEntry {
  rollNo: string
  studentName: string
  marks: string
}

const SAMPLE_STUDENTS: MarkEntry[] = [
  { rollNo: '01', studentName: 'Aarav Sharma',    marks: '' },
  { rollNo: '02', studentName: 'Meera Joshi',     marks: '' },
  { rollNo: '03', studentName: 'Rohan Gupta',     marks: '' },
  { rollNo: '04', studentName: 'Ananya Singh',    marks: '' },
  { rollNo: '05', studentName: 'Karan Verma',     marks: '' },
  { rollNo: '06', studentName: 'Siddharth Nair',  marks: '' },
  { rollNo: '07', studentName: 'Kavya Reddy',     marks: '' },
  { rollNo: '08', studentName: 'Arjun Patel',     marks: '' },
]

export default function OfflineExamsPage() {
  const [exams, setExams] = useState<OfflineExam[]>(MOCK)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | ExamStatus>('All')
  const [uploadModal, setUploadModal] = useState<OfflineExam | null>(null)
  const [markEntries, setMarkEntries] = useState<MarkEntry[]>(SAMPLE_STUDENTS.map(s => ({ ...s })))

  const filtered = useMemo(() => exams.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || e.status === statusFilter
    return matchSearch && matchStatus
  }), [exams, search, statusFilter])

  function openUpload(exam: OfflineExam) {
    setMarkEntries(SAMPLE_STUDENTS.map(s => ({ ...s })))
    setUploadModal(exam)
  }

  function handleSaveMarks() {
    if (!uploadModal) return
    setExams(prev => prev.map(e =>
      e.id === uploadModal.id
        ? { ...e, sheetsChecked: e.answerSheetsReceived, status: 'Completed' as ExamStatus }
        : e
    ))
    setUploadModal(null)
  }

  const totalExams = MOCK.length
  const pendingResults = MOCK.filter(e => e.status === 'Results Pending').length
  const completedExams = MOCK.filter(e => e.status === 'Completed').length

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Offline Exam Management</h1>
          <p className="text-sm text-gray-500 mt-1">Paper-based exams · Term 2 2025</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Offline Exams', value: totalExams, icon: FileText, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
          { label: 'Results Pending', value: pendingResults, icon: Clock, color: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-100' },
          { label: 'Completed', value: completedExams, icon: CheckCircle2, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
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

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search exam or subject..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
            className="pl-9 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f] appearance-none bg-white"
          >
            <option value="All">All Status</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Results Pending">Results Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Exam Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Class</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Subject</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Max Marks</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Sheets Received</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Checked</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => {
                const sc = statusConfig[e.status]
                const checkPct = e.answerSheetsReceived > 0
                  ? Math.round((e.sheetsChecked / e.answerSheetsReceived) * 100)
                  : 0
                return (
                  <tr key={e.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                    <td className="px-4 py-3 font-medium text-gray-800">{e.title}</td>
                    <td className="px-4 py-3 text-gray-600">Class {e.class}</td>
                    <td className="px-4 py-3 text-gray-600">{e.subject}</td>
                    <td className="px-4 py-3 text-gray-600">{e.date}</td>
                    <td className="px-4 py-3 text-center text-gray-700 font-medium">{e.maxMarks}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{e.answerSheetsReceived}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-gray-700 font-medium">{e.sheetsChecked}</span>
                        {e.answerSheetsReceived > 0 && (
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${checkPct === 100 ? 'bg-green-500' : 'bg-[#d4a017]'}`}
                              style={{ width: `${checkPct}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${sc.color} ${sc.bg} ${sc.border} whitespace-nowrap`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {(e.status === 'Results Pending' || e.status === 'Ongoing') ? (
                        <button
                          onClick={() => openUpload(e)}
                          className="flex items-center gap-1.5 mx-auto text-xs bg-[#1e3a5f] text-white px-3 py-1.5 rounded-lg hover:bg-[#16304f] transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                          Upload Results
                        </button>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
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

      {/* Mark Entry Modal */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-[#1e3a5f]">Upload Results</h3>
                <p className="text-xs text-gray-500 mt-0.5">{uploadModal.title} · {uploadModal.subject} · Class {uploadModal.class}</p>
              </div>
              <button onClick={() => setUploadModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mark Entry</p>
                <p className="text-xs text-gray-400">Max Marks: {uploadModal.maxMarks}</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 rounded-xl">
                    <th className="text-left px-3 py-2 font-semibold text-gray-600 rounded-l-xl">Roll No.</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-600">Student Name</th>
                    <th className="text-center px-3 py-2 font-semibold text-gray-600 rounded-r-xl">Marks Obtained</th>
                  </tr>
                </thead>
                <tbody>
                  {markEntries.map((m, i) => (
                    <tr key={m.rollNo} className="border-b border-gray-50 last:border-0">
                      <td className="px-3 py-2.5 text-gray-500">{m.rollNo}</td>
                      <td className="px-3 py-2.5 text-gray-700">{m.studentName}</td>
                      <td className="px-3 py-2.5 text-center">
                        <input
                          type="number"
                          min={0}
                          max={uploadModal.maxMarks}
                          value={m.marks}
                          onChange={e => {
                            const updated = [...markEntries]
                            updated[i] = { ...updated[i], marks: e.target.value }
                            setMarkEntries(updated)
                          }}
                          placeholder="—"
                          className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:border-[#1e3a5f]"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 pt-0 flex gap-3 border-t border-gray-50 mt-2">
              <button
                onClick={handleSaveMarks}
                className="flex-1 bg-[#1e3a5f] text-white py-2 rounded-xl text-sm font-medium hover:bg-[#16304f] transition-colors"
              >
                Save Results
              </button>
              <button onClick={() => setUploadModal(null)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
