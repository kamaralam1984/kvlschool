'use client'
import React, { useState, useMemo } from 'react'
import { Save, ChevronDown, Award, TrendingUp, Users, CheckCircle2, Download, Printer } from 'lucide-react'

interface StudentResult {
  id: string; name: string; rollNo: string;
  marks: Record<string, number | ''>; total: number; percentage: number; grade: string; result: 'Pass' | 'Fail'
}

const SUBJECTS = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Sc.', 'Computer']
const MAX_MARKS = 100

function calcGrade(pct: number): string {
  if (pct >= 90) return 'A+'
  if (pct >= 80) return 'A'
  if (pct >= 70) return 'B+'
  if (pct >= 60) return 'B'
  if (pct >= 50) return 'C'
  if (pct >= 33) return 'D'
  return 'F'
}

const GRADE_COLORS: Record<string, string> = {
  'A+': 'text-green-700 bg-green-100',
  'A':  'text-green-600 bg-green-50',
  'B+': 'text-blue-700 bg-blue-100',
  'B':  'text-blue-600 bg-blue-50',
  'C':  'text-yellow-700 bg-yellow-100',
  'D':  'text-orange-700 bg-orange-100',
  'F':  'text-red-700 bg-red-100',
}

const INIT_STUDENTS = [
  { id: '1', name: 'Aarav Sharma', rollNo: 'KVL-001' },
  { id: '2', name: 'Priya Singh', rollNo: 'KVL-002' },
  { id: '3', name: 'Rohan Verma', rollNo: 'KVL-003' },
  { id: '4', name: 'Ananya Gupta', rollNo: 'KVL-004' },
  { id: '5', name: 'Arjun Mishra', rollNo: 'KVL-005' },
  { id: '6', name: 'Kavya Patel', rollNo: 'KVL-006' },
  { id: '7', name: 'Dev Agarwal', rollNo: 'KVL-007' },
].map(s => ({
  ...s,
  marks: Object.fromEntries(SUBJECTS.map(sub => [sub, '' as number | ''])),
  total: 0, percentage: 0, grade: '—', result: 'Fail' as 'Pass' | 'Fail',
}))

