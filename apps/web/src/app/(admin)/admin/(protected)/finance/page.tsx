'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, Wallet, AlertCircle, ArrowRight, CreditCard, Users, FileText, Receipt, DollarSign, BarChart2, PiggyBank, BookOpen } from 'lucide-react'

const TRANSACTIONS = [
  { id: '1', description: 'Tuition Fee – Class 10A', amount: 1,82,000, type: 'income', date: '2025-05-30', category: 'Tuition' },
  { id: '2', description: 'Staff Salary – May 2025', amount: 4,85,000, type: 'expense', date: '2025-05-29', category: 'Salary' },
  { id: '3', description: 'Transport Fee Collection', amount: 56,500, type: 'income', date: '2025-05-28', category: 'Transport' },
  { id: '4', description: 'Electricity Bill – May', amount: 38,200, type: 'expense', date: '2025-05-27', category: 'Utilities' },
  { id: '5', description: 'Hostel Fee – Class 11 & 12', amount: 2,40,000, type: 'income', date: '2025-05-26', category: 'Hostel' },
  { id: '6', description: 'Lab Equipment Purchase', amount: 75,000, type: 'expense', date: '2025-05-25', category: 'Supplies' },
  { id: '7', description: 'Exam Fee Collection', amount: 92,000, type: 'income', date: '2025-05-24', category: 'Exam' },
  { id: '8', description: 'Annual Day Event Expenses', amount: 1,20,000, type: 'expense', date: '2025-05-23', category: 'Events' },
  { id: '9', description: 'Tuition Fee – Class 9B', amount: 1,65,000, type: 'income', date: '2025-05-22', category: 'Tuition' },
  { id: '10', description: 'Building Maintenance', amount: 45,000, type: 'expense', date: '2025-05-21', category: 'Maintenance' },
]

const MONTHLY = [
  { month: 'Jan', revenue: 38, expense: 9 },
  { month: 'Feb', revenue: 42, expense: 11 },
  { month: 'Mar', revenue: 35, expense: 10 },
  { month: 'Apr', revenue: 44, expense: 12 },
  { month: 'May', revenue: 47, expense: 12 },
]

const QUICK_LINKS = [
  { label: 'Fee Structure', href: '/admin/finance/fee-structure', icon: FileText, desc: 'Configure fee categories' },
  { label: 'Payments', href: '/admin/finance/payments', icon: CreditCard, desc: 'Track all payments' },
  { label: 'Income', href: '/admin/finance/income', icon: TrendingUp, desc: 'Income entries' },
  { label: 'Expenses', href: '/admin/finance/expenses', icon: TrendingDown, desc: 'Expense tracking' },
  { label: 'Collect Fees', href: '/admin/finance/collect', icon: Users, desc: 'Collect student fees' },
  { label: 'Invoices', href: '/admin/finance/invoices', icon: Receipt, desc: 'Generate invoices' },
  { label: 'Scholarships', href: '/admin/finance/scholarships', icon: BookOpen, desc: 'Manage scholarships' },
  { label: 'Reports', href: '/admin/finance/reports', icon: BarChart2, desc: 'Financial reports' },
]

function formatINR(lakhs: number) {
  return `₹${lakhs.toFixed(1)}L`
}

export default function FinancePage() {
  const [selectedMonth] = useState('May 2025')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Finance Overview</h1>
        <p className="text-gray-500 text-sm mt-1">{selectedMonth} · Academic Year 2024–25</p>
      </div>

      {/* Outstanding dues alert */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-800">Outstanding Dues Alert</p>
          <p className="text-sm text-red-600 mt-0.5">₹8.4L in pending fees from 127 students. 23 accounts are overdue by more than 30 days.</p>
        </div>
        <Link href="/admin/finance/collect" className="text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
          Collect Now
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₹47.3L', sub: '+8.2% vs last month', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', subColor: 'text-green-600' },
          { label: 'Total Expenses', value: '₹12.1L', sub: '+3.1% vs last month', icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50', subColor: 'text-red-500' },
          { label: 'Net Profit', value: '₹35.2L', sub: 'This month', icon: Wallet, color: 'text-[#1e3a5f]', bg: 'bg-[#1e3a5f]/10', subColor: 'text-gray-500' },
          { label: 'Pending Fees', value: '₹8.4L', sub: '127 students', icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', subColor: 'text-yellow-600' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{k.label}</p>
              <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center`}>
                <k.icon className={`w-4.5 h-4.5 ${k.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{k.value}</p>
            <p className={`text-xs mt-1 ${k.subColor}`}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue vs Expense Bar Chart (CSS) */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-5">Monthly Revenue vs Expenses (₹ Lakhs)</h3>
          <div className="flex items-end gap-6 h-48">
            {MONTHLY.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end gap-1 h-36">
                  <div className="flex-1 rounded-t-lg bg-[#1e3a5f] transition-all" style={{ height: `${(m.revenue / 50) * 100}%` }} title={`Revenue: ₹${m.revenue}L`} />
                  <div className="flex-1 rounded-t-lg bg-red-300 transition-all" style={{ height: `${(m.expense / 50) * 100}%` }} title={`Expense: ₹${m.expense}L`} />
                </div>
                <span className="text-xs text-gray-500 font-medium">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#1e3a5f]" /><span className="text-xs text-gray-500">Revenue</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-300" /><span className="text-xs text-gray-500">Expenses</span></div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Access</h3>
          <div className="space-y-2">
            {QUICK_LINKS.map(ql => (
              <Link key={ql.label} href={ql.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1e3a5f]/20 transition-colors">
                  <ql.icon className="w-4 h-4 text-[#1e3a5f]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{ql.label}</p>
                  <p className="text-xs text-gray-400">{ql.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Recent Transactions</h3>
          <Link href="/admin/finance/payments" className="text-xs text-[#1e3a5f] font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {TRANSACTIONS.map(tx => (
            <div key={tx.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.type === 'income' ? 'bg-green-50' : 'bg-red-50'}`}>
                {tx.type === 'income'
                  ? <TrendingUp className="w-4 h-4 text-green-600" />
                  : <TrendingDown className="w-4 h-4 text-red-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{tx.description}</p>
                <p className="text-xs text-gray-400">{tx.category} · {tx.date}</p>
              </div>
              <p className={`text-sm font-bold flex-shrink-0 ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                {tx.type === 'income' ? '+' : '−'}₹{tx.amount.toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
