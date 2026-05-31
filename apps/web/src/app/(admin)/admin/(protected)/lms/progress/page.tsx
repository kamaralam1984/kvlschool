'use client'
import React, { useState, useMemo } from 'react'
import { Search, ChevronDown, X, BarChart2, BookOpen, CheckCircle, Clock, TrendingUp } from 'lucide-react'

interface Student {
  id: string
  name: string
  rollNo: string
  class: string
  section: string
  coursesEnrolled: number
  completed: number
  inProgress: number
  avgScore: number
  lastActive: string
  overallProgress: number
  courses: CourseProgress[]
}

interface CourseProgress {
  name: string
  subject: string
  progress: number
  score: number
  status: 'Completed' | 'In Progress' | 'Not Started'
  lastActivity: string
}

const MOCK: Student[] = [
  {
    id: 'S001', name: 'Arjun Mehta', rollNo: '23001', class: '10', section: 'A',
    coursesEnrolled: 6, completed: 4, inProgress: 2, avgScore: 88, lastActive: 'Today',
    overallProgress: 82,
    courses: [
      { name: 'Mathematics', subject: 'Math', progress: 100, score: 92, status: 'Completed', lastActivity: '2 days ago' },
      { name: 'English Literature', subject: 'English', progress: 100, score: 85, status: 'Completed', lastActivity: '3 days ago' },
      { name: 'Physics', subject: 'Science', progress: 78, score: 88, status: 'In Progress', lastActivity: 'Today' },
      { name: 'History', subject: 'Social', progress: 100, score: 90, status: 'Completed', lastActivity: '1 week ago' },
      { name: 'Chemistry', subject: 'Science', progress: 60, score: 82, status: 'In Progress', lastActivity: 'Yesterday' },
      { name: 'Geography', subject: 'Social', progress: 100, score: 88, status: 'Completed', lastActivity: '5 days ago' },
    ],
  },
  {
    id: 'S002', name: 'Priya Singh', rollNo: '23002', class: '10', section: 'B',
    coursesEnrolled: 6, completed: 5, inProgress: 1, avgScore: 93, lastActive: 'Yesterday',
    overallProgress: 94,
    courses: [
      { name: 'Mathematics', subject: 'Math', progress: 100, score: 96, status: 'Completed', lastActivity: '1 day ago' },
      { name: 'English Literature', subject: 'English', progress: 100, score: 94, status: 'Completed', lastActivity: '2 days ago' },
      { name: 'Physics', subject: 'Science', progress: 100, score: 91, status: 'Completed', lastActivity: '3 days ago' },
      { name: 'History', subject: 'Social', progress: 100, score: 95, status: 'Completed', lastActivity: '4 days ago' },
      { name: 'Chemistry', subject: 'Science', progress: 88, score: 89, status: 'In Progress', lastActivity: 'Yesterday' },
      { name: 'Geography', subject: 'Social', progress: 100, score: 92, status: 'Completed', lastActivity: '6 days ago' },
    ],
  },
  {
    id: 'S003', name: 'Rohan Kapoor', rollNo: '23003', class: '9', section: 'A',
    coursesEnrolled: 5, completed: 2, inProgress: 3, avgScore: 74, lastActive: '3 days ago',
    overallProgress: 58,
    courses: [
      { name: 'Mathematics', subject: 'Math', progress: 72, score: 70, status: 'In Progress', lastActivity: '3 days ago' },
      { name: 'English Literature', subject: 'English', progress: 100, score: 80, status: 'Completed', lastActivity: '5 days ago' },
      { name: 'Biology', subject: 'Science', progress: 55, score: 72, status: 'In Progress', lastActivity: '3 days ago' },
      { name: 'History', subject: 'Social', progress: 100, score: 76, status: 'Completed', lastActivity: '1 week ago' },
      { name: 'Hindi', subject: 'Language', progress: 40, score: 68, status: 'In Progress', lastActivity: '3 days ago' },
    ],
  },
  {
    id: 'S004', name: 'Ananya Sharma', rollNo: '23004', class: '11', section: 'A',
    coursesEnrolled: 7, completed: 6, inProgress: 1, avgScore: 91, lastActive: 'Today',
    overallProgress: 96,
    courses: [
      { name: 'Physics', subject: 'Science', progress: 100, score: 94, status: 'Completed', lastActivity: '1 day ago' },
      { name: 'Chemistry', subject: 'Science', progress: 100, score: 90, status: 'Completed', lastActivity: '2 days ago' },
      { name: 'Mathematics', subject: 'Math', progress: 100, score: 95, status: 'Completed', lastActivity: '2 days ago' },
      { name: 'English', subject: 'Language', progress: 100, score: 88, status: 'Completed', lastActivity: '3 days ago' },
      { name: 'Computer Science', subject: 'Tech', progress: 100, score: 92, status: 'Completed', lastActivity: '4 days ago' },
      { name: 'Physical Education', subject: 'PE', progress: 100, score: 90, status: 'Completed', lastActivity: '1 week ago' },
      { name: 'Introduction to Python', subject: 'Tech', progress: 78, score: 87, status: 'In Progress', lastActivity: 'Today' },
    ],
  },
  {
    id: 'S005', name: 'Vikram Nair', rollNo: '23005', class: '9', section: 'B',
    coursesEnrolled: 5, completed: 1, inProgress: 2, avgScore: 62, lastActive: '1 week ago',
    overallProgress: 34,
    courses: [
      { name: 'Mathematics', subject: 'Math', progress: 35, score: 58, status: 'In Progress', lastActivity: '1 week ago' },
      { name: 'English Literature', subject: 'English', progress: 100, score: 70, status: 'Completed', lastActivity: '2 weeks ago' },
      { name: 'Biology', subject: 'Science', progress: 28, score: 55, status: 'In Progress', lastActivity: '1 week ago' },
      { name: 'History', subject: 'Social', progress: 0, score: 0, status: 'Not Started', lastActivity: 'Never' },
      { name: 'Hindi', subject: 'Language', progress: 0, score: 0, status: 'Not Started', lastActivity: 'Never' },
    ],
  },
  {
    id: 'S006', name: 'Meera Patel', rollNo: '23006', class: '12', section: 'A',
    coursesEnrolled: 6, completed: 5, inProgress: 1, avgScore: 87, lastActive: 'Today',
    overallProgress: 90,
    courses: [
      { name: 'Physics', subject: 'Science', progress: 100, score: 88, status: 'Completed', lastActivity: '2 days ago' },
      { name: 'Chemistry', subject: 'Science', progress: 100, score: 85, status: 'Completed', lastActivity: '2 days ago' },
      { name: 'Mathematics', subject: 'Math', progress: 100, score: 90, status: 'Completed', lastActivity: '3 days ago' },
      { name: 'English', subject: 'Language', progress: 100, score: 84, status: 'Completed', lastActivity: '4 days ago' },
      { name: 'Computer Science', subject: 'Tech', progress: 100, score: 92, status: 'Completed', lastActivity: '5 days ago' },
      { name: 'Introduction to Python', subject: 'Tech', progress: 65, score: 83, status: 'In Progress', lastActivity: 'Today' },
    ],
  },
]

