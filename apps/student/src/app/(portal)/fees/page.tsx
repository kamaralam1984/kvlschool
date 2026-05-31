'use client'

import React, { useState } from 'react'
import { CreditCard, CheckCircle, Clock, Banknote, Calendar, Download, Receipt, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

const SUMMARY = { total: 60800, paid: 45800, pending: 15000, nextDue: '2026-07-01', nextAmount: 15000 }

const TRANSACTIONS = [
  { id: 'TXN001', type: 'Tuition Fee — Q1',    amount: 11250, date: '2026-04-05', method: 'Online', status: 'Paid',    receipt: '#RCP001' },
  { id: 'TXN002', type: 'Transport Fee',         amount: 12000, date: '2026-04-10', method: 'Online', status: 'Paid',    receipt: '#RCP002' },
  { id: 'TXN003', type: 'Activity Fee',          amount: 1500,  date: '2026-04-10', method: 'Cash',   status: 'Paid',    receipt: '#RCP003' },
  { id: 'TXN004', type: 'Lab Fee',               amount: 2500,  date: '2026-04-15', method: 'Online', status: 'Paid',    receipt: '#RCP004' },
  { id: 'TXN005', type: 'Library Fee',           amount: 800,   date: '2026-04-15', method: 'Online', status: 'Paid',    receipt: '#RCP005' },
  { id: 'TXN006', type: 'Tuition Fee — Q2',    amount: 11250, date: '—',           method: '—',      status: 'Pending', receipt: '—' },
  { id: 'TXN007', type: 'Hostel Fee — Term 2',  amount: 30000, date: '—',           method: '—',      status: 'Pending', receipt: '—' },
]

const STATUS_COLOR: Record<string, string> = {
  Paid:    'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
}

export default function FeesPage() {
  const [tab, setTab] = useState<'overview' | 'history' | 'structure'>('overview')
  const pct = Math.round((SUMMARY.paid / SUMMARY.total) * 100)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Details</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track payments and upcoming dues</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
          <Download className="w-4 h-4" />Fee Receipt
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Annual Fee',    value: `₹${SUMMARY.total.toLocaleString()}`,   icon: Banknote,  color: 'bg-gray-700' },
          { label: 'Paid',          value: `₹${SUMMARY.paid.toLocaleString()}`,    icon: CheckCircle, color: 'bg-green-500' },
          { label: 'Pending',       value: `₹${SUMMARY.pending.toLocaleString()}`, icon: Clock,     color: 'bg-yellow-400' },
          { label: 'Next Due Date', value: SUMMARY.nextDue,                         icon: Calendar,  color: 'bg-blue-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', s.color)}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Annual Payment Progress</h2>
          <span className="text-lg font-bold text-green-600">{pct}% paid</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
          <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Paid: ₹{SUMMARY.paid.toLocaleString()}</span>
          <span>Remaining: ₹{SUMMARY.pending.toLocaleString()}</span>
        </div>
        <div className="mt-4 flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div>
            <p className="font-medium text-yellow-800 text-sm">Next Payment Due</p>
            <p className="text-xs text-yellow-600 mt-0.5">₹{SUMMARY.nextAmount.toLocaleString()} due on {SUMMARY.nextDue}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600">
            <CreditCard className="w-4 h-4" />Pay Now
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['overview','history','structure'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-1.5 text-sm rounded-md capitalize transition-all',
              tab === t ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700')}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TRANSACTIONS.filter(t => t.status === 'Pending').map(t => (
            <div key={t.id} className="bg-white rounded-xl border border-yellow-200 bg-yellow-50/30 p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">{t.type}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.id}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">₹{t.amount.toLocaleString()}</p>
                <button className="text-xs text-blue-600 hover:underline mt-1 flex items-center gap-1 ml-auto">
                  Pay <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          {TRANSACTIONS.filter(t => t.status === 'Paid').slice(0, 4).map(t => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">{t.type}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.date} · {t.method}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-700">₹{t.amount.toLocaleString()}</p>
                <button className="text-xs text-blue-600 hover:underline mt-1 flex items-center gap-1 ml-auto">
                  <Receipt className="w-3 h-3" />Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'history' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['ID','Description','Amount','Date','Method','Status','Receipt'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {TRANSACTIONS.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{t.id}</td>
                    <td className="px-4 py-3 text-gray-700">{t.type}</td>
                    <td className="px-4 py-3 font-semibold">₹{t.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{t.date}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{t.method}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', STATUS_COLOR[t.status] || 'bg-gray-100 text-gray-500')}>{t.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {t.receipt !== '—'
                        ? <button className="text-xs text-blue-600 hover:underline flex items-center gap-1"><Download className="w-3 h-3" />{t.receipt}</button>
                        : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'structure' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Fee Structure — 2025-26</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Category','Annual','Q1 Apr','Q2 Jul','Q3 Oct','Q4 Jan'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { cat: 'Tuition Fee',  annual: 45000, q: [11250,11250,11250,11250] },
                  { cat: 'Transport',    annual: 12000, q: [12000,0,0,0] },
                  { cat: 'Activity',     annual: 1500,  q: [1500,0,0,0] },
                  { cat: 'Lab',          annual: 2500,  q: [2500,0,0,0] },
                  { cat: 'Library',      annual: 800,   q: [800,0,0,0] },
                ].map(f => (
                  <tr key={f.cat} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{f.cat}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">₹{f.annual.toLocaleString()}</td>
                    {f.q.map((v, i) => <td key={i} className="px-4 py-3 text-gray-600">{v ? `₹${v.toLocaleString()}` : '—'}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
