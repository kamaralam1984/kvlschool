'use client'

import React, { useState } from 'react'
import { FileText, Clock, CheckCircle, AlertCircle, Upload, Eye, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const ASSIGNMENTS = [
  { id: 'A001', subject: 'Mathematics', title: 'Quadratic Equations — Practice Set 5', teacher: 'Dr. Sanjay Gupta', assigned: '2026-05-28', due: '2026-06-03', status: 'Pending', maxMarks: 20, description: 'Solve all 15 problems from Chapter 4. Show complete working.' },
  { id: 'A002', subject: 'Physics', title: "Newton's Laws — Problem Set 4", teacher: 'Mr. Ravi Kumar', assigned: '2026-05-26', due: '2026-06-05', status: 'Submitted', maxMarks: 25, score: 22, description: 'Answer all conceptual and numerical questions.' },
  { id: 'A003', subject: 'English', title: 'Character Analysis — Macbeth Act III', teacher: 'Mrs. Anita Sharma', assigned: '2026-05-24', due: '2026-05-31', status: 'Overdue', maxMarks: 15, description: 'Write a 500-word essay analyzing Macbeth\'s transformation.' },
  { id: 'A004', subject: 'Chemistry', title: 'Organic Compounds — Nomenclature Exercise', teacher: 'Mr. Ravi Kumar', assigned: '2026-05-30', due: '2026-06-07', status: 'Pending', maxMarks: 20, description: 'Name the given organic compounds using IUPAC nomenclature.' },
  { id: 'A005', subject: 'Computer Science', title: 'Python OOP — Class Design Project', teacher: 'Mr. Amit Joshi', assigned: '2026-05-20', due: '2026-05-28', status: 'Graded', maxMarks: 30, score: 28, description: 'Design and implement a Student Management System using OOP.' },
  { id: 'A006', subject: 'Biology', title: 'Cell Division — Diagram Labelling', teacher: 'Dr. Meera Pillai', assigned: '2026-05-29', due: '2026-06-06', status: 'Pending', maxMarks: 10, description: 'Label all stages of mitosis and meiosis with descriptions.' },
]

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  Pending:   { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  Submitted: { color: 'bg-blue-100 text-blue-700',    icon: CheckCircle },
  Graded:    { color: 'bg-green-100 text-green-700',  icon: CheckCircle },
  Overdue:   { color: 'bg-red-100 text-red-700',      icon: AlertCircle },
}

const subjectColors: Record<string, string> = {
  Mathematics:      'bg-blue-100 text-blue-700',
  Physics:          'bg-green-100 text-green-700',
  English:          'bg-purple-100 text-purple-700',
  Chemistry:        'bg-orange-100 text-orange-700',
  'Computer Science': 'bg-indigo-100 text-indigo-700',
  Biology:          'bg-teal-100 text-teal-700',
}

export default function AssignmentsPage() {
  const [filter, setFilter]     = useState('All')
  const [search, setSearch]     = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = ASSIGNMENTS.filter(a => {
    const matchFilter = filter === 'All' || a.status === filter
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                        a.subject.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const counts = {
    Pending:   ASSIGNMENTS.filter(a => a.status === 'Pending').length,
    Submitted: ASSIGNMENTS.filter(a => a.status === 'Submitted').length,
    Graded:    ASSIGNMENTS.filter(a => a.status === 'Graded').length,
    Overdue:   ASSIGNMENTS.filter(a => a.status === 'Overdue').length,
  }

  const getDaysLeft = (due: string) => {
    const diff = Math.ceil((new Date(due).getTime() - Date.now()) / 86400000)
    if (diff < 0) return `${Math.abs(diff)}d overdue`
    if (diff === 0) return 'Due today'
    return `${diff}d left`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track and submit your assignments</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(['Pending','Submitted','Graded','Overdue'] as const).map(s => (
          <button key={s} onClick={() => setFilter(filter === s ? 'All' : s)}
            className={cn('bg-white rounded-xl border p-4 text-left transition-all hover:shadow-md',
              filter === s ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-100')}>
            <p className={cn('text-2xl font-bold',
              s === 'Pending'   ? 'text-yellow-600' :
              s === 'Submitted' ? 'text-blue-600'   :
              s === 'Graded'    ? 'text-green-600'  : 'text-red-500')}>
              {counts[s]}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{s}</p>
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assignments…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        {['All','Pending','Submitted','Graded','Overdue'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('px-3 py-2 text-sm rounded-lg border transition-all',
              filter === f ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50')}>
            {f}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map(a => {
          const cfg  = statusConfig[a.status]
          const open = expanded === a.id
          const days = getDaysLeft(a.due)
          return (
            <div key={a.id}
              className={cn('bg-white rounded-xl border transition-all',
                open ? 'border-blue-200 shadow-md' : 'border-gray-100 hover:shadow-sm')}>
              <div className="p-4 flex items-start gap-4 cursor-pointer" onClick={() => setExpanded(open ? null : a.id)}>
                <div className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{a.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', subjectColors[a.subject] || 'bg-gray-100 text-gray-600')}>{a.subject}</span>
                        <span className="text-xs text-gray-400">{a.teacher}</span>
                        <span className="text-xs text-gray-400">Max: {a.maxMarks} marks</span>
                      </div>
                    </div>
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 flex-shrink-0', cfg.color)}>
                      <cfg.icon className="w-3 h-3" />{a.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Assigned: {a.assigned}</span>
                    <span className={cn('font-medium', days.includes('overdue') ? 'text-red-500' : days.includes('today') ? 'text-orange-500' : 'text-gray-600')}>
                      Due: {a.due} ({days})
                    </span>
                    {a.score !== undefined && <span className="text-green-600 font-medium">Score: {a.score}/{a.maxMarks}</span>}
                  </div>
                </div>
              </div>

              {open && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-600 mb-4">{a.description}</p>
                  {(a.status === 'Pending' || a.status === 'Overdue') ? (
                    <div className="flex gap-3">
                      <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer">
                        <Upload className="w-4 h-4" />Upload Submission
                        <input type="file" className="hidden" />
                      </label>
                      <button className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 text-gray-600">View Details</button>
                    </div>
                  ) : (
                    <div className="flex gap-3 flex-wrap">
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 text-gray-600">
                        <Eye className="w-4 h-4" />View Submission
                      </button>
                      {a.score !== undefined && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-700 font-medium">{a.score}/{a.maxMarks} marks</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No assignments found</p>
          </div>
        )}
      </div>
    </div>
  )
}
