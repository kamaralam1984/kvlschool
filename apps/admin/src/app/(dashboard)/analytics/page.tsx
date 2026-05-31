'use client'

import React, { useState } from 'react'
import {
  BarChart3, TrendingUp, TrendingDown, Users, GraduationCap,
  CreditCard, Calendar, Download, RefreshCw, ArrowUp, ArrowDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

const KPI_CARDS = [
  { label: 'Total Students', value: '4,218', change: '+128', trend: 'up', sub: 'vs last year', color: 'text-blue-600' },
  { label: 'Fee Collection Rate', value: '94.2%', change: '+2.1%', trend: 'up', sub: 'vs last month', color: 'text-green-600' },
  { label: 'Avg Attendance', value: '93.8%', change: '-0.4%', trend: 'down', sub: 'this month', color: 'text-orange-500' },
  { label: 'Pass Rate', value: '96.8%', change: '+1.2%', trend: 'up', sub: 'last exam', color: 'text-purple-600' },
]

const MONTHLY_DATA = [
  { month: 'Jan', students: 4090, fees: 68, attendance: 94 },
  { month: 'Feb', students: 4110, fees: 72, attendance: 92 },
  { month: 'Mar', students: 4150, fees: 85, attendance: 95 },
  { month: 'Apr', students: 4180, fees: 78, attendance: 93 },
  { month: 'May', students: 4218, fees: 92, attendance: 94 },
]

const CLASS_PERFORMANCE = [
  { class: 'XII-A', avgScore: 86, attendance: 96.2, passRate: 100 },
  { class: 'XII-B', avgScore: 81, attendance: 94.8, passRate: 97.0 },
  { class: 'XI-A', avgScore: 79, attendance: 93.5, passRate: 97.2 },
  { class: 'XI-B', avgScore: 77, attendance: 92.1, passRate: 100 },
  { class: 'X-A', avgScore: 82, attendance: 95.3, passRate: 97.6 },
  { class: 'X-B', avgScore: 78, attendance: 93.8, passRate: 94.9 },
  { class: 'IX-A', avgScore: 74, attendance: 91.2, passRate: 95.0 },
  { class: 'IX-B', avgScore: 71, attendance: 90.5, passRate: 92.1 },
]

const SUBJECT_PERFORMANCE = [
  { subject: 'Mathematics', avgScore: 74, topperScore: 99, failRate: 4.2 },
  { subject: 'Physics', avgScore: 78, topperScore: 98, failRate: 3.1 },
  { subject: 'Chemistry', avgScore: 76, topperScore: 97, failRate: 3.8 },
  { subject: 'English', avgScore: 83, topperScore: 99, failRate: 1.2 },
  { subject: 'Biology', avgScore: 81, topperScore: 97, failRate: 2.0 },
  { subject: 'History', avgScore: 79, topperScore: 95, failRate: 2.5 },
]

const maxFees = Math.max(...MONTHLY_DATA.map(d => d.fees))

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'finance' | 'reports'>('overview')
  const [period, setPeriod] = useState('2025-2026')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">School performance insights and reports</p>
        </div>
        <div className="flex gap-2">
          <select value={period} onChange={e => setPeriod(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none">
            <option>2025-2026</option>
            <option>2024-2025</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-500 mb-1">{k.label}</p>
            <p className={cn('text-2xl font-bold', k.color)}>{k.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {k.trend === 'up'
                ? <ArrowUp className="w-3 h-3 text-green-500" />
                : <ArrowDown className="w-3 h-3 text-red-400" />}
              <span className={cn('text-xs font-medium', k.trend === 'up' ? 'text-green-600' : 'text-red-500')}>{k.change}</span>
              <span className="text-xs text-gray-400">{k.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['overview', 'academic', 'finance', 'reports'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-1.5 text-sm rounded-md capitalize transition-all', activeTab === tab ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700')}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Enrollment */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Student Enrollment Trend</h2>
            <div className="flex items-end gap-2 h-40">
              {MONTHLY_DATA.map(d => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500">{d.students}</span>
                  <div className="w-full bg-blue-500 rounded-t-md" style={{ height: `${((d.students - 4080) / 140) * 100}%` }} />
                  <span className="text-xs text-gray-400">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Collection */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Monthly Fee Collection (₹ Lakhs)</h2>
            <div className="flex items-end gap-2 h-40">
              {MONTHLY_DATA.map(d => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500">₹{d.fees}L</span>
                  <div className="w-full bg-green-500 rounded-t-md" style={{ height: `${(d.fees / maxFees) * 100}%` }} />
                  <span className="text-xs text-gray-400">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Trend */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Monthly Attendance %</h2>
            <div className="space-y-3">
              {MONTHLY_DATA.map(d => (
                <div key={d.month} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-8">{d.month}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className={cn('h-2 rounded-full', d.attendance >= 95 ? 'bg-green-500' : d.attendance >= 90 ? 'bg-yellow-400' : 'bg-red-400')} style={{ width: `${d.attendance}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-10 text-right">{d.attendance}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Department Distribution */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Students by Stream (XI-XII)</h2>
            <div className="space-y-3">
              {[
                { stream: 'Science (PCM)', count: 180, pct: 38, color: 'bg-blue-500' },
                { stream: 'Science (PCB)', count: 142, pct: 30, color: 'bg-green-500' },
                { stream: 'Commerce', count: 98, pct: 21, color: 'bg-orange-400' },
                { stream: 'Arts / Humanities', count: 52, pct: 11, color: 'bg-purple-400' },
              ].map(s => (
                <div key={s.stream} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-36 flex-shrink-0">{s.stream}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className={cn('h-2 rounded-full', s.color)} style={{ width: `${s.pct}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-16 text-right">{s.count} ({s.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'academic' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Class-wise Academic Performance</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Class', 'Avg Score', 'Attendance', 'Pass Rate', 'Performance'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {CLASS_PERFORMANCE.map(c => (
                    <tr key={c.class} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">{c.class}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${c.avgScore}%` }} />
                          </div>
                          <span className="text-xs text-gray-700">{c.avgScore}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-sm font-medium', c.attendance >= 95 ? 'text-green-600' : c.attendance >= 90 ? 'text-yellow-600' : 'text-red-500')}>{c.attendance}%</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-sm font-medium', c.passRate === 100 ? 'text-green-600' : c.passRate >= 95 ? 'text-blue-600' : 'text-orange-500')}>{c.passRate}%</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-1 rounded-full text-xs font-medium',
                          c.avgScore >= 82 ? 'bg-green-100 text-green-700' :
                          c.avgScore >= 76 ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700')}>
                          {c.avgScore >= 82 ? 'Excellent' : c.avgScore >= 76 ? 'Good' : 'Average'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Subject-wise Performance</h2>
            <div className="space-y-4">
              {SUBJECT_PERFORMANCE.map(s => (
                <div key={s.subject} className="flex items-center gap-4">
                  <span className="text-sm text-gray-700 w-24 flex-shrink-0">{s.subject}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className={cn('h-2 rounded-full', s.avgScore >= 80 ? 'bg-green-500' : s.avgScore >= 75 ? 'bg-blue-500' : 'bg-yellow-400')} style={{ width: `${s.avgScore}%` }} />
                  </div>
                  <span className="text-xs text-gray-600 w-12">Avg: {s.avgScore}%</span>
                  <span className="text-xs text-green-600 w-16">Top: {s.topperScore}%</span>
                  <span className={cn('text-xs w-16', s.failRate > 3 ? 'text-red-500' : 'text-gray-500')}>Fail: {s.failRate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Total Revenue', value: '₹1.24 Cr', change: '+8.2%', color: 'text-green-600' },
            { title: 'Total Expenses', value: '₹86.4 L', change: '+3.1%', color: 'text-red-500' },
            { title: 'Net Surplus', value: '₹37.6 L', change: '+18.4%', color: 'text-blue-600' },
            { title: 'Outstanding Fees', value: '₹22.8 L', change: '-5.2%', color: 'text-orange-500' },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-sm text-gray-500">{f.title}</p>
              <p className={cn('text-3xl font-bold mt-1', f.color)}>{f.value}</p>
              <p className="text-sm text-gray-400 mt-1">{f.change} vs last year</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Annual Report', desc: 'Full school performance for 2025-26', type: 'PDF' },
            { title: 'Student Progress Report', desc: 'Individual student performance cards', type: 'PDF' },
            { title: 'Financial Summary', desc: 'Income, expenses, and fee collection', type: 'XLSX' },
            { title: 'Attendance Report', desc: 'Monthly and annual attendance data', type: 'XLSX' },
            { title: 'Exam Results Summary', desc: 'All exam results in one report', type: 'PDF' },
            { title: 'Staff Performance', desc: 'Teacher evaluation and ratings', type: 'PDF' },
          ].map(r => (
            <div key={r.title} className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{r.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">{r.type}</span>
              </div>
              <Download className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
