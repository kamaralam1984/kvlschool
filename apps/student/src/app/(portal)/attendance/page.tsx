'use client'

import React, { useState } from 'react'

// ─── Mock Data ──────────────────────────────────────────────────────
// Day status: P = Present, A = Absent, L = Leave, H = Holiday, '' = future/weekend
type DayStatus = 'P' | 'A' | 'L' | 'H' | ''

interface MonthData {
  year: number
  month: number // 0-indexed
  days: (DayStatus | null)[] // null = no school day (weekend/no entry); index 0 = first cell offset
  stats: { present: number; absent: number; leave: number; holiday: number; total: number }
}

const attendanceData: Record<string, MonthData> = {
  'May 2025': {
    year: 2025, month: 4,
    days: [
      // May 1 = Thursday (offset 3: Mon=0)
      null, null, null, 'P', 'P', null, null, // week 1: 1 Thu, 2 Fri
      'P', 'P', 'P', 'P', 'P', null, null,    // week 2: 5-9
      'P', 'P', 'A', 'P', 'P', null, null,    // week 3: 12-16
      'P', 'P', 'P', 'P', 'H', null, null,    // week 4: 19-23 (23 = holiday)
      'P', 'P', 'P', 'P',                     // week 5: 26-29
    ],
    stats: { present: 19, absent: 1, leave: 0, holiday: 1, total: 22 },
  },
  'April 2025': {
    year: 2025, month: 3,
    days: [
      // April 1 = Tuesday (offset 1)
      null, 'P', 'P', 'P', 'H', null, null,   // week 1
      'P', 'P', 'P', 'P', 'P', null, null,    // week 2
      'P', 'L', 'P', 'P', 'P', null, null,    // week 3
      'P', 'P', 'P', 'P', 'P', null, null,    // week 4
      'P', 'P', 'P',                           // week 5: last 3 days
    ],
    stats: { present: 20, absent: 0, leave: 1, holiday: 1, total: 22 },
  },
  'March 2025': {
    year: 2025, month: 2,
    days: [
      // March 1 = Saturday → skip first two days
      null, null, null, null, null, null, null, // week0 pad
      'P', 'P', 'P', 'P', 'P', null, null,
      'P', 'A', 'P', 'P', 'P', null, null,
      'P', 'P', 'P', 'P', 'P', null, null,
      'P', 'P', 'P', 'P',
    ],
    stats: { present: 19, absent: 1, leave: 0, holiday: 0, total: 21 },
  },
}

const months = Object.keys(attendanceData)

const subjectAttendance = [
  { subject: 'Mathematics', present: 20, total: 22, pct: 91 },
  { subject: 'Physics', present: 21, total: 22, pct: 95 },
  { subject: 'Chemistry', present: 19, total: 22, pct: 86 },
  { subject: 'English Literature', present: 22, total: 22, pct: 100 },
  { subject: 'History', present: 21, total: 22, pct: 95 },
  { subject: 'Computer Science', present: 22, total: 22, pct: 100 },
]

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const statusStyles: Record<DayStatus, { bg: string; text: string; label: string }> = {
  P: { bg: 'bg-teal-500', text: 'text-white', label: 'Present' },
  A: { bg: 'bg-red-400', text: 'text-white', label: 'Absent' },
  L: { bg: 'bg-amber-400', text: 'text-white', label: 'Leave' },
  H: { bg: 'bg-slate-200', text: 'text-slate-500', label: 'Holiday' },
  '': { bg: 'bg-transparent', text: 'text-transparent', label: '' },
}

