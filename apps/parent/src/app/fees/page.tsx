'use client'

import React, { useState } from 'react'
import ParentShell from '@/components/ParentShell'
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  Wallet,
  TrendingUp,
  ChevronRight,
} from 'lucide-react'

// ─── Mock Data ────────────────────────────────────────────

const PENDING_FEES = [
  {
    id: 'fee-001',
    type: 'Tuition Fee',
    description: 'Q2 Tuition — Class 10-A (Jan–Mar 2026)',
    amount: 18500,
    dueDate: 'Jan 31, 2026',
    overdue: true,
    category: 'Academic',
  },
  {
    id: 'fee-002',
    type: 'Hostel Fee',
    description: 'Term 2 Hostel — Dormitory Block B',
    amount: 12000,
    dueDate: 'Feb 15, 2026',
    overdue: false,
    category: 'Hostel',
  },
  {
    id: 'fee-003',
    type: 'Transport Fee',
    description: 'Route 4B — Jan to Mar 2026',
    amount: 4500,
    dueDate: 'Feb 15, 2026',
    overdue: false,
    category: 'Transport',
  },
]

const PAYMENT_HISTORY = [
  { id: 'TXN-7821', date: 'Oct 15, 2025', amount: 18500, type: 'Tuition Fee', txnId: 'pay_RZ7821abc', status: 'Success' },
  { id: 'TXN-6543', date: 'Oct 15, 2025', amount: 12000, type: 'Hostel Fee', txnId: 'pay_RZ6543xyz', status: 'Success' },
  { id: 'TXN-5210', date: 'Oct 12, 2025', amount: 4500, type: 'Transport Fee', txnId: 'pay_RZ5210mno', status: 'Success' },
  { id: 'TXN-4100', date: 'Jul 8, 2025', amount: 18500, type: 'Tuition Fee', txnId: 'pay_RZ4100pqr', status: 'Success' },
  { id: 'TXN-3890', date: 'Jul 8, 2025', amount: 12000, type: 'Hostel Fee', txnId: 'pay_RZ3890stu', status: 'Success' },
]

const ANNUAL_SUMMARY = {
  totalDue: 105000,
  totalPaid: 70000,
}

function formatINR(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

function PayNowButton({ amount, label }: { amount: number; label: string }) {
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)

  const handlePay = () => {
    setLoading(true)
    // Razorpay integration stub
    // In production: load Razorpay script, open checkout modal
    setTimeout(() => {
      setLoading(false)
      setPaid(true)
    }, 1800)
  }

  if (paid) {
    return (
      <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
        <CheckCircle2 className="w-4 h-4" /> Paid
      </span>
    )
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Processing…
        </span>
      ) : (
        <>
          <CreditCard className="w-3.5 h-3.5" />
          Pay {formatINR(amount)}
        </>
      )}
    </button>
  )
}

export default function FeesPage() {
  const [payingAll, setPayingAll] = useState(false)
  const [allPaid, setAllPaid] = useState(false)
  const totalPending = PENDING_FEES.reduce((s, f) => s + f.amount, 0)
  const paidPercent = Math.round((ANNUAL_SUMMARY.totalPaid / ANNUAL_SUMMARY.totalDue) * 100)

  const handlePayAll = () => {
    setPayingAll(true)
    setTimeout(() => {
      setPayingAll(false)
      setAllPaid(true)
    }, 2000)
  }

  return (
    <ParentShell>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Fee Payment</h1>
          <p className="text-stone-500 text-sm mt-1">Aarav Sharma · Class 10-A · Academic Year 2025–26</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
          <Wallet className="w-4 h-4 text-amber-600" />
          <div>
            <p className="text-xs text-amber-700 font-medium">Total Pending</p>
            <p className="text-sm font-bold text-stone-900">{formatINR(totalPending)}</p>
          </div>
        </div>
      </div>

      {/* Annual Summary Progress */}
      <div className="bg-white rounded-2xl border border-amber-100 p-5 mb-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-bold text-stone-900">Annual Fee Summary</h2>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-stone-500">Paid: <span className="font-semibold text-green-600">{formatINR(ANNUAL_SUMMARY.totalPaid)}</span></span>
          <span className="text-xs text-stone-500">Total: <span className="font-semibold text-stone-900">{formatINR(ANNUAL_SUMMARY.totalDue)}</span></span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-green-500 rounded-full transition-all duration-700"
            style={{ width: `${paidPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-stone-400">{paidPercent}% of annual fees paid</span>
          <span className="text-xs font-semibold text-red-500">
            Remaining: {formatINR(ANNUAL_SUMMARY.totalDue - ANNUAL_SUMMARY.totalPaid)}
          </span>
        </div>
      </div>

      {/* Pending Fees */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm mb-5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-50">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" /> Pending Fees
          </h2>
          {!allPaid && (
            <button
              onClick={handlePayAll}
              disabled={payingAll}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
            >
              {payingAll ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Processing…
                </>
              ) : (
                <>Pay All — {formatINR(totalPending)} <ChevronRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          )}
          {allPaid && (
            <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" /> All fees paid!
            </span>
          )}
        </div>

        <div className="divide-y divide-stone-50">
          {PENDING_FEES.map((fee) => (
            <div key={fee.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  fee.category === 'Academic' ? 'bg-blue-50' :
                  fee.category === 'Hostel' ? 'bg-purple-50' : 'bg-green-50'
                }`}>
                  <CreditCard className={`w-5 h-5 ${
                    fee.category === 'Academic' ? 'text-blue-500' :
                    fee.category === 'Hostel' ? 'text-purple-500' : 'text-green-500'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-stone-900">{fee.type}</p>
                    {fee.overdue && (
                      <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">Overdue</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{fee.description}</p>
                  <p className="text-xs text-stone-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> Due: {fee.dueDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <p className="text-base font-bold text-stone-900 hidden sm:block">{formatINR(fee.amount)}</p>
                {!allPaid && <PayNowButton amount={fee.amount} label={fee.type} />}
                {allPaid && <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold"><CheckCircle2 className="w-4 h-4" /> Paid</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Razorpay badge */}
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-100">
          <p className="text-xs text-stone-400 flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="4" fill="#072654" />
              <path d="M7 16.5l3-9 3 5.5 2-3 2 6.5" stroke="#0dd6f8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Secured by Razorpay · All transactions are encrypted with 256-bit SSL
          </p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" /> Payment History
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-xs text-stone-500 font-semibold uppercase tracking-wide">
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Type</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Transaction ID</th>
                <th className="text-right px-5 py-3">Amount</th>
                <th className="text-right px-5 py-3">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {PAYMENT_HISTORY.map((txn) => (
                <tr key={txn.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-5 py-3.5 text-stone-600 whitespace-nowrap">{txn.date}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-stone-900 font-medium">{txn.type}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-xs font-mono text-stone-400 bg-stone-50 px-2 py-1 rounded">{txn.txnId}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-stone-900">{formatINR(txn.amount)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700 text-xs font-medium ml-auto">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ParentShell>
  )
}
