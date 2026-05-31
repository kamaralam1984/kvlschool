'use client'

import React, { useState } from 'react'
import ParentShell from '@/components/ParentShell'
import { MessageSquare, Send, Search, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const THREADS = [
  { id: 1, with: 'Dr. Sanjay Gupta', role: 'Mathematics Teacher', avatar: 'SG', lastMsg: "Aarav's performance in the latest test was excellent. Keep it up!", time: '10:30 AM', unread: 1 },
  { id: 2, with: 'Principal Office', role: 'Administration', avatar: 'PO', lastMsg: 'Thank you for attending the PTM. We look forward to Aarav\'s continued progress.', time: 'Yesterday', unread: 0 },
  { id: 3, with: 'Mrs. Anita Sharma', role: 'English Teacher', avatar: 'AS', lastMsg: 'Please ensure the essay assignment is submitted by Friday.', time: 'May 29', unread: 0 },
  { id: 4, with: 'School Transport', role: 'Transport Department', avatar: 'TR', lastMsg: 'Bus Route 3 timing has been updated to 7:00 AM from June 1.', time: 'May 28', unread: 0 },
]

type Msg = { from: 'me'|'them'; text: string; time: string }

const CHAT: Record<number, Msg[]> = {
  1: [
    { from: 'them', text: "Good morning! I wanted to inform you that Aarav scored 47/50 in the Unit Test 3.", time: '10:15 AM' },
    { from: 'me',   text: "That's wonderful to hear! We've been working hard at home as well. Thank you for letting us know.", time: '10:20 AM' },
    { from: 'them', text: "Aarav's performance in the latest test was excellent. Keep it up!", time: '10:30 AM' },
  ],
  2: [
    { from: 'them', text: 'Thank you for attending the PTM. We look forward to Aarav\'s continued progress.', time: 'Yesterday 3:00 PM' },
  ],
  3: [
    { from: 'them', text: 'Please ensure the essay assignment is submitted by Friday.', time: 'May 29 9:00 AM' },
    { from: 'me',   text: 'Understood, I\'ll remind Aarav. Thank you.', time: 'May 29 9:30 AM' },
  ],
  4: [
    { from: 'them', text: 'Bus Route 3 timing has been updated to 7:00 AM from June 1.', time: 'May 28 4:00 PM' },
  ],
}

export default function MessagesPage() {
  const [activeThread, setActiveThread] = useState<number | null>(1)
  const [input, setInput] = useState('')
  const [chats, setChats] = useState(CHAT)

  const send = () => {
    if (!input.trim() || !activeThread) return
    setChats(p => ({ ...p, [activeThread]: [...(p[activeThread] || []), { from: 'me', text: input, time: 'Just now' }] }))
    setInput('')
  }

  const activeInfo = THREADS.find(t => t.id === activeThread)

  return (
    <ParentShell>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><MessageSquare className="w-6 h-6" />Messages</h1>
          <p className="text-sm text-gray-500 mt-0.5">Communicate with teachers and school staff</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex" style={{ height: '600px' }}>
          {/* Thread list */}
          <div className="w-72 border-r border-gray-100 flex flex-col flex-shrink-0">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input placeholder="Search…" className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg focus:outline-none" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {THREADS.map(t => (
                <button key={t.id} onClick={() => setActiveThread(t.id)}
                  className={cn('w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-gray-50 transition-colors', activeThread === t.id && 'bg-blue-50')}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 text-sm truncate">{t.with}</p>
                      <p className="text-xs text-gray-400 flex-shrink-0">{t.time}</p>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{t.role}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{t.lastMsg}</p>
                  </div>
                  {t.unread > 0 && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Chat panel */}
          {activeThread && activeInfo ? (
            <div className="flex-1 flex flex-col min-w-0">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {activeInfo.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{activeInfo.with}</p>
                  <p className="text-xs text-gray-400">{activeInfo.role}</p>
                </div>
                <button className="ml-auto p-2 hover:bg-gray-100 rounded-lg"><Phone className="w-4 h-4 text-gray-500" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {(chats[activeThread] || []).map((m, i) => (
                  <div key={i} className={cn('flex', m.from === 'me' ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[75%] px-4 py-2.5 rounded-2xl text-sm', m.from === 'me' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800')}>
                      <p>{m.text}</p>
                      <p className={cn('text-xs mt-1', m.from === 'me' ? 'text-blue-200' : 'text-gray-400')}>{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-100 flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="Type a message…"
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                <button onClick={send} className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ParentShell>
  )
}
