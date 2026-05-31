'use client'

import { useState, useMemo } from 'react'
import { Search, Download, Filter, TrendingUp, IndianRupee, CreditCard, Banknote } from 'lucide-react'

type PaymentMode = 'Online' | 'Cash' | 'Cheque' | 'DD'
type PaymentStatus = 'Success' | 'Pending' | 'Failed'

interface Payment {
  id: string
  date: string
  studentName: string
  class: string
  feeType: string
  amount: number
  mode: PaymentMode
  transactionId: string
  receivedBy: string
  status: PaymentStatus
}

const MODE_CONFIG: Record<PaymentMode, { color: string; bg: string; icon: string }> = {
  Online: { color: 'text-blue-700',   bg: 'bg-blue-50',   icon: '💳' },
  Cash:   { color: 'text-green-700',  bg: 'bg-green-50',  icon: '💵' },
  Cheque: { color: 'text-purple-700', bg: 'bg-purple-50', icon: '🏦' },
  DD:     { color: 'text-orange-700', bg: 'bg-orange-50', icon: '📄' },
}

const STATUS_CONFIG: Record<PaymentStatus, { color: string; bg: string }> = {
  Success: { color: 'text-green-700', bg: 'bg-green-50' },
  Pending: { color: 'text-yellow-700', bg: 'bg-yellow-50' },
  Failed:  { color: 'text-red-700',   bg: 'bg-red-50' },
}

const MOCK: Payment[] = [
  { id: '1',  date: '2025-05-31', studentName: 'Aarav Sharma',    class: '10-A', feeType: 'Tuition Fee',  amount: 18000, mode: 'Online', transactionId: 'TXN2025053101', receivedBy: 'System',        status: 'Success' },
  { id: '2',  date: '2025-05-31', studentName: 'Priya Nair',       class: '8-B',  feeType: 'Transport',    amount: 3500,  mode: 'Cash',   transactionId: 'CSH2025053102', receivedBy: 'Mr. Ramesh',    status: 'Success' },
  { id: '3',  date: '2025-05-30', studentName: 'Rohan Mehta',      class: '12-C', feeType: 'Exam Fee',     amount: 1500,  mode: 'Online', transactionId: 'TXN2025053003', receivedBy: 'System',        status: 'Success' },
  { id: '4',  date: '2025-05-30', studentName: 'Kiran Reddy',      class: '9-B',  feeType: 'Hostel Fee',   amount: 8000,  mode: 'Cheque', transactionId: 'CHQ2025053004', receivedBy: 'Ms. Lakshmi',   status: 'Pending' },
  { id: '5',  date: '2025-05-29', studentName: 'Sneha Patel',      class: '6-A',  feeType: 'Tuition Fee',  amount: 14000, mode: 'Online', transactionId: 'TXN2025052905', receivedBy: 'System',        status: 'Success' },
  { id: '6',  date: '2025-05-29', studentName: 'Ananya Singh',     class: '11-A', feeType: 'Library Fee',  amount: 500,   mode: 'Cash',   transactionId: 'CSH2025052906', receivedBy: 'Mr. Ramesh',    status: 'Success' },
  { id: '7',  date: '2025-05-28', studentName: 'Dev Krishnan',     class: '7-C',  feeType: 'Meal Plan',    amount: 2500,  mode: 'DD',     transactionId: 'DD2025052807',  receivedBy: 'Ms. Lakshmi',   status: 'Success' },
  { id: '8',  date: '2025-05-28', studentName: 'Meera Joshi',      class: '5-B',  feeType: 'Activity Fee', amount: 1000,  mode: 'Cash',   transactionId: 'CSH2025052808', receivedBy: 'Mr. Ramesh',    status: 'Success' },
  { id: '9',  date: '2025-05-27', studentName: 'Arjun Verma',      class: '9-A',  feeType: 'Tuition Fee',  amount: 17000, mode: 'Online', transactionId: 'TXN2025052709', receivedBy: 'System',        status: 'Failed'  },
  { id: '10', date: '2025-05-27', studentName: 'Sana Malik',       class: '4-C',  feeType: 'Transport',    amount: 3500,  mode: 'Cash',   transactionId: 'CSH2025052710', receivedBy: 'Ms. Lakshmi',   status: 'Success' },
  { id: '11', date: '2025-05-26', studentName: 'Rahul Gupta',      class: '11-B', feeType: 'Tuition Fee',  amount: 19000, mode: 'Cheque', transactionId: 'CHQ2025052611', receivedBy: 'Mr. Ramesh',    status: 'Success' },
  { id: '12', date: '2025-05-25', studentName: 'Nisha Rao',        class: '3-A',  feeType: 'Lab Fee',      amount: 2000,  mode: 'Online', transactionId: 'TXN2025052512', receivedBy: 'System',        status: 'Success' },
]

