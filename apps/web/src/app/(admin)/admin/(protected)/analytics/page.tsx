'use client'
import React, { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PolarRadiusAxis, Cell,
} from 'recharts'
import { TrendingUp, TrendingDown, Users, GraduationCap, CreditCard, Award } from 'lucide-react'

const enrollment = [
  { year: '2020', students: 2840 }, { year: '2021', students: 3120 },
  { year: '2022', students: 3580 }, { year: '2023', students: 3910 },
  { year: '2024', students: 4218 }, { year: '2025*', students: 4500 },
]

const feeMonthly = [
  { month: 'Jul', collected: 557000, target: 620000 },
  { month: 'Aug', collected: 659500, target: 680000 },
  { month: 'Sep', collected: 620200, target: 680000 },
  { month: 'Oct', collected: 680000, target: 680000 },
  { month: 'Nov', collected: 617000, target: 680000 },
  { month: 'Dec', collected: 414000, target: 450000 },
  { month: 'Jan', collected: 703000, target: 720000 },
  { month: 'Feb', collected: 702000, target: 720000 },
]

const subjectPerformance = [
  { subject: 'Maths',   avg: 78 },
  { subject: 'Science', avg: 72 },
  { subject: 'English', avg: 81 },
  { subject: 'Hindi',   avg: 85 },
  { subject: 'Social',  avg: 76 },
  { subject: 'Computer',avg: 88 },
]

const classAttendance = [
  { month: 'Jul', cl10: 94.2, cl9: 91.8, cl11: 95.1, cl12: 96.3 },
  { month: 'Aug', cl10: 95.8, cl9: 93.2, cl11: 94.7, cl12: 97.1 },
  { month: 'Sep', cl10: 93.1, cl9: 90.4, cl11: 93.8, cl12: 95.8 },
  { month: 'Oct', cl10: 96.2, cl9: 94.1, cl11: 96.0, cl12: 97.8 },
  { month: 'Nov', cl10: 92.4, cl9: 89.7, cl11: 91.5, cl12: 94.2 },
  { month: 'Dec', cl10: 88.3, cl9: 85.2, cl11: 89.1, cl12: 92.0 },
  { month: 'Jan', cl10: 95.0, cl9: 92.8, cl11: 95.5, cl12: 97.0 },
]

const passFailData = [
  { class: 'Cl 7', pass: 95, fail: 5 }, { class: 'Cl 8', pass: 91, fail: 9 },
  { class: 'Cl 9', pass: 88, fail: 12 }, { class: 'Cl 10', pass: 93, fail: 7 },
  { class: 'Cl 11', pass: 86, fail: 14 }, { class: 'Cl 12', pass: 79, fail: 21 },
]

const fmtINR = (v: number) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`

const KPI = [
  { label: 'Total Students', value: '4,218', change: '+7.8%', trend: 'up', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Avg Attendance', value: '94.2%', change: '+1.3%', trend: 'up', icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Fee Collection', value: '₹47.3L', change: '+12.4%', trend: 'up', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Pass Rate', value: '89.6%', change: '-2.1%', trend: 'down', icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-50' },
]

export default function AnalyticsPage() {
  const [activeLines, setActiveLines] = useState<Record<string, boolean>>({ cl10: true, cl9: true, cl11: true, cl12: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">School performance overview · FY 2024–25</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI.map(k => (
          <div key={k.label} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${k.bg} rounded-xl flex items-center justify-center`}>
                <k.icon className={`w-5 h-5 ${k.color}`} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${k.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {k.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {k.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{k.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Row 1: Enrollment Trend + Fee Collection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <p className="text-sm font-semibold text-gray-700 mb-1">Enrollment Trend</p>
          <p className="text-xs text-gray-400 mb-4">5-year growth · +48.5%</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={enrollment}>
              <defs>
                <linearGradient id="gEnroll" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #f3f4f6' }} />
              <Area type="monotone" dataKey="students" stroke="#1e3a5f" strokeWidth={2.5} fill="url(#gEnroll)" name="Students" dot={{ r: 4, fill: '#1e3a5f' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <p className="text-sm font-semibold text-gray-700 mb-1">Fee Collection vs Target</p>
          <p className="text-xs text-gray-400 mb-4">Monthly comparison</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={feeMonthly} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtINR} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={44} />
              <Tooltip formatter={(v: number) => fmtINR(v)} contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #f3f4f6' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="target" fill="#e5e7eb" radius={[4,4,0,0]} name="Target" barSize={14} />
              <Bar dataKey="collected" fill="#1e3a5f" radius={[4,4,0,0]} name="Collected" barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Subject Performance + Pass/Fail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <p className="text-sm font-semibold text-gray-700 mb-1">Subject-wise Avg Score</p>
          <p className="text-xs text-gray-400 mb-4">All classes combined</p>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={subjectPerformance} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={60} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Avg Score']} contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #f3f4f6' }} />
              <Bar dataKey="avg" radius={[0,6,6,0]} name="Avg Score">
                {subjectPerformance.map((entry, i) => (
                  <Cell key={i} fill={entry.avg >= 85 ? '#10b981' : entry.avg >= 75 ? '#1e3a5f' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <p className="text-sm font-semibold text-gray-700 mb-1">Pass / Fail Rate by Class</p>
          <p className="text-xs text-gray-400 mb-4">Last term results</p>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={passFailData} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="class" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #f3f4f6' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="pass" stackId="a" fill="#10b981" radius={[0,0,0,0]} name="Pass %" />
              <Bar dataKey="fail" stackId="a" fill="#f87171" radius={[4,4,0,0]} name="Fail %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Attendance Trend */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-700">Class-wise Attendance Trend</p>
            <p className="text-xs text-gray-400">Monthly % — click legend to toggle</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={classAttendance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis domain={[80, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #f3f4f6' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} onClick={e => setActiveLines(p => ({ ...p, [e.dataKey]: !p[e.dataKey] }))} />
            {[
              { key: 'cl10', label: 'Class 10', color: '#1e3a5f' },
              { key: 'cl9',  label: 'Class 9',  color: '#10b981' },
              { key: 'cl11', label: 'Class 11', color: '#d4a017' },
              { key: 'cl12', label: 'Class 12', color: '#8b5cf6' },
            ].map(({ key, label, color }) => (
              <Line key={key} type="monotone" dataKey={key} name={label}
                stroke={color} strokeWidth={2} dot={{ r: 3 }} hide={!activeLines[key]} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