const CLASSES = ['All', '9', '10', '11', '12']
const SECTIONS = ['All', 'A', 'B']
const PROGRESS_LEVELS = ['All', 'High (>80%)', 'Medium (50–80%)', 'Low (<50%)']

function ProgressBar({ value, color = 'bg-[#1e3a5f]' }: { value: number; color?: string }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${value}%` }} />
    </div>
  )
}

function statusColor(status: string) {
  if (status === 'Completed') return 'bg-green-100 text-green-700'
  if (status === 'In Progress') return 'bg-blue-100 text-blue-700'
  return 'bg-gray-100 text-gray-500'
}

export default function ProgressPage() {
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('All')
  const [sectionFilter, setSectionFilter] = useState('All')
  const [progressFilter, setProgressFilter] = useState('All')
  const [selected, setSelected] = useState<Student | null>(null)

  const filtered = useMemo(() => MOCK.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.includes(search)
    const matchClass = classFilter === 'All' || s.class === classFilter
    const matchSection = sectionFilter === 'All' || s.section === sectionFilter
    const matchProgress =
      progressFilter === 'All' ||
      (progressFilter === 'High (>80%)' && s.overallProgress > 80) ||
      (progressFilter === 'Medium (50–80%)' && s.overallProgress >= 50 && s.overallProgress <= 80) ||
      (progressFilter === 'Low (<50%)' && s.overallProgress < 50)
    return matchSearch && matchClass && matchSection && matchProgress
  }), [search, classFilter, sectionFilter, progressFilter])

  const progressBarColor = (v: number) =>
    v >= 80 ? 'bg-green-500' : v >= 50 ? 'bg-amber-500' : 'bg-red-400'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Progress Tracking</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor LMS progress for all enrolled students</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-100 rounded-xl px-4 py-2">
          <TrendingUp size={15} className="text-[#1e3a5f]" />
          <span>Avg overall progress: <strong className="text-[#1e3a5f]">75.7%</strong></span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student name or roll no..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
          />
        </div>
        {[
          { label: 'Class', value: classFilter, set: setClassFilter, options: CLASSES },
          { label: 'Section', value: sectionFilter, set: setSectionFilter, options: SECTIONS },
          { label: 'Progress', value: progressFilter, set: setProgressFilter, options: PROGRESS_LEVELS },
        ].map(({ label, value, set, options }) => (
          <div key={label} className="relative">
            <select
              value={value}
              onChange={(e) => set(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 bg-white"
            >
              {options.map((o) => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        ))}
        <span className="ml-auto flex items-center text-sm text-gray-500">{filtered.length} students</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Student', 'Class', 'Enrolled', 'Completed', 'In Progress', 'Avg Score', 'Last Active', 'Overall Progress'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.rollNo}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.class}{s.section}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-gray-700"><BookOpen size={13} />{s.coursesEnrolled}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-green-600"><CheckCircle size={13} />{s.completed}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-blue-600"><Clock size={13} />{s.inProgress}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{s.avgScore}%</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{s.lastActive}</td>
                  <td className="px-4 py-3 min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <ProgressBar value={s.overallProgress} color={progressBarColor(s.overallProgress)} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-9 text-right">{s.overallProgress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">No students match your filters.</div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
                <p className="text-sm text-gray-500">Roll No: {selected.rollNo} · Class {selected.class}{selected.section}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Enrolled', value: selected.coursesEnrolled, color: 'text-[#1e3a5f]' },
                  { label: 'Completed', value: selected.completed, color: 'text-green-600' },
                  { label: 'Avg Score', value: `${selected.avgScore}%`, color: 'text-amber-600' },
                ].map((m) => (
                  <div key={m.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">Overall Progress</span>
                  <span className="font-bold text-gray-900">{selected.overallProgress}%</span>
                </div>
                <ProgressBar value={selected.overallProgress} color={progressBarColor(selected.overallProgress)} />
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2"><BarChart2 size={16} />Course Breakdown</h3>
                {selected.courses.map((c) => (
                  <div key={c.name} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.subject} · Last active: {c.lastActivity}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(c.status)}`}>{c.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <ProgressBar value={c.progress} color={progressBarColor(c.progress)} />
                      </div>
                      <span className="text-xs font-semibold w-9 text-right text-gray-700">{c.progress}%</span>
                      {c.score > 0 && (
                        <span className="text-xs text-gray-500 border border-gray-200 rounded px-1.5 py-0.5">{c.score}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
