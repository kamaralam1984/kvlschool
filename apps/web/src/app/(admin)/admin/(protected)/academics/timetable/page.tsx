'use client'
import React, { useState } from 'react'
import { ChevronDown, Printer, Download } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const PERIODS = [
  { label: 'Period 1', time: '08:00–08:45' }, { label: 'Period 2', time: '08:45–09:30' },
  { label: 'Period 3', time: '09:30–10:15' }, { label: 'Break', time: '10:15–10:30' },
  { label: 'Period 4', time: '10:30–11:15' }, { label: 'Period 5', time: '11:15–12:00' },
  { label: 'Lunch', time: '12:00–12:45' },    { label: 'Period 6', time: '12:45–13:30' },
  { label: 'Period 7', time: '13:30–14:15' }, { label: 'Period 8', time: '14:15–15:00' },
]

const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
  'Physics':     'bg-purple-100 text-purple-800 border-purple-200',
  'Chemistry':   'bg-green-100 text-green-800 border-green-200',
  'English':     'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Hindi':       'bg-orange-100 text-orange-800 border-orange-200',
  'Social Sc.':  'bg-teal-100 text-teal-800 border-teal-200',
  'Computer':    'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Biology':     'bg-emerald-100 text-emerald-800 border-emerald-200',
  'P.E.':        'bg-red-100 text-red-800 border-red-200',
  'Library':     'bg-gray-100 text-gray-700 border-gray-200',
  'Break':       'bg-gray-50 text-gray-400 border-gray-100',
  'Lunch':       'bg-amber-50 text-amber-600 border-amber-100',
}

type Cell = { subject: string; teacher: string } | null

const TT_10A: Record<string, Record<string, Cell>> = {
  Monday:    { 'Period 1': { subject: 'Mathematics', teacher: 'Mr. Rajesh' }, 'Period 2': { subject: 'Physics', teacher: 'Ms. Priya' }, 'Period 3': { subject: 'English', teacher: 'Mrs. Anita' }, Break: null, 'Period 4': { subject: 'Chemistry', teacher: 'Mr. Suresh' }, 'Period 5': { subject: 'Hindi', teacher: 'Ms. Kavita' }, Lunch: null, 'Period 6': { subject: 'Social Sc.', teacher: 'Mr. Anil' }, 'Period 7': { subject: 'Computer', teacher: 'Mr. Dev' }, 'Period 8': { subject: 'P.E.', teacher: 'Mr. Ravi' } },
  Tuesday:   { 'Period 1': { subject: 'Physics', teacher: 'Ms. Priya' }, 'Period 2': { subject: 'Mathematics', teacher: 'Mr. Rajesh' }, 'Period 3': { subject: 'Hindi', teacher: 'Ms. Kavita' }, Break: null, 'Period 4': { subject: 'English', teacher: 'Mrs. Anita' }, 'Period 5': { subject: 'Chemistry', teacher: 'Mr. Suresh' }, Lunch: null, 'Period 6': { subject: 'Biology', teacher: 'Ms. Nisha' }, 'Period 7': { subject: 'Mathematics', teacher: 'Mr. Rajesh' }, 'Period 8': { subject: 'Library', teacher: 'Mrs. Seema' } },
  Wednesday: { 'Period 1': { subject: 'English', teacher: 'Mrs. Anita' }, 'Period 2': { subject: 'Chemistry', teacher: 'Mr. Suresh' }, 'Period 3': { subject: 'Mathematics', teacher: 'Mr. Rajesh' }, Break: null, 'Period 4': { subject: 'Physics', teacher: 'Ms. Priya' }, 'Period 5': { subject: 'Social Sc.', teacher: 'Mr. Anil' }, Lunch: null, 'Period 6': { subject: 'Hindi', teacher: 'Ms. Kavita' }, 'Period 7': { subject: 'P.E.', teacher: 'Mr. Ravi' }, 'Period 8': { subject: 'Computer', teacher: 'Mr. Dev' } },
  Thursday:  { 'Period 1': { subject: 'Chemistry', teacher: 'Mr. Suresh' }, 'Period 2': { subject: 'Biology', teacher: 'Ms. Nisha' }, 'Period 3': { subject: 'Physics', teacher: 'Ms. Priya' }, Break: null, 'Period 4': { subject: 'Mathematics', teacher: 'Mr. Rajesh' }, 'Period 5': { subject: 'Computer', teacher: 'Mr. Dev' }, Lunch: null, 'Period 6': { subject: 'English', teacher: 'Mrs. Anita' }, 'Period 7': { subject: 'Hindi', teacher: 'Ms. Kavita' }, 'Period 8': { subject: 'Social Sc.', teacher: 'Mr. Anil' } },
  Friday:    { 'Period 1': { subject: 'Hindi', teacher: 'Ms. Kavita' }, 'Period 2': { subject: 'Social Sc.', teacher: 'Mr. Anil' }, 'Period 3': { subject: 'Chemistry', teacher: 'Mr. Suresh' }, Break: null, 'Period 4': { subject: 'Biology', teacher: 'Ms. Nisha' }, 'Period 5': { subject: 'English', teacher: 'Mrs. Anita' }, Lunch: null, 'Period 6': { subject: 'Mathematics', teacher: 'Mr. Rajesh' }, 'Period 7': { subject: 'Physics', teacher: 'Ms. Priya' }, 'Period 8': { subject: 'P.E.', teacher: 'Mr. Ravi' } },
  Saturday:  { 'Period 1': { subject: 'Mathematics', teacher: 'Mr. Rajesh' }, 'Period 2': { subject: 'English', teacher: 'Mrs. Anita' }, 'Period 3': { subject: 'Hindi', teacher: 'Ms. Kavita' }, Break: null, 'Period 4': { subject: 'P.E.', teacher: 'Mr. Ravi' }, 'Period 5': { subject: 'Library', teacher: 'Mrs. Seema' }, Lunch: null, 'Period 6': null, 'Period 7': null, 'Period 8': null },
}

