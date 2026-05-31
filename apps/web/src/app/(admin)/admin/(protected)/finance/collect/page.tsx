'use client'
import React, { useState } from 'react'
import { Search, CreditCard, CheckCircle2, Clock, AlertCircle, IndianRupee, X, Loader2 } from 'lucide-react'

interface FeeRecord {
  id: string; studentName: string; rollNo: string; class: string;
  feeType: string; amount: number; dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue'; paidDate?: string; txnId?: string;
}

const MOCK_FEES: FeeRecord[] = [
  { id: '1', studentName: 'Aarav Sharma', rollNo: 'KVL-2024-001', class: '10-A', feeType: 'Tuition Fee', amount: 18500, dueDate: '2025-01-10', status: 'Paid', paidDate: '2025-01-08', txnId: 'TXN-8821' },
  { id: '2', studentName: 'Priya Singh', rollNo: 'KVL-2024-002', class: '10-B', feeType: 'Tuition Fee', amount: 18500, dueDate: '2025-01-10', status: 'Pending' },
  { id: '3', studentName: 'Ananya Gupta', rollNo: 'KVL-2024-004', class: '11-A', feeType: 'Hostel Fee', amount: 12000, dueDate: '2024-12-31', status: 'Overdue' },
  { id: '4', studentName: 'Rohan Verma', rollNo: 'KVL-2024-003', class: '9-A', feeType: 'Transport Fee', amount: 4500, dueDate: '2025-01-10', status: 'Pending' },
  { id: '5', studentName: 'Kavya Patel', rollNo: 'KVL-2024-006', class: '12-B', feeType: 'Exam Fee', amount: 1200, dueDate: '2025-01-15', status: 'Paid', paidDate: '2025-01-10', txnId: 'TXN-9931' },
  { id: '6', studentName: 'Dev Agarwal', rollNo: 'KVL-2024-007', class: '7-A', feeType: 'Library Fee', amount: 800, dueDate: '2024-12-20', status: 'Overdue' },
]

const statusIcon: Record<string, React.ReactNode> = {
  Paid: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  Pending: <Clock className="w-4 h-4 text-yellow-500" />,
  Overdue: <AlertCircle className="w-4 h-4 text-red-500" />,
}
const statusStyle: Record<string, string> = {
  Paid: 'bg-green-50 text-green-700 border-green-200',
  Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Overdue: 'bg-red-50 text-red-700 border-red-200',
}

declare global { interface Window { Razorpay: any } }

export default function FeeCollectPage() {
  const [fees, setFees] = useState<FeeRecord[]>(MOCK_FEES)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'All' | 'Paid' | 'Pending' | 'Overdue'>('All')
  const [paying, setPaying] = useState<FeeRecord | null>(null)
  const [processing, setProcessing] = useState(false)

  const filtered = fees.filter(f => {
    const matchSearch = f.studentName.toLowerCase().includes(search.toLowerCase()) ||
      f.rollNo.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || f.status === filter
    return matchSearch && matchFilter
  })

  const totals = {
    collected: fees.filter(f => f.status === 'Paid').reduce((s, f) => s + f.amount, 0),
    pending: fees.filter(f => f.status === 'Pending').reduce((s, f) => s + f.amount, 0),
    overdue: fees.filter(f => f.status === 'Overdue').reduce((s, f) => s + f.amount, 0),
  }

  function loadRazorpay(): Promise<boolean> {
    return new Promise(resolve => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  async function handlePay(fee: FeeRecord) {
    setProcessing(true)
    const loaded = await loadRazorpay()
    setProcessing(false)
    if (!loaded) { alert('Failed to load payment gateway. Check internet connection.'); return }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? 'rzp_test_placeholder',
      amount: fee.amount * 100,
      currency: 'INR',
      name: 'KVL International School',
      description: `${fee.feeType} — ${fee.studentName}`,
      image: '/logo.png',
      handler: (response: any) => {
        const txnId = response.razorpay_payment_id ?? `TXN-${Date.now()}`
        setFees(prev => prev.map(f =>
          f.id === fee.id
            ? { ...f, status: 'Paid', paidDate: new Date().toISOString().slice(0, 10), txnId }
            : f
        ))
        setPaying(null)
        alert(`Payment successful!\nTransaction ID: ${txnId}`)
      },
      prefill: { name: fee.studentName, email: '', contact: '' },
      theme: { color: '#1e3a5f' },
      modal: { ondismiss: () => setPaying(null) },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
    setPaying(fee)
  }

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Collection</h1>
          <p className="text-gray-500 text-sm mt-1">Collect fees via Razorpay</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Collected', value: totals.collected, color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 },
          { label: 'Pending', value: totals.pending, color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock },
          { label: 'Overdue', value: totals.overdue, color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle },
        ].map(c => (
          <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-3`}>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </div>
            <p className="text-xl font-bold text-gray-900">{fmt(c.value)}</p>
            <p className="text-sm text-gray-500 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search student name or roll no…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
        </div>
        <div className="flex gap-2">
          {(['All', 'Paid', 'Pending', 'Overdue'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === s ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Fee Records Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Student', 'Class', 'Fee Type', 'Amount', 'Due Date', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(f => (
                <tr key={f.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">{f.studentName}</p>
                    <p className="text-xs text-gray-400 font-mono">{f.rollNo}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{f.class}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{f.feeType}</td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-gray-900 flex items-center gap-0.5">
                      <IndianRupee className="w-3.5 h-3.5" />{f.amount.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{f.dueDate}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle[f.status]}`}>
                      {statusIcon[f.status]}{f.status}
                    </span>
                    {f.txnId && <p className="text-xs text-gray-400 mt-0.5 font-mono">{f.txnId}</p>}
                  </td>
                  <td className="px-5 py-4">
                    {f.status !== 'Paid' ? (
                      <button onClick={() => handlePay(f)} disabled={processing}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#1e3a5f] text-white rounded-xl text-xs font-medium hover:bg-[#163050] transition-colors disabled:opacity-50">
                        {processing ? <Loader2 className="w-3 h-3 animate-spin" /> : <CreditCard className="w-3 h-3" />}
                        Pay Now
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Paid on {f.paidDate}</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
