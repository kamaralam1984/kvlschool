'use client'
import React, { useState, useMemo } from 'react'
import { Search, CheckCircle2, XCircle, Clock, Upload, X, Filter } from 'lucide-react'

type DocStatus = 'submitted' | 'missing' | 'pending'
type OverallStatus = 'Complete' | 'Incomplete' | 'Pending'

interface DocItem {
  name: string
  status: DocStatus
}

interface Student {
  id: string
  name: string
  class: string
  appNo: string
  docs: DocItem[]
  overall: OverallStatus
}

const DOC_NAMES = ['Birth Certificate', 'Marksheet', 'TC', 'Aadhar', 'Photos']

const MOCK: Student[] = [
  {
    id: '1', name: 'Aarav Sharma', class: '6', appNo: 'APP-2025-001',
    docs: [
      { name: 'Birth Certificate', status: 'submitted' },
      { name: 'Marksheet', status: 'submitted' },
      { name: 'TC', status: 'submitted' },
      { name: 'Aadhar', status: 'submitted' },
      { name: 'Photos', status: 'submitted' },
    ],
    overall: 'Complete',
  },
  {
    id: '2', name: 'Meera Joshi', class: '4', appNo: 'APP-2025-002',
    docs: [
      { name: 'Birth Certificate', status: 'submitted' },
      { name: 'Marksheet', status: 'missing' },
      { name: 'TC', status: 'submitted' },
      { name: 'Aadhar', status: 'submitted' },
      { name: 'Photos', status: 'missing' },
    ],
    overall: 'Incomplete',
  },
  {
    id: '3', name: 'Rohan Gupta', class: '9', appNo: 'APP-2025-003',
    docs: [
      { name: 'Birth Certificate', status: 'submitted' },
      { name: 'Marksheet', status: 'submitted' },
      { name: 'TC', status: 'pending' },
      { name: 'Aadhar', status: 'submitted' },
      { name: 'Photos', status: 'submitted' },
    ],
    overall: 'Incomplete',
  },
  {
    id: '4', name: 'Priya Mehta', class: '1', appNo: 'APP-2025-004',
    docs: [
      { name: 'Birth Certificate', status: 'pending' },
      { name: 'Marksheet', status: 'pending' },
      { name: 'TC', status: 'pending' },
      { name: 'Aadhar', status: 'pending' },
      { name: 'Photos', status: 'pending' },
    ],
    overall: 'Pending',
  },
  {
    id: '5', name: 'Ananya Singh', class: '7', appNo: 'APP-2025-005',
    docs: [
      { name: 'Birth Certificate', status: 'submitted' },
      { name: 'Marksheet', status: 'submitted' },
      { name: 'TC', status: 'submitted' },
      { name: 'Aadhar', status: 'submitted' },
      { name: 'Photos', status: 'submitted' },
    ],
    overall: 'Complete',
  },
  {
    id: '6', name: 'Karan Verma', class: '10', appNo: 'APP-2025-006',
    docs: [
      { name: 'Birth Certificate', status: 'submitted' },
      { name: 'Marksheet', status: 'submitted' },
      { name: 'TC', status: 'missing' },
      { name: 'Aadhar', status: 'submitted' },
      { name: 'Photos', status: 'submitted' },
    ],
    overall: 'Incomplete',
  },
  {
    id: '7', name: 'Deepika Rao', class: '3', appNo: 'APP-2025-007',
    docs: [
      { name: 'Birth Certificate', status: 'submitted' },
      { name: 'Marksheet', status: 'pending' },
      { name: 'TC', status: 'pending' },
      { name: 'Aadhar', status: 'submitted' },
      { name: 'Photos', status: 'submitted' },
    ],
    overall: 'Pending',
  },
  {
    id: '8', name: 'Siddharth Nair', class: '8', appNo: 'APP-2025-008',
    docs: [
      { name: 'Birth Certificate', status: 'submitted' },
      { name: 'Marksheet', status: 'submitted' },
      { name: 'TC', status: 'submitted' },
      { name: 'Aadhar', status: 'submitted' },
      { name: 'Photos', status: 'submitted' },
    ],
    overall: 'Complete',
  },
]