// ─── Calendar ───────────────────────────────────────────────────────
function AttendanceCalendar({ data }: { data: MonthData }) {
  // Build calendar cells: each entry is [dayNumber | null, status]
  const cells: { day: number | null; status: DayStatus | null }[] = []

  // data.days starts at index 0 which may be null-padding for offset
  // We need to reconstruct day numbers
  let dayNum = 1
  for (let i = 0; i < data.days.length; i++) {
    const dow = i % 7
    if (dow === 5 || dow === 6) {
      // weekend — show as empty
      cells.push({ day: null, status: null })
    } else {
      const st = data.days[i]
      if (st === null) {
        cells.push({ day: null, status: null })
      } else {
        cells.push({ day: dayNum++, status: st })
      }
    }
  }

  return (
    <div>
      {/* Week headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (cell.day === null || cell.status === null) {
            return <div key={i} className="aspect-square rounded-lg" />
          }
          const style = statusStyles[cell.status]
          return (
            <div
              key={i}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center ${style.bg} transition-all hover:scale-105 cursor-default group relative`}
              title={`Day ${cell.day} — ${style.label}`}
            >
              <span className={`text-xs font-semibold ${style.text}`}>{cell.day}</span>
              <span className={`text-[9px] ${style.text} opacity-80`}>{cell.status}</span>
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {style.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────
export default function AttendancePage() {
  const [selectedMonth, setSelectedMonth] = useState(months[0])
  const data = attendanceData[selectedMonth]

  // Overall stats across all months
  const overallPresent = Object.values(attendanceData).reduce((s, d) => s + d.stats.present, 0)
  const overallTotal = Object.values(attendanceData).reduce((s, d) => s + d.stats.total, 0)
  const overallPct = ((overallPresent / overallTotal) * 100).toFixed(1)

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Attendance</h1>
        <p className="text-sm text-slate-400 mt-0.5">Aarav Sharma · Class 10-A · Roll KVL-001</p>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Overall Attendance', value: `${overallPct}%`, icon: '📊', color: 'teal' },
          { label: 'Total Present', value: overallPresent, icon: '✅', color: 'emerald' },
          { label: 'Total Absent', value: Object.values(attendanceData).reduce((s, d) => s + d.stats.absent, 0), icon: '❌', color: 'red' },
          { label: 'Leave Taken', value: Object.values(attendanceData).reduce((s, d) => s + d.stats.leave, 0), icon: '🏖️', color: 'amber' },
        ].map((s) => (
          <div key={s.label} className={`card px-4 py-4 border-l-4 border-${s.color}-400`}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              <span className="text-lg">{s.icon}</span>
            </div>
            <p className={`text-2xl font-bold text-${s.color}-600 mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Calendar */}
        <div className="lg:col-span-2 card px-5 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="text-sm font-semibold text-slate-800">Monthly Calendar</h2>
            {/* Month selector */}
            <div className="flex gap-1 flex-wrap">
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedMonth === m
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <AttendanceCalendar data={data} />

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-slate-100">
            {(['P', 'A', 'L', 'H'] as DayStatus[]).map((st) => (
              <div key={st} className="flex items-center gap-2 text-xs text-slate-600">
                <span className={`w-5 h-5 rounded ${statusStyles[st].bg} flex items-center justify-center`}>
                  <span className={`text-[10px] font-bold ${statusStyles[st].text}`}>{st}</span>
                </span>
                {statusStyles[st].label}
              </div>
            ))}
          </div>
        </div>

        {/* Month stats */}
        <div className="card px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">{selectedMonth} Summary</h2>

          {/* Donut */}
          <div className="flex justify-center mb-5">
            {(() => {
              const r = 38
              const circ = 2 * Math.PI * r
              const pct = (data.stats.present / data.stats.total) * 100
              const dash = (pct / 100) * circ
              return (
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="12" />
                    <circle
                      cx="50" cy="50" r={r} fill="none"
                      stroke="#14b8a6" strokeWidth="12"
                      strokeDasharray={`${dash} ${circ}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-teal-700">{pct.toFixed(0)}%</span>
                  </div>
                </div>
              )
            })()}
          </div>

          <div className="space-y-2">
            {[
              { label: 'Working Days', val: data.stats.total, color: 'slate' },
              { label: 'Present', val: data.stats.present, color: 'teal' },
              { label: 'Absent', val: data.stats.absent, color: 'red' },
              { label: 'Leave', val: data.stats.leave, color: 'amber' },
              { label: 'Holidays', val: data.stats.holiday, color: 'slate' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-sm text-slate-600">{item.label}</span>
                <span className={`text-sm font-bold text-${item.color}-600`}>{item.val}</span>
              </div>
            ))}
          </div>

          <div className={`mt-4 p-3 rounded-xl text-sm ${
            (data.stats.present / data.stats.total) >= 0.90
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-amber-50 border border-amber-200 text-amber-700'
          }`}>
            {(data.stats.present / data.stats.total) >= 0.90
              ? '✅ Above 90% attendance threshold.'
              : '⚠️ Attendance below 90%. Please attend regularly.'}
          </div>
        </div>
      </div>

      {/* Subject-wise attendance */}
      <div className="card px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Subject-wise Attendance Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Subject</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Classes Held</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Present</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Absent</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-48">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {subjectAttendance.map((row, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-slate-800">{row.subject}</td>
                  <td className="px-4 py-3.5 text-center text-slate-600">{row.total}</td>
                  <td className="px-4 py-3.5 text-center text-emerald-600 font-semibold">{row.present}</td>
                  <td className="px-4 py-3.5 text-center text-red-500 font-semibold">{row.total - row.present}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.pct >= 90 ? 'bg-teal-500' : row.pct >= 75 ? 'bg-amber-400' : 'bg-red-400'}`}
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold w-10 text-right ${
                        row.pct >= 90 ? 'text-teal-600' : row.pct >= 75 ? 'text-amber-600' : 'text-red-500'
                      }`}>
                        {row.pct}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
