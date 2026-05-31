'use client'
import React, { useState } from 'react'
import { Clock, CheckCircle, Users, Plus, X, ChevronDown, Check, XCircle } from 'lucide-react'

type LeaveStatus = 'Pending' | 'Approved' | 'Rejected'
type LeaveType = 'Casual' | 'Medical' | 'Earned' | 'Maternity' | 'Emergency'

interface LeaveRequest {
  id: string; empId: string; employee: string; department: string
  type: LeaveType; from: string; to: string; days: number
  reason: string; status: LeaveStatus
}

interface LeaveBalance {
  empId: string; name: string; casual: number; medical: number; earned: number
}

const MOCK_REQUESTS: LeaveRequest[] = [
  { id:'1', empId:'EMP003', employee:'Anita Verma', department:'Science', type:'Medical', from:'2025-01-15', to:'2025-01-17', days:3, reason:'Fever and rest prescribed by doctor', status:'Pending' },
  { id:'2', empId:'EMP005', employee:'Meena Joshi', department:'English', type:'Casual', from:'2025-01-20', to:'2025-01-20', days:1, reason:'Personal work', status:'Pending' },
  { id:'3', empId:'EMP004', employee:'Suresh Patel', department:'Mathematics', type:'Earned', from:'2025-01-22', to:'2025-01-25', days:4, reason:'Family function out of town', status:'Pending' },
  { id:'4', empId:'EMP006', employee:'Vikram Singh', department:'Science', type:'Emergency', from:'2025-01-18', to:'2025-01-19', days:2, reason:'Family emergency', status:'Approved' },
  { id:'5', empId:'EMP007', employee:'Kavitha Nair', department:'Library', type:'Medical', from:'2025-01-10', to:'2025-01-11', days:2, reason:'Dental surgery follow-up', status:'Approved' },
  { id:'6', empId:'EMP008', employee:'Mohan Das', department:'Administration', type:'Casual', from:'2025-01-28', to:'2025-01-28', days:1, reason:'Village visit', status:'Pending' },
]

const MOCK_BALANCES: LeaveBalance[] = [
  { empId:'EMP003', name:'Anita Verma', casual:8, medical:5, earned:12 },
  { empId:'EMP004', name:'Suresh Patel', casual:10, medical:8, earned:6 },
  { empId:'EMP005', name:'Meena Joshi', casual:9, medical:10, earned:15 },
  { empId:'EMP006', name:'Vikram Singh', casual:6, medical:8, earned:10 },
]

const APPROVED_THIS_MONTH: Array<{ employee: string; type: LeaveType; from: string; to: string; days: number }> = [
  { employee:'Vikram Singh', type:'Emergency', from:'Jan 18', to:'Jan 19', days:2 },
  { employee:'Kavitha Nair', type:'Medical', from:'Jan 10', to:'Jan 11', days:2 },
  { employee:'Priya Sharma', type:'Casual', from:'Jan 5', to:'Jan 5', days:1 },
  { employee:'Rajesh Kumar', type:'Earned', from:'Jan 2', to:'Jan 4', days:3 },
]

const typeColor: Record<LeaveType, string> = {
  Casual: 'bg-blue-50 text-blue-700',
  Medical: 'bg-red-50 text-red-700',
  Earned: 'bg-purple-50 text-purple-700',
  Maternity: 'bg-pink-50 text-pink-700',
  Emergency: 'bg-orange-50 text-orange-700',
}
const statusColor: Record<LeaveStatus, string> = {
  Pending: 'bg-yellow-50 text-yellow-700',
  Approved: 'bg-green-50 text-green-700',
  Rejected: 'bg-red-50 text-red-700',
}

const emptyForm = { employee:'', department:'', type:'Casual' as LeaveType, from:'', to:'', days:1, reason:'' }

