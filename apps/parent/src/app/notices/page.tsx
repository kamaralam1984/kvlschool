'use client'

import React, { useState } from 'react'
import ParentShell from '@/components/ParentShell'
import { Bell, Pin, Calendar, Megaphone, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const NOTICES = [
  { id: 1, title: 'Mid-Term Examination Schedule — June 2026', category: 'Academic', date: '2026-05-30', priority: 'High', pinned: true, content: 'Mid-Term Exams for Classes VI–XII will be held June 15–25, 2026. Students must report 30 minutes early. No electronic devices permitted.' },
  { id: 2, title: 'School Closed — June 5 (World Environment Day)', category: 'Holiday', date: '2026-05-29', priority: 'Medium', pinned: true, content: 'School will remain closed on June 5. Classes resume June 6 (Monday).' },
  { id: 3, title: 'Parent-Teacher Meeting — June 12, 2026', category: 'Event', date: '2026-05-28', priority: 'High', pinned: false, content: 'PTM on Saturday, June 12 from 9 AM–1 PM. Please bring your child\'s report card. Slot booking opens June 5 via the parent portal.' },
  { id: 4, title: 'Term 2 Fee Due — July 1, 2026', category: 'Finance', date: '2026-05-27', priority: 'High', pinned: false, content: 'Term 2 fee of ₹15,000 is due on July 1, 2026. Pay online via parent portal to avoid late fee penalty of ₹500/week.' },
  { id: 5, title: 'Annual Sports Day — June 28, 2026', category: 'Event', date: '2026-05-25', priority: 'Medium', pinned: false, content: 'Annual Sports Day on June 28. Parents are cordially invited. Event starts at 9 AM. Prizes and refreshments will be arranged.' },
  { id: 6, title: 'Summer Vacation Homework Notice', category: 'Academic', date: '2026-05-20', priority: 'Medium', pinned: false, content: 'Summer vacation homework schedule has been shared with students. Please ensure timely completion before school reopens.' },
]

const catColors: Record<string, string> = {
  Academic: 'bg-blue-100 text-blue-700',
  Holiday:  'bg-green-100 text-green-700',
  Event:    'bg-purple-100 text-purple-700',
  Finance:  'bg-yellow-100 text-yellow-700',
}

export default function NoticesPage() {
  const [search,   setSearch]   = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [readSet,  setReadSet]  = useState(new Set([2, 5, 6]))

  const filtered = NOTICES.filter(n => n.title.toLowerCase().includes(search.toLowerCase()))
  const unread   = NOTICES.filter(n => !readSet.has(n.id)).length

  return (
    <ParentShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-6 h-6" />School Notices
              {unread > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{unread} new</span>}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Important announcements from KVL International School</p>
          </div>
          <button onClick={() => setReadSet(new Set(NOTICES.map(n => n.id)))} className="text-xs text-blue-600 hover:underline">Mark all read</button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notices…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>

        <div className="space-y-3">
          {filtered.map(n => {
            const isRead = readSet.has(n.id)
            const open   = expanded === n.id
            return (
              <div key={n.id}
                className={cn('bg-white rounded-xl border cursor-pointer transition-all',
                  !isRead ? 'border-blue-200 bg-blue-50/20' : 'border-gray-100', open && 'shadow-md')}
                onClick={() => { setExpanded(open ? null : n.id); setReadSet(p => new Set([...p, n.id])) }}>
                <div className="p-4 flex items-start gap-3">
                  {n.pinned ? <Pin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" /> : <div className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0', !isRead ? 'bg-blue-500' : 'bg-transparent')} />}
                  <div className="flex-1 min-w-0">
                    <h3 className={cn('text-sm', !isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700')}>{n.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-1 text-xs">
                      <span className={cn('px-2 py-0.5 rounded-full font-medium', catColors[n.category] || 'bg-gray-100 text-gray-600')}>{n.category}</span>
                      <span className="text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{n.date}</span>
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
        </div>
      </div>
    </ParentShell>
  )
}
