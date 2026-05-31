'use client'

import React, { useState } from 'react'
import ParentShell from '@/components/ParentShell'
import {
  TrendingUp,
  Award,
  BookOpen,
  CheckSquare,
  Star,
  Brain,
  BarChart2,
  MessageCircle,
} from 'lucide-react'

// ─── Mock Data ────────────────────────────────────────────

const ATTENDANCE_BY_MONTH = [
  { month: 'Jan', present: 22, total: 24, pct: 92 },
  { month: 'Feb', present: 18, total: 20, pct: 90 },
  { month: 'Mar', present: 25, total: 26, pct: 96 },
  { month: 'Apr', present: 21, total: 24, pct: 88 },
  { month: 'May', present: 19, total: 21, pct: 90 },
  { month: 'Jun', present: 10, total: 11, pct: 91 },
]

const SUBJECTS = [
  { name: 'Mathematics', marks: 87, total: 100, teacher: 'Mr. Suresh Kumar', remarks: 'Excellent problem-solving skills. Needs more practice in trigonometry.', hwCompletion: 92 },
  { name: 'Science', marks: 91, total: 100, teacher: 'Mrs. Anitha Rao', remarks: 'Outstanding performance in Biology. Physics concepts are strong.', hwCompletion: 95 },
  { name: 'English', marks: 78, total: 100, teacher: 'Mrs. Priya Nair', remarks: 'Good communicator. Essay writing needs more structured approach.', hwCompletion: 85 },
  { name: 'Social Studies', marks: 83, total: 100, teacher: 'Mr. Rajan Pillai', remarks: 'Strong in History. Should focus more on Geography map work.', hwCompletion: 88 },
  { name: 'Hindi', marks: 76, total: 100, teacher: 'Mrs. Kavitha Menon', remarks: 'Reading comprehension is good. Needs to work on creative writing.', hwCompletion: 80 },
  { name: 'Computer Science', marks: 94, total: 100, teacher: 'Mr. Arun Thomas', remarks: 'Exceptional programming skills. Top scorer in the class.', hwCompletion: 98 },
]

const CLASS_RANK = { rank: 8, total: 42 }
const OVERALL_PCT = Math.round(SUBJECTS.reduce((s, sub) => s + (sub.marks / sub.total) * 100, 0) / SUBJECTS.length)

function gradeFromPct(pct: number) {
  if (pct >= 90) return { grade: 'A+', color: 'text-green-700', bg: 'bg-green-100' }
  if (pct >= 80) return { grade: 'A', color: 'text-emerald-700', bg: 'bg-emerald-100' }
  if (pct >= 70) return { grade: 'B+', color: 'text-blue-700', bg: 'bg-blue-100' }
  if (pct >= 60) return { grade: 'B', color: 'text-sky-700', bg: 'bg-sky-100' }
  return { grade: 'C', color: 'text-yellow-700', bg: 'bg-yellow-100' }
}

function SubjectBar({ subject }: { subject: typeof SUBJECTS[0] }) {
  const pct = Math.round((subject.marks / subject.total) * 100)
  const { grade, color, bg } = gradeFromPct(pct)
  return (
    <div className="py-3 border-b border-stone-50 last:border-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold text-stone-900">{subject.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-stone-700">{subject.marks}/{subject.total}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${bg} ${color}`}>{grade}</span>
        </div>
      </div>
      <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden mb-1">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: pct >= 90 ? '#10b981' : pct >= 80 ? '#f59e0b' : pct >= 70 ? '#3b82f6' : '#f97316',
          }}
        />
      </div>
      <p className="text-xs text-stone-500">{pct}%</p>
    </div>
  )
}

