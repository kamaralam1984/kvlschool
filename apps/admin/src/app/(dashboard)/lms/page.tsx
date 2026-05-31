'use client'

import React, { useState } from 'react'
import {
  PlayCircle, BookOpen, Users, Clock, Star, Plus,
  Download, Eye, Edit, Video, FileText, Award,
  Search, ChevronRight, Radio
} from 'lucide-react'
import { cn } from '@/lib/utils'

const COURSES = [
  { id: 'CS001', title: 'Mathematics — Class X CBSE', subject: 'Mathematics', teacher: 'Dr. Sanjay Gupta', students: 42, lessons: 48, completed: 32, duration: '96 hrs', rating: 4.9, status: 'Active', thumbnail: '📐' },
  { id: 'CS002', title: 'Physics — Class XI (Theory + Practical)', subject: 'Physics', teacher: 'Mr. Ravi Kumar', students: 36, lessons: 60, completed: 28, duration: '120 hrs', rating: 4.8, status: 'Active', thumbnail: '⚡' },
  { id: 'CS003', title: 'English Literature — Class XII', subject: 'English', teacher: 'Mrs. Anita Sharma', students: 35, lessons: 36, completed: 36, duration: '72 hrs', rating: 4.7, status: 'Completed', thumbnail: '📚' },
  { id: 'CS004', title: 'Computer Science — Class XII', subject: 'CS', teacher: 'Mr. Amit Joshi', students: 28, lessons: 52, completed: 18, duration: '104 hrs', rating: 4.9, status: 'Active', thumbnail: '💻' },
  { id: 'CS005', title: 'Biology — Class XI', subject: 'Biology', teacher: 'Dr. Meera Pillai', students: 34, lessons: 44, completed: 0, duration: '88 hrs', rating: 0, status: 'Draft', thumbnail: '🧬' },
]

const LIVE_CLASSES = [
  { title: 'Trigonometry — Chapter 8', teacher: 'Dr. Sanjay Gupta', class: 'X-A', time: '10:00 AM', duration: '45 min', status: 'Live Now', students: 38 },
  { title: 'Organic Chemistry', teacher: 'Mr. Ravi Kumar', class: 'XI-A, XI-B', time: '11:00 AM', duration: '45 min', status: 'Upcoming', students: 0 },
  { title: 'Essay Writing Practice', teacher: 'Mrs. Anita Sharma', class: 'XII-B', time: '12:00 PM', duration: '30 min', status: 'Upcoming', students: 0 },
  { title: 'Python — OOP Concepts', teacher: 'Mr. Amit Joshi', class: 'XII-A', time: '2:00 PM', duration: '60 min', status: 'Upcoming', students: 0 },
]

const ASSIGNMENTS = [
  { title: 'Quadratic Equations — Practice Set', course: 'Mathematics X', submissions: 38, total: 42, dueDate: '2026-06-03', status: 'Active' },
  { title: 'Newton\'s Laws — Problem Set 4', course: 'Physics XI', submissions: 30, total: 36, dueDate: '2026-06-05', status: 'Active' },
  { title: 'Macbeth — Character Analysis Essay', course: 'English XII', submissions: 35, total: 35, dueDate: '2026-05-30', status: 'Closed' },
  { title: 'Database Design Project', course: 'Computer Science XII', submissions: 20, total: 28, dueDate: '2026-06-10', status: 'Active' },
]

const statusColor: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Completed: 'bg-gray-100 text-gray-600',
  Draft: 'bg-yellow-100 text-yellow-700',
}

export default function LMSPage() {
  const [activeTab, setActiveTab] = useState<'courses' | 'live' | 'assignments' | 'progress'>('courses')
  const [search, setSearch] = useState('')

  const filtered = COURSES.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) || c.teacher.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning Management System</h1>
          <p className="text-sm text-gray-500 mt-0.5">Courses, live classes, assignments and progress</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Plus className="w-4 h-4" /> New Course
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Courses', value: '24', icon: BookOpen, color: 'bg-purple-500', sub: 'across all classes' },
          { label: 'Live Today', value: '8', icon: Radio, color: 'bg-red-500', sub: '4 ongoing now' },
          { label: 'Assignments', value: '48', icon: FileText, color: 'bg-blue-500', sub: '12 due this week' },
          { label: 'Completion Rate', value: '78.4%', icon: Award, color: 'bg-green-500', sub: 'avg across courses' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', s.color)}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['courses', 'live', 'assignments', 'progress'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-1.5 text-sm rounded-md capitalize transition-all', activeTab === tab ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700')}>
            {tab === 'live' ? '🔴 Live' : tab}
          </button>
        ))}
      </div>

      {activeTab === 'courses' && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." className="w-full max-w-sm pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-6 text-center text-4xl">
                  {c.thumbnail}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug flex-1">{c.title}</h3>
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0', statusColor[c.status])}>{c.status}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{c.teacher} · {c.subject}</p>

                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.students}</span>
                    <span className="flex items-center gap-1"><PlayCircle className="w-3 h-3" />{c.lessons} lessons</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.duration}</span>
                    {c.rating > 0 && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{c.rating}</span>}
                  </div>

                  {c.status === 'Active' && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{c.completed}/{c.lessons} lessons</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${(c.completed / c.lessons) * 100}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600"><Edit className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'live' && (
        <div className="space-y-3">
          {LIVE_CLASSES.map((cls, i) => (
            <div key={i} className={cn('bg-white rounded-xl border p-5 flex items-center gap-4', cls.status === 'Live Now' ? 'border-red-200 bg-red-50/30' : 'border-gray-100')}>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', cls.status === 'Live Now' ? 'bg-red-500' : 'bg-gray-200')}>
                {cls.status === 'Live Now' ? <Radio className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-gray-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{cls.title}</h3>
                  {cls.status === 'Live Now' && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-medium animate-pulse">
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />LIVE
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{cls.teacher} · {cls.class}</p>
                <div className="flex gap-4 mt-1 text-xs text-gray-400">
                  <span>⏰ {cls.time}</span>
                  <span>⏱ {cls.duration}</span>
                  {cls.status === 'Live Now' && <span className="text-red-500 font-medium">👥 {cls.students} students joined</span>}
                </div>
              </div>
              <div className="flex gap-2">
                {cls.status === 'Live Now'
                  ? <button className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">Join Live</button>
                  : <button className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 text-gray-600">View Details</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-3">
          {ASSIGNMENTS.map((a, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900">{a.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{a.course} · Due: {a.dueDate}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5 max-w-[200px]">
                    <div className={cn('h-1.5 rounded-full', a.submissions === a.total ? 'bg-green-500' : 'bg-blue-500')} style={{ width: `${(a.submissions / a.total) * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-600">{a.submissions}/{a.total} submitted</span>
                </div>
              </div>
              <span className={cn('px-2 py-1 rounded-full text-xs font-medium', a.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600')}>{a.status}</span>
              <button className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                View <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Course Completion Overview</h2>
          <div className="space-y-4">
            {COURSES.filter(c => c.status !== 'Draft').map(c => (
              <div key={c.id} className="flex items-center gap-4">
                <span className="text-lg flex-shrink-0">{c.thumbnail}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{c.title}</p>
                  <p className="text-xs text-gray-400">{c.completed}/{c.lessons} lessons · {c.students} students</p>
                </div>
                <div className="w-32">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{((c.completed / c.lessons) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={cn('h-2 rounded-full', c.status === 'Completed' ? 'bg-green-500' : 'bg-purple-500')} style={{ width: `${(c.completed / c.lessons) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
