'use client'
import React, { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp } from 'lucide-react'

const monthly = [
  { month: 'Jul', tuition: 420000, hostel: 85000, transport: 32000 },
  { month: 'Aug', tuition: 510000, hostel: 91000, transport: 35000 },
  { month: 'Sep', tuition: 480000, hostel: 89000, transport: 33000 },
  { month: 'Oct', tuition: 525000, hostel: 94000, transport: 36000 },
  { month: 'Nov', tuition: 495000, hostel: 88000, transport: 34000 },
  { month: 'Dec', tuition: 310000, hostel: 76000, transport: 28000 },
  { month: 'Jan', tuition: 540000, hostel: 96000, transport: 38000 },
  { month: 'Feb', tuition: 565000, hostel: 98000, transport: 39000 },
  { month: 'Mar', tuition: 590000, hostel: 102000, transport: 41000 },
  { month: 'Apr', tuition: 472000, hostel: 87000, transport: 33000 },
  { month: 'May', tuition: 448000, hostel: 84000, transport: 31000 },
  { month: 'Jun', tuition: 385000, hostel: 79000, transport: 29000 },
]

const fmt = (v: number) =>
  v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s: number, p: any) => s + p.value, 0)
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-6 mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-500 capitalize">{p.name}</span>
          </span>
          <span className="font-medium text-gray-800">{fmt(p.value)}</span>
        </div>
      ))}
      <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between">
        <span className="text-gray-500">Total</span>
        <span className="font-bold text-gray-900">{fmt(total)}</span>
      </div>
    </div>
  )
}

export function RevenueChart() {
  const [period, setPeriod] = useState<'6m' | '12m'>('12m')
  const data = period === '6m' ? monthly.slice(6) : monthly
  const total = monthly.reduce((s, m) => s + m.tuition + m.hostel + m.transport, 0)

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-semibold text-gray-700">Revenue Overview</p>
          <p className="text-xs text-gray-400 mt-0.5">FY 2024–25 · Total {fmt(total)}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs">
            {(['6m', '12m'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-md font-medium transition-all ${period === p ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                {p}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
            <TrendingUp className="w-3 h-3" /><span>+12.4%</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gTuition" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gHostel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d4a017" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#d4a017" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gTransport" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={46} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            formatter={(v) => <span className="text-gray-500 capitalize">{v}</span>} />
          <Area type="monotone" dataKey="tuition"   stroke="#1e3a5f" strokeWidth={2} fill="url(#gTuition)"   name="Tuition" />
          <Area type="monotone" dataKey="hostel"    stroke="#d4a017" strokeWidth={2} fill="url(#gHostel)"    name="Hostel" />
          <Area type="monotone" dataKey="transport" stroke="#10b981" strokeWidth={2} fill="url(#gTransport)" name="Transport" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
