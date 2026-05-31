'use client'
import React, { useState, useMemo } from 'react'
import { Search, Plus, X, ChevronDown, TrendingDown, Download } from 'lucide-react'

interface ExpenseEntry {
  id: string
  date: string
  category: 'Salary' | 'Utilities' | 'Maintenance' | 'Supplies' | 'Events' | 'Other'
  description: string
  amount: number
  vendor: string
  approvedBy: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

const MOCK: ExpenseEntry[] = [
  { id: '1', date: '2025-05-29', category: 'Salary', description: 'Staff Salary – May 2025', amount: 485000, vendor: 'Internal', approvedBy: 'Principal', status: 'Approved' },
  { id: '2', date: '2025-05-27', category: 'Utilities', description: 'Electricity Bill – May 2025', amount: 38200, vendor: 'UP State Electricity', approvedBy: 'Admin Head', status: 'Approved' },
  { id: '3', date: '2025-05-25', category: 'Supplies', description: 'Lab Equipment – Science Block', amount: 75000, vendor: 'EduLab Pvt. Ltd.', approvedBy: 'Vice Principal', status: 'Approved' },
  { id: '4', date: '2025-05-23', category: 'Events', description: 'Annual Day Decoration & AV Setup', amount: 120000, vendor: 'EventMakers Co.', approvedBy: 'Principal', status: 'Approved' },
  { id: '5', date: '2025-05-21', category: 'Maintenance', description: 'Building Repair – Block C Roof', amount: 45000, vendor: 'Sharma Contractors', approvedBy: 'Admin Head', status: 'Approved' },
  { id: '6', date: '2025-05-19', category: 'Utilities', description: 'Water & Sewage Bill – May', amount: 12500, vendor: 'Lucknow Jal Sansthan', approvedBy: 'Admin Head', status: 'Approved' },
  { id: '7', date: '2025-05-17', category: 'Supplies', description: 'Stationery & Printing Materials', amount: 22000, vendor: 'Paper World', approvedBy: '', status: 'Pending' },
  { id: '8', date: '2025-05-15', category: 'Maintenance', description: 'Generator Fuel & Servicing', amount: 18500, vendor: 'Fuel Express', approvedBy: '', status: 'Pending' },
  { id: '9', date: '2025-05-12', category: 'Events', description: 'Sports Day Equipment Purchase', amount: 35000, vendor: 'Sports Hub', approvedBy: '', status: 'Rejected' },
  { id: '10', date: '2025-05-08', category: 'Other', description: 'Miscellaneous Admin Expenses', amount: 9800, vendor: 'Various', approvedBy: 'Admin Head', status: 'Approved' },
]

const BUDGET_DATA = [
  { category: 'Salary', budget: 550000, spent: 485000 },
  { category: 'Utilities', budget: 60000, spent: 50700 },
  { category: 'Maintenance', budget: 80000, spent: 63500 },
  { category: 'Supplies', budget: 100000, spent: 97000 },
  { category: 'Events', budget: 200000, spent: 155000 },
  { category: 'Other', budget: 30000, spent: 9800 },
]

const CATEGORIES = ['All', 'Salary', 'Utilities', 'Maintenance', 'Supplies', 'Events', 'Other']
const STATUSES = ['All', 'Pending', 'Approved', 'Rejected']
const MONTHS = ['All', 'May 2025', 'April 2025', 'March 2025']

const statusColor: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
}
const categoryColor: Record<string, string> = {
  Salary: 'bg-blue-100 text-blue-700',
  Utilities: 'bg-yellow-100 text-yellow-700',
  Maintenance: 'bg-orange-100 text-orange-700',
  Supplies: 'bg-purple-100 text-purple-700',
  Events: 'bg-pink-100 text-pink-700',
  Other: 'bg-gray-100 text-gray-600',
}

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  category: 'Supplies' as ExpenseEntry['category'],
  description: '', amount: 0, vendor: '',
  approvedBy: '', status: 'Pending' as ExpenseEntry['status'],
}

