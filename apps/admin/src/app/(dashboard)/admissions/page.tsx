'use client'

import React, { useState } from 'react'
import {
  Users, FileText, CheckCircle, Clock, XCircle, Plus,
  Download, Eye, Edit, Search, Phone, Mail, Calendar,
  ChevronRight, Award
} from 'lucide-react'
import { cn } from '@/lib/utils'

const APPLICATIONS = [
  { id: 'ADM001', name: 'Ishaan Verma', applyingFor: 'Class VI', dob: '2014-03-12', parent: 'Mr. Suresh Verma', phone: '9811234567', email: 's.verma@email.com', appliedDate: '2026-05-25', status: 'Under Review', docs: 'Complete' },
  { id: 'ADM002', name: 'Zara Ahmed', applyingFor: 'Class IX', dob: '2011-07-08', parent: 'Mrs. Nasreen Ahmed', phone: '9822345678', email: 'nasreen@email.com', appliedDate: '2026-05-28', status: 'Interview Scheduled', docs: 'Complete' },
  { id: 'ADM003', name: 'Aarav Singh', applyingFor: 'Class XI (Science)', dob: '2009-01-22', parent: 'Mr. Harpal Singh', phone: '9833456789', email: 'h.singh@email.com', appliedDate: '2026-05-20', status: 'Admitted', docs: 'Complete' },
  { id: 'ADM004', name: 'Meera Krishnan', applyingFor: 'Class VI', dob: '2014-09-15', parent: 'Mrs. Lakshmi Krishnan', phone: '9844567890', email: 'l.krishnan@email.com', appliedDate: '2026-05-29', status: 'Pending Documents', docs: 'Incomplete' },
  { id: 'ADM005', name: 'Rishi Gupta', applyingFor: 'Class XI (Commerce)', dob: '2009-04-30', parent: 'Mr. Vivek Gupta', phone: '9855678901', email: 'v.gupta@email.com', appliedDate: '2026-05-18', status: 'Waitlist', docs: 'Complete' },
  { id: 'ADM006', name: 'Anaya Joshi', applyingFor: 'Class IX', dob: '2011-11-03', parent: 'Mrs. Priti Joshi', phone: '9866789012', email: 'p.joshi@email.com', appliedDate: '2026-05-30', status: 'Under Review', docs: 'Incomplete' },
]

const PIPELINE = [
  { stage: 'Applications Received', count: 148, color: 'bg-blue-500', icon: FileText },
  { stage: 'Documents Verified', count: 112, color: 'bg-indigo-500', icon: CheckCircle },
  { stage: 'Interviews Scheduled', count: 68, color: 'bg-purple-500', icon: Calendar },
  { stage: 'Admitted', count: 43, color: 'bg-green-500', icon: Award },
]

const statusColor: Record<string, string> = {
  'Under Review': 'bg-blue-100 text-blue-700',
  'Interview Scheduled': 'bg-purple-100 text-purple-700',
  'Admitted': 'bg-green-100 text-green-700',
  'Pending Documents': 'bg-yellow-100 text-yellow-700',
  'Waitlist': 'bg-orange-100 text-orange-700',
  'Rejected': 'bg-red-100 text-red-700',
}

const docColor: Record<string, string> = {
  Complete: 'text-green-600',
  Incomplete: 'text-red-500',
}

export default function AdmissionsPage() {
  const [activeTab, setActiveTab] = useState<'applications' | 'enquiries' | 'pipeline'>('applications')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = APPLICATIONS.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admissions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Applications, enrollment and admission management</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus className="w-4 h-4" /> New Application
          </button>
        </div>
      </div>

      {/* Pipeline */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {PIPELINE.map((p, i) => (
          <div key={p.stage} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', p.color)}>
                <p.icon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
              </div>
              {i < PIPELINE.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
            </div>
            <p className="text-2xl font-bold text-gray-900">{p.count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{p.stage}</p>
          </div>
        ))}
      </div>

      {/* Admission Stats by Class */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Seats Available — 2026-27</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map((cls, i) => {
            const total = [60, 60, 55, 50, 50, 45, 45][i]
            const filled = [42, 58, 55, 48, 50, 38, 42][i]
            const pct = Math.round((filled / total) * 100)
            return (
              <div key={cls} className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-sm font-bold text-gray-700">Class {cls}</p>
                <p className={cn('text-xl font-bold mt-1', pct >= 95 ? 'text-red-500' : pct >= 80 ? 'text-orange-500' : 'text-green-600')}>{total - filled}</p>
                <p className="text-xs text-gray-400">seats left</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                  <div className={cn('h-1 rounded-full', pct >= 95 ? 'bg-red-400' : pct >= 80 ? 'bg-orange-400' : 'bg-green-400')} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['applications', 'enquiries', 'pipeline'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-1.5 text-sm rounded-md capitalize transition-all', activeTab === tab ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700')}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'applications' && (
        <>
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search applications..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none">
              {['All', 'Under Review', 'Interview Scheduled', 'Admitted', 'Pending Documents', 'Waitlist'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Applicant', 'Class', 'Parent / Contact', 'Applied On', 'Documents', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{a.name}</p>
                        <p className="text-xs text-gray-400">{a.id} · DOB: {a.dob}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{a.applyingFor}</td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700 text-xs">{a.parent}</p>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5"><Phone className="w-3 h-3" />{a.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{a.appliedDate}</td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs font-medium', docColor[a.docs])}>{a.docs}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', statusColor[a.status])}>{a.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                          <button className="p-1 hover:bg-yellow-50 rounded text-gray-400 hover:text-yellow-600"><Edit className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'enquiries' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700">Admission Enquiries</h3>
          <p className="text-sm text-gray-400 mt-1">Track walk-in enquiries, phone calls, and online enquiry forms</p>
          <button className="mt-4 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
            <span className="flex items-center gap-2"><Plus className="w-4 h-4" />Add Enquiry</span>
          </button>
        </div>
      )}

      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          {['Under Review', 'Interview Scheduled', 'Admitted', 'Pending Documents', 'Waitlist'].map(stage => {
            const stageApps = APPLICATIONS.filter(a => a.status === stage)
            return (
              <div key={stage} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium', statusColor[stage])}>{stage}</span>
                  <span className="text-xs text-gray-500">{stageApps.length} applications</span>
                </div>
                {stageApps.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {stageApps.map(a => (
                      <div key={a.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{a.name}</p>
                          <p className="text-xs text-gray-400">{a.applyingFor} · Applied {a.appliedDate}</p>
                        </div>
                        <div className="flex gap-2">
                          {stage === 'Under Review' && <button className="text-xs text-purple-600 hover:underline">Schedule Interview</button>}
                          {stage === 'Interview Scheduled' && <button className="text-xs text-green-600 hover:underline">Mark Admitted</button>}
                          {stage === 'Pending Documents' && <button className="text-xs text-yellow-600 hover:underline">Send Reminder</button>}
                          <button className="text-xs text-blue-600 hover:underline">View</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="px-5 py-4 text-sm text-gray-400">No applications in this stage</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
