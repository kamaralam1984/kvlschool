'use client'

import React, { useState } from 'react'

// ─── Mock Data ──────────────────────────────────────────────────────
const todayClasses = [
  { time: '08:00', subject: 'Mathematics', teacher: 'Mr. Kapoor', room: 'A-201', status: 'completed' },
  { time: '09:00', subject: 'Physics', teacher: 'Mrs. Joshi', room: 'Lab-1', status: 'completed' },
  { time: '10:00', subject: 'English Literature', teacher: 'Ms. Priya', room: 'B-102', status: 'ongoing' },
  { time: '11:00', subject: 'Chemistry', teacher: 'Dr. Mehta', room: 'Lab-2', status: 'upcoming' },
  { time: '12:00', subject: 'History', teacher: 'Mr. Das', room: 'C-301', status: 'upcoming' },
]

const recentMarks = [
  { subject: 'Mathematics', exam: 'Unit Test 3', score: 47, max: 50, grade: 'A+' },
  { subject: 'Physics', exam: 'Mid-Term', score: 88, max: 100, grade: 'A' },
  { subject: 'Chemistry', exam: 'Mid-Term', score: 79, max: 100, grade: 'B+' },
]

const quickActions = [
  { label: 'View Timetable', icon: '🕐', href: '/timetable', color: 'teal' },
  { label: 'Submit Assignment', icon: '📝', href: '/assignments', color: 'emerald' },
  { label: 'Join Live Class', icon: '🎥', href: '/live', color: 'blue' },
  { label: 'Download Notes', icon: '📥', href: '/library', color: 'violet' },
]

const announcements = [
  {
    id: 1,
    title: 'Annual Sports Day — June 10',
    body: 'All students must register for at least one sport by June 5. Register at the PE office or via the portal.',
    date: 'Today',
    tag: 'Events',
    tagColor: 'emerald',
  },
  {
    id: 2,
    title: 'Pre-Board Examinations Schedule Released',
    body: 'Pre-board exams commence July 1. Detailed timetable available in the Exams section.',
    date: '29 May',
    tag: 'Exams',
    tagColor: 'amber',
  },
  {
    id: 3,
    title: 'Library Timings Extended',
    body: 'School library will remain open until 6 PM from June 1 for exam preparation.',
    date: '28 May',
    tag: 'Notice',
    tagColor: 'slate',
  },
]

const upcoming = [
  { label: 'Next Exam', value: 'Pre-Board — Jul 1', icon: '📋' },
  { label: 'Assignment Due', value: 'Physics Lab Report — Jun 3', icon: '⏰' },
  { label: 'School Event', value: 'Sports Day — Jun 10', icon: '🏆' },
]

// ─── Grade Badge ────────────────────────────────────────────────────
function GradeBadge({ grade }: { grade: string }) {
  const map: Record<string, string> = {
    'A+': 'bg-emerald-100 text-emerald-700',
    'A':  'bg-teal-100 text-teal-700',
    'B+': 'bg-blue-100 text-blue-700',
    'B':  'bg-indigo-100 text-indigo-700',
    'C':  'bg-amber-100 text-amber-700',
  }
  return (
    <span className={`badge-grade ${map[grade] ?? 'bg-slate-100 text-slate-600'}`}>
      {grade}
    </span>
  )
}

// ─── Attendance Donut ───────────────────────────────────────────────
function AttendanceDonut({ pct }: { pct: number }) {
  const r = 40
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="50" cy="50" r={r} fill="none"
            stroke="#14b8a6" strokeWidth="10"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-teal-700">{pct}%</span>
          <span className="text-xs text-slate-400">Present</span>
        </div>
      </div>
      <p className="text-sm font-medium text-slate-600">May 2025</p>
    </div>
  )
}

