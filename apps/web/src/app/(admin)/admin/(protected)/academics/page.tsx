'use client'
import React from 'react'
import Link from 'next/link'
import {
  BookOpen, Clock, FlaskConical, Calendar, ClipboardList, Layers,
  Users, GraduationCap, BarChart2, TrendingUp
} from 'lucide-react'

const stats = [
  { label: 'Total Classes', value: '42', icon: Layers, color: 'bg-blue-50 text-blue-600' },
  { label: 'Total Subjects', value: '18', icon: BookOpen, color: 'bg-purple-50 text-purple-600' },
  { label: 'Active Teachers', value: '68', icon: Users, color: 'bg-green-50 text-green-600' },
  { label: 'Avg Class Size', value: '35', icon: GraduationCap, color: 'bg-yellow-50 text-yellow-600' },
]

const navCards = [
  {
    href: '/admin/academics/timetable',
    icon: Clock,
    title: 'Timetable',
    description: 'Manage class schedules and period allocation',
    count: '42 schedules',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    href: '/admin/academics/subjects',
    icon: BookOpen,
    title: 'Subjects',
    description: 'Manage curriculum subjects and assignments',
    count: '18 subjects',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    href: '/admin/academics/classes',
    icon: Layers,
    title: 'Classes',
    description: 'View and manage class sections and teachers',
    count: '12 classes',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    href: '/admin/academics/calendar',
    icon: Calendar,
    title: 'Calendar',
    description: 'Academic events, holidays, and exam schedule',
    count: '36 events',
    color: 'bg-red-50 text-red-600',
  },
  {
    href: '/admin/academics/homework',
    icon: ClipboardList,
    title: 'Homework',
    description: 'Track assignments, due dates, and submissions',
    count: '124 assignments',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    href: '/admin/academics/lessons',
    icon: FlaskConical,
    title: 'Lesson Plans',
    description: 'Curriculum planning and lesson tracking',
    count: '89 plans',
    color: 'bg-green-50 text-green-600',
  },
]

export default function AcademicsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academics</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of the KVL academics module for the current session.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2">
          <BarChart2 size={16} className="text-[#1e3a5f]" />
          <span className="text-sm font-medium text-[#1e3a5f]">Session 2024–25</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-[#1e3a5f] rounded-2xl p-5 flex flex-wrap gap-6 items-center">
        <div className="flex items-center gap-2 text-white">
          <TrendingUp size={18} className="text-[#d4a017]" />
          <span className="text-sm font-medium">Curriculum Completion</span>
          <span className="text-[#d4a017] font-bold text-lg">72%</span>
        </div>
        <div className="h-8 w-px bg-white/20 hidden sm:block" />
        <div className="text-white text-sm">
          <span className="text-gray-300">Pending Homework Reviews:</span>
          <span className="font-bold ml-2">14</span>
        </div>
        <div className="h-8 w-px bg-white/20 hidden sm:block" />
        <div className="text-white text-sm">
          <span className="text-gray-300">Upcoming Exams:</span>
          <span className="font-bold ml-2">3 this week</span>
        </div>
        <div className="h-8 w-px bg-white/20 hidden sm:block" />
        <div className="text-white text-sm">
          <span className="text-gray-300">PTM Scheduled:</span>
          <span className="font-bold ml-2">June 15, 2025</span>
        </div>
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Quick Navigation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {navCards.map(card => (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-gray-200 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color} flex-shrink-0`}>
                  <card.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#1e3a5f] transition-colors">{card.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 leading-snug">{card.description}</p>
                  <span className="inline-block mt-2 text-xs font-medium text-[#d4a017] bg-yellow-50 px-2 py-0.5 rounded-full">
                    {card.count}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
