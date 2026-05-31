'use client'

import React, { useState } from 'react'
import {
  Users, Phone, Mail, Search, Plus, Download, Eye, Edit,
  MessageSquare, ChevronLeft, ChevronRight, UserCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PARENTS = [
  { id: 'PAR001', name: 'Mr. Salim Khan', children: ['Aisha Khan (X-A)'], phone: '9876543210', email: 's.khan@email.com', occupation: 'Business', fees: 'Paid', lastLogin: '2026-05-30', avatar: 'SK' },
  { id: 'PAR002', name: 'Mrs. Sunita Mehta', children: ['Rohan Mehta (IX-B)'], phone: '9123456780', email: 'sunita.m@email.com', occupation: 'Teacher', fees: 'Pending', lastLogin: '2026-05-28', avatar: 'SM' },
  { id: 'PAR003', name: 'Mr. Rakesh Sharma', children: ['Priya Sharma (XI-A)', 'Kunal Sharma (VII-B)'], phone: '9988776655', email: 'r.sharma@email.com', occupation: 'Engineer', fees: 'Paid', lastLogin: '2026-05-31', avatar: 'RS' },
  { id: 'PAR004', name: 'Mrs. Kanchan Patel', children: ['Arjun Patel (VIII-C)'], phone: '9765432109', email: 'k.patel@email.com', occupation: 'Homemaker', fees: 'Overdue', lastLogin: '2026-05-15', avatar: 'KP' },
  { id: 'PAR005', name: 'Mr. Tariq Ansari', children: ['Fatima Ansari (XII-B)'], phone: '9654321098', email: 't.ansari@email.com', occupation: 'Doctor', fees: 'Paid', lastLogin: '2026-05-29', avatar: 'TA' },
  { id: 'PAR006', name: 'Mrs. Lalitha Reddy', children: ['Sneha Reddy (XI-C)'], phone: '9543210987', email: 'l.reddy@email.com', occupation: 'Lawyer', fees: 'Paid', lastLogin: '2026-05-30', avatar: 'LR' },
]

const feeColor: Record<string, string> = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Overdue: 'bg-red-100 text-red-700',
}

export default function ParentsPage() {
  const [search, setSearch] = useState('')

  const filtered = PARENTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.children.some(c => c.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parents</h1>
          <p className="text-sm text-gray-500 mt-0.5">Parent directory and communication</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <MessageSquare className="w-4 h-4" /> Broadcast Message
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Parents', value: '3,842', icon: Users, color: 'bg-blue-500', sub: 'registered families' },
          { label: 'App Installed', value: '2,916', icon: UserCheck, color: 'bg-green-500', sub: '75.9% adoption' },
          { label: 'Fee Defaulters', value: '143', icon: Users, color: 'bg-red-400', sub: 'need follow-up' },
          { label: 'Messages Today', value: '47', icon: MessageSquare, color: 'bg-purple-500', sub: 'via app & SMS' },
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

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by parent name, ID or child name..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Parent', 'Children', 'Contact', 'Occupation', 'Fee Status', 'Last Active', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                        {p.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      {p.children.map(c => (
                        <p key={c} className="text-xs text-gray-600">{c}</p>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-xs text-gray-500"><Phone className="w-3 h-3" />{p.phone}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500"><Mail className="w-3 h-3" />{p.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm">{p.occupation}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', feeColor[p.fees])}>{p.fees}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{p.lastLogin}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                      <button className="p-1 hover:bg-green-50 rounded text-gray-400 hover:text-green-600"><MessageSquare className="w-4 h-4" /></button>
                      <button className="p-1 hover:bg-yellow-50 rounded text-gray-400 hover:text-yellow-600"><Edit className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between text-sm text-gray-500">
          <span>Showing {filtered.length} of 3,842 parents</span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-gray-100"><ChevronLeft className="w-4 h-4" /></button>
            {[1, 2, 3, '...', 39].map((p, i) => (
              <button key={i} className={cn('w-8 h-8 rounded text-xs', p === 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100')}>{p}</button>
            ))}
            <button className="p-1 rounded hover:bg-gray-100"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
