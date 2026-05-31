'use client'
import React, { useState, useMemo } from 'react'
import { Search, Eye, CheckCircle2, XCircle, Clock, Download, Filter, User, Phone, Mail, GraduationCap, FileText, ChevronDown } from 'lucide-react'

type AppStatus = 'Pending Review' | 'Under Review' | 'Approved' | 'Rejected' | 'Waitlisted'

interface Application {
  id: string; appNo: string; studentName: string; parentName: string;
  phone: string; email: string; applyingClass: string; dob: string;
  prevSchool: string; status: AppStatus; submittedDate: string;
  docs: { name: string; submitted: boolean }[]
}

const statusConfig: Record<AppStatus, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  'Pending Review': { color: 'text-gray-600',   bg: 'bg-gray-100',   border: 'border-gray-200', icon: <Clock className="w-3.5 h-3.5" /> },
  'Under Review':   { color: 'text-blue-700',   bg: 'bg-blue-100',   border: 'border-blue-200', icon: <FileText className="w-3.5 h-3.5" /> },
  'Approved':       { color: 'text-green-700',  bg: 'bg-green-100',  border: 'border-green-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  'Rejected':       { color: 'text-red-700',    bg: 'bg-red-100',    border: 'border-red-200',  icon: <XCircle className="w-3.5 h-3.5" /> },
  'Waitlisted':     { color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200', icon: <Clock className="w-3.5 h-3.5" /> },
}

const DOCS = ['Birth Certificate', 'Previous Marksheet', 'Transfer Certificate', 'Aadhar Card', 'Passport Photos', 'Address Proof']

const MOCK: Application[] = [
  { id: '1', appNo: 'APP-2025-001', studentName: 'Vikram Tiwari', parentName: 'Suresh Tiwari', phone: '9811234567', email: 'suresh@gmail.com', applyingClass: '6', dob: '2014-03-15', prevSchool: 'DPS Lucknow', status: 'Under Review', submittedDate: '2025-01-28', docs: DOCS.map((d, i) => ({ name: d, submitted: i < 4 })) },
  { id: '2', appNo: 'APP-2025-002', studentName: 'Meera Joshi', parentName: 'Rakesh Joshi', phone: '9922334455', email: 'rakesh@yahoo.com', applyingClass: '9', dob: '2011-07-22', prevSchool: 'KV Kanpur', status: 'Approved', submittedDate: '2025-01-25', docs: DOCS.map(d => ({ name: d, submitted: true })) },
  { id: '3', appNo: 'APP-2025-003', studentName: 'Aditya Rao', parentName: 'Venkat Rao', phone: '9833445566', email: 'venkat@gmail.com', applyingClass: '11', dob: '2009-11-08', prevSchool: 'St. Joseph\'s School', status: 'Pending Review', submittedDate: '2025-01-30', docs: DOCS.map((d, i) => ({ name: d, submitted: i < 2 })) },
  { id: '4', appNo: 'APP-2025-004', studentName: 'Karan Malhotra', parentName: 'Raj Malhotra', phone: '9655667788', email: 'raj@outlook.com', applyingClass: '10', dob: '2010-05-12', prevSchool: 'Ryan International', status: 'Rejected', submittedDate: '2025-01-18', docs: DOCS.map((d, i) => ({ name: d, submitted: i < 3 })) },
  { id: '5', appNo: 'APP-2025-005', studentName: 'Prachi Verma', parentName: 'Deepak Verma', phone: '9566778899', email: 'deepak@gmail.com', applyingClass: '7', dob: '2013-09-28', prevSchool: 'City Montessori', status: 'Waitlisted', submittedDate: '2025-01-31', docs: DOCS.map((d, i) => ({ name: d, submitted: i < 5 })) },
]

const STATUSES: AppStatus[] = ['Pending Review', 'Under Review', 'Approved', 'Rejected', 'Waitlisted']

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>(MOCK)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | AppStatus>('All')
  const [selected, setSelected] = useState<Application | null>(null)

  const filtered = useMemo(() => apps.filter(a => {
    const matchSearch = a.studentName.toLowerCase().includes(search.toLowerCase()) ||
      a.appNo.toLowerCase().includes(search.toLowerCase()) ||
      a.parentName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || a.status === statusFilter
    return matchSearch && matchStatus
  }), [apps, search, statusFilter])

  function updateStatus(id: string, status: AppStatus) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev)
  }

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: apps.filter(a => a.status === s).length }), {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-500 text-sm mt-1">{apps.length} total applications · {counts['Approved'] ?? 0} approved</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Status Pipeline */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex gap-0 overflow-x-auto">
          {STATUSES.map((s, i) => {
            const cfg = statusConfig[s]
            const cnt = counts[s] ?? 0
            return (
              <button key={s} onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}
                className={`flex-1 min-w-[120px] px-4 py-3 text-center transition-all ${statusFilter === s ? `${cfg.bg} ${cfg.color} font-semibold` : 'hover:bg-gray-50'} ${i < STATUSES.length - 1 ? 'border-r border-gray-100' : ''}`}>
                <p className={`text-2xl font-bold ${statusFilter === s ? cfg.color : 'text-gray-900'}`}>{cnt}</p>
                <p className={`text-xs mt-0.5 ${statusFilter === s ? cfg.color : 'text-gray-500'}`}>{s}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, application number, or parent…"
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['App No', 'Student', 'Class', 'Parent', 'Submitted', 'Docs', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(a => {
                const docsSubmitted = a.docs.filter(d => d.submitted).length
                const cfg = statusConfig[a.status]
                return (
                  <tr key={a.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 text-sm font-mono text-gray-600">{a.appNo}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-[#1e3a5f]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{a.studentName}</p>
                          <p className="text-xs text-gray-400">{a.prevSchool}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">Class {a.applyingClass}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{a.parentName}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{a.submittedDate}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${(docsSubmitted / DOCS.length) * 100}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{docsSubmitted}/{DOCS.length}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        {cfg.icon}{a.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelected(a)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                        <Eye className="w-3.5 h-3.5" /> Review
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400">No applications match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selected.studentName}</h2>
                <p className="text-xs text-gray-400 font-mono">{selected.appNo}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-gray-100"><XCircle className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: GraduationCap, label: 'Applying for', val: `Class ${selected.applyingClass}` },
                  { icon: User, label: 'Parent', val: selected.parentName },
                  { icon: Phone, label: 'Phone', val: selected.phone },
                  { icon: Mail, label: 'Email', val: selected.email },
                  { icon: FileText, label: 'Previous School', val: selected.prevSchool },
                  { icon: Clock, label: 'Submitted', val: selected.submittedDate },
                ].map(f => (
                  <div key={f.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><f.icon className="w-3 h-3" />{f.label}</p>
                    <p className="text-sm font-medium text-gray-800">{f.val}</p>
                  </div>
                ))}
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Documents Checklist</h3>
                <div className="space-y-2">
                  {selected.docs.map(d => (
                    <div key={d.name} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${d.submitted ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                      {d.submitted ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> : <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                      <span className={`text-sm ${d.submitted ? 'text-green-700 font-medium' : 'text-gray-500'}`}>{d.name}</span>
                      <span className={`ml-auto text-xs font-medium ${d.submitted ? 'text-green-600' : 'text-gray-400'}`}>{d.submitted ? 'Submitted' : 'Pending'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(s => {
                    const cfg = statusConfig[s]
                    return (
                      <button key={s} onClick={() => updateStatus(selected.id, s)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${selected.status === s ? `${cfg.bg} ${cfg.color} ${cfg.border}` : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                        {cfg.icon}{s}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