export default function LeavePage() {
  const [requests, setRequests] = useState<LeaveRequest[]>(MOCK_REQUESTS)
  const [tab, setTab] = useState<'requests' | 'calendar'>('requests')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })

  const pending = requests.filter(r => r.status === 'Pending')
  const approvedMonth = requests.filter(r => r.status === 'Approved').length + APPROVED_THIS_MONTH.length

  function approve(id: string) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r))
  }
  function reject(id: string) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r))
  }
  function handleAdd() {
    const newReq: LeaveRequest = {
      id: String(Date.now()), empId: 'EMP000', employee: form.employee,
      department: form.department, type: form.type, from: form.from, to: form.to,
      days: form.days, reason: form.reason, status: 'Pending'
    }
    setRequests(prev => [newReq, ...prev])
    setShowModal(false)
    setForm({ ...emptyForm })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage staff leave requests</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Plus className="w-4 h-4" /> Add Leave Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label:'Pending Requests', value:'8', sub:'Awaiting approval', icon: Clock, color:'bg-yellow-50 text-yellow-600' },
          { label:'Approved This Month', value:String(approvedMonth), sub:'January 2025', icon: CheckCircle, color:'bg-green-50 text-green-600' },
          { label:'On Leave Today', value:'8', sub:'Staff currently absent', icon: Users, color:'bg-blue-50 text-blue-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex border-b border-gray-100">
          {(['requests','calendar'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-4 text-sm font-medium capitalize transition-colors ${tab === t ? 'text-[#1e3a5f] border-b-2 border-[#1e3a5f]' : 'text-gray-500 hover:text-gray-700'}`}>
              {t === 'requests' ? 'Leave Requests' : 'Leave Calendar'}
            </button>
          ))}
        </div>

        {tab === 'requests' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Employee','Leave Type','From','To','Days','Reason','Status','Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-900">{r.employee}</p>
                      <p className="text-xs text-gray-400">{r.department}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColor[r.type]}`}>{r.type}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 whitespace-nowrap">{r.from}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 whitespace-nowrap">{r.to}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{r.days}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 max-w-[180px]">
                      <p className="truncate">{r.reason}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[r.status]}`}>{r.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {r.status === 'Pending' && (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => approve(r.id)} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-medium transition-colors">
                            <Check className="w-3 h-3" /> Approve
                          </button>
                          <button onClick={() => reject(r.id)} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-medium transition-colors">
                            <XCircle className="w-3 h-3" /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'calendar' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Approved Leaves — January 2025</h3>
              <div className="space-y-2">
                {[...APPROVED_THIS_MONTH, ...requests.filter(r => r.status === 'Approved').map(r => ({ employee: r.employee, type: r.type, from: r.from, to: r.to, days: r.days }))].map((l, i) => (
                  <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
                    <div className="w-8 h-8 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-[#1e3a5f]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{l.employee}</p>
                      <p className="text-xs text-gray-500">{l.from} → {l.to}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColor[l.type]}`}>{l.type}</span>
                    <span className="text-sm font-semibold text-gray-700">{l.days}d</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Leave Balances</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOCK_BALANCES.map(b => (
                  <div key={b.empId} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">{b.name}</p>
                    <div className="flex gap-4">
                      {[['Casual', b.casual, 'text-blue-600'],['Medical', b.medical, 'text-red-600'],['Earned', b.earned, 'text-purple-600']].map(([l, v, c]) => (
                        <div key={String(l)} className="text-center">
                          <p className={`text-lg font-bold ${c}`}>{v}</p>
                          <p className="text-xs text-gray-400">{l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add Leave Request</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label:'Employee Name', key:'employee', type:'text' },
                { label:'Department', key:'department', type:'text' },
                { label:'From Date', key:'from', type:'date' },
                { label:'To Date', key:'to', type:'date' },
                { label:'Number of Days', key:'days', type:'number' },
              ].map(f => (
                <div key={f.key} className={f.key === 'reason' ? 'col-span-2' : ''}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Leave Type</label>
                <div className="relative">
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as LeaveType }))}
                    className="w-full appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 bg-white">
                    {(['Casual','Medical','Earned','Maternity','Emergency'] as LeaveType[]).map(t => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Reason</label>
                <textarea value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleAdd} className="px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] transition-colors">Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