export default function PaymentsPage() {
  const [search, setSearch] = useState('')
  const [modeFilter, setModeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const filtered = useMemo(() => MOCK.filter(p => {
    const matchSearch = p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      p.feeType.toLowerCase().includes(search.toLowerCase())
    const matchMode   = modeFilter === 'All' || p.mode === modeFilter
    const matchStatus = statusFilter === 'All' || p.status === statusFilter
    const matchFrom   = !fromDate || p.date >= fromDate
    const matchTo     = !toDate   || p.date <= toDate
    return matchSearch && matchMode && matchStatus && matchFrom && matchTo
  }), [search, modeFilter, statusFilter, fromDate, toDate])

  const today = '2025-05-31'
  const thisWeekStart = '2025-05-25'
  const thisMonthStart = '2025-05-01'
  const todayTotal    = MOCK.filter(p => p.date === today && p.status === 'Success').reduce((s, p) => s + p.amount, 0)
  const weekTotal     = MOCK.filter(p => p.date >= thisWeekStart && p.status === 'Success').reduce((s, p) => s + p.amount, 0)
  const monthTotal    = MOCK.filter(p => p.date >= thisMonthStart && p.status === 'Success').reduce((s, p) => s + p.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Ledger</h1>
          <p className="text-gray-500 text-sm mt-1">Complete payment history and collection tracker.</p>
        </div>
        <button onClick={() => {}} className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#162d4a] transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Today's Collection", value: `₹${(todayTotal / 1000).toFixed(1)}K`, sub: `${MOCK.filter(p => p.date === today).length} transactions`, icon: IndianRupee, color: 'bg-green-50 text-green-600' },
          { label: 'This Week',           value: `₹${(weekTotal  / 1000).toFixed(1)}K`, sub: `${MOCK.filter(p => p.date >= thisWeekStart).length} transactions`, icon: TrendingUp, color: 'bg-blue-50 text-blue-600' },
          { label: 'This Month',          value: `₹${(monthTotal / 1000).toFixed(1)}K`, sub: `${MOCK.filter(p => p.date >= thisMonthStart).length} transactions`, icon: CreditCard, color: 'bg-purple-50 text-purple-600' },
        ].map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Live feed */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <h3 className="text-sm font-semibold text-gray-700">Recent Payments</h3>
        </div>
        <div className="space-y-2">
          {MOCK.slice(0, 5).map(p => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${MODE_CONFIG[p.mode].bg}`}>
                  {MODE_CONFIG[p.mode].icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{p.studentName} <span className="text-gray-400 font-normal">— {p.feeType}</span></p>
                  <p className="text-xs text-gray-400">{p.date} · {p.transactionId}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">₹{p.amount.toLocaleString()}</p>
                <span className={`text-xs font-medium ${STATUS_CONFIG[p.status].color}`}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48 border border-gray-200 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, TXN ID, fee type..." className="flex-1 text-sm outline-none" />
        </div>
        <select value={modeFilter} onChange={e => setModeFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
          <option value="All">All Modes</option>
          {(['Online', 'Cash', 'Cheque', 'DD'] as PaymentMode[]).map(m => <option key={m}>{m}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
          <option value="All">All Status</option>
          {(['Success', 'Pending', 'Failed'] as PaymentStatus[]).map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
          <span className="text-gray-400 text-sm">to</span>
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">{filtered.length} records</span>
          <span className="text-sm text-gray-500">Total: ₹{filtered.filter(p => p.status === 'Success').reduce((s, p) => s + p.amount, 0).toLocaleString()}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Date', 'Student', 'Class', 'Fee Type', 'Amount', 'Mode', 'Transaction ID', 'Received By', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => {
                const modeCfg   = MODE_CONFIG[p.mode]
                const statusCfg = STATUS_CONFIG[p.status]
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{p.date}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{p.studentName}</td>
                    <td className="px-4 py-3 text-gray-500">{p.class}</td>
                    <td className="px-4 py-3 text-gray-600">{p.feeType}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">₹{p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${modeCfg.bg} ${modeCfg.color}`}>{p.mode}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.transactionId}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.receivedBy}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.bg} ${statusCfg.color}`}>{p.status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
