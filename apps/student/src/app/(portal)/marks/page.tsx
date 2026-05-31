'use client'

import React, { useState } from 'react'

// ─── Mock Data ──────────────────────────────────────────────────────
const exams = ['Mid-Term Examination', 'Unit Test 1', 'Unit Test 2', 'Unit Test 3', 'Pre-Board']

const marksData: Record<string, { subject: string; marks: number; max: number; classAvg: number; grade: string; rank: number }[]> = {
  'Mid-Term Examination': [
    { subject: 'Mathematics', marks: 88, max: 100, classAvg: 71, grade: 'A', rank: 3 },
    { subject: 'Physics', marks: 88, max: 100, classAvg: 68, grade: 'A', rank: 4 },
    { subject: 'Chemistry', marks: 79, max: 100, classAvg: 65, grade: 'B+', rank: 7 },
    { subject: 'English Literature', marks: 85, max: 100, classAvg: 73, grade: 'A', rank: 5 },
    { subject: 'History', marks: 76, max: 100, classAvg: 70, grade: 'B+', rank: 9 },
    { subject: 'Computer Science', marks: 93, max: 100, classAvg: 78, grade: 'A+', rank: 2 },
  ],
  'Unit Test 3': [
    { subject: 'Mathematics', marks: 47, max: 50, classAvg: 38, grade: 'A+', rank: 2 },
    { subject: 'Physics', marks: 43, max: 50, classAvg: 35, grade: 'A+', rank: 3 },
    { subject: 'Chemistry', marks: 38, max: 50, classAvg: 33, grade: 'A', rank: 6 },
    { subject: 'English Literature', marks: 44, max: 50, classAvg: 39, grade: 'A+', rank: 2 },
    { subject: 'History', marks: 36, max: 50, classAvg: 34, grade: 'A', rank: 8 },
    { subject: 'Computer Science', marks: 49, max: 50, classAvg: 40, grade: 'A+', rank: 1 },
  ],
  'Unit Test 1': [
    { subject: 'Mathematics', marks: 42, max: 50, classAvg: 36, grade: 'A+', rank: 4 },
    { subject: 'Physics', marks: 39, max: 50, classAvg: 33, grade: 'A', rank: 5 },
    { subject: 'Chemistry', marks: 35, max: 50, classAvg: 30, grade: 'A', rank: 8 },
    { subject: 'English Literature', marks: 45, max: 50, classAvg: 38, grade: 'A+', rank: 2 },
    { subject: 'History', marks: 38, max: 50, classAvg: 35, grade: 'A', rank: 6 },
    { subject: 'Computer Science', marks: 48, max: 50, classAvg: 39, grade: 'A+', rank: 1 },
  ],
  'Unit Test 2': [
    { subject: 'Mathematics', marks: 45, max: 50, classAvg: 37, grade: 'A+', rank: 3 },
    { subject: 'Physics', marks: 41, max: 50, classAvg: 34, grade: 'A+', rank: 4 },
    { subject: 'Chemistry', marks: 37, max: 50, classAvg: 31, grade: 'A', rank: 7 },
    { subject: 'English Literature', marks: 43, max: 50, classAvg: 38, grade: 'A+', rank: 3 },
    { subject: 'History', marks: 40, max: 50, classAvg: 36, grade: 'A+', rank: 5 },
    { subject: 'Computer Science', marks: 50, max: 50, classAvg: 41, grade: 'A+', rank: 1 },
  ],
  'Pre-Board': [
    { subject: 'Mathematics', marks: 0, max: 100, classAvg: 0, grade: '—', rank: 0 },
    { subject: 'Physics', marks: 0, max: 100, classAvg: 0, grade: '—', rank: 0 },
    { subject: 'Chemistry', marks: 0, max: 100, classAvg: 0, grade: '—', rank: 0 },
    { subject: 'English Literature', marks: 0, max: 100, classAvg: 0, grade: '—', rank: 0 },
    { subject: 'History', marks: 0, max: 100, classAvg: 0, grade: '—', rank: 0 },
    { subject: 'Computer Science', marks: 0, max: 100, classAvg: 0, grade: '—', rank: 0 },
  ],
}

const subjectColors: Record<string, string> = {
  'Mathematics': '#14b8a6',
  'Physics': '#6366f1',
  'Chemistry': '#f59e0b',
  'English Literature': '#ec4899',
  'History': '#8b5cf6',
  'Computer Science': '#10b981',
}