// CSS Spider/Radar chart approximation using positioned divs around a circle
function RadarChart({ subjects }: { subjects: typeof SUBJECTS }) {
  const size = 200
  const center = size / 2
  const maxR = 80

  const points = subjects.map((s, i) => {
    const angle = (i / subjects.length) * 2 * Math.PI - Math.PI / 2
    const r = maxR * (s.marks / s.total)
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      lx: center + (maxR + 22) * Math.cos(angle),
      ly: center + (maxR + 22) * Math.sin(angle),
      name: s.name.split(' ')[0],
      pct: Math.round((s.marks / s.total) * 100),
    }
  })

  const gridLevels = [0.25, 0.5, 0.75, 1]

  return (
    <div className="flex flex-col items-center">
      <svg width={size + 80} height={size + 80} viewBox={`-40 -40 ${size + 80} ${size + 80}`} className="overflow-visible">
        {/* Grid polygons */}
        {gridLevels.map((level) => {
          const gPoints = subjects.map((_, i) => {
            const angle = (i / subjects.length) * 2 * Math.PI - Math.PI / 2
            const r = maxR * level
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`
          }).join(' ')
          return (
            <polygon
              key={level}
              points={gPoints}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          )
        })}

        {/* Axis lines */}
        {subjects.map((_, i) => {
          const angle = (i / subjects.length) * 2 * Math.PI - Math.PI / 2
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + maxR * Math.cos(angle)}
              y2={center + maxR * Math.sin(angle)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          )
        })}

        {/* Data polygon */}
        <polygon
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="rgba(245,158,11,0.2)"
          stroke="#f59e0b"
          strokeWidth="2"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
        ))}

        {/* Labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.lx}
            y={p.ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fontWeight="600"
            fill="#44403c"
          >
            {p.name}
          </text>
        ))}
      </svg>
      <p className="text-xs text-stone-400 mt-1">Subject-wise performance radar</p>
    </div>
  )
}

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'remarks'>('overview')
  const overallGrade = gradeFromPct(OVERALL_PCT)
  const avgAttendance = Math.round(ATTENDANCE_BY_MONTH.reduce((s, m) => s + m.pct, 0) / ATTENDANCE_BY_MONTH.length)
  const avgHwCompletion = Math.round(SUBJECTS.reduce((s, sub) => s + sub.hwCompletion, 0) / SUBJECTS.length)

  return (
    <ParentShell>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Child&apos;s Progress</h1>
        <p className="text-stone-500 text-sm mt-1">Aarav Sharma · Class 10-A · Academic Year 2025–26</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Overall Grade */}
        <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm text-center">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-2">
            <Star className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-xs text-stone-500 mb-1">Overall Score</p>
          <p className="text-2xl font-bold text-stone-900">{OVERALL_PCT}%</p>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${overallGrade.bg} ${overallGrade.color}`}>{overallGrade.grade}</span>
        </div>

        {/* Class Rank */}
        <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-xs text-stone-500 mb-1">Class Rank</p>
          <p className="text-2xl font-bold text-stone-900">{CLASS_RANK.rank}</p>
          <p className="text-xs text-stone-400">out of {CLASS_RANK.total} students</p>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm text-center">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-xs text-stone-500 mb-1">Avg Attendance</p>
          <p className="text-2xl font-bold text-stone-900">{avgAttendance}%</p>
          <p className="text-xs text-green-600 font-medium">Excellent</p>
        </div>

        {/* Homework */}
        <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm text-center">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-2">
            <CheckSquare className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-xs text-stone-500 mb-1">HW Completion</p>
          <p className="text-2xl font-bold text-stone-900">{avgHwCompletion}%</p>
          <p className="text-xs text-purple-600 font-medium">Consistent</p>
        </div>
      </div>

      {/* AI Prediction Badge */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-4 mb-6 flex items-center gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white/70 text-xs font-medium mb-0.5">AI Grade Prediction · Based on current performance trend</p>
          <p className="text-white font-bold text-base">Aarav is predicted to score an <span className="bg-white text-purple-700 px-2 py-0.5 rounded-lg font-extrabold">A Grade</span> in the Annual Examination</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-white/60 text-xs">Confidence</p>
          <p className="text-white font-bold text-xl">87%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 rounded-xl p-1 mb-5 w-fit">
        {([['overview', 'Overview'], ['subjects', 'Subjects & Marks'], ['remarks', 'Teacher Remarks']] as const).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white text-amber-700 shadow-sm font-semibold'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Attendance Bar Chart by Month */}
          <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-5">
              <BarChart2 className="w-4 h-4 text-amber-500" /> Monthly Attendance
            </h2>
            <div className="flex items-end gap-3 h-36">
              {ATTENDANCE_BY_MONTH.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-stone-500">{m.pct}%</span>
                  <div className="w-full relative rounded-t-lg overflow-hidden" style={{ height: `${(m.pct / 100) * 100}px` }}>
                    <div
                      className="absolute inset-x-0 bottom-0 rounded-t-lg transition-all duration-700"
                      style={{
                        height: '100%',
                        background: m.pct >= 90 ? 'linear-gradient(to top, #f59e0b, #fbbf24)' : 'linear-gradient(to top, #fb923c, #fcd34d)',
                      }}
                    />
                  </div>
                  <span className="text-xs text-stone-400 font-medium">{m.month}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-400 mt-3 text-center">Days present / working days per month</p>
          </div>

          {/* Radar Chart */}
          <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm flex flex-col items-center">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-4 self-start">
              <Star className="w-4 h-4 text-amber-500" /> Subject Performance Radar
            </h2>
            <RadarChart subjects={SUBJECTS} />
          </div>

          {/* Homework Completion by Subject */}
          <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm lg:col-span-2">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-4">
              <CheckSquare className="w-4 h-4 text-amber-500" /> Homework Completion Rate
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SUBJECTS.map((sub) => (
                <div key={sub.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-stone-700">{sub.name.split(' ')[0]}</span>
                    <span className="text-xs font-bold text-stone-900">{sub.hwCompletion}%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-1.5">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-700"
                      style={{ width: `${sub.hwCompletion}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Subjects & Marks */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-amber-500" /> Subject-wise Marks
          </h2>
          <div>
            {SUBJECTS.map((sub) => (
              <SubjectBar key={sub.name} subject={sub} />
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-700">Overall Average</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-stone-900">{OVERALL_PCT}%</span>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${overallGrade.bg} ${overallGrade.color}`}>{overallGrade.grade}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Teacher Remarks */}
      {activeTab === 'remarks' && (
        <div className="space-y-4">
          {SUBJECTS.map((sub) => {
            const pct = Math.round((sub.marks / sub.total) * 100)
            const { grade, bg, color } = gradeFromPct(pct)
            return (
              <div key={sub.name} className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-stone-900">{sub.name}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${bg} ${color}`}>{grade}</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">{sub.teacher}</p>
                  </div>
                  <span className="text-sm font-bold text-stone-700">{sub.marks}/{sub.total}</span>
                </div>
                <div className="flex items-start gap-2.5 bg-amber-50 rounded-xl p-3">
                  <MessageCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-stone-700 leading-relaxed italic">&ldquo;{sub.remarks}&rdquo;</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </ParentShell>
  )
}
