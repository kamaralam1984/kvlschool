'use client'

import React, { useState } from 'react'
import {
  Users, UserCheck, Clock, AlertCircle, Plus, Download,
  Calendar, FileText, TrendingUp, Eye, Edit, CheckCircle, XCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const LEAVE_REQUESTS = [
  { id: 'LV001', employee: 'Mr. Ravi Kumar', dept: 'Science', type: 'Sick Leave', from: '2026-06-02', to: '2026-06-03', days: 2, reason: 'Fever and flu', status: 'Pending', avatar: 'RK' },
  { id: 'LV002', employee: 'Ms. Pooja Nair', dept: 'Social Studies', type: 'Casual Leave', from: '2026-06-05', to: '2026-06-05', days: 1, reason: 'Personal work', status: 'Approved', avatar: 'PN' },
  { id: 'LV003', employee: 'Mr. Dinesh Patel', dept: 'Administration', type: 'Earned Leave', from: '2026-06-10', to: '2026-06-15', days: 6, reason: 'Family vacation', status: 'Pending', avatar: 'DP' },
  { id: 'LV004', employee: 'Mrs. Sunita Rao', dept: 'Mathematics', type: 'Maternity Leave', from: '2026-07-01', to: '2026-10-01', days: 90, reason: 'Maternity', status: 'Approved', avatar: 'SR' },
  { id: 'LV005', employee: 'Mr. Kiran Joshi', dept: 'Physical Education', type: 'Sick Leave', from: '2026-05-29', to: '2026-05-30', days: 2, reason: 'Medical appointment', status: 'Rejected', avatar: 'KJ' },
]

const PAYROLL = [
  { employee: 'Dr. Sanjay Gupta', designation: 'Senior Teacher', dept: 'Mathematics', basic: 55000, hra: 22000, allowances: 8000, deductions: 6800, net: 78200 },
  { employee: 'Mrs. Anita Sharma', designation: 'Teacher', dept: 'English', basic: 45000, hra: 18000, allowances: 6000, deductions: 5600, net: 63400 },
  { employee: 'Mr. Ravi Kumar', designation: 'Senior Teacher', dept: 'Science', basic: 52000, hra: 20800, allowances: 7500, deductions: 6400, net: 73900 },
  { employee: 'Ms. Pooja Nair', designation: 'Teacher (Part-time)', dept: 'Social Studies', basic: 25000, hra: 0, allowances: 3000, deductions: 3000, net: 25000 },
  { employee: 'Mr. Amit Joshi', designation: 'Teacher', dept: 'CS', basic: 48000, hra: 19200, allowances: 7000, deductions: 5900, net: 68300 },
]

const RECRUITMENT = [
  { position: 'Physics Teacher', dept: 'Science', applicants: 12, shortlisted: 4, interviews: 2, status: 'Interview Stage' },
  { position: 'School Counselor', dept: 'Administration', applicants: 28, shortlisted: 6, interviews: 3, status: 'Interview Stage' },
  { position: 'Librarian', dept: 'Library', applicants: 8, shortlisted: 3, interviews: 0, status: 'Shortlisting' },
  { position: 'Bus Driver', dept: 'Transport', applicants: 5, shortlisted: 2, interviews: 2, status: 'Final Stage' },
]

const statusColor: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
}

