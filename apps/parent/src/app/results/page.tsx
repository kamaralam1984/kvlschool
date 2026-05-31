'use client'

import React, { useState } from 'react'
import ParentShell from '@/components/ParentShell'
import { Award, TrendingUp, TrendingDown, Download, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const CHILD = { name: 'Aarav Sharma', class: 'Class 10-A', rollNo: '10A-018', rank: 3, totalStudents: 42 }

const EXAMS = [
  {
    name: 'Unit Test 3',
    date: '2026-05-20',
    subjects: [
      { name: 'Mathematics', max: 50,  scored: 47, grade: 'A+' },
      { name: 'Physics',     max: 50,  scored: 43, grade: 'A'  },
      { name: 'Chemistry',   max: 50,  scored: 40, grade: 'B+' },
      { name: 'English',     max: 50,  scored: 45, grade: 'A+' },
      { name: 'Biology',     max: 50,  scored: 42, grade: 'A'  },
      { name: 'CS',          max: 50,  scored: 48, grade: 'A+' },
    ],
  },
  {
    name: 'Mid-Term Examination',
    date: '2026-03-15',
    subjects: [
      { name: 'Mathematics', max: 100, scored: 88, grade: 'A'  },
      { name: 'Physics',     max: 100, scored: 82, grade: 'A'  },
      { name: 'Chemistry',   max: 100, scored: 79, grade: 'B+' },
      { name: 'English',     max: 100, scored: 91, grade: 'A+' },
      { name: 'Biology',     max: 100, scored: 85, grade: 'A'  },
      { name: 'CS',          max: 100, scored: 94, grade: 'A+' },
    ],
  },
]

const gradeColors: Record<string, string> = {
  'A+': 'bg-green-100 text-green-700',
  'A':  'bg-blue-100 text-blue-700',
  'B+': 'bg-yellow-100 text-yellow-700',
  'B':  'bg-orange-100 text-orange-700',
  'C':  'bg-red-100 text-red-700',
}

export default function ResultsPage() {
  const [selectedExam, setSelectedExam] = useState(0)
  const exam = EXAMS[selectedExam]
  const total   = exam.subjects.reduce((a, s) => a + s.scored, 0)
  const maxTotal = exam.subjects.reduce((a, s) => a + s.max, 0)
  const pct = ((total / maxTotal) * 100).toFixed(1)

  return (
    <ParentShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
            <p className="text-sm text-gray-500 mt-0.5">{CHILD.name} · {CHILD.class} · Roll {CHILD.rollNo}</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download className="w-4 h-4" />Report Card
          </button>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Class Rank',    value: `#${CHILD.rank}`,       color: 'text-blue-600',   icon: Award      },
            { label: 'Total Score',   value: `${total}/${maxTotal}`,  color: 'text-gray-900',   icon: Star       },
            { label: 'Percentage',    value: `${pct}%`,               color: 'text-green-600',  icon: TrendingUp },
            { label: 'Out of',        value: `${CHILD.totalStudents} students`, color: 'text-gray-500', icon: Award },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={cn('text-xl font-bold mt-1', s.color)}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Exam selector */}
        <div className="flex gap-2">
          {EXAMS.map((e, i) => (
            <button key={i} onClick={() => setSelectedExam(i)}
              className={cn('px-4 py-2 text-sm rounded-lg border transition-all',
                selectedExam === i ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50')}>
              {e.name}
            </button>
          ))}
        </div>

        {/* Results table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">{exam.name} — {exam.date}</h2>
            <span className="text-sm font-bold text-blue-600">{total}/{maxTotal} ({pct}%)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Subject','Max Marks','Scored','Percentage','Grade'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {exam.subjects.map(s => {
                  const p = ((s.scored / s.max) * 100).toFixed(0)
                  return (
                    <tr key={s.name} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                      <td className="px-4 py-3 text-gray-500">{s.max}</td>
                      <td className="px-4 py-3 font-bold text-gray-900">{s.scored}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-100 rounded-full h-1.5">
                            <div className={cn('h-1.5 rounded-full', parseInt(p) >= 85 ? 'bg-green-500' : parseInt(p) >= 70 ? 'bg-blue-500' : 'bg-yellow-400')}
                              style={{ width: `${p}%` }} />
                          </div>
                          <span className="text-xs">{p}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-1 rounded-full text-xs font-bold', gradeColors[s.grade] || 'bg-gray-100 text-gray-600')}>{s.grade}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-800">Total</td>
                  <td className="px-4 py-3 font-bold text-gray-600">{maxTotal}</td>
                  <td className="px-4 py-3 font-bold text-blue-700 text-lg">{total}</td>
                  <td className="px-4 py-3 font-bold text-green-600">{pct}%</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-1 rounded-full text-xs font-bold', parseFloat(pct) >= 85 ? gradeColors['A+'] : gradeColors['A'])}>
                      {parseFloat(pct) >= 90 ? 'A+' : parseFloat(pct) >= 80 ? 'A' : 'B+'}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Teacher remarks */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Teacher Remarks</h2>
          <div className="space-y-3">
            {[
              { teacher: 'Dr. Sanjay Gupta', subject: 'Mathematics', remark: 'Excellent performance! Aarav shows strong conceptual understanding. Focus on speed in calculations.' },
              { teacher: 'Mr. Ravi Kumar', subject: 'Physics', remark: 'Good understanding of theory. Numericals need more practice.' },
              { teacher: 'Mrs. Anita Sharma', subject: 'English', remark: 'Outstanding writing skills. Keep up the excellent work.' },
            ].map((r, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-900">{r.subject} — {r.teacher}</p>
                <p className="text-sm text-gray-600 mt-1">{r.remark}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ParentShell>
  )
}