// ─── Grade Badge ────────────────────────────────────────────────────
function GradeBadge({ grade }: { grade: string }) {
  const map: Record<string, string> = {
    'A+': 'bg-emerald-100 text-emerald-700',
    'A':  'bg-teal-100 text-teal-700',
    'B+': 'bg-blue-100 text-blue-700',
    'B':  'bg-indigo-100 text-indigo-700',
    'C':  'bg-amber-100 text-amber-700',
    '—':  'bg-slate-100 text-slate-400',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[grade] ?? 'bg-slate-100 text-slate-500'}`}>
      {grade}
    </span>
  )
}

// ─── CSS Bar Chart ──────────────────────────────────────────────────
function PerformanceBar({ row }: { row: { subject: string; marks: number; max: number; classAvg: number } }) {
  const myPct = row.max > 0 ? (row.marks / row.max) * 100 : 0
  const avgPct = row.max > 0 ? (row.classAvg / row.max) * 100 : 0
  const color = subjectColors[row.subject] ?? '#14b8a6'

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-slate-700 truncate max-w-[140px]">{row.subject}</span>
        <span className="text-xs text-slate-400">{row.marks}/{row.max}</span>
      </div>
      {/* My score */}
      <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${myPct}%`, backgroundColor: color }}
        />
      </div>
      {/* Class avg */}
      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full opacity-40 transition-all duration-700"
          style={{ width: `${avgPct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────
export default function MarksPage() {
  const [selectedExam, setSelectedExam] = useState(exams[0])
  const rows = marksData[selectedExam] ?? []
  const isPending = rows.every(r => r.marks === 0)

  const total = rows.reduce((s, r) => s + r.marks, 0)
  const maxTotal = rows.reduce((s, r) => s + r.max, 0)
  const avgTotal = rows.reduce((s, r) => s + r.classAvg, 0)
  const overallPct = maxTotal > 0 ? ((total / maxTotal) * 100).toFixed(1) : '—'

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Marks &amp; Results</h1>
          <p className="text-sm text-slate-400 mt-0.5">Aarav Sharma · Class 10-A · Roll KVL-001</p>
        </div>
        <button className="btn-teal flex items-center gap-2 self-start sm:self-auto">
          <span>📥</span> Download Report Card
        </button>
      </div>

      {/* Exam selector */}
      <div className="card px-5 py-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Select Examination</p>
        <div className="flex flex-wrap gap-2">
          {exams.map((exam) => (
            <button
              key={exam}
              onClick={() => setSelectedExam(exam)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                selectedExam === exam
                  ? 'bg-teal-500 text-white shadow-teal'
                  : 'bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700'
              }`}
            >
              {exam}
            </button>
          ))}
        </div>
      </div>

      {isPending ? (
        <div className="card px-5 py-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-slate-600 font-medium">Results not yet published</p>
          <p className="text-sm text-slate-400 mt-1">Check back after the exam is conducted.</p>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Score', value: `${total}/${maxTotal}`, sub: `${overallPct}%`, color: 'teal' },
              { label: 'Class Average', value: `${avgTotal}/${maxTotal}`, sub: `${((avgTotal / maxTotal) * 100).toFixed(1)}%`, color: 'indigo' },
              { label: 'Class Rank', value: '#4', sub: 'out of 42 students', color: 'emerald' },
              { label: 'Best Subject', value: 'Comp. Sci.', sub: rows.find(r => r.subject === 'Computer Science')?.grade ?? '', color: 'violet' },
            ].map((s) => (
              <div key={s.label} className={`card px-4 py-4 border-l-4 border-${s.color}-400`}>
                <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                <p className={`text-xl font-bold text-${s.color}-600 mt-1`}>{s.value}</p>
                <p className="text-xs text-slate-400">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Marks table */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800">Subject-wise Marks — {selectedExam}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Subject</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Score</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Max</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">%</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Grade</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rank</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Class Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const pct = row.max > 0 ? ((row.marks / row.max) * 100).toFixed(1) : '—'
                    const above = row.marks > row.classAvg
                    return (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-slate-800">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: subjectColors[row.subject] ?? '#94a3b8' }}
                            />
                            {row.subject}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-slate-800">{row.marks}</td>
                        <td className="px-4 py-3.5 text-center text-slate-400">{row.max}</td>
                        <td className="px-4 py-3.5 text-center text-slate-700 font-medium">{pct}%</td>
                        <td className="px-4 py-3.5 text-center"><GradeBadge grade={row.grade} /></td>
                        <td className="px-4 py-3.5 text-center text-slate-600">
                          {row.rank > 0 ? `#${row.rank}` : '—'}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`text-xs font-medium ${above ? 'text-emerald-600' : 'text-red-500'}`}>
                            {row.classAvg > 0 ? `${row.classAvg} ${above ? '▲' : '▼'}` : '—'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-teal-50 border-t-2 border-teal-200">
                    <td className="px-5 py-3 font-bold text-teal-800">Total</td>
                    <td className="px-4 py-3 text-center font-bold text-teal-800">{total}</td>
                    <td className="px-4 py-3 text-center font-bold text-teal-700">{maxTotal}</td>
                    <td className="px-4 py-3 text-center font-bold text-teal-800">{overallPct}%</td>
                    <td className="px-4 py-3 text-center">
                      <GradeBadge grade={Number(overallPct) >= 90 ? 'A+' : Number(overallPct) >= 80 ? 'A' : 'B+'} />
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-teal-700">#4</td>
                    <td className="px-4 py-3 text-center text-slate-500">{avgTotal}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Performance graph */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="card px-5 py-4">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-slate-800">Performance Graph</h2>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-teal-500 inline-block" /> My Score</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-teal-200 inline-block" /> Class Avg</span>
                </div>
              </div>
              <div className="space-y-4">
                {rows.map((row, i) => (
                  <PerformanceBar key={i} row={row} />
                ))}
              </div>
            </div>

            {/* Comparison insight */}
            <div className="card px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-800 mb-4">My Score vs Class Average</h2>
              <div className="space-y-3">
                {rows.map((row, i) => {
                  const diff = row.marks - row.classAvg
                  const above = diff >= 0
                  return (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-700 truncate max-w-[160px]">{row.subject}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden relative">
                          <div
                            className={`absolute top-0 h-full rounded-full ${above ? 'bg-emerald-400 right-1/2' : 'bg-red-400 left-1/2'}`}
                            style={{ width: `${Math.min(Math.abs(diff / row.max) * 200, 50)}%` }}
                          />
                          <div className="absolute top-0 left-1/2 w-px h-full bg-slate-300" />
                        </div>
                        <span className={`text-xs font-bold w-12 text-right ${above ? 'text-emerald-600' : 'text-red-500'}`}>
                          {above ? '+' : ''}{row.max > 0 ? diff : '—'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
                <span className="font-semibold">Well done!</span> You scored above class average in {rows.filter(r => r.marks > r.classAvg && r.marks > 0).length}/{rows.filter(r => r.max > 0).length} subjects.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