export default function ResultsPage() {
  const [cls, setCls] = useState('10')
  const [section, setSection] = useState('A')
  const [exam, setExam] = useState('Mid-Term 2024-25')
  const [students, setStudents] = useState<StudentResult[]>(INIT_STUDENTS)
  const [saved, setSaved] = useState(false)
  const [viewMode, setViewMode] = useState<'entry' | 'summary'>('entry')

  function updateMark(id: string, subject: string, raw: string) {
    const val = raw === '' ? '' : Math.min(Math.max(parseInt(raw) || 0, 0), MAX_MARKS)
    setStudents(prev => prev.map(s => {
      if (s.id !== id) return s
      const newMarks = { ...s.marks, [subject]: val }
      const filled = Object.values(newMarks).filter(v => v !== '')
      const total = filled.reduce((sum, v) => sum + (v as number), 0)
      const pct = filled.length === SUBJECTS.length ? (total / (SUBJECTS.length * MAX_MARKS)) * 100 : 0
      const grade = filled.length === SUBJECTS.length ? calcGrade(pct) : '—'
      const result = filled.length === SUBJECTS.length && pct >= 33 ? 'Pass' : 'Fail'
      return { ...s, marks: newMarks, total, percentage: Math.round(pct * 10) / 10, grade, result }
    }))
    setSaved(false)
  }

  const stats = useMemo(() => {
    const graded = students.filter(s => s.grade !== '—')
    return {
      entered: graded.length,
      passed: graded.filter(s => s.result === 'Pass').length,
      avgPct: graded.length ? Math.round(graded.reduce((s, r) => s + r.percentage, 0) / graded.length * 10) / 10 : 0,
      topScore: graded.length ? Math.max(...graded.map(s => s.percentage)) : 0,
    }
  }, [students])

  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 3000) }

  function downloadCSV() {
    const headers = ['Roll No', 'Name', ...SUBJECTS, 'Total', 'Percentage', 'Grade', 'Result']
    const rows = students.map(s => [s.rollNo, s.name, ...SUBJECTS.map(sub => s.marks[sub] ?? ''), s.total, `${s.percentage}%`, s.grade, s.result])
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `results-${cls}${section}-${exam}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
          <p className="text-gray-500 text-sm mt-1">Enter and manage student marks</p>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadCSV} className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
            <Save className="w-4 h-4" />{saved ? 'Saved!' : 'Save Results'}
          </button>
        </div>
      </div>

      {/* Config */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        {[
          { label: 'Exam', val: exam, set: setExam, opts: ['Mid-Term 2024-25', 'Unit Test 1', 'Unit Test 2', 'Annual Exam'] },
          { label: 'Class', val: cls, set: setCls, opts: ['7','8','9','10','11','12'] },
          { label: 'Section', val: section, set: setSection, opts: ['A','B','C','D'] },
        ].map(f => (
          <div key={f.label} className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">{f.label}</span>
            <div className="relative">
              <select value={f.val} onChange={e => f.set(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-gray-50">
                {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        ))}
        <div className="ml-auto flex gap-1 bg-gray-100 rounded-lg p-0.5">
          {(['entry', 'summary'] as const).map(v => (
            <button key={v} onClick={() => setViewMode(v)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${viewMode === v ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Results Entered', value: `${stats.entered}/${students.length}`, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pass Count', value: stats.passed, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Class Avg', value: `${stats.avgPct}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Highest Score', value: `${stats.topScore}%`, icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mark Entry Table */}
      {viewMode === 'entry' && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                  {SUBJECTS.map(s => (
                    <th key={s} className="px-3 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{s.slice(0, 8)}</th>
                  ))}
                  <th className="px-3 py-3.5 text-center text-xs font-semibold text-gray-500">Total</th>
                  <th className="px-3 py-3.5 text-center text-xs font-semibold text-gray-500">%</th>
                  <th className="px-3 py-3.5 text-center text-xs font-semibold text-gray-500">Grade</th>
                  <th className="px-3 py-3.5 text-center text-xs font-semibold text-gray-500">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{s.rollNo}</p>
                    </td>
                    {SUBJECTS.map(sub => (
                      <td key={sub} className="px-2 py-3 text-center">
                        <input
                          type="number" min={0} max={MAX_MARKS}
                          value={s.marks[sub] ?? ''}
                          onChange={e => updateMark(s.id, sub, e.target.value)}
                          className="w-14 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:border-[#1e3a5f]/40 focus:bg-[#1e3a5f]/5"
                          placeholder="—"
                        />
                      </td>
                    ))}
                    <td className="px-3 py-3 text-center text-sm font-semibold text-gray-900">{s.total || '—'}</td>
                    <td className="px-3 py-3 text-center text-sm text-gray-700">{s.grade !== '—' ? `${s.percentage}%` : '—'}</td>
                    <td className="px-3 py-3 text-center">
                      {s.grade !== '—' ? (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${GRADE_COLORS[s.grade]}`}>{s.grade}</span>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {s.grade !== '—' ? (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${s.result === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.result}</span>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">Max marks per subject: {MAX_MARKS} · Total: {SUBJECTS.length * MAX_MARKS} · Pass criteria: 33%</p>
          </div>
        </div>
      )}

      {/* Summary View */}
      {viewMode === 'summary' && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Rank', 'Student', 'Total', 'Percentage', 'Grade', 'Result'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...students]
                .filter(s => s.grade !== '—')
                .sort((a, b) => b.percentage - a.percentage)
                .map((s, i) => (
                  <tr key={s.id} className={`hover:bg-gray-50/50 ${i < 3 ? 'bg-yellow-50/30' : ''}`}>
                    <td className="px-5 py-3.5">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-gray-300 text-white' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{s.rollNo}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{s.total} / {SUBJECTS.length * MAX_MARKS}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{s.percentage}%</td>
                    <td className="px-5 py-3.5"><span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${GRADE_COLORS[s.grade]}`}>{s.grade}</span></td>
                    <td className="px-5 py-3.5"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${s.result === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.result}</span></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
