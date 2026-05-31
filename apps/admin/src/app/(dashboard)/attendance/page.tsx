'use client'

import React, { useState } from 'react'
import {
  Calendar, CheckCircle, XCircle, Clock, AlertCircle,
  Search, Filter, Download, ChevronLeft, ChevronRight,
  Users, TrendingUp, TrendingDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

const CLASSES = [
  { class: 'VI-A', total: 42, present: 39, absent: 2, late: 1 },
  { class: 'VI-B', total: 40, present: 38, absent: 2, late: 0 },
  { class: 'VII-A', total: 45, present: 41, absent: 3, late: 1 },
  { class: 'VII-B', total: 43, present: 40, absent: 2, late: 1 },
  { class: 'VIII-A', total: 44, present: 42, absent: 1, late: 1 },
  { class: 'VIII-B', total: 41, present: 38, absent: 3, late: 0 },
  { class: 'IX-A', total: 40, present: 36, absent: 3, late: 1 },
  { class: 'IX-B', total: 38, present: 35, absent: 2, late: 1 },
  { class: 'X-A', total: 42, present: 40, absent: 1, late: 1 },
  { class: 'X-B', total: 39, present: 37, absent: 2, late: 0 },
  { class: 'XI-A', total: 36, present: 33, absent: 3, late: 0 },
  { class: 'XI-B', total: 34, present: 32, absent: 2, late: 0 },
  { class: 'XII-A', total: 35, present: 34, absent: 1, late: 0 },
  { class: 'XII-B', total: 33, present: 31, absent: 2, late: 0 },
]

const STUDENTS_ABSENT = [
  { name: 'Arjun Patel', class: 'VIII-C', reason: 'Sick', days: 3, parent: '9765432109' },
  { name: 'Rohan Mehta', class: 'IX-B', reason: 'Family event', days: 1, parent: '9123456780' },
  { name: 'Ananya Singh', class: 'XI-A', reason: 'Not informed', days: 2, parent: '9876012345' },
  { name: 'Vikram Joshi', class: 'VII-A', reason: 'Medical', days: 5, parent: '9654890123' },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const WEEKS = ['W1', 'W2', 'W3', 'W4']

const totalPresent = CLASSES.reduce((a, c) => a + c.present, 0)
const totalStudents = CLASSES.reduce((a, c) => a + c.total, 0)
const totalAbsent = CLASSES.reduce((a, c) => a + c.absent, 0)
const totalLate = CLASSES.reduce((a, c) => a + c.late, 0)
const attendanceRate = ((totalPresent / totalStudents) * 100).toFixed(1)

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'absentees'>('overview')
  const [selectedDate, setSelectedDate] = useState('2026-05-31')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-500 mt-0.5">Daily attendance tracking and reports</p>
        </div>
        <div className="flex gap-2">
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: totalStudents, icon: Users, color: 'bg-blue-500', sub: 'enrolled today' },
          { label: 'Present', value: totalPresent, icon: CheckCircle, color: 'bg-green-500', sub: `${attendanceRate}% rate` },
          { label: 'Absent', value: totalAbsent, icon: XCircle, color: 'bg-red-400', sub: 'need follow-up' },
          { label: 'Late', value: totalLate, icon: Clock, color: 'bg-yellow-400', sub: 'arrived late' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', s.color)}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Rate Bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Overall Attendance Rate</h2>
          <span className="text-2xl font-bold text-green-600">{attendanceRate}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style={{ width: `${attendanceRate}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">Target: 95% — {parseFloat(attendanceRate) >= 95 ? '✓ Target met' : `${(95 - parseFloat(attendanceRate)).toFixed(1)}% below target`}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['overview', 'detailed', 'absentees'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-1.5 text-sm rounded-md capitalize transition-all', activeTab === tab ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700')}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Class-wise Attendance — {selectedDate}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Class', 'Total', 'Present', 'Absent', 'Late', 'Rate', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CLASSES.map(c => {
                  const rate = ((c.present / c.total) * 100).toFixed(0)
                  const isLow = parseInt(rate) < 90
                  return (
                    <tr key={c.class} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">{c.class}</td>
                      <td className="px-4 py-3 text-gray-500">{c.total}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">{c.present}</td>
                      <td className="px-4 py-3 text-red-500">{c.absent}</td>
                      <td className="px-4 py-3 text-yellow-500">{c.late}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-20">
                            <div className={cn('h-1.5 rounded-full', parseInt(rate) >= 95 ? 'bg-green-500' : parseInt(rate) >= 90 ? 'bg-yellow-400' : 'bg-red-400')} style={{ width: `${rate}%` }} />
                          </div>
                          <span className="text-xs font-medium">{rate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {isLow
                          ? <span className="flex items-center gap-1 text-red-500 text-xs"><AlertCircle className="w-3 h-3" />Low</span>
                          : <span className="flex items-center gap-1 text-green-500 text-xs"><CheckCircle className="w-3 h-3" />Good</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'absentees' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Absent Students Today</h2>
            <span className="text-sm text-red-500 font-medium">{totalAbsent} students absent</span>
          </div>
          <div className="divide-y divide-gray-50">
            {STUDENTS_ABSENT.map(s => (
              <div key={s.name} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.class} · {s.reason} · {s.days} day{s.days > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('px-2 py-1 rounded-full text-xs', s.reason === 'Not informed' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600')}>{s.reason}</span>
                  <button className="text-xs text-blue-600 hover:underline">Call Parent</button>
                  <button className="text-xs text-gray-500 hover:underline">Mark Leave</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'detailed' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Weekly Attendance Heatmap</h2>
          <div className="overflow-x-auto">
            <table className="text-xs text-center">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-gray-500 text-left">Class</th>
                  {WEEKS.flatMap(w => DAYS.map(d => (
                    <th key={`${w}-${d}`} className="px-2 py-2 text-gray-400">{d}</th>
                  )))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CLASSES.slice(0, 8).map(c => (
                  <tr key={c.class}>
                    <td className="px-3 py-2 font-medium text-gray-700 text-left">{c.class}</td>
                    {WEEKS.flatMap(w => DAYS.map(d => {
                      const pct = Math.floor(Math.random() * 15 + 85)
                      return (
                        <td key={`${w}-${d}`} className="px-2 py-2">
                          <div className={cn('w-7 h-7 rounded flex items-center justify-center text-xs font-medium mx-auto',
                            pct >= 95 ? 'bg-green-100 text-green-700' : pct >= 90 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')}>
                            {pct}
                          </div>
                        </td>
                      )
                    }))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
