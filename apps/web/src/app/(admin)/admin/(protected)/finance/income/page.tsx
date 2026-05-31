'use client'
import React, { useState, useMemo } from 'react'
import { Search, Plus, X, ChevronDown, TrendingUp, Download } from 'lucide-react'

interface IncomeEntry {
  id: string
  date: string
  source: 'Tuition' | 'Hostel' | 'Transport' | 'Exam' | 'Other'
  amount: number
  receivedFrom: string
  paymentMode: 'Cash' | 'Online' | 'Cheque'
  referenceNo: string
  recordedBy: string
}

const MOCK: IncomeEntry[] = [
  { id: '1', date: '2025-05-30', source: 'Tuition', amount: 182000, receivedFrom: 'Class 10A Parents', paymentMode: 'Online', referenceNo: 'TXN-2025-0541', recordedBy: 'Mrs. Gupta' },
  { id: '2', date: '2025-05-28', source: 'Transport', amount: 56500, receivedFrom: 'Route 3 Students', paymentMode: 'Online', referenceNo: 'TXN-2025-0538', recordedBy: 'Mr. Sharma' },
  { id: '3', date: '2025-05-26', source: 'Hostel', amount: 240000, receivedFrom: 'Class 11 & 12 Boarders', paymentMode: 'Cheque', referenceNo: 'CHQ-004521', recordedBy: 'Mrs. Gupta' },
  { id: '4', date: '2025-05-24', source: 'Exam', amount: 92000, receivedFrom: 'Annual Exam Fees', paymentMode: 'Online', referenceNo: 'TXN-2025-0519', recordedBy: 'Mr. Patel' },
  { id: '5', date: '2025-05-22', source: 'Tuition', amount: 165000, receivedFrom: 'Class 9B Parents', paymentMode: 'Cash', referenceNo: 'CASH-0091', recordedBy: 'Mrs. Gupta' },
  { id: '6', date: '2025-05-20', source: 'Other', amount: 28000, receivedFrom: 'Canteen Vendor Rental', paymentMode: 'Cheque', referenceNo: 'CHQ-004498', recordedBy: 'Mr. Verma' },
  { id: '7', date: '2025-05-18', source: 'Tuition', amount: 195000, receivedFrom: 'Class 12A Parents', paymentMode: 'Online', referenceNo: 'TXN-2025-0504', recordedBy: 'Mrs. Gupta' },
  { id: '8', date: '2025-05-15', source: 'Transport', amount: 48000, receivedFrom: 'Route 1 Students', paymentMode: 'Cash', referenceNo: 'CASH-0089', recordedBy: 'Mr. Sharma' },
  { id: '9', date: '2025-05-12', source: 'Hostel', amount: 185000, receivedFrom: 'Class 9 & 10 Boarders', paymentMode: 'Online', referenceNo: 'TXN-2025-0487', recordedBy: 'Mr. Patel' },
  { id: '10', date: '2025-05-08', source: 'Exam', amount: 35000, receivedFrom: 'Unit Test Fees', paymentMode: 'Cash', referenceNo: 'CASH-0082', recordedBy: 'Mrs. Gupta' },
]

const SOURCES = ['All', 'Tuition', 'Hostel', 'Transport', 'Exam', 'Other']
const MONTHS = ['All', 'May 2025', 'April 2025', 'March 2025']
const PAYMENT_MODES = ['All', 'Cash', 'Online', 'Cheque']

const sourceColor: Record<string, string> = {
  Tuition: 'bg-blue-100 text-blue-700',
  Hostel: 'bg-purple-100 text-purple-700',
  Transport: 'bg-yellow-100 text-yellow-700',
  Exam: 'bg-orange-100 text-orange-700',
  Other: 'bg-gray-100 text-gray-600',
}
const modeColor: Record<string, string> = {
  Cash: 'bg-green-100 text-green-700',
  Online: 'bg-blue-100 text-blue-700',
  Cheque: 'bg-pink-100 text-pink-700',
}

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  source: 'Tuition' as IncomeEntry['source'],
  amount: 0, receivedFrom: '',
  paymentMode: 'Online' as IncomeEntry['paymentMode'],
  referenceNo: '', recordedBy: '',
}

