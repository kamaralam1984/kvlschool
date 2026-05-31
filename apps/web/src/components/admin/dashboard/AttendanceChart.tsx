'use client'
import React from 'react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'

const pie = [
  { name: 'Present', value: 3972, color: '#10b981' },
  { name: 'Absent',  value: 186,  color: '#f87171' },
  { name: 'Leave',   value: 60,   color: '#fbbf24' },
]

const weekly = [
  { day: 'Mon', pct: 95.2 },
  { day: 'Tue', pct: 93.8 },
  { day: 'Wed', pct: 96.1 },
  { day: 'Thu', pct: 94.5 },
  { day: 'Fri', pct: 91.3 },
]

function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-2.5 text-xs">
      <p className="font-semibold" style={{ color: payload[0].payload.color }}>
        {payload[0].name}
      </p>
      <p className="text-gray-700">{payload[0].value} students</p>
    </div>
  )
}

export function AttendanceChart() {
  const total = pie.reduce((s, p) => s + p.value, 0)
  const pct = ((pie[0].value / total) * 100).toFixed(1)

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-gray-700">Today's Attendance</p>
        <p className="text-xs text-gray-400 mt-0.5">{total.toLocaleString()} enrolled</p>
      </div>

      <div className="relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={pie} cx="50%" cy="50%" innerRadius={50} outerRadius={70}
              paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
              {pie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-900">{pct}%</span>
          <span className="text-xs text-gray-400">Present</span>
        </div>
      </div>

      <div className="flex justify-center gap-3 flex-wrap">
        {pie.map(p => (
          <div key={p.name} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
            <span>{p.name}</span>
            <span className="font-medium text-gray-700">{p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">This Week</p>
        <ResponsiveContainer width="100%" height={70}>
          <BarChart data={weekly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis domain={[85, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v: any) => [`${v}%`, 'Attendance']}
              contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #f3f4f6' }}
            />
            <Bar dataKey="pct" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
