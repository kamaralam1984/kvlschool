'use client'

import React, { useState } from 'react'
import { Bell, Pin, Search, Calendar, Megaphone } from 'lucide-react'
import { cn } from '@/lib/utils'

const NOTICES = [
  { id: 1, title: 'Mid-Term Examination Schedule — June 2026', category: 'Academic', date: '2026-05-30', priority: 'High', pinned: true, content: 'Mid-Term Exams for all classes (VI–XII) will be held June 15–25, 2026. Report 30 minutes early. No electronic devices.' },
  { id: 2, title: 'School Closed — June 5 (World Environment Day)', category: 'Holiday', date: '2026-05-29', priority: 'Medium', pinned: true, content: 'School will remain closed on June 5, 2026. Classes resume June 6 (Monday).' },
  { id: 3, title: 'Parent-Teacher Meeting — June 12, 2026', category: 'Event', date: '2026-05-28', priority: 'High', pinned: false, content: 'PTM on Saturday, June 12 from 9 AM to 1 PM. Parents must bring the previous report card.' },
  { id: 4, title: 'New Books Available in Library', category: 'Library', date: '2026-05-27', priority: 'Low', pinned: false, content: 'Fresh batch of books received. Students can borrow from the new collection starting June 1.' },
  { id: 5, title: 'Annual Sports Day — June 28, 2026', category: 'Event', date: '2026-05-25', priority: 'Medium', pinned: false, content: 'Register with your PE teacher by June 10. Prizes in all categories.' },
  { id: 6, title: 'Computer Lab Maintenance — June 3-4', category: 'Academic', date: '2026-05-24', priority: 'Low', pinned: false, content: 'Lab closed for maintenance. CS classes will be held in classrooms those days.' },
]

const catColors: Record<string, string> = {
  Academic: 'bg-blue-100 text-blue-700',
  Holiday:  'bg-green-100 text-green-700',
  Event:    'bg-purple-100 text-purple-700',
  Library:  'bg-amber-100 text-amber-700',
}

const priorityDot: Record<string, string> = {
  High:   'bg-red-400',
  Medium: 'bg-yellow-400',
  Low:    'bg-gray-300',
}

export default function NoticesPage() {
  const [search,    setSearch]    = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [expanded,  setExpanded]  = useState<number | null>(null)
  const [readSet,   setReadSet]   = useState<Set<number>>(new Set([2, 4, 5, 6]))

  const filtered = NOTICES.filter(n =>
    (catFilter === 'All' || n.category === catFilter) &&
    n.title.toLowerCase().includes(search.toLowerCase())
  )

  const unread = NOTICES.filter(n => !readSet.has(n.id)).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6" />Notices
            {unread > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{unread} new</span>}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">School announcements and important notices</p>
        </div>
        <button onClick={() => setReadSet(new Set(NOTICES.map(n => n.id)))} className="text-xs text-blue-600 hover:underline">
          Mark all read
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notices…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        {['All','Academic','Holiday','Event','Library'].map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={cn('px-3 py-2 text-sm rounded-lg border transition-all',
              catFilter === c ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50')}>
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(n => {
          const isRead = readSet.has(n.id)
          const open   = expanded === n.id
          return (
            <div key={n.id}
              className={cn('bg-white rounded-xl border transition-all cursor-pointer',
                !isRead ? 'border-blue-200 bg-blue-50/20' : 'border-gray-100',
                open && 'shadow-md')}
              onClick={() => { setExpanded(open ? null : n.id); setReadSet(p => new Set([...p, n.id])) }}>
              <div className="p-4 flex items-start gap-3">
                {n.pinned
                  ? <Pin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  : <div className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0', !isRead ? 'bg-blue-500' : 'bg-transparent')} />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={cn('text-sm leading-snug', !isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700')}>{n.title}</h3>
                    <div className={cn('w-2 h-2 rounded-full flex-shrink-0 mt-1', priorityDot[n.priority])} />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-gray-400">
                    <span className={cn('px-2 py-0.5 rounded-full font-medium', catColors[n.category])}>{n.category}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{n.date}</span>
                    {n.priority === 'High' && <span className="text-red-500 font-medium">Important</span>}
                  </div>
                </div>
              </div>
              {open && (
                <div className="px-5 pb-4 border-t border-gray-100 pt-3">
                  <p className="text-sm text-gray-600 leading-relaxed">{n.content}</p>
                </div>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Megaphone className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No notices found</p>
          </div>
        )}
      </div>
    </div>
  )
}
