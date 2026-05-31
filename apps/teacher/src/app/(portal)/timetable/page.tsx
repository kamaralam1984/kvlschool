'use client'

import { Printer } from 'lucide-react'

const PERIODS = [
  { label: 'Period 1', time: '08:00–08:45' },
  { label: 'Period 2', time: '08:50–09:35' },
  { label: 'Break',    time: '09:35–09:50', isBreak: true },
  { label: 'Period 3', time: '09:50–10:35' },
  { label: 'Period 4', time: '10:40–11:25' },
  { label: 'Period 5', time: '11:30–12:15' },
  { label: 'Lunch',    time: '12:15–13:00', isBreak: true },
  { label: 'Period 6', time: '13:00–13:45' },
  { label: 'Period 7', time: '13:50–14:35' },
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

type SlotType = { class: string; room: string; color: string } | 'FREE' | 'BREAK'

const timetable: Record<string, SlotType[]> = {
  'Monday':    [
    { class: '10A', room: 'Room 12', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { class: '10B', room: 'Room 14', color: 'bg-green-50 border-green-200 text-green-800' },
    'BREAK',
    'FREE',
    { class: '9A', room: 'Room 8', color: 'bg-purple-50 border-purple-200 text-purple-800' },
    { class: '10A', room: 'Room 12', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    'BREAK',
    'FREE',
    { class: '10B', room: 'Room 14', color: 'bg-green-50 border-green-200 text-green-800' },
  ],
  'Tuesday':   [
    { class: '9A', room: 'Room 8', color: 'bg-purple-50 border-purple-200 text-purple-800' },
    'FREE',
    'BREAK',
    { class: '10A', room: 'Room 12', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { class: '10B', room: 'Room 14', color: 'bg-green-50 border-green-200 text-green-800' },
    'FREE',
    'BREAK',
    { class: '9A', room: 'Room 8', color: 'bg-purple-50 border-purple-200 text-purple-800' },
    'FREE',
  ],
  'Wednesday': [
    { class: '10B', room: 'Room 14', color: 'bg-green-50 border-green-200 text-green-800' },
    { class: '10A', room: 'Room 12', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    'BREAK',
    { class: '9A', room: 'Room 8', color: 'bg-purple-50 border-purple-200 text-purple-800' },
    'FREE',
    { class: '10B', room: 'Room 14', color: 'bg-green-50 border-green-200 text-green-800' },
    'BREAK',
    { class: '10A', room: 'Room 12', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    'FREE',
  ],
  'Thursday':  [
    'FREE',
    { class: '9A', room: 'Room 8', color: 'bg-purple-50 border-purple-200 text-purple-800' },
    'BREAK',
    { class: '10B', room: 'Room 14', color: 'bg-green-50 border-green-200 text-green-800' },
    { class: '10A', room: 'Room 12', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    'FREE',
    'BREAK',
    { class: '10B', room: 'Room 14', color: 'bg-green-50 border-green-200 text-green-800' },
    { class: '9A', room: 'Room 8', color: 'bg-purple-50 border-purple-200 text-purple-800' },
  ],
  'Friday':    [
    { class: '10A', room: 'Room 12', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { class: '9A', room: 'Room 8', color: 'bg-purple-50 border-purple-200 text-purple-800' },
    'BREAK',
    { class: '10B', room: 'Room 14', color: 'bg-green-50 border-green-200 text-green-800' },
    'FREE',
    { class: '10A', room: 'Room 12', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    'BREAK',
    'FREE',
    { class: '9A', room: 'Room 8', color: 'bg-purple-50 border-purple-200 text-purple-800' },
  ],
  'Saturday':  [
    { class: '10B', room: 'Room 14', color: 'bg-green-50 border-green-200 text-green-800' },
    'FREE',
    'BREAK',
    { class: '10A', room: 'Room 12', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    'FREE',
    'FREE',
    'BREAK',
    'FREE',
    'FREE',
  ],
}

const TODAY = 'Monday'

export default function TimetablePage() {
  const classCount = (day: string, cls: string) =>
    (timetable[day] || []).filter(s => typeof s === 'object' && s !== null && (s as {class:string}).class === cls).length

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Timetable</h2>
          <p className="text-sm text-gray-500 mt-0.5">Weekly schedule — Term 2, 2024–25</p>
        </div>
        <button onClick={() => window.print()} className="btn-secondary">
          <Printer size={15} /> Print Timetable
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Class 10A', color: 'bg-blue-100 border-blue-200 text-blue-700' },
          { label: 'Class 10B', color: 'bg-green-100 border-green-200 text-green-700' },
          { label: 'Class 9A',  color: 'bg-purple-100 border-purple-200 text-purple-700' },
          { label: 'Free Period', color: 'bg-gray-100 border-gray-200 text-gray-500' },
        ].map(l => (
          <span key={l.label} className={`badge border ${l.color}`}>{l.label}</span>
        ))}
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { cls: 'Class 10A', color: 'bg-blue-50 text-blue-700', weekly: DAYS.reduce((s, d) => s + classCount(d, '10A'), 0) },
          { cls: 'Class 10B', color: 'bg-green-50 text-green-700', weekly: DAYS.reduce((s, d) => s + classCount(d, '10B'), 0) },
          { cls: 'Class 9A',  color: 'bg-purple-50 text-purple-700', weekly: DAYS.reduce((s, d) => s + classCount(d, '9A'), 0) },
        ].map(s => (
          <div key={s.cls} className={`${s.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold">{s.weekly}</p>
            <p className="text-xs font-medium">{s.cls} · per week</p>
          </div>
        ))}
      </div>

      {/* Timetable Grid */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="table-th w-28">Period</th>
                {DAYS.map(d => (
                  <th key={d} className={`table-th ${d === TODAY ? 'bg-indigo-50 text-indigo-700' : ''}`}>
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {PERIODS.map((period, pIdx) => (
                <tr key={pIdx} className={period.isBreak ? 'bg-amber-50/50' : 'hover:bg-gray-50/50'}>
                  <td className="table-td border-r border-gray-100">
                    <p className="text-xs font-semibold text-gray-700">{period.label}</p>
                    <p className="text-[10px] text-gray-400">{period.time}</p>
                  </td>
                  {DAYS.map(day => {
                    const slot = timetable[day]?.[pIdx]
                    if (period.isBreak) {
                      return (
                        <td key={day} className={`px-2 py-2 text-center ${day === TODAY ? 'bg-indigo-50/30' : ''}`}>
                          <span className="text-xs text-amber-600 font-medium">{period.label}</span>
                        </td>
                      )
                    }
                    if (!slot || slot === 'BREAK') {
                      return <td key={day} className={`px-2 py-2 ${day === TODAY ? 'bg-indigo-50/20' : ''}`} />
                    }
                    if (slot === 'FREE') {
                      return (
                        <td key={day} className={`px-2 py-2 ${day === TODAY ? 'bg-indigo-50/20' : ''}`}>
                          <div className="rounded-lg bg-gray-50 border border-gray-100 px-2 py-2 text-center">
                            <p className="text-xs text-gray-400">Free</p>
                          </div>
                        </td>
                      )
                    }
                    const s = slot as { class: string; room: string; color: string }
                    return (
                      <td key={day} className={`px-2 py-2 ${day === TODAY ? 'bg-indigo-50/20' : ''}`}>
                        <div className={`rounded-lg border px-2 py-2 ${s.color}`}>
                          <p className="text-xs font-bold">{s.class}</p>
                          <p className="text-[10px] opacity-70">Math · {s.room}</p>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