export default function IncomePage() {
  const [entries, setEntries] = useState<IncomeEntry[]>(MOCK)
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [monthFilter, setMonthFilter] = useState('All')
  const [modeFilter, setModeFilter] = useState('All')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })

  const filtered = useMemo(() => entries.filter(e => {
    const matchSearch = e.receivedFrom.toLowerCase().includes(search.toLowerCase()) ||
      e.referenceNo.toLowerCase().includes(search.toLowerCase())
    const matchSource = sourceFilter === 'All' || e.source === sourceFilter
    const matchMode = modeFilter === 'All' || e.paymentMode === modeFilter
    return matchSearch && matchSource && matchMode
  }), [entries, search, sourceFilter, monthFilter, modeFilter])

  const monthlyTotal = filtered.reduce((s, e) => s + e.amount, 0)

  function handleSave() {
    setEntries(prev => [{
      id: String(Date.now()), ...form,
    }, ...prev])
    setModal(false)
    setForm({ ...emptyForm })
  }

  function exportCSV() {
    const headers = ['Date', 'Source', 'Amount', 'Received From', 'Payment Mode', 'Reference No', 'Recorded By']
    const rows = filtered.map(e => [e.date, e.source, e.amount, e.receivedFrom, e.paymentMode, e.referenceNo, e.recordedBy])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'income.csv'; a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income Tracker</h1>
          <p className="text-gray-500 text-sm mt-1">{entries.length} entries · May 2025</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => setModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
            <Plus className="w-4 h-4" /> Add Income
          </button>
        </div>
      </div>

      {/* Monthly Total */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Income (filtered)</p>
          <p className="text-3xl font-bold text-gray-900">₹{monthlyTotal.toLocaleString('en-IN')}</p>
        </div>
        <div className="ml-auto grid grid-cols-2 gap-3 text-right">
          {['Tuition', 'Hostel', 'Transport', 'Exam'].map(src => {
            const total = filtered.filter(e => e.source === src).reduce((s, e) => s + e.amount, 0)
            return total > 0 ? (
              <div key={src} className="text-sm">
                <p className="text-gray-400 text-xs">{src}</p>
                <p className="font-semibold text-gray-700">₹{total.toLocaleString('en-IN')}</p>
              </div>
            ) : null
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by payer or reference…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
          </div>
          {[
            { label: 'Source', val: sourceFilter, set: setSourceFilter, opts: SOURCES },
            { label: 'Month', val: monthFilter, set: setMonthFilter, opts: MONTHS },
            { label: 'Mode', val: modeFilter, set: setModeFilter, opts: PAYMENT_MODES },
          ].map(f => (
            <div key={f.label} className="relative">
              <select value={f.val} onChange={e => f.set(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#1e3a5f]/40 bg-white cursor-pointer">
                {f.opts.map(o => <option key={o} value={o}>{f.label}: {o}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Date', 'Source', 'Amount', 'Received From', 'Payment Mode', 'Reference No', 'Recorded By'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{e.date}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sourceColor[e.source]}`}>{e.source}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-bold text-green-700">₹{e.amount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">{e.receivedFrom}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${modeColor[e.paymentMode]}`}>{e.paymentMode}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-mono text-gray-500">{e.referenceNo}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{e.recordedBy}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">No income entries match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add Income Entry</h2>
              <button onClick={() => setModal(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Source</label>
                <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value as IncomeEntry['source'] }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 bg-white">
                  {SOURCES.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Amount (₹)</label>
                <input type="number" min={0} value={form.amount} onChange={e => setForm(p => ({ ...p, amount: Number(e.target.value) }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Payment Mode</label>
                <select value={form.paymentMode} onChange={e => setForm(p => ({ ...p, paymentMode: e.target.value as IncomeEntry['paymentMode'] }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 bg-white">
                  {PAYMENT_MODES.slice(1).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Received From</label>
                <input type="text" value={form.receivedFrom} onChange={e => setForm(p => ({ ...p, receivedFrom: e.target.value }))}
                  placeholder="e.g., Class 10A Parents"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Reference No</label>
                <input type="text" value={form.referenceNo} onChange={e => setForm(p => ({ ...p, referenceNo: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Recorded By</label>
                <input type="text" value={form.recordedBy} onChange={e => setForm(p => ({ ...p, recordedBy: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] transition-colors">Add Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
