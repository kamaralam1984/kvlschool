'use client'

import React, { useState } from 'react'
import {
  FileText, Plus, Calendar, Clock, Users, Award,
  BookOpen, CheckCircle, AlertCircle, Download, Eye, Edit, Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'

const EXAMS = [
  { id: 'EX001', name: 'Mid-Term Examination', type: 'Offline', classes: 'VI-XII', startDate: '2026-06-15', endDate: '2026-06-25', totalStudents: 1240, status: 'Upcoming', subjects: 6 },
  { id: 'EX002', name: 'Chapter Test - Mathematics', type: 'Online', classes: 'X-A, X-B', startDate: '2026-06-02', endDate: '2026-06-02', totalStudents: 81, status: 'Upcoming', subjects: 1 },
  { id: 'EX003', name: 'Unit Test 3 - Science', type: 'Offline', classes: 'VIII-A, VIII-B', startDate: '2026-05-28', endDate: '2026-05-28', totalStudents: 85, status: 'Completed', subjects: 1 },
  { id: 'EX004', name: 'Annual Examination', type: 'Offline', classes: 'VI-XII', startDate: '2026-03-01', endDate: '2026-03-15', totalStudents: 4218, status: 'Completed', subjects: 6 },
  { id: 'EX005', name: 'Pre-Board Exam', type: 'Offline', classes: 'X, XII', startDate: '2026-01-10', endDate: '2026-01-20', totalStudents: 280, status: 'Completed', subjects: 5 },
]

const RESULTS_SUMMARY = [
  { class: 'X-A', students: 42, passed: 41, failed: 1, topScore: 98, avgScore: 82, grade: 'A+' },
  { class: 'X-B', students: 39, passed: 37, failed: 2, topScore: 95, avgScore: 79, grade: 'A' },
  { class: 'XI-A', students: 36, passed: 35, failed: 1, topScore: 97, avgScore: 81, grade: 'A+' },
  { class: 'XI-B', students: 34, passed: 34, failed: 0, topScore: 94, avgScore: 78, grade: 'A' },
  { class: 'XII-A', students: 35, passed: 35, failed: 0, topScore: 99, avgScore: 86, grade: 'A+' },
  { class: 'XII-B', students: 33, passed: 32, failed: 1, topScore: 93, avgScore: 77, grade: 'A' },
]

const QUESTION_BANK = [
  { subject: 'Mathematics', total: 1240, easy: 410, medium: 580, hard: 250 },
  { subject: 'Physics', total: 980, easy: 320, medium: 460, hard: 200 },
  { subject: 'Chemistry', total: 860, easy: 280, medium: 400, hard: 180 },
  { subject: 'English', total: 720, easy: 300, medium: 320, hard: 100 },
  { subject: 'History', total: 640, easy: 260, medium: 280, hard: 100 },
]

const statusColor: Record<string, string> = {
  Upcoming: 'bg-blue-100 text-blue-700',
  Ongoing: 'bg-green-100 text-green-700',
  Completed: 'bg-gray-100 text-gray-600',
}

const typeColor: Record<string, string> = {
  Online: 'bg-purple-100 text-purple-700',
  Offline: 'bg-orange-100 text-orange-700',
}

export default function ExamsPage() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'results' | 'questions' | 'reports'>('schedule')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Examinations</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage exams, results, and question banks</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download className="w-4 h-4" /> Export Results
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Schedule Exam
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Exams', value: '24', icon: FileText, color: 'bg-blue-500', sub: 'this academic year' },
          { label: 'Upcoming', value: '3', icon: Calendar, color: 'bg-purple-500', sub: 'in next 30 days' },
          { label: 'Avg Pass Rate', value: '96.8%', icon: CheckCircle, color: 'bg-green-500', sub: 'across all classes' },
          { label: 'Question Bank', value: '4.4K', icon: BookOpen, color: 'bg-orange-400', sub: 'questions total' },
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
        {(['schedule', 'results', 'questions', 'reports'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-1.5 text-sm rounded-md capitalize transition-all', activeTab === tab ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700')}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'schedule' && (
        <div className="space-y-3">
          {EXAMS.map(e => (
            <div key={e.id} className="bg-white rounded-xl border border-gray-100 p-5 flex flex-wrap items-center gap-4 hover:shadow-sm transition-shadow">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{e.name}</h3>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColor[e.status])}>{e.status}</span>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', typeColor[e.type])}>{e.type}</span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{e.startDate}{e.startDate !== e.endDate ? ` → ${e.endDate}` : ''}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{e.totalStudents} students</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{e.subjects} subjects</span>
                  <span>Classes: {e.classes}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">Hall Tickets</button>
                <button className="p-1.5 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-yellow-50 rounded text-gray-400 hover:text-yellow-600"><Edit className="w-4 h-4" /></button>
                {e.status === 'Upcoming' && <button className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'results' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Unit Test 3 — Results Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Class', 'Students', 'Passed', 'Failed', 'Top Score', 'Avg Score', 'Grade', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RESULTS_SUMMARY.map(r => (
                  <tr key={r.class} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-800">{r.class}</td>
                    <td className="px-4 py-3 text-gray-500">{r.students}</td>
                    <td className="px-4 py-3 text-green-600 font-medium">{r.passed}</td>
                    <td className="px-4 py-3 text-red-500">{r.failed}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">{r.topScore}%</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${r.avgScore}%` }} />
                        </div>
                        <span className="text-xs">{r.avgScore}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-1 rounded font-bold text-xs', r.grade === 'A+' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700')}>{r.grade}</span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="text-xs text-blue-600 hover:underline">View</button>
                      <button className="text-xs text-gray-500 hover:underline">Report Cards</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Question Bank</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Add Questions
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUESTION_BANK.map(q => (
              <div key={q.subject} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{q.subject}</h3>
                  <span className="text-lg font-bold text-blue-600">{q.total}</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Easy', value: q.easy, color: 'bg-green-400', pct: (q.easy / q.total * 100).toFixed(0) },
                    { label: 'Medium', value: q.medium, color: 'bg-yellow-400', pct: (q.medium / q.total * 100).toFixed(0) },
                    { label: 'Hard', value: q.hard, color: 'bg-red-400', pct: (q.hard / q.total * 100).toFixed(0) },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-14">{l.label}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className={cn('h-1.5 rounded-full', l.color)} style={{ width: `${l.pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-600 w-8 text-right">{l.value}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full text-xs text-blue-600 hover:underline text-center">Manage Questions →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Report Cards', desc: 'Generate and download student report cards', icon: Award },
            { title: 'Hall Tickets', desc: 'Print admit cards for upcoming exams', icon: FileText },
            { title: 'Topper List', desc: 'Class and school toppers for last exam', icon: Award },
            { title: 'Failing Students', desc: 'Students at risk — attendance and scores below threshold', icon: AlertCircle },
          ].map(r => (
            <div key={r.title} className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <r.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{r.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
              </div>
              <Download className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
