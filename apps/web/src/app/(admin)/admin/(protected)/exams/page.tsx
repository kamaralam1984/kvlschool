'use client'
import React from 'react'
import { ClipboardList, Monitor, FileText, Calendar, ArrowRight, BookOpen, Award, Printer, HelpCircle } from 'lucide-react'
import Link from 'next/link'

const STATS = [
  { label: 'Total Exams', value: 24, icon: ClipboardList, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
  { label: 'Online Exams', value: 8, icon: Monitor, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  { label: 'Offline Exams', value: 16, icon: FileText, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
  { label: 'Upcoming', value: 5, icon: Calendar, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
]

type ExamStatus = 'Upcoming' | 'Ongoing' | 'Completed'
type ExamType = 'Online' | 'Offline'

interface Exam {
  id: string
  title: string
  subject: string
  class: string
  date: string
  type: ExamType
  status: ExamStatus
}

const EXAMS: Exam[] = [
  { id: '1', title: 'Mid-Term Examination', subject: 'Mathematics',          class: '10', date: '2025-02-10', type: 'Offline', status: 'Completed' },
  { id: '2', title: 'Unit Test 3',           subject: 'Science',             class: '8',  date: '2025-02-14', type: 'Offline', status: 'Completed' },
  { id: '3', title: 'Chapter Quiz',          subject: 'English Literature',  class: '9',  date: '2025-02-18', type: 'Online',  status: 'Completed' },
  { id: '4', title: 'Pre-Board Exam',        subject: 'Physics',             class: '12', date: '2025-02-22', type: 'Offline', status: 'Ongoing' },
  { id: '5', title: 'Online MCQ Test',       subject: 'Chemistry',           class: '11', date: '2025-02-25', type: 'Online',  status: 'Upcoming' },
  { id: '6', title: 'Annual Examination',    subject: 'Hindi',               class: '7',  date: '2025-03-01', type: 'Offline', status: 'Upcoming' },
  { id: '7', title: 'Practice Test',         subject: 'Social Studies',      class: '6',  date: '2025-03-05', type: 'Online',  status: 'Upcoming' },
  { id: '8', title: 'Final Term Paper',      subject: 'Mathematics',         class: '5',  date: '2025-03-10', type: 'Offline', status: 'Upcoming' },
]

const statusConfig: Record<ExamStatus, { color: string; bg: string; border: string }> = {
  Upcoming:  { color: 'text-blue-700',   bg: 'bg-blue-100',   border: 'border-blue-200' },
  Ongoing:   { color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200' },
  Completed: { color: 'text-green-700',  bg: 'bg-green-100',  border: 'border-green-200' },
}

const typeConfig: Record<ExamType, { color: string; bg: string }> = {
  Online:  { color: 'text-purple-700', bg: 'bg-purple-50' },
  Offline: { color: 'text-amber-700',  bg: 'bg-amber-50' },
}

const QUICK_LINKS = [
  { label: 'Schedule',       href: '/admin/exams/schedule',    icon: Calendar,     desc: 'View timetable' },
  { label: 'Online Exams',   href: '/admin/exams/online',      icon: Monitor,      desc: '8 exams' },
  { label: 'Offline Exams',  href: '/admin/exams/offline',     icon: FileText,     desc: '16 exams' },
  { label: 'Question Bank',  href: '/admin/exams/questions',   icon: HelpCircle,   desc: 'Manage questions' },
  { label: 'Results',        href: '/admin/exams/results',     icon: Award,        desc: 'View results' },
  { label: 'Report Cards',   href: '/admin/exams/report-cards',icon: BookOpen,     desc: 'Generate cards' },
  { label: 'Hall Tickets',   href: '/admin/exams/hall-tickets',icon: Printer,      desc: 'Print tickets' },
]

export default function ExamsPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Exams Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Current term · Feb–Mar 2025</p>
        </div>
        <span className="text-sm bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1.5 rounded-full font-medium">
          1 Ongoing
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className={`bg-white border ${s.border} rounded-2xl p-5`}>
            <div className={`inline-flex p-2.5 rounded-xl ${s.color} mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold text-[#1e3a5f]">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Exams Grid */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-base font-semibold text-[#1e3a5f]">Recent &amp; Upcoming Exams</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EXAMS.map(e => {
              const sc = statusConfig[e.status]
              const tc = typeConfig[e.type]
              return (
                <div key={e.id} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${sc.color} ${sc.bg} ${sc.border}`}>
                      {e.status}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tc.color} ${tc.bg}`}>
                      {e.type}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 leading-snug">{e.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{e.subject}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400">Class {e.class}</span>
                    <span className="text-xs text-gray-400">{e.date}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-[#1e3a5f] mb-4">Quick Links</h2>
          <div className="space-y-2">
            {QUICK_LINKS.map(l => (
              <Link
                key={l.label}
                href={l.href}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1e3a5f]/10 rounded-lg">
                    <l.icon className="w-4 h-4 text-[#1e3a5f]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{l.label}</div>
                    <div className="text-xs text-gray-400">{l.desc}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#1e3a5f] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