export default function HRPage() {
  const [activeTab, setActiveTab] = useState<'leave' | 'payroll' | 'recruitment' | 'policies'>('leave')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Human Resources</h1>
          <p className="text-sm text-gray-500 mt-0.5">Leave management, payroll and recruitment</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Staff', value: '234', icon: Users, color: 'bg-indigo-500', sub: 'teaching + admin' },
          { label: 'On Leave Today', value: '8', icon: Clock, color: 'bg-orange-400', sub: '3.4% of staff' },
          { label: 'Pending Requests', value: '5', icon: AlertCircle, color: 'bg-yellow-400', sub: 'need approval' },
          { label: 'Open Positions', value: '4', icon: UserCheck, color: 'bg-green-500', sub: 'actively hiring' },
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

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['leave', 'payroll', 'recruitment', 'policies'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-1.5 text-sm rounded-md capitalize transition-all', activeTab === tab ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700')}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'leave' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Leave Requests</h2>
            <span className="text-sm text-yellow-600 font-medium">5 pending approval</span>
          </div>
          <div className="divide-y divide-gray-50">
            {LEAVE_REQUESTS.map(l => (
              <div key={l.id} className="px-5 py-4 flex items-start gap-4 hover:bg-gray-50">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {l.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-900">{l.employee}</p>
                    <span className="text-xs text-gray-400">{l.dept}</span>
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColor[l.status])}>{l.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{l.type} · {l.days} day{l.days > 1 ? 's' : ''} · {l.from}{l.from !== l.to ? ` to ${l.to}` : ''}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{l.reason}</p>
                </div>
                {l.status === 'Pending' && (
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <CheckCircle className="w-3 h-3" /> Approve
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50">
                      <XCircle className="w-3 h-3" /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Payroll — May 2026</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Download className="w-3.5 h-3.5" /> Process Payroll
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Employee', 'Basic', 'HRA', 'Allowances', 'Deductions', 'Net Pay', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {PAYROLL.map(p => (
                  <tr key={p.employee} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{p.employee}</p>
                      <p className="text-xs text-gray-400">{p.designation} · {p.dept}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">₹{p.basic.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">₹{p.hra.toLocaleString()}</td>
                    <td className="px-4 py-3 text-green-600">+₹{p.allowances.toLocaleString()}</td>
                    <td className="px-4 py-3 text-red-500">-₹{p.deductions.toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">₹{p.net.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-blue-600 hover:underline">Slip</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-800">Total</td>
                  <td className="px-4 py-3 font-bold text-gray-800">₹{PAYROLL.reduce((a, p) => a + p.basic, 0).toLocaleString()}</td>
                  <td className="px-4 py-3 font-bold text-gray-800">₹{PAYROLL.reduce((a, p) => a + p.hra, 0).toLocaleString()}</td>
                  <td className="px-4 py-3 font-bold text-green-600">+₹{PAYROLL.reduce((a, p) => a + p.allowances, 0).toLocaleString()}</td>
                  <td className="px-4 py-3 font-bold text-red-500">-₹{PAYROLL.reduce((a, p) => a + p.deductions, 0).toLocaleString()}</td>
                  <td className="px-4 py-3 font-bold text-gray-900 text-base">₹{PAYROLL.reduce((a, p) => a + p.net, 0).toLocaleString()}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'recruitment' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Open Positions</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Plus className="w-3.5 h-3.5" /> Post Job
            </button>
          </div>
          {RECRUITMENT.map((r, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{r.position}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{r.dept}</p>
                </div>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">{r.status}</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {[
                  { label: 'Applicants', value: r.applicants, color: 'text-blue-600' },
                  { label: 'Shortlisted', value: r.shortlisted, color: 'text-yellow-600' },
                  { label: 'Interviews', value: r.interviews, color: 'text-green-600' },
                ].map(s => (
                  <div key={s.label} className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex items-center gap-1 text-xs text-blue-600 hover:underline"><Eye className="w-3 h-3" />View Applications</button>
                <button className="flex items-center gap-1 text-xs text-gray-500 hover:underline"><Edit className="w-3 h-3" />Edit Posting</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'policies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Leave Policy', desc: 'Types, entitlements and carry-forward rules', icon: Calendar },
            { title: 'Code of Conduct', desc: 'Staff behaviour and professional standards', icon: FileText },
            { title: 'Appraisal Policy', desc: 'Annual performance review process', icon: TrendingUp },
            { title: 'Salary Structure', desc: 'Pay grades, allowances and deduction rules', icon: FileText },
          ].map(p => (
            <div key={p.title} className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <p.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{p.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
              </div>
              <Download className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
