'use client'

import React, { useState } from 'react'
import {
  BookOpen, Users, Clock, Plus, Download, Edit, Eye, Trash2,
  Calendar, FileText, ChevronRight, GraduationCap, BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

const CLASSES = [
  { name: 'VI-A', classTeacher: 'Mrs. Sunita Rao', students: 42, subjects: 8, room: '101', timing: '7:30 AM – 1:30 PM' },
  { name: 'VI-B', classTeacher: 'Mr. Kiran Joshi', students: 40, subjects: 8, room: '102', timing: '7:30 AM – 1:30 PM' },
  { name: 'VII-A', classTeacher: 'Mrs. Anita Sharma', students: 45, subjects: 9, room: '201', timing: '7:30 AM – 2:00 PM' },
  { name: 'VIII-A', classTeacher: 'Mr. Ravi Kumar', students: 44, subjects: 9, room: '301', timing: '7:30 AM – 2:00 PM' },
  { name: 'IX-A', classTeacher: 'Dr. Sanjay Gupta', students: 40, subjects: 6, room: '401', timing: '7:30 AM – 2:30 PM' },
  { name: 'X-A', classTeacher: 'Ms. Pooja Nair', students: 42, subjects: 6, room: '402', timing: '7:30 AM – 2:30 PM' },
  { name: 'XI-A (Sci)', classTeacher: 'Mr. Amit Joshi', students: 36, subjects: 5, room: '501', timing: '7:30 AM – 3:00 PM' },
  { name: 'XII-A (Sci)', classTeacher: 'Dr. Meera Pillai', students: 35, subjects: 5, room: '601', timing: '7:30 AM – 3:00 PM' },
]

const SUBJECTS = [
  { name: 'Mathematics', code: 'MATH', classes: ['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'], teachers: 4, periods: 6, type: 'Core' },
  { name: 'English', code: 'ENG', classes: ['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'], teachers: 3, periods: 5, type: 'Core' },
  { name: 'Science', code: 'SCI', classes: ['VI', 'VII', 'VIII'], teachers: 3, periods: 5, type: 'Core' },
  { name: 'Physics', code: 'PHY', classes: ['IX', 'X', 'XI', 'XII'], teachers: 2, periods: 4, type: 'Core' },
  { name: 'Chemistry', code: 'CHEM', classes: ['IX', 'X', 'XI', 'XII'], teachers: 2, periods: 4, type: 'Core' },
  { name: 'Biology', code: 'BIO', classes: ['IX', 'X', 'XI', 'XII'], teachers: 2, periods: 4, type: 'Elective' },
  { name: 'Computer Science', code: 'CS', classes: ['IX', 'X', 'XI', 'XII'], teachers: 1, periods: 3, type: 'Elective' },
  { name: 'Physical Education', code: 'PE', classes: ['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'], teachers: 2, periods: 2, type: 'Core' },
  { name: 'Social Studies', code: 'SST', classes: ['VI', 'VII', 'VIII', 'IX', 'X'], teachers: 2, periods: 4, type: 'Core' },
  { name: 'Hindi', code: 'HIN', classes: ['VI', 'VII', 'VIII', 'IX', 'X'], teachers: 2, periods: 4, type: 'Core' },
]

const TIMETABLE_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const PERIODS = ['P1\n7:30', 'P2\n8:20', 'P3\n9:10', 'Break', 'P4\n10:20', 'P5\n11:10', 'P6\n12:00', 'P7\n12:50']
const TIMETABLE_DATA: Record<string, string[]> = {
  Monday: ['Mathematics', 'English', 'Physics', '—', 'Chemistry', 'CS', 'PE', 'Biology'],
  Tuesday: ['Physics', 'Mathematics', 'English', '—', 'Biology', 'Mathematics', 'Chemistry', 'CS'],
  Wednesday: ['English', 'Chemistry', 'Mathematics', '—', 'Physics', 'Biology', 'Mathematics', 'English'],
  Thursday: ['CS', 'Physics', 'Biology', '—', 'English', 'Chemistry', 'Mathematics', 'Physics'],
  Friday: ['Chemistry', 'Biology', 'CS', '—', 'Mathematics', 'English', 'Physics', 'PE'],
  Saturday: ['Mathematics', 'English', 'Physics', '—', 'Biology', 'Chemistry', '—', '—'],
}

const subjectColors: Record<string, string> = {
  Mathematics: 'bg-blue-100 text-blue-700',
  English: 'bg-purple-100 text-purple-700',
  Physics: 'bg-green-100 text-green-700',
  Chemistry: 'bg-orange-100 text-orange-700',
  Biology: 'bg-teal-100 text-teal-700',
  CS: 'bg-indigo-100 text-indigo-700',
  PE: 'bg-red-100 text-red-700',
  '—': 'bg-gray-50 text-gray-300',
}

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState<'classes' | 'subjects' | 'timetable' | 'calendar'>('classes')
  const [selectedClass, setSelectedClass] = useState('XII-A (Sci)')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Classes, subjects, timetable and academic calendar</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Class
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Classes', value: '28', icon: GraduationCap, color: 'bg-blue-500', sub: 'VI to XII' },
          { label: 'Subjects', value: '18', icon: BookOpen, color: 'bg-purple-500', sub: 'core + elective' },
          { label: 'Periods/Week', value: '42', icon: Clock, color: 'bg-green-500', sub: 'per class' },
          { label: 'Avg Class Size', value: '41', icon: Users, color: 'bg-orange-400', sub: 'students' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', s.color)}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['classes', 'subjects', 'timetable', 'calendar'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-1.5 text-sm rounded-md capitalize transition-all', activeTab === tab ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700')}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CLASSES.map(c => (
            <div key={c.name} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{c.name.split('-')[0]}</span>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600"><Eye className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-yellow-50 rounded text-gray-400 hover:text-yellow-600"><Edit className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <h3 className="font-bold text-gray-900">Class {c.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">CT: {c.classTeacher}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="font-bold text-gray-900 text-base">{c.students}</p>
                  <p className="text-gray-400">Students</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="font-bold text-gray-900 text-base">{c.subjects}</p>
                  <p className="text-gray-400">Subjects</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />{c.timing} · Room {c.room}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Subject', 'Code', 'Type', 'Classes', 'Teachers', 'Periods/Week', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {SUBJECTS.map(s => (
                  <tr key={s.code} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 bg-gray-50 rounded">{s.code}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', s.type === 'Core' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700')}>{s.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.classes.slice(0, 4).map(c => <span key={c} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">{c}</span>)}
                        {s.classes.length > 4 && <span className="text-gray-400 text-xs">+{s.classes.length - 4}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{s.teachers}</td>
                    <td className="px-4 py-3 text-gray-500">{s.periods}</td>
                    <td className="px-4 py-3 flex gap-1">
                      <button className="p-1 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1 hover:bg-yellow-50 rounded text-gray-400 hover:text-yellow-600"><Edit className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'timetable' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Class:</label>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none">
              {CLASSES.map(c => <option key={c.name}>Class {c.name}</option>)}
            </select>
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 ml-auto">
              <Download className="w-4 h-4" /> Print Timetable
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-3 py-3 text-left text-gray-500 font-semibold uppercase tracking-wide">Day</th>
                    {PERIODS.map(p => (
                      <th key={p} className="px-2 py-3 text-gray-500 font-semibold whitespace-pre-line leading-tight">{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {TIMETABLE_DAYS.map(day => (
                    <tr key={day} className="hover:bg-gray-50">
                      <td className="px-3 py-3 text-left font-semibold text-gray-700 text-xs">{day}</td>
                      {TIMETABLE_DATA[day].map((subject, i) => (
                        <td key={i} className="px-1 py-2">
                          {subject === 'Break'
                            ? <div className="bg-gray-100 rounded text-gray-400 text-xs py-2 px-1">Break</div>
                            : <div className={cn('rounded py-2 px-1 font-medium text-xs leading-tight', subjectColors[subject] || 'bg-gray-100 text-gray-600')}>{subject}</div>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Academic Calendar 2025-26</h2>
          <div className="space-y-3">
            {[
              { month: 'June 2025', events: ['School reopens (June 2)', 'Orientation Day (June 5)', 'Unit Test 1 (June 20-25)'] },
              { month: 'July 2025', events: ['PTM - Unit Test 1 (July 12)', 'Independence Day (Aug 15 - Holiday)'] },
              { month: 'August 2025', events: ['Half-yearly Exams (Aug 25 – Sep 5)', 'Independence Day Celebration (Aug 15)'] },
              { month: 'September 2025', events: ['PTM - Half Yearly (Sep 20)', 'Teacher\'s Day (Sep 5)'] },
              { month: 'October 2025', events: ['Dussehra Break (Oct 1-5)', 'Unit Test 2 (Oct 20-25)'] },
              { month: 'November 2025', events: ['Children\'s Day (Nov 14)', 'Annual Day (Nov 28)'] },
              { month: 'December 2025', events: ['Pre-Board Exams (Dec 15-22)', 'Winter Break (Dec 25 – Jan 1)'] },
              { month: 'January 2026', events: ['Republic Day (Jan 26 – Holiday)', 'Board Practical Exams (Jan 15-25)'] },
              { month: 'February 2026', events: ['Board Exams Begin (Feb 15)', 'Sports Day (Feb 5)'] },
              { month: 'March 2026', events: ['Annual Examinations (Mar 1-15)', 'Result Declaration (Mar 25)'] },
            ].map(m => (
              <div key={m.month} className="flex gap-4">
                <div className="w-28 flex-shrink-0">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{m.month}</span>
                </div>
                <div className="flex-1 flex flex-wrap gap-2">
                  {m.events.map(e => (
                    <span key={e} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">{e}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
