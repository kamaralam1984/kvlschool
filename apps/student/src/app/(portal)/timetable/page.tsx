'use client'

import React, { useState } from 'react'
import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

const PERIODS = [
  { label:'P1', time:'7:30–8:15' },{ label:'P2', time:'8:15–9:00' },
  { label:'P3', time:'9:00–9:45' },{ label:'Break', time:'9:45–10:05', isBreak:true },
  { label:'P4', time:'10:05–10:50' },{ label:'P5', time:'10:50–11:35' },
  { label:'P6', time:'11:35–12:20' },{ label:'Lunch', time:'12:20–1:00', isBreak:true },
  { label:'P7', time:'1:00–1:45' },{ label:'P8', time:'1:45–2:30' },
]

type Slot = { subject:string; teacher:string; room:string } | null

const TT: Record<string, (Slot|'break')[]> = {
  Monday:    [{subject:'Mathematics',teacher:'Dr. Gupta',room:'A-201'},{subject:'Physics',teacher:'Mr. Kumar',room:'Lab-1'},{subject:'English',teacher:'Mrs. Sharma',room:'B-102'},'break',{subject:'Chemistry',teacher:'Mr. Kumar',room:'Lab-2'},{subject:'CS',teacher:'Mr. Joshi',room:'Lab-3'},{subject:'PE',teacher:'Mr. Kiran',room:'Ground'},'break',{subject:'Biology',teacher:'Dr. Pillai',room:'C-301'},{subject:'Mathematics',teacher:'Dr. Gupta',room:'A-201'}],
  Tuesday:   [{subject:'Physics',teacher:'Mr. Kumar',room:'Lab-1'},{subject:'Mathematics',teacher:'Dr. Gupta',room:'A-201'},{subject:'Biology',teacher:'Dr. Pillai',room:'C-301'},'break',{subject:'English',teacher:'Mrs. Sharma',room:'B-102'},{subject:'Mathematics',teacher:'Dr. Gupta',room:'A-201'},{subject:'Chemistry',teacher:'Mr. Kumar',room:'Lab-2'},'break',{subject:'CS',teacher:'Mr. Joshi',room:'Lab-3'},null],
  Wednesday: [{subject:'English',teacher:'Mrs. Sharma',room:'B-102'},{subject:'Chemistry',teacher:'Mr. Kumar',room:'Lab-2'},{subject:'Mathematics',teacher:'Dr. Gupta',room:'A-201'},'break',{subject:'Physics',teacher:'Mr. Kumar',room:'Lab-1'},{subject:'Biology',teacher:'Dr. Pillai',room:'C-301'},{subject:'Mathematics',teacher:'Dr. Gupta',room:'A-201'},'break',{subject:'English',teacher:'Mrs. Sharma',room:'B-102'},null],
  Thursday:  [{subject:'CS',teacher:'Mr. Joshi',room:'Lab-3'},{subject:'Physics',teacher:'Mr. Kumar',room:'Lab-1'},{subject:'Biology',teacher:'Dr. Pillai',room:'C-301'},'break',{subject:'English',teacher:'Mrs. Sharma',room:'B-102'},{subject:'Chemistry',teacher:'Mr. Kumar',room:'Lab-2'},{subject:'Mathematics',teacher:'Dr. Gupta',room:'A-201'},'break',{subject:'Physics',teacher:'Mr. Kumar',room:'Lab-1'},null],
  Friday:    [{subject:'Chemistry',teacher:'Mr. Kumar',room:'Lab-2'},{subject:'Biology',teacher:'Dr. Pillai',room:'C-301'},{subject:'CS',teacher:'Mr. Joshi',room:'Lab-3'},'break',{subject:'Mathematics',teacher:'Dr. Gupta',room:'A-201'},{subject:'English',teacher:'Mrs. Sharma',room:'B-102'},{subject:'Physics',teacher:'Mr. Kumar',room:'Lab-1'},'break',{subject:'PE',teacher:'Mr. Kiran',room:'Ground'},null],
  Saturday:  [{subject:'Mathematics',teacher:'Dr. Gupta',room:'A-201'},{subject:'English',teacher:'Mrs. Sharma',room:'B-102'},{subject:'Physics',teacher:'Mr. Kumar',room:'Lab-1'},'break',{subject:'Biology',teacher:'Dr. Pillai',room:'C-301'},{subject:'Chemistry',teacher:'Mr. Kumar',room:'Lab-2'},null,'break',null,null],
}

