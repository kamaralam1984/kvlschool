'use client'

import { useState } from 'react'
import {
  Clock, Users, BookOpen, FileText, CheckCircle2, AlertCircle,
  ClipboardCheck, Upload, PenLine, MessageCircle, X, Send,
  TrendingUp, Calendar
} from 'lucide-react'

const todaySchedule = [
  { period: 1, time: '08:00–08:45', class: '10A', subject: 'Mathematics', room: 'Room 12', status: 'done' },
  { period: 2, time: '08:50–09:35', class: '10B', subject: 'Mathematics', room: 'Room 14', status: 'done' },
  { period: 3, time: '10:00–10:45', class: 'FREE', subject: '—', room: '—', status: 'free' },
  { period: 4, time: '10:50–11:35', class: '9A', subject: 'Mathematics', room: 'Room 8', status: 'upcoming' },
  { period: 5, time: '11:40–12:25', class: '10A', subject: 'Mathematics', room: 'Room 12', status: 'upcoming' },
]

const classes = [
  { name: 'Class 10A', students: 42, attendance: 95, pending: 1 },
  { name: 'Class 10B', students: 40, attendance: 91, pending: 2 },
  { name: 'Class 9A',  students: 38, attendance: 97, pending: 0 },
]

const pendingTasks = [
  { type: 'grade', label: 'Grade Chapter 5 Assignment', class: '10A', due: 'Today' },
  { type: 'grade', label: 'Grade Trigonometry Quiz', class: '10B', due: 'Today' },
  { type: 'grade', label: 'Grade Algebra Test', class: '9A', due: 'Tomorrow' },
  { type: 'report', label: 'Submit Term 2 Progress Report', class: '10A', due: 'Jun 3' },
  { type: 'report', label: 'Submit Mid-Term Marks', class: 'All', due: 'Jun 5' },
]

const recentActivities = [
  { student: 'Priya Sharma', class: '10A', action: 'Submitted Chapter 5 Assignment', time: '10 min ago' },
  { student: 'Arjun Mehta', class: '10B', action: 'Late submission — Trigonometry Quiz', time: '32 min ago' },
  { student: 'Sneha Patel', class: '9A', action: 'Requested deadline extension', time: '1h ago' },
  { student: 'Rohan Verma', class: '10A', action: 'Submitted Chapter 5 Assignment', time: '2h ago' },
  { student: 'Kavya Nair', class: '10B', action: 'Viewed assignment instructions', time: '3h ago' },
]

const aiSuggestions = [
  'Class 10B attendance dropped 4% this week. Consider following up.',
  '3 students in 9A consistently score below 50% — recommend remedial sessions.',
  'Assignment deadline for Chapter 5 is today — 12 students yet to submit.',
]

