'use client'

import React, { useState } from 'react'
import {
  Search, Plus, Download, Filter, Eye, Edit, Trash2,
  Users, Award, Clock, Star, Phone, Mail, BookOpen,
  ChevronLeft, ChevronRight, MoreVertical
} from 'lucide-react'
import { cn } from '@/lib/utils'

const TEACHERS = [
  { id: 'TCH001', name: 'Dr. Sanjay Gupta', dept: 'Mathematics', subjects: ['Algebra', 'Calculus'], exp: '12 yrs', phone: '9811223344', email: 's.gupta@kvl.edu', type: 'Full-time', rating: 4.9, classes: 8, status: 'Active', avatar: 'SG' },
  { id: 'TCH002', name: 'Mrs. Anita Sharma', dept: 'English', subjects: ['Literature', 'Grammar'], exp: '8 yrs', phone: '9822334455', email: 'a.sharma@kvl.edu', type: 'Full-time', rating: 4.7, classes: 6, status: 'Active', avatar: 'AS' },
  { id: 'TCH003', name: 'Mr. Ravi Kumar', dept: 'Science', subjects: ['Physics', 'Chemistry'], exp: '15 yrs', phone: '9833445566', email: 'r.kumar@kvl.edu', type: 'Full-time', rating: 4.8, classes: 7, status: 'Active', avatar: 'RK' },
  { id: 'TCH004', name: 'Ms. Pooja Nair', dept: 'Social Studies', subjects: ['History', 'Geography'], exp: '5 yrs', phone: '9844556677', email: 'p.nair@kvl.edu', type: 'Part-time', rating: 4.5, classes: 4, status: 'Active', avatar: 'PN' },
  { id: 'TCH005', name: 'Mr. Amit Joshi', dept: 'Computer Science', subjects: ['Programming', 'Databases'], exp: '9 yrs', phone: '9855667788', email: 'a.joshi@kvl.edu', type: 'Full-time', rating: 4.9, classes: 5, status: 'Active', avatar: 'AJ' },
  { id: 'TCH006', name: 'Dr. Meera Pillai', dept: 'Biology', subjects: ['Zoology', 'Botany'], exp: '18 yrs', phone: '9866778899', email: 'm.pillai@kvl.edu', type: 'Full-time', rating: 5.0, classes: 6, status: 'On Leave', avatar: 'MP' },
]

const STATS = [
  { label: 'Total Teachers', value: '187', icon: Users, color: 'bg-indigo-500' },
  { label: 'Full-time', value: '142', icon: Award, color: 'bg-green-500' },
  { label: 'Part-time', value: '45', icon: Clock, color: 'bg-orange-400' },
  { label: 'Avg Rating', value: '4.8', icon: Star, color: 'bg-yellow-400' },
]

const deptColors: Record<string, string> = {
  Mathematics: 'bg-blue-100 text-blue-700',
  English: 'bg-purple-100 text-purple-700',
  Science: 'bg-green-100 text-green-700',
  'Social Studies': 'bg-orange-100 text-orange-700',
  'Computer Science': 'bg-indigo-100 text-indigo-700',
  Biology: 'bg-teal-100 text-teal-700',
}

export default function TeachersPage() {
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('All')
  const [type, setType] = useState('All')

  const filtered = TEACHERS.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())
    const matchDept = dept === 'All' || t.dept === dept
    const matchType = type === 'All' || t.type === type
    return matchSearch && matchDept && matchType
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers & Staff</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage faculty and support staff</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Add Teacher
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', s.color)}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
        </div>
        <select value={dept} onChange={e => setDept(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none">
          {['All', 'Mathematics', 'English', 'Science', 'Social Studies', 'Computer Science', 'Biology'].map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={type} onChange={e => setType(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none">
          {['All', 'Full-time', 'Part-time'].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(t => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {t.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate">{t.name}</h3>
                    <p className="text-xs text-gray-400">{t.id} · {t.exp} experience</p>
                  </div>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0', t.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
                    {t.status}
                  </span>
                </div>
                <span className={cn('mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium', deptColors[t.dept] || 'bg-gray-100 text-gray-600')}>
                  {t.dept}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-gray-500">
              <div className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" />{t.subjects.join(', ')}</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{t.phone}</div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{t.email}</div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />{t.rating}</span>
                <span>{t.classes} classes</span>
                <span className={cn('px-1.5 py-0.5 rounded text-xs', t.type === 'Full-time' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600')}>{t.type}</span>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600"><Eye className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-yellow-50 rounded text-gray-400 hover:text-yellow-600"><Edit className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Showing {filtered.length} of 187 teachers</span>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-gray-100"><ChevronLeft className="w-4 h-4" /></button>
          {[1, 2, 3].map(p => (
            <button key={p} className={cn('w-8 h-8 rounded text-xs', p === 1 ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100')}>{p}</button>
          ))}
          <button className="p-1 rounded hover:bg-gray-100"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  )
}
