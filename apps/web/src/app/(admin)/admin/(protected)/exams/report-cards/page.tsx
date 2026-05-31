'use client'
import React, { useState, useMemo } from 'react'
import { ChevronDown, FileText, Printer, Globe, X, CheckCircle, Clock } from 'lucide-react'

interface StudentResult {
  id: string
  name: string
  rollNo: string
  class: string
  section: string
  marks: { subject: string; max: number; obtained: number }[]
  attendance: number
  grade: string
  rank: number
  remarks: string
  published: boolean
}

const MOCK: StudentResult[] = [
  { id: '1', name: 'Aarav Sharma', rollNo: 'KVL-001', class: '10', section: 'A', attendance: 94, grade: 'A+', rank: 1, remarks: 'Excellent performance throughout the term.', published: true, marks: [{ subject: 'Mathematics', max: 100, obtained: 96 }, { subject: 'Physics', max: 100, obtained: 91 }, { subject: 'Chemistry', max: 100, obtained: 88 }, { subject: 'English', max: 100, obtained: 94 }, { subject: 'Hindi', max: 100, obtained: 89 }] },
  { id: '2', name: 'Priya Singh', rollNo: 'KVL-002', class: '10', section: 'A', attendance: 89, grade: 'A', rank: 2, remarks: 'Very good effort. Can improve in Mathematics.', published: true, marks: [{ subject: 'Mathematics', max: 100, obtained: 82 }, { subject: 'Physics', max: 100, obtained: 87 }, { subject: 'Chemistry', max: 100, obtained: 90 }, { subject: 'English', max: 100, obtained: 91 }, { subject: 'Hindi', max: 100, obtained: 85 }] },
  { id: '3', name: 'Rohan Verma', rollNo: 'KVL-003', class: '10', section: 'A', attendance: 76, grade: 'B+', rank: 3, remarks: 'Good student. Should focus more on attendance.', published: false, marks: [{ subject: 'Mathematics', max: 100, obtained: 74 }, { subject: 'Physics', max: 100, obtained: 79 }, { subject: 'Chemistry', max: 100, obtained: 72 }, { subject: 'English', max: 100, obtained: 81 }, { subject: 'Hindi', max: 100, obtained: 77 }] },
  { id: '4', name: 'Ananya Gupta', rollNo: 'KVL-004', class: '10', section: 'B', attendance: 91, grade: 'A', rank: 1, remarks: 'Outstanding in English and Chemistry.', published: true, marks: [{ subject: 'Mathematics', max: 100, obtained: 85 }, { subject: 'Physics', max: 100, obtained: 83 }, { subject: 'Chemistry', max: 100, obtained: 93 }, { subject: 'English', max: 100, obtained: 95 }, { subject: 'Hindi', max: 100, obtained: 88 }] },
  { id: '5', name: 'Arjun Mishra', rollNo: 'KVL-005', class: '10', section: 'B', attendance: 68, grade: 'B', rank: 4, remarks: 'Needs to improve attendance and study habits.', published: false, marks: [{ subject: 'Mathematics', max: 100, obtained: 65 }, { subject: 'Physics', max: 100, obtained: 70 }, { subject: 'Chemistry', max: 100, obtained: 63 }, { subject: 'English', max: 100, obtained: 72 }, { subject: 'Hindi', max: 100, obtained: 68 }] },
]

const EXAMS = ['Annual Exam 2025', 'Mid-Term 2025', 'Unit Test 1', 'Unit Test 2']
const CLASSES = ['10', '9', '8', '11', '12']
const SECTIONS = ['A', 'B', 'C']

function getTotal(marks: StudentResult['marks']) {
  return marks.reduce((s, m) => s + m.obtained, 0)
}
function getMax(marks: StudentResult['marks']) {
  return marks.reduce((s, m) => s + m.max, 0)
}

const gradeColor: Record<string, string> = {
  'A+': 'bg-green-100 text-green-700',
  'A': 'bg-blue-100 text-blue-700',
  'B+': 'bg-yellow-100 text-yellow-700',
  'B': 'bg-orange-100 text-orange-700',
  'C': 'bg-red-100 text-red-700',
}

