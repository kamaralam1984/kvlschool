'use client'

import React, { useState } from 'react'
import {
  CreditCard, TrendingUp, TrendingDown, DollarSign, AlertCircle,
  Search, Filter, Download, Plus, Eye, CheckCircle, Clock, XCircle,
  ChevronLeft, ChevronRight, Banknote, Receipt, PieChart
} from 'lucide-react'
import { cn } from '@/lib/utils'

const STATS = [
  { label: 'Total Collected', value: '₹1.24 Cr', icon: Banknote, color: 'bg-green-500', change: '+8.2% vs last month', trend: 'up' },
  { label: 'Pending Fees', value: '₹18.6 L', icon: Clock, color: 'bg-yellow-400', change: '143 students', trend: 'neutral' },
  { label: 'Overdue', value: '₹4.2 L', icon: AlertCircle, color: 'bg-red-400', change: '38 students', trend: 'down' },
  { label: 'This Month', value: '₹32.4 L', icon: TrendingUp, color: 'bg-blue-500', change: '+12% vs Apr', trend: 'up' },
]

const FEE_STRUCTURE = [
  { category: 'Tuition Fee', amount: 45000, frequency: 'Annual', classes: 'All', collected: '₹84.6 L' },
  { category: 'Transport Fee', amount: 12000, frequency: 'Annual', classes: 'Optional', collected: '₹22.8 L' },
  { category: 'Hostel Fee', amount: 60000, frequency: 'Annual', classes: 'Optional', collected: '₹36.0 L' },
  { category: 'Lab Fee', amount: 2500, frequency: 'Annual', classes: 'IX-XII', collected: '₹3.5 L' },
  { category: 'Activity Fee', amount: 1500, frequency: 'Annual', classes: 'All', collected: '₹5.2 L' },
  { category: 'Library Fee', amount: 800, frequency: 'Annual', classes: 'All', collected: '₹2.8 L' },
]

const TRANSACTIONS = [
  { id: 'TXN001', student: 'Aisha Khan', class: 'X-A', amount: 45000, type: 'Tuition', date: '2026-05-30', method: 'Online', status: 'Success' },
  { id: 'TXN002', student: 'Priya Sharma', class: 'XI-A', amount: 12000, type: 'Transport', date: '2026-05-30', method: 'Cash', status: 'Success' },
  { id: 'TXN003', student: 'Rohan Mehta', class: 'IX-B', amount: 45000, type: 'Tuition', date: '2026-05-29', method: 'Cheque', status: 'Pending' },
  { id: 'TXN004', student: 'Fatima Ansari', class: 'XII-B', amount: 60000, type: 'Hostel', date: '2026-05-29', method: 'Online', status: 'Success' },
  { id: 'TXN005', student: 'Arjun Patel', class: 'VIII-C', amount: 45000, type: 'Tuition', date: '2026-05-28', method: 'Online', status: 'Failed' },
  { id: 'TXN006', student: 'Sneha Reddy', class: 'XI-C', amount: 2500, type: 'Lab', date: '2026-05-28', method: 'Online', status: 'Success' },
]

const methodColor: Record<string, string> = {
  Online: 'bg-blue-100 text-blue-700',
  Cash: 'bg-green-100 text-green-700',
  Cheque: 'bg-purple-100 text-purple-700',
}

const statusColor: Record<string, string> = {
  Success: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Failed: 'bg-red-100 text-red-700',
}

const StatusIcon = ({ s }: { s: string }) => {
  if (s === 'Success') return <CheckCircle className="w-3.5 h-3.5 text-green-500" />
  if (s === 'Pending') return <Clock className="w-3.5 h-3.5 text-yellow-500" />
  return <XCircle className="w-3.5 h-3.5 text-red-500" />
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'structure' | 'reports'>('transactions')
  const [search, setSearch] = useState('')

  const filtered = TRANSACTIONS.filter(t =>
    t.student.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
          <p className="text-sm text-gray-500 mt-0.5">Fee collection, invoices and financial reports</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus className="w-4 h-4" /> Collect Fee
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', s.color)}>
                <s.icon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
              </div>
              {s.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
              {s.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
            </div>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Monthly Collection Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Monthly Collection (2026)</h2>
        <div className="flex items-end gap-2 h-36">
          {[
            { m: 'Jan', v: 68 }, { m: 'Feb', v: 72 }, { m: 'Mar', v: 85 },
            { m: 'Apr', v: 78 }, { m: 'May', v: 92 }, { m: 'Jun', v: 45 },
          ].map(({ m, v }) => (
            <div key={m} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500 font-medium">₹{v}L</span>
              <div className={cn('w-full rounded-t-md', m === 'May' ? 'bg-green-500' : 'bg-blue-200')} style={{ height: `${v}%` }} />
              <span className="text-xs text-gray-400">{m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['transactions', 'structure', 'reports'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-1.5 text-sm rounded-md capitalize transition-all', activeTab === tab ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700')}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'transactions' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['TXN ID', 'Student', 'Amount', 'Fee Type', 'Date', 'Method', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{t.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{t.student}</p>
                      <p className="text-xs text-gray-400">{t.class}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">₹{t.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">{t.type}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{t.date}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', methodColor[t.method])}>{t.method}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('flex items-center gap-1 w-fit px-2 py-1 rounded-full text-xs font-medium', statusColor[t.status])}>
                        <StatusIcon s={t.status} />{t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <Eye className="w-3 h-3" /> Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'structure' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Fee Structure</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Category', 'Amount', 'Frequency', 'Applicable Classes', 'Collected', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {FEE_STRUCTURE.map(f => (
                  <tr key={f.category} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{f.category}</td>
                    <td className="px-4 py-3 font-semibold text-green-700">₹{f.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500">{f.frequency}</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{f.classes}</span></td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{f.collected}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="text-xs text-blue-600 hover:underline">Edit</button>
                      <button className="text-xs text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Collection Summary', desc: 'Monthly and annual fee collection report', icon: Receipt },
            { title: 'Outstanding Fees', desc: 'List of students with pending/overdue fees', icon: AlertCircle },
            { title: 'Payment Methods', desc: 'Breakdown by cash, online, cheque', icon: PieChart },
            { title: 'Scholarship Report', desc: 'Scholarships granted and amounts', icon: DollarSign },
          ].map(r => (
            <div key={r.title} className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <r.icon className="w-5 h-5 text-green-600" />
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
