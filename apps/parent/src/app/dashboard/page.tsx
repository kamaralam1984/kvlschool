'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import ParentShell from '@/components/ParentShell'
import {
  CheckCircle2,
  AlertCircle,
  BookOpen,
  CalendarDays,
  FileText,
  MessageSquare,
  MapPin,
  Bus,
  ChevronRight,
  Clock,
  Star,
  Megaphone,
} from 'lucide-react'

// ─── Mock Data ────────────────────────────────────────────

const CHILD = {
  name: 'Aarav Sharma',
  class: 'Class 10-A',
  rollNo: '10A-018',
  photo: null,
}

const RECENT_EXAMS = [
  { subject: 'Mathematics', exam: 'Unit Test 3', marks: 87, total: 100, grade: 'A', date: 'May 20, 2026' },
  { subject: 'Science', exam: 'Mid-Term Exam', marks: 91, total: 100, grade: 'A+', date: 'May 10, 2026' },
]

const UPCOMING_EVENTS = [
  { title: 'Parent-Teacher Meeting', date: 'Jun 7, 2026', type: 'PTM', color: 'bg-blue-100 text-blue-700' },
  { title: 'Mathematics Final Exam', date: 'Jun 15, 2026', type: 'Exam', color: 'bg-red-100 text-red-700' },
  { title: 'Summer Break Begins', date: 'Jun 22, 2026', type: 'Holiday', color: 'bg-green-100 text-green-700' },
]

const HOMEWORK = [
  { subject: 'English', task: 'Essay: "My Future Goals" — 500 words', due: 'Jun 2, 2026' },
  { subject: 'Chemistry', task: 'Lab report: Acid-Base titration experiment', due: 'Jun 3, 2026' },
]

const NOTICES = [
  { title: 'PTM Schedule Released', body: 'Parent-Teacher Meeting on Jun 7. Slot booking open.', time: '2 hours ago', tag: 'Important' },
  { title: 'Annual Sports Day', body: 'Sports Day on Jun 18. Students to wear house colors.', time: 'Yesterday', tag: 'Event' },
  { title: 'Fee Reminder', body: 'Q2 fee payment deadline is Jan 31. Please pay promptly.', time: '2 days ago', tag: 'Finance' },
]

const GRADE_COLOR: Record<string, string> = {
  'A+': 'bg-green-100 text-green-700',
  'A': 'bg-emerald-100 text-emerald-700',
  'B+': 'bg-blue-100 text-blue-700',
  'B': 'bg-sky-100 text-sky-700',
}

export default function DashboardPage() {
  const [busEta] = useState({ distance: '2 km', eta: '10 mins', status: 'En route' })

  return (
    <ParentShell>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Welcome, Mr. Sharma</h1>
        <p className="text-stone-500 text-sm mt-1">KVL International School — Parent Dashboard</p>
      </div>

      {/* ── Row 1: Attendance + Fee Alert ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

        {/* Attendance Status */}
        <div className="bg-white rounded-2xl border border-amber-100 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Today's Attendance</p>
            <p className="text-lg font-bold text-stone-900">
              Aarav is <span className="text-green-600">PRESENT</span> today ✅
            </p>
            <p className="text-xs text-stone-500 mt-0.5">Marked at 8:12 AM · {CHILD.class} · Roll {CHILD.rollNo}</p>
          </div>
        </div>

        {/* Fee Due Alert */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200 p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm font-bold text-red-700">Fee Payment Due</p>
            </div>
            <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">Urgent</span>
          </div>
          <p className="text-2xl font-bold text-red-700 mb-1">₹18,500</p>
          <p className="text-xs text-red-600 mb-4">Tuition Fee (Q2) — Due by <strong>Jan 31, 2026</strong></p>
          <Link
            href="/fees"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            Pay Now <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── Row 2: Exams + Events + Transport ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">

        {/* Recent Exam Results */}
        <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" /> Recent Results
            </h2>
            <Link href="/progress" className="text-xs text-amber-600 hover:text-amber-700 font-medium">View All</Link>
          </div>
          <div className="space-y-3">
            {RECENT_EXAMS.map((exam) => (
              <div key={exam.exam} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-stone-900">{exam.subject}</p>
                  <p className="text-xs text-stone-400">{exam.exam} · {exam.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-stone-900">{exam.marks}/{exam.total}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${GRADE_COLOR[exam.grade] ?? 'bg-gray-100 text-gray-600'}`}>
                    {exam.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-amber-500" /> Upcoming Events
          </h2>
          <div className="space-y-3">
            {UPCOMING_EVENTS.map((evt) => (
              <div key={evt.title} className="flex items-start gap-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg shrink-0 ${evt.color}`}>{evt.type}</span>
                <div>
                  <p className="text-sm font-semibold text-stone-900 leading-tight">{evt.title}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{evt.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transport / Bus Tracker */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 shadow-sm text-white">
          <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Bus className="w-4 h-4" /> Bus Tracker
          </h2>
          <div className="bg-white/20 backdrop-blur rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              <span className="text-xs font-medium opacity-90">Live · Route 4B</span>
            </div>
            <p className="text-2xl font-bold mb-0.5">{busEta.distance} away</p>
            <div className="flex items-center gap-1.5 text-sm opacity-90">
              <Clock className="w-3.5 h-3.5" />
              <span>ETA: <strong>{busEta.eta}</strong></span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs opacity-80">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>Near Sector 12 Junction — heading to school</span>
          </div>
        </div>
      </div>

      {/* ── Row 3: Homework + Notices + Message ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Homework Pending */}
        <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" /> Homework Pending
              <span className="ml-1 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{HOMEWORK.length}</span>
            </h2>
          </div>
          <div className="space-y-3">
            {HOMEWORK.map((hw) => (
              <div key={hw.task} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-amber-700 mb-0.5">{hw.subject}</p>
                  <p className="text-sm text-stone-700 leading-snug">{hw.task}</p>
                  <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due: {hw.due}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/progress" className="mt-4 flex items-center justify-center gap-1.5 text-xs text-amber-600 font-medium hover:text-amber-700">
            View homework history <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Notices + Message Teacher */}
        <div className="space-y-4">
          {/* Recent Notices */}
          <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-4">
              <Megaphone className="w-4 h-4 text-amber-500" /> Recent Notices
            </h2>
            <div className="space-y-3">
              {NOTICES.map((notice) => (
                <div key={notice.title} className="flex items-start gap-3 pb-3 border-b border-stone-50 last:border-0 last:pb-0">
                  <span className="text-xs bg-stone-100 text-stone-600 font-medium px-2 py-0.5 rounded-md shrink-0">{notice.tag}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-stone-900 leading-tight">{notice.title}</p>
                    <p className="text-xs text-stone-500 mt-0.5 truncate">{notice.body}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{notice.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Teacher CTA */}
          <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-stone-900">Message Class Teacher</p>
              <p className="text-xs text-stone-500 mt-0.5">Mrs. Priya Nair · English & Class Tutor</p>
            </div>
            <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shrink-0">
              <MessageSquare className="w-4 h-4" /> Message
            </button>
          </div>
        </div>
      </div>
    </ParentShell>
  )
}