export default function DashboardPage() {
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMsg, setChatMsg] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Hello Mr. Rajesh! How can I assist you today?' },
  ])

  const sendMessage = () => {
    if (!chatMsg.trim()) return
    setChatHistory(h => [
      ...h,
      { role: 'user', text: chatMsg },
      { role: 'ai', text: 'I\'m analyzing your class data. Based on recent performance trends, Class 10A is performing well while 10B may need additional attention in algebra.' },
    ])
    setChatMsg('')
  }

  const doneCount = todaySchedule.filter(p => p.status === 'done').length
  const totalClasses = todaySchedule.filter(p => p.status !== 'free').length

  return (
    <div className="p-4 lg:p-6 space-y-5 relative">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Good Morning, Mr. Rajesh!</h2>
        <p className="text-sm text-gray-500 mt-0.5">Saturday, 31 May 2026 · Term 2 ongoing</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Classes Today', value: `${doneCount}/${totalClasses}`, sub: 'attended', icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
          { label: 'Pending Grading', value: '3', sub: 'assignments', icon: ClipboardCheck, color: 'bg-amber-50 text-amber-600' },
          { label: 'Reports Due', value: '2', sub: 'this week', icon: FileText, color: 'bg-red-50 text-red-600' },
          { label: 'Total Students', value: '120', sub: 'across 3 classes', icon: Users, color: 'bg-indigo-50 text-indigo-600' },
        ].map(s => (
          <div key={s.label} className="card flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's Schedule */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock size={16} className="text-indigo-600" /> Today&apos;s Schedule
            </h3>
            <span className="text-xs text-gray-400">5 periods</span>
          </div>
          <div className="space-y-2">
            {todaySchedule.map(p => (
              <div
                key={p.period}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  p.status === 'done' ? 'bg-green-50 border-green-100' :
                  p.status === 'free' ? 'bg-gray-50 border-gray-100' :
                  'bg-indigo-50 border-indigo-100'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  p.status === 'done' ? 'bg-green-500 text-white' :
                  p.status === 'free' ? 'bg-gray-300 text-gray-600' :
                  'bg-indigo-500 text-white'
                }`}>
                  {p.period}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {p.class === 'FREE' ? 'Free Period' : `${p.class} — ${p.subject}`}
                  </p>
                  <p className="text-xs text-gray-500">{p.time} · {p.room}</p>
                </div>
                <span className={`badge text-xs ${
                  p.status === 'done' ? 'bg-green-100 text-green-700' :
                  p.status === 'free' ? 'bg-gray-100 text-gray-500' :
                  'bg-indigo-100 text-indigo-700'
                }`}>
                  {p.status === 'done' ? 'Done' : p.status === 'free' ? 'Free' : 'Upcoming'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* My Classes */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Users size={16} className="text-indigo-600" /> My Classes
          </h3>
          <div className="space-y-3">
            {classes.map(cls => (
              <div key={cls.name} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-800">{cls.name}</p>
                  <span className="text-xs text-gray-500">{cls.students} students</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full"
                      style={{ width: `${cls.attendance}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-indigo-600">{cls.attendance}%</span>
                </div>
                <p className="text-xs text-gray-400">Attendance · {cls.pending > 0 ? `${cls.pending} pending` : 'All up to date'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pending Tasks */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <AlertCircle size={16} className="text-amber-500" /> Pending Tasks
          </h3>
          <div className="space-y-2">
            {pendingTasks.map((t, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50">
                <div className={`mt-0.5 p-1 rounded ${t.type === 'grade' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                  {t.type === 'grade' ? <PenLine size={12} /> : <FileText size={12} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{t.label}</p>
                  <p className="text-xs text-gray-400">{t.class} · Due {t.due}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: 'Mark Attendance', icon: ClipboardCheck, href: '/attendance', color: 'bg-green-50 text-green-700 border-green-200' },
              { label: 'Upload Assignment', icon: Upload, href: '/assignments', color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { label: 'Enter Marks', icon: PenLine, href: '/marks', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
              { label: 'View Timetable', icon: Calendar, href: '/timetable', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            ].map(a => (
              <a
                key={a.label}
                href={a.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border font-medium text-sm transition-all hover:shadow-sm ${a.color}`}
              >
                <a.icon size={16} />
                {a.label}
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-indigo-600" /> Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivities.map((a, i) => (
              <div key={i} className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {a.student.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{a.student} <span className="text-gray-400 font-normal">({a.class})</span></p>
                  <p className="text-xs text-gray-500 truncate">{a.action}</p>
                  <p className="text-[10px] text-gray-400">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-40">
        {chatOpen && (
          <div className="mb-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col overflow-hidden" style={{ height: '380px' }}>
            <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                  <BookOpen size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">AI Teaching Assistant</p>
                  <p className="text-indigo-200 text-xs">Powered by KVL AI</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/70 hover:text-white">
                <X size={16} />
              </button>
            </div>

            {/* AI Suggestions */}
            <div className="px-3 pt-3 pb-1">
              <p className="text-xs text-gray-400 font-medium mb-2">Insights</p>
              {aiSuggestions.map((s, i) => (
                <div key={i} className="flex gap-1.5 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600">{s}</p>
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
              {chatHistory.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-lg text-xs ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-3 py-3 border-t border-gray-100 flex gap-2">
              <input
                className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ask anything..."
                value={chatMsg}
                onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <Send size={13} />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setChatOpen(o => !o)}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all"
        >
          <MessageCircle size={22} />
        </button>
      </div>
    </div>
  )
}