export default function ExpensesPage() {
  const [entries, setEntries] = useState<ExpenseEntry[]>(MOCK)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [monthFilter, setMonthFilter] = useState('All')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })

  const filtered = useMemo(() => entries.filter(e => {
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.vendor.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'All' || e.category === catFilter
    const matchStatus = statusFilter === 'All' || e.status === statusFilter
    return matchSearch && matchCat && matchStatus
  }), [entries, search, catFilter, statusFilter, monthFilter])

  const monthlyTotal = filtered.reduce((s, e) => s + e.amount, 0)

  function handleSave() {
    setEntries(prev => [{ id: String(Date.now()), ...form }, ...prev])
    setModal(false)
    setForm({ ...emptyForm })
  }

  function approve(id: string) {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status: 'Approved', approvedBy: 'Admin Head' } : e))
  }
  function reject(id: string) {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status: 'Rejected' } : e))
  }

  function exportCSV() {
    const headers = ['Date', 'Category', 'Description', 'Amount', 'Vendor', 'Approved By', 'Status']
    const rows = filtered.map(e => [e.date, e.category, e.description, e.amount, e.vendor, e.approvedBy, e.status])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'expenses.csv'; a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="text-gray-500 text-sm mt-1">{entries.length} entries · May 2025</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => setModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      {/* Monthly Total */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0">
          <TrendingDown className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Expenses (filtered)</p>
          <p className="text-3xl font-bold text-gray-900">₹{monthlyTotal.toLocaleString('en-IN')}</p>
        </div>
        <div className="ml-auto flex gap-3 text-sm">
          <div className="text-center">
            <p className="text-xs text-gray-400">Approved</p>
            <p className="font-bold text-green-600">{filtered.filter(e => e.status === 'Approved').length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Pending</p>
            <p className="font-bold text-yellow-600">{filtered.filter(e => e.status === 'Pending').length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Rejected</p>
            <p className="font-bold text-red-500">{filtered.filter(e => e.status === 'Rejected').length}</p>
          </div>
        </div>
      </div>

      {/* Budget vs Actual */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Budget vs Actual (May 2025)</h3>
        <div className="space-y-3">
          {BUDGET_DATA.map(b => {
            const pct = Math.round((b.spent / b.budget) * 100)
            const over = pct > 90
            return (
              <div key={b.category}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span className="font-medium">{b.category}</span>
                  <span>₹{b.spent.toLocaleString('en-IN')} / ₹{b.budget.toLocaleString('en-IN')} <span className={`font-semibold ${over ? 'text-red-500' : 'text-gray-500'}`}>({pct}%)</span></span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${over ? 'bg-red-400' : 'bg-[#1e3a5f]'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by description or vendor…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
          </div>
          {[
            { label: 'Category', val: catFilter, set: setCatFilter, opts: CATEGORIES },
            { label: 'Status', val: statusFilter, set: setStatusFilter, opts: STATUSES },
            { label: 'Month', val: monthFilter, set: setMonthFilter, opts: MONTHS },
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
                {['Date', 'Category', 'Description', 'Amount', 'Vendor', 'Approved By', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{e.date}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryColor[e.category]}`}>{e.category}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-800 max-w-[200px] truncate" title={e.description}>{e.description}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-red-600">₹{e.amount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{e.vendor}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{e.approvedBy || <span className="text-gray-300">—</span>}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[e.status]}`}>{e.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {e.status === 'Pending' && (
                      <div className="flex gap-1">
                        <button onClick={() => approve(e.id)}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors font-medium">Approve</button>
                        <button onClick={() => reject(e.id)}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400">No expense entries match your filters.</td></tr>
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
              <h2 className="text-lg font-bold text-gray-900">Add Expense Entry</h2>
              <button onClick={() => setModal(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as ExpenseEntry['category'] }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 bg-white">
                  {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <input type="text" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of expense"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Amount (₹)</label>
                <input type="number" min={0} value={form.amount} onChange={e => setForm(p => ({ ...p, amount: Number(e.target.value) }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Vendor</label>
                <input type="text" value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Approved By</label>
                <input type="text" value={form.approvedBy} onChange={e => setForm(p => ({ ...p, approvedBy: e.target.value }))}
                  placeholder="Leave blank if pending"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as ExpenseEntry['status'] }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 bg-white">
                  {STATUSES.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] transition-colors">Add Expense</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
