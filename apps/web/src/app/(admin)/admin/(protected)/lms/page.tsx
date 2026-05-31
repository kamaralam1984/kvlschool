'use client'
import React, { useState } from 'react'
import { BookOpen, Video, ClipboardList, Users, Play, BarChart2, FileText, ChevronRight, Clock, Star } from 'lucide-react'

const STATS = [
  { label: 'Total Courses', value: '18', icon: BookOpen, color: 'bg-blue-50 text-blue-600' },
  { label: 'Live Sessions Today', value: '3', icon: Video, color: 'bg-green-50 text-green-600' },
  { label: 'Assignments Due', value: '12', icon: ClipboardList, color: 'bg-amber-50 text-amber-600' },
  { label: 'Students Enrolled', value: '4,218', icon: Users, color: 'bg-purple-50 text-purple-600' },
]

const ACTIVITY = [
  { id: 1, type: 'submission', text: 'Arjun Mehta submitted Assignment 3 — Mathematics (Grade 9A)', time: '5 min ago', color: 'bg-blue-500' },
  { id: 2, type: 'live', text: 'Mrs. Priya Sharma started Live Class — Chemistry (Grade 11)', time: '12 min ago', color: 'bg-green-500' },
  { id: 3, type: 'enroll', text: '14 students enrolled in "Introduction to Python" course', time: '1 hr ago', color: 'bg-purple-500' },
  { id: 4, type: 'upload', text: 'Mr. Rahul Verma uploaded Recording — Physics Practical (Grade 12)', time: '2 hr ago', color: 'bg-amber-500' },
  { id: 5, type: 'grade', text: 'Grades published for English Essay Assignment (Grade 10B)', time: '3 hr ago', color: 'bg-red-500' },
  { id: 6, type: 'course', text: 'New course "Environmental Science" created by Mrs. Deepa Nair', time: '5 hr ago', color: 'bg-indigo-500' },
]

const QUICK_LINKS = [
  { label: 'Courses', href: '/admin/lms/courses', icon: BookOpen, desc: '18 active courses' },
  { label: 'Live Classes', href: '/admin/lms/live', icon: Video, desc: '3 sessions today' },
  { label: 'Recordings', href: '/admin/lms/recordings', icon: Play, desc: '94 recordings' },
  { label: 'Assignments', href: '/admin/lms/assignments', icon: ClipboardList, desc: '12 due this week' },
  { label: 'Progress', href: '/admin/lms/progress', icon: BarChart2, desc: 'Track all students' },
]

const TOP_COURSES = [
  { id: 1, title: 'Mathematics — Grade 10', teacher: 'Mr. Anil Kumar', enrolled: 186, rating: 4.8, lessons: 42, category: 'Science' },
  { id: 2, title: 'Introduction to Python', teacher: 'Mrs. Sneha Joshi', enrolled: 154, rating: 4.9, lessons: 28, category: 'Technology' },
  { id: 3, title: 'English Literature', teacher: 'Mrs. Kavita Rao', enrolled: 201, rating: 4.7, lessons: 36, category: 'Language' },
]

export default function LmsPage() {
  const [activeTab, setActiveTab] = useState<'activity' | 'upcoming'>('activity')

  const UPCOMING = [
    { id: 1, subject: 'Chemistry', class: 'Grade 11', teacher: 'Mrs. Priya Sharma', time: '10:00 AM', duration: '45 min' },
    { id: 2, subject: 'Physics', class: 'Grade 12', teacher: 'Mr. Suresh Pillai', time: '11:30 AM', duration: '60 min' },
    { id: 3, subject: 'Mathematics', class: 'Grade 9A', teacher: 'Mr. Anil Kumar', time: '2:00 PM', duration: '45 min' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning Management System</h1>
          <p className="text-gray-500 text-sm mt-1">Manage courses, live sessions, assignments and student progress</p>
        </div>
        <button className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#16304f] transition-colors">
          <BookOpen size={16} />
          New Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.color}`}>
              <s.icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {QUICK_LINKS.map((ql) => (
            <a
              key={ql.label}
              href={ql.href}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-2 hover:border-[#1e3a5f] hover:shadow-sm transition-all group"
            >
              <div className="p-2 bg-[#1e3a5f]/10 rounded-xl w-fit">
                <ql.icon size={18} className="text-[#1e3a5f]" />
              </div>
              <p className="font-semibold text-gray-900 text-sm group-hover:text-[#1e3a5f]">{ql.label}</p>
              <p className="text-xs text-gray-400">{ql.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Activity + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Activity Feed */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setActiveTab('activity')}
              className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${activeTab === 'activity' ? 'bg-[#1e3a5f] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              Recent Activity
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${activeTab === 'upcoming' ? 'bg-[#1e3a5f] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              Upcoming Sessions
            </button>
          </div>
          {activeTab === 'activity' ? (
            <div className="space-y-3">
              {ACTIVITY.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${a.color}`} />
                  <div>
                    <p className="text-sm text-gray-700">{a.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {UPCOMING.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{u.subject} — {u.class}</p>
                    <p className="text-xs text-gray-500">{u.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#1e3a5f]">{u.time}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 justify-end"><Clock size={10} />{u.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Courses */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Top Courses</h2>
            <a href="/admin/lms/courses" className="text-xs text-[#1e3a5f] font-medium flex items-center gap-1 hover:underline">
              View all <ChevronRight size={12} />
            </a>
          </div>
          <div className="space-y-3">
            {TOP_COURSES.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{c.title}</p>
                  <p className="text-xs text-gray-500">{c.teacher} · {c.lessons} lessons</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 justify-end text-amber-500">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-medium">{c.rating}</span>
                  </div>
                  <p className="text-xs text-gray-400">{c.enrolled} enrolled</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">Course completion rate</span>
            <span className="font-semibold text-gray-800">72%</span>
          </div>
          <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
            <div className="bg-[#d4a017] h-2 rounded-full" style={{ width: '72%' }} />
          </div>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-[#1e3a5f]" />
            <span className="font-semibold text-gray-800 text-sm">Assignment Overview</span>
          </div>
          <div className="space-y-2 mt-3">
            {[['Submitted', '74', 'text-green-600'], ['Pending', '28', 'text-amber-600'], ['Overdue', '12', 'text-red-600']].map(([l, v, c]) => (
              <div key={l} className="flex justify-between text-sm">
                <span className="text-gray-500">{l}</span>
                <span className={`font-semibold ${c}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 size={16} className="text-[#1e3a5f]" />
            <span className="font-semibold text-gray-800 text-sm">Avg. Course Progress</span>
          </div>
          <p className="text-3xl font-bold text-[#1e3a5f] mt-3">68%</p>
          <p className="text-xs text-gray-400 mt-1">Across all active students</p>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
            <div className="bg-[#1e3a5f] h-2 rounded-full" style={{ width: '68%' }} />
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Video size={16} className="text-[#1e3a5f]" />
            <span className="font-semibold text-gray-800 text-sm">Recordings This Month</span>
          </div>
          <p className="text-3xl font-bold text-[#1e3a5f] mt-3">94</p>
          <p className="text-xs text-gray-400 mt-1">Total views: 3,812</p>
          <div className="mt-3 flex items-center gap-1 text-xs text-green-600 font-medium">
            <span>↑ 18% from last month</span>
          </div>
        </div>
      </div>
    </div>
  )
}