const today = new Date().toLocaleDateString('en-IN', { weekday: 'long' })

export default function TimetablePage() {
  const [cls, setCls] = useState('10')
  const [section, setSection] = useState('A')

  const subjects = Array.from(new Set(
    Object.values(TT_10A).flatMap(day => Object.values(day).filter(Boolean).map(c => c!.subject))
  )).sort()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-500 text-sm mt-1">Weekly class schedule · Class {cls} – Section {section}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3">
        {[
          { label: 'Class', val: cls, set: setCls, opts: ['7','8','9','10','11','12'] },
          { label: 'Section', val: section, set: setSection, opts: ['A','B','C','D'] },
        ].map(f => (
          <div key={f.label} className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">{f.label}</span>
            <div className="relative">
              <select value={f.val} onChange={e => f.set(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-gray-50">
                {f.opts.map(o => <option key={o} value={o}>{f.label === 'Class' ? `Class ${o}` : `Section ${o}`}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="ml-auto flex flex-wrap gap-2">
          {subjects.slice(0, 5).map(s => (
            <span key={s} className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${SUBJECT_COLORS[s] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>{s}</span>
          ))}
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-[#1e3a5f]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/70 w-[120px]">Period / Day</th>
                {DAYS.map(d => (
                  <th key={d} className={`px-4 py-3 text-left text-xs font-semibold ${d === today ? 'text-gold-300' : 'text-white/80'}`}>
                    {d.slice(0, 3)}
                    {d === today && <span className="ml-1.5 text-[10px] bg-gold-500/30 text-gold-200 px-1.5 py-0.5 rounded-full">Today</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map((period, pi) => {
                const isBreak = period.label === 'Break' || period.label === 'Lunch'
                return (
                  <tr key={period.label} className={`${pi % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} ${isBreak ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-4 py-2.5 border-r border-gray-100">
                      <p className="text-xs font-semibold text-gray-700">{period.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{period.time}</p>
                    </td>
                    {DAYS.map(day => {
                      const cell = TT_10A[day]?.[period.label]
                      const isToday = day === today
                      if (isBreak) {
                        return (
                          <td key={day} colSpan={1} className={`px-3 py-2 border-r border-gray-100 last:border-r-0 ${isToday ? 'bg-blue-50/30' : ''}`}>
                            <span className={`text-[10px] font-medium ${period.label === 'Lunch' ? 'text-amber-500' : 'text-gray-400'}`}>— {period.label} —</span>
                          </td>
                        )
                      }
                      return (
                        <td key={day} className={`px-3 py-2 border-r border-gray-100 last:border-r-0 ${isToday ? 'bg-blue-50/20' : ''}`}>
                          {cell ? (
                            <div className={`rounded-lg px-2.5 py-2 border ${SUBJECT_COLORS[cell.subject] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                              <p className="text-[11px] font-semibold leading-tight">{cell.subject}</p>
                              <p className="text-[10px] mt-0.5 opacity-70">{cell.teacher}</p>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-300">—</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