// ─── AI Chat Widget ─────────────────────────────────────────────────
function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hi Aarav! I am your AI Study Assistant. Ask me anything — formulas, concepts, or exam tips! 📚' },
  ])

  const send = () => {
    if (!input.trim()) return
    setMessages(prev => [
      ...prev,
      { role: 'user', text: input },
      { role: 'ai', text: `Great question! Let me help you with "${input}". This topic is covered in Chapter 4. Would you like a summary or practice problems?` },
    ])
    setInput('')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <p className="text-white text-sm font-semibold">AI Study Assistant</p>
                <p className="text-teal-100 text-xs">Powered by KVL AI</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 h-56 overflow-y-auto p-3 space-y-2 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-teal-500 text-white rounded-br-sm'
                      : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-100 bg-white flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask a question..."
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-400 bg-slate-50"
            />
            <button
              onClick={send}
              className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-3 py-2 text-xs font-medium transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full shadow-teal flex items-center justify-center text-2xl hover:scale-105 transition-transform"
      >
        {open ? '✕' : '🤖'}
      </button>
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <>
      <div className="space-y-5">

        {/* Welcome header */}
        <div className="card px-5 py-4 bg-gradient-to-r from-teal-600 to-emerald-500 text-white border-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">{greeting}, Aarav 👋</h1>
              <p className="text-teal-100 text-sm mt-0.5">Class 10-A &nbsp;·&nbsp; Roll No: KVL-001 &nbsp;·&nbsp; Academic Year 2024–25</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-2 bg-white/15 rounded-xl">
                <p className="text-2xl font-bold">28</p>
                <p className="text-teal-100 text-xs">Days to Exams</p>
              </div>
              <div className="text-center px-4 py-2 bg-white/15 rounded-xl">
                <p className="text-2xl font-bold">8.7</p>
                <p className="text-teal-100 text-xs">Overall GPA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="card card-hover px-4 py-3.5 flex flex-col items-center gap-2 text-center cursor-pointer group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{action.icon}</span>
              <span className="text-xs font-medium text-slate-600">{action.label}</span>
            </a>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Today's timetable */}
          <div className="lg:col-span-2 card px-5 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-800">Today&apos;s Classes</h2>
              <span className="text-xs text-slate-400">Thursday, 29 May 2025</span>
            </div>
            <div className="space-y-2">
              {todayClasses.map((cls, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm ${
                    cls.status === 'ongoing'
                      ? 'bg-teal-50 border-teal-200'
                      : cls.status === 'completed'
                      ? 'bg-slate-50 border-slate-100 opacity-60'
                      : 'bg-white border-slate-100'
                  }`}
                >
                  <span className="text-xs font-mono text-slate-400 w-10 flex-shrink-0">{cls.time}</span>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    cls.status === 'ongoing' ? 'bg-teal-500 animate-pulse' :
                    cls.status === 'completed' ? 'bg-slate-300' : 'bg-amber-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{cls.subject}</p>
                    <p className="text-xs text-slate-400">{cls.teacher} · Room {cls.room}</p>
                  </div>
                  {cls.status === 'ongoing' && (
                    <span className="text-xs font-semibold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">Live</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Attendance donut */}
          <div className="card px-5 py-4 flex flex-col items-center justify-center gap-4">
            <h2 className="text-sm font-semibold text-slate-800 self-start">Attendance</h2>
            <AttendanceDonut pct={94} />
            <div className="grid grid-cols-3 gap-2 w-full">
              {[
                { label: 'Present', val: 21, color: 'teal' },
                { label: 'Absent', val: 1, color: 'red' },
                { label: 'Leave', val: 0, color: 'amber' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className={`text-lg font-bold text-${s.color}-600`}>{s.val}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
            <a href="/attendance" className="btn-outline-teal w-full text-center">Full Report</a>
          </div>
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Recent marks */}
          <div className="card px-5 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-800">Recent Marks</h2>
              <a href="/marks" className="text-xs text-teal-600 hover:underline">View all</a>
            </div>
            <div className="space-y-3">
              {recentMarks.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{m.subject}</p>
                    <p className="text-xs text-slate-400">{m.exam}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-slate-700">{m.score}<span className="text-slate-400 font-normal">/{m.max}</span></p>
                    <GradeBadge grade={m.grade} />
                  </div>
                </div>
              ))}
            </div>
            <a href="/marks" className="btn-outline-teal w-full text-center mt-4 block">Full Report Card</a>
          </div>

          {/* Upcoming */}
          <div className="card px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">Upcoming</h2>
            <div className="space-y-3">
              {upcoming.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fee status */}
          <div className="card px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">Fee Status</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="text-xs text-amber-600 font-medium mb-1">Amount Due</p>
              <p className="text-2xl font-bold text-amber-700">₹18,500</p>
              <p className="text-xs text-amber-500 mt-1">Due by June 15, 2025</p>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Tuition Fee</span>
                <span className="font-medium text-slate-700">₹15,000</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Lab Charges</span>
                <span className="font-medium text-slate-700">₹2,500</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Activity Fee</span>
                <span className="font-medium text-slate-700">₹1,000</span>
              </div>
            </div>
            <button className="btn-teal w-full flex items-center justify-center gap-2">
              <span>💳</span> Pay Now
            </button>
            <a href="/fees" className="block text-center text-xs text-slate-400 hover:text-teal-600 mt-2">View fee history</a>
          </div>
        </div>

        {/* Announcements */}
        <div className="card px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-800">Announcements</h2>
            <a href="/notices" className="text-xs text-teal-600 hover:underline">View all</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-teal-200 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`badge-grade bg-${ann.tagColor}-100 text-${ann.tagColor}-700`}>
                    {ann.tag}
                  </span>
                  <span className="text-xs text-slate-400 flex-shrink-0">{ann.date}</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-1">{ann.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{ann.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Chat Widget */}
      <AIChatWidget />
    </>
  )
}
