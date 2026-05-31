'use client'

import React, { useState } from 'react'
import ParentShell from '@/components/ParentShell'
import { CheckCircle2, XCircle, Clock, AlertCircle, Calendar, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const CHILD = { name: 'Aarav Sharma', class: 'Class 10-A', rollNo: '10A-018' }

const MONTHLY = [
  { month: 'January', total: 26, present: 25, absent: 1, late: 0, pct: 96.2 },
  { month: 'February', total: 24, present: 23, absent: 1, late: 0, pct: 95.8 },
  { month: 'March', total: 26, present: 24, absent: 2, late: 0, pct: 92.3 },
  { month: 'April', total: 25, present: 24, absent: 1, late: 0, pct: 96.0 },
  { month: 'May', total: 22, present: 20, absent: 1, late: 1, pct: 90.9 },
]

const RECENT = [
  { date: '2026-05-31', day: 'Saturday', status: 'Present' },
  { date: '2026-05-30', day: 'Friday', status: 'Present' },
  { date: '2026-05-29', day: 'Thursday', status: 'Present' },
  { date: '2026-05-28', day: 'Wednesday', status: 'Absent', reason: 'Sick' },
  { date: '2026-05-27', day: 'Tuesday', status: 'Present' },
  { date: '2026-05-26', day: 'Monday', status: 'Late', reason: 'Traffic delay' },
  { date: '2026-05-23', day: 'Friday', status: 'Present' },
  { date: '2026-05-22', day: 'Thursday', status: 'Present' },
]

const totalPresent = MONTHLY.reduce((a, m) => a + m.present, 0)
const totalDays    = MONTHLY.reduce((a, m) => a + m.total, 0)
const overallPct   = ((totalPresent / totalDays) * 100).toFixed(1)

export default function AttendancePage() {
  return (
    <ParentShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-500 mt-0.5">{CHILD.name} · {CHILD.class} · Roll {CHILD.rollNo}</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Overall Rate',    value: `${overallPct}%`,  icon: TrendingUp,   color: 'bg-green-500' },
            { label: 'Days Present',    value: totalPresent,       icon: CheckCircle2, color: 'bg-blue-500'  },
            { label: 'Days Absent',     value: totalDays - totalPresent, icon: XCircle, color: 'bg-red-400' },
            { label: 'Working Days',    value: totalDays,          icon: Calendar,     color: 'bg-purple-500' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', s.color)}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Alert if low */}
        {parseFloat(overallPct) < 95 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Attendance below 95%</p>
              <p className="text-sm text-yellow-600 mt-0.5">
                Aarav's current attendance is {overallPct}%. Minimum 75% is required for exams. Please ensure regular attendance.
              </p>
            </div>
          </div>
        )}

        {/* Monthly chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Month-wise Attendance</h2>
          <div className="space-y-3">
            {MONTHLY.map(m => (
              <div key={m.month} className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-20 flex-shrink-0">{m.month}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className={cn('h-2 rounded-full', m.pct >= 95 ? 'bg-green-500' : m.pct >= 85 ? 'bg-yellow-400' : 'bg-red-400')}
                    style={{ width: `${m.pct}%` }} />
                </div>
                <span className={cn('text-xs font-semibold w-12 text-right', m.pct >= 95 ? 'text-green-600' : m.pct >= 85 ? 'text-yellow-600' : 'text-red-500')}>
                  {m.pct}%
                </span>
                <span className="text-xs text-gray-400 w-20 flex-shrink-0">{m.present}/{m.total} days</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent days */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Recent Attendance</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT.map((r, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.day}, {r.date}</p>
                  {r.reason && <p className="text-xs text-gray-400 mt-0.5">Reason: {r.reason}</p>}
                </div>
                <span className={cn('px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1',
                  r.status === 'Present' ? 'bg-green-100 text-green-700' :
                  r.status === 'Absent'  ? 'bg-red-100 text-red-700'    :
                  'bg-yellow-100 text-yellow-700')}>
                  {r.status === 'Present' ? <CheckCircle2 className="w-3 h-3" /> :
                   r.status === 'Absent'  ? <XCircle className="w-3 h-3" /> :
                   <Clock className="w-3 h-3" />}
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ParentShell>
  )
}