const COLORS: Record<string,string> = {
  Mathematics:'bg-blue-50 border-blue-200 text-blue-800',
  Physics:'bg-green-50 border-green-200 text-green-800',
  Chemistry:'bg-orange-50 border-orange-200 text-orange-800',
  English:'bg-purple-50 border-purple-200 text-purple-800',
  Biology:'bg-teal-50 border-teal-200 text-teal-800',
  CS:'bg-indigo-50 border-indigo-200 text-indigo-800',
  PE:'bg-red-50 border-red-200 text-red-800',
}

const TODAY = new Date().toLocaleDateString('en-US',{weekday:'long'})

export default function TimetablePage() {
  const [view, setView] = useState<'week'|'day'>('week')
  const [day,  setDay]  = useState(DAYS.includes(TODAY) ? TODAY : 'Monday')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
          <p className="text-sm text-gray-500 mt-0.5">Class XII-A · 2025-26</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(['week','day'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={cn('px-3 py-1.5 text-xs rounded-md capitalize', view===v?'bg-white shadow text-gray-900 font-medium':'text-gray-500')}>
                {v}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download className="w-4 h-4"/>Print
          </button>
        </div>
      </div>

      {view === 'week' ? (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-3 text-left text-gray-500 font-semibold w-28">Period</th>
                  {DAYS.map(d => (
                    <th key={d} className={cn('px-2 py-3 font-semibold text-center', d===TODAY?'bg-blue-50 text-blue-700':'text-gray-500')}>
                      {d.slice(0,3)}{d===TODAY&&<span className="block text-xs font-normal text-blue-400">Today</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERIODS.map((p,pi) => (
                  <tr key={pi} className={cn('border-b border-gray-50', p.isBreak&&'bg-gray-50')}>
                    <td className="px-3 py-2">
                      <p className="font-semibold text-gray-700">{p.label}</p>
                      <p className="text-gray-400 text-xs">{p.time}</p>
                    </td>
                    {DAYS.map(d => {
                      const slot = TT[d][pi]
                      if (p.isBreak||slot==='break') return <td key={d} className="px-2 py-2 text-center"><span className="text-gray-300 text-xs">{p.isBreak?p.label:'Break'}</span></td>
                      if (!slot) return <td key={d} className="px-2 py-2"/>
                      return (
                        <td key={d} className={cn('px-1 py-1', d===TODAY&&'bg-blue-50/50')}>
                          <div className={cn('rounded-lg border px-2 py-1.5 text-center', COLORS[slot.subject]||'bg-gray-50 border-gray-200 text-gray-700')}>
                            <p className="font-semibold leading-tight">{slot.subject}</p>
                            <p className="text-xs opacity-70">{slot.room}</p>
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
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {DAYS.map(d => (
              <button key={d} onClick={() => setDay(d)}
                className={cn('px-4 py-2 text-sm rounded-lg border flex-shrink-0',
                  day===d?'bg-blue-600 text-white border-blue-600':
                  d===TODAY?'border-blue-300 text-blue-600':'border-gray-200 text-gray-600 hover:bg-gray-50')}>
                {d.slice(0,3)}{d===TODAY&&' ★'}
              </button>
            ))}
          </div>
          {PERIODS.map((p,pi) => {
            const slot = TT[day][pi]
            if (p.isBreak||slot==='break') return (
              <div key={pi} className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-2 flex items-center gap-3 text-sm text-gray-400">
                <span className="w-24 flex-shrink-0 text-xs">{p.time}</span>
                <span>{p.label}</span>
              </div>
            )
            if (!slot) return null
            return (
              <div key={pi} className={cn('rounded-xl border px-4 py-3 flex items-center gap-4', COLORS[slot.subject]||'bg-gray-50 border-gray-200')}>
                <div className="w-24 flex-shrink-0">
                  <p className="text-xs font-semibold">{p.label}</p>
                  <p className="text-xs opacity-70">{p.time}</p>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{slot.subject}</p>
                  <p className="text-xs opacity-70">{slot.teacher}</p>
                </div>
                <p className="text-xs opacity-70">{slot.room}</p>
              </div>
            )
          })}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Legend</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(COLORS).map(([sub, col]) => (
            <span key={sub} className={cn('px-3 py-1 rounded-full text-xs font-medium border', col)}>{sub}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
