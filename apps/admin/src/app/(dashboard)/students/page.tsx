'use client'

import React, { useState } from 'react'
import {
  Search, Filter, Plus, Download, Upload, MoreVertical,
  GraduationCap, Phone, Mail, MapPin, Eye, Edit, Trash2,
  ChevronLeft, ChevronRight, UserCheck, UserX, Users
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'

const STUDENTS = [
  { id: 'STU001', name: 'Aisha Khan', class: 'X-A', roll: '01', dob: '2009-03-15', phone: '9876543210', email: 'aisha@kvl.edu', address: 'Mumbai, MH', status: 'Active', fees: 'Paid', avatar: 'AK' },
  { id: 'STU002', name: 'Rohan Mehta', class: 'IX-B', roll: '12', dob: '2010-07-22', phone: '9123456780', email: 'rohan@kvl.edu', address: 'Pune, MH', status: 'Active', fees: 'Pending', avatar: 'RM' },
  { id: 'STU003', name: 'Priya Sharma', class: 'XI-A', roll: '05', dob: '2008-11-05', phone: '9988776655', email: 'priya@kvl.edu', address: 'Delhi, DL', status: 'Active', fees: 'Paid', avatar: 'PS' },
  { id: 'STU004', name: 'Arjun Patel', class: 'VIII-C', roll: '23', dob: '2011-01-30', phone: '9765432109', email: 'arjun@kvl.edu', address: 'Surat, GJ', status: 'Inactive', fees: 'Overdue', avatar: 'AP' },
  { id: 'STU005', name: 'Fatima Ansari', class: 'XII-B', roll: '07', dob: '2007-05-18', phone: '9654321098', email: 'fatima@kvl.edu', address: 'Hyderabad, TS', status: 'Active', fees: 'Paid', avatar: 'FA' },
  { id: 'STU006', name: 'Kiran Yadav', class: 'X-C', roll: '19', dob: '2009-09-12', phone: '9543210987', email: 'kiran@kvl.edu', address: 'Jaipur, RJ', status: 'Active', fees: 'Pending', avatar: 'KY' },
  { id: 'STU007', name: 'Mohit Verma', class: 'VII-A', roll: '31', dob: '2012-04-25', phone: '9432109876', email: 'mohit@kvl.edu', address: 'Lucknow, UP', status: 'Active', fees: 'Paid', avatar: 'MV' },
  { id: 'STU008', name: 'Sneha Reddy', class: 'XI-C', roll: '08', dob: '2008-08-08', phone: '9321098765', email: 'sneha@kvl.edu', address: 'Bengaluru, KA', status: 'Active', fees: 'Paid', avatar: 'SR' },
]

const STATS = [
  { label: 'Total Students', value: '4,218', icon: Users, color: 'bg-blue-500', change: '+128 this year' },
  { label: 'Active', value: '4,102', icon: UserCheck, color: 'bg-green-500', change: '97.3% active' },
  { label: 'Inactive', value: '116', icon: UserX, color: 'bg-red-400', change: '2.7% inactive' },
  { label: 'New This Month', value: '43', icon: GraduationCap, color: 'bg-purple-500', change: '+12 vs last month' },
]

const feeColor: Record<string, string> = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Overdue: 'bg-red-100 text-red-700',
}

const statusColor: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-gray-100 text-gray-600',
}

export default function StudentsPage() {
  const [search, setSearch] = useState('')
  const [selectedClass, setSelectedClass] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selected, setSelected] = useState<string[]>([])
  const [view, setView] = useState<'table' | 'grid'>('table')

  const filtered = STUDENTS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
    const matchClass = selectedClass === 'All' || s.class.startsWith(selectedClass)
    const matchStatus = selectedStatus === 'All' || s.status === selectedStatus
    return matchSearch && matchClass && matchStatus
  })

  const toggleSelect = (id: string) =>
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const allSelected = filtered.length > 0 && filtered.every(s => selected.includes(s.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage all enrolled students</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Upload className="w-4 h-4" /> Import
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', s.color)}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
        <select
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {['All', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {['All', 'Active', 'Inactive'].map(s => <option key={s}>{s}</option>)}
        </select>
        <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
          <Filter className="w-4 h-4" /> More Filters
        </button>
        <div className="ml-auto flex gap-1">
          {(['table', 'grid'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn('px-3 py-2 text-xs rounded-lg border capitalize', view === v ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50')}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-4 text-sm">
          <span className="font-medium text-blue-700">{selected.length} selected</span>
          <button className="text-red-600 hover:underline">Delete</button>
          <button className="text-blue-600 hover:underline">Export</button>
          <button className="text-gray-600 hover:underline">Send Notice</button>
          <button onClick={() => setSelected([])} className="ml-auto text-gray-500 hover:underline">Clear</button>
        </div>
      )}

      {/* Table */}
      {view === 'table' ? (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => allSelected ? setSelected([]) : setSelected(filtered.map(s => s.id))}
                      className="rounded border-gray-300"
                    />
                  </th>
                  {['Student', 'ID', 'Class', 'Contact', 'Fee Status', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(s.id)}
                        onChange={() => toggleSelect(s.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {s.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{s.name}</p>
                          <p className="text-xs text-gray-400">DOB: {s.dob}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.id}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-700">{s.class}</span>
                      <span className="ml-2 text-gray-400 text-xs">Roll #{s.roll}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-gray-500 text-xs"><Phone className="w-3 h-3" />{s.phone}</div>
                        <div className="flex items-center gap-1 text-gray-500 text-xs"><Mail className="w-3 h-3" />{s.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', feeColor[s.fees])}>{s.fees}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', statusColor[s.status])}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                        <button className="p-1 hover:bg-yellow-50 rounded text-gray-400 hover:text-yellow-600"><Edit className="w-4 h-4" /></button>
                        <button className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between text-sm text-gray-500">
            <span>Showing {filtered.length} of 4,218 students</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-gray-100"><ChevronLeft className="w-4 h-4" /></button>
              {[1, 2, 3, '...', 42].map((p, i) => (
                <button key={i} className={cn('w-8 h-8 rounded text-xs', p === 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100')}>{p}</button>
              ))}
              <button className="p-1 rounded hover:bg-gray-100"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {s.avatar}
                </div>
                <span className={cn('px-2 py-1 rounded-full text-xs font-medium', statusColor[s.status])}>{s.status}</span>
              </div>
              <h3 className="font-semibold text-gray-900">{s.name}</h3>
              <p className="text-xs text-gray-400 mb-2">{s.id} · {s.class} · Roll #{s.roll}</p>
              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{s.phone}</div>
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{s.address}</div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={cn('px-2 py-1 rounded-full text-xs font-medium', feeColor[s.fees])}>Fees: {s.fees}</span>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600"><Eye className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-yellow-50 rounded text-gray-400 hover:text-yellow-600"><Edit className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