export default function ReportCardsPage() {
  const [examFilter, setExamFilter] = useState(EXAMS[0])
  const [classFilter, setClassFilter] = useState('10')
  const [sectionFilter, setSectionFilter] = useState('All')
  const [students, setStudents] = useState<StudentResult[]>(MOCK)
  const [preview, setPreview] = useState<StudentResult | null>(null)

  const filtered = useMemo(() => students.filter(s => {
    const matchClass = s.class === classFilter
    const matchSection = sectionFilter === 'All' || s.section === sectionFilter
    return matchClass && matchSection
  }), [students, classFilter, sectionFilter])

  function togglePublish(id: string) {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, published: !s.published } : s))
  }
  function updateRemarks(id: string, val: string) {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, remarks: val } : s))
  }

  const generated = students.filter(s => s.published).length
  const pending = students.length - generated

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Cards</h1>
          <p className="text-gray-500 text-sm mt-1">Generate and publish student report cards</p>
        </div>
        <button onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Printer className="w-4 h-4" /> Generate PDF
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: String(students.length), icon: FileText, color: 'text-[#1e3a5f]', bg: 'bg-[#1e3a5f]/10' },
          { label: 'Generated', value: '45', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Pending', value: '23', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Published', value: String(generated), icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
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
          {[
            { label: 'Exam', val: examFilter, set: setExamFilter, opts: EXAMS },
            { label: 'Class', val: classFilter, set: setClassFilter, opts: CLASSES },
            { label: 'Section', val: sectionFilter, set: setSectionFilter, opts: ['All', ...SECTIONS] },
          ].map(f => (
            <div key={f.label} className="relative">
              <select value={f.val} onChange={e => f.set(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#1e3a5f]/40 bg-white cursor-pointer">
                {f.opts.map(o => <option key={o} value={o}>{f.label}: {o}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          ))}
          <p className="ml-auto self-center text-sm text-gray-500">{filtered.length} students</p>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Student', 'Roll No', 'Total Marks', 'Grade', 'Rank', 'Attendance', 'Remarks', 'Publish', ''].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-400">Class {s.class}–{s.section}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-mono text-gray-600">{s.rollNo}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">
                    {getTotal(s.marks)}/{getMax(s.marks)}
                    <span className="ml-1 text-xs text-gray-400 font-normal">({Math.round(getTotal(s.marks) / getMax(s.marks) * 100)}%)</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${gradeColor[s.grade] ?? 'bg-gray-100 text-gray-600'}`}>{s.grade}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-[#1e3a5f]">#{s.rank}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-sm font-medium ${s.attendance >= 85 ? 'text-green-600' : s.attendance >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {s.attendance}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 min-w-[200px]">
                    <input value={s.remarks} onChange={e => updateRemarks(s.id, e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#1e3a5f]/40" />
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => togglePublish(s.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${s.published ? 'bg-[#1e3a5f]' : 'bg-gray-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${s.published ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => setPreview(s)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-sm text-gray-400">No students found for selected filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Report Card Preview</h2>
              <button onClick={() => setPreview(null)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-8 space-y-6">
              {/* School Header */}
              <div className="text-center border-b-2 border-[#1e3a5f] pb-4">
                <p className="text-xl font-bold text-[#1e3a5f]">KVL International School</p>
                <p className="text-sm text-gray-500 mt-1">Lucknow, Uttar Pradesh</p>
                <p className="text-base font-semibold text-gray-700 mt-2">{examFilter} — Report Card</p>
              </div>
              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Student Name:</span> <span className="font-semibold ml-1">{preview.name}</span></div>
                <div><span className="text-gray-500">Roll No:</span> <span className="font-semibold ml-1">{preview.rollNo}</span></div>
                <div><span className="text-gray-500">Class:</span> <span className="font-semibold ml-1">{preview.class} – {preview.section}</span></div>
                <div><span className="text-gray-500">Attendance:</span> <span className="font-semibold ml-1">{preview.attendance}%</span></div>
              </div>
              {/* Marks Table */}
              <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-[#1e3a5f] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Subject</th>
                    <th className="px-4 py-3 text-center font-semibold">Max Marks</th>
                    <th className="px-4 py-3 text-center font-semibold">Obtained</th>
                    <th className="px-4 py-3 text-center font-semibold">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {preview.marks.map(m => (
                    <tr key={m.subject} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{m.subject}</td>
                      <td className="px-4 py-3 text-center">{m.max}</td>
                      <td className="px-4 py-3 text-center font-semibold">{m.obtained}</td>
                      <td className="px-4 py-3 text-center">{Math.round(m.obtained / m.max * 100)}%</td>
                    </tr>
                  ))}
                  <tr className="bg-[#1e3a5f]/5 font-bold">
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3 text-center">{getMax(preview.marks)}</td>
                    <td className="px-4 py-3 text-center">{getTotal(preview.marks)}</td>
                    <td className="px-4 py-3 text-center">{Math.round(getTotal(preview.marks) / getMax(preview.marks) * 100)}%</td>
                  </tr>
                </tbody>
              </table>
              {/* Grade & Rank */}
              <div className="flex gap-4">
                <div className="flex-1 bg-[#1e3a5f]/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500">Overall Grade</p>
                  <p className={`text-2xl font-bold mt-1 ${preview.grade === 'A+' ? 'text-green-600' : preview.grade === 'A' ? 'text-blue-600' : 'text-yellow-600'}`}>{preview.grade}</p>
                </div>
                <div className="flex-1 bg-[#1e3a5f]/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500">Class Rank</p>
                  <p className="text-2xl font-bold mt-1 text-[#1e3a5f]">#{preview.rank}</p>
                </div>
              </div>
              {/* Remarks */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Teacher Remarks</p>
                <p className="text-sm text-gray-700 italic">"{preview.remarks}"</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setPreview(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Close</button>
              <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] transition-colors">
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