const overallConfig: Record<OverallStatus, { color: string; bg: string; border: string }> = {
  Complete:   { color: 'text-green-700',  bg: 'bg-green-100',  border: 'border-green-200' },
  Incomplete: { color: 'text-red-700',    bg: 'bg-red-100',    border: 'border-red-200' },
  Pending:    { color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200' },
}

const docIcon = (status: DocStatus) => {
  if (status === 'submitted') return <CheckCircle2 className="w-4 h-4 text-green-500" />
  if (status === 'missing')   return <XCircle className="w-4 h-4 text-red-400" />
  return <Clock className="w-4 h-4 text-yellow-400" />
}

export default function DocumentsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | OverallStatus>('All')
  const [selected, setSelected] = useState<Student | null>(null)

  const filtered = useMemo(() => MOCK.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.appNo.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || s.overall === statusFilter
    return matchSearch && matchStatus
  }), [search, statusFilter])

  const completedCount = MOCK.filter(s => s.overall === 'Complete').length
  const incompleteCount = MOCK.filter(s => s.overall === 'Incomplete').length
  const pendingCount = MOCK.filter(s => s.overall === 'Pending').length

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Document Verification</h1>
          <p className="text-sm text-gray-500 mt-1">Track and verify admission documents for each applicant</p>
        </div>
        <button className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#16304f] transition-colors">
          <Upload className="w-4 h-4" />
          Upload Docs
        </button>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: 'Complete', count: completedCount, color: 'bg-green-50 text-green-700 border-green-200' },
          { label: 'Incomplete', count: incompleteCount, color: 'bg-red-50 text-red-700 border-red-200' },
          { label: 'Pending', count: pendingCount, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
        ].map(p => (
          <span key={p.label} className={`text-sm font-medium border px-3 py-1 rounded-full ${p.color}`}>
            {p.label}: {p.count}
          </span>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or app no..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
            className="pl-9 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f] appearance-none bg-white"
          >
            <option value="All">All Status</option>
            <option value="Complete">Complete</option>
            <option value="Incomplete">Incomplete</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Student Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Class</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">App No.</th>
                {DOC_NAMES.map(d => (
                  <th key={d} className="text-center px-3 py-3 font-semibold text-gray-600 whitespace-nowrap">{d}</th>
                ))}
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const cfg = overallConfig[s.overall]
                return (
                  <tr key={s.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                    <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">Class {s.class}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.appNo}</td>
                    {s.docs.map(d => (
                      <td key={d.name} className="px-3 py-3 text-center">
                        <div className="flex justify-center">{docIcon(d.status)}</div>
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                        {s.overall}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelected(s)}
                        className="text-xs text-[#1e3a5f] border border-[#1e3a5f]/30 px-3 py-1 rounded-lg hover:bg-[#1e3a5f]/5 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doc Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-[#1e3a5f]">{selected.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{selected.appNo} · Class {selected.class}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {selected.docs.map(d => (
                <div key={d.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">{d.name}</span>
                  <div className="flex items-center gap-2">
                    {docIcon(d.status)}
                    <span className={`text-xs font-medium ${
                      d.status === 'submitted' ? 'text-green-600' :
                      d.status === 'missing' ? 'text-red-500' : 'text-yellow-600'
                    }`}>
                      {d.status === 'submitted' ? 'Submitted' : d.status === 'missing' ? 'Missing' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button className="flex-1 bg-[#1e3a5f] text-white py-2 rounded-xl text-sm font-medium hover:bg-[#16304f] transition-colors">
                Request Documents
              </button>
              <button onClick={() => setSelected(null)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
