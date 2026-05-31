'use client'

import { useState } from 'react'
import { Download, Printer, TrendingUp, IndianRupee, AlertCircle, PieChart, Award, Users, Calendar } from 'lucide-react'

type Period = 'Monthly' | 'Quarterly' | 'Yearly'

interface ReportCard {
  id: string
  title: string
  description: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
  lastGenerated: string
}

const REPORT_CARDS: ReportCard[] = [
  { id: '1', title: 'Monthly P&L Statement',          description: 'Income vs expenditure breakdown with net surplus/deficit for the selected period.',         icon: TrendingUp,    iconColor: 'text-green-600',  iconBg: 'bg-green-50',  lastGenerated: '2025-05-30' },
  { id: '2', title: 'Fee Collection Summary',          description: 'Class-wise and fee-type-wise collection analysis with pending dues overview.',              icon: IndianRupee,   iconColor: 'text-blue-600',   iconBg: 'bg-blue-50',   lastGenerated: '2025-05-31' },
  { id: '3', title: 'Outstanding Dues Report',         description: 'List of students with pending payments, overdue invoices and follow-up priority.',          icon: AlertCircle,   iconColor: 'text-red-600',    iconBg: 'bg-red-50',    lastGenerated: '2025-05-29' },
  { id: '4', title: 'Expense Category Breakdown',      description: 'Department-wise expense split: salaries, utilities, maintenance, supplies and more.',       icon: PieChart,      iconColor: 'text-purple-600', iconBg: 'bg-purple-50', lastGenerated: '2025-05-28' },
  { id: '5', title: 'Scholarship Disbursement Report', description: 'Total scholarships awarded, program-wise amounts and year-over-year comparison.',           icon: Award,         iconColor: 'text-[#d4a017]',  iconBg: 'bg-yellow-50', lastGenerated: '2025-05-25' },
  { id: '6', title: 'Salary Expense Report',           description: 'Department-wise payroll summary, increment history, and total salary liability.',            icon: Users,         iconColor: 'text-indigo-600', iconBg: 'bg-indigo-50', lastGenerated: '2025-05-31' },
]

const PERIODS: Period[] = ['Monthly', 'Quarterly', 'Yearly']

export default function FinanceReportsPage() {
  const [periods, setPeriods] = useState<Record<string, Period>>(
    Object.fromEntries(REPORT_CARDS.map(r => [r.id, 'Monthly']))
  )

  function setPeriod(id: string, period: Period) {
    setPeriods(prev => ({ ...prev, [id]: period }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Generate, download and print financial statements.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-2">
          <Calendar className="w-4 h-4" />
          <span>As of May 31, 2025</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Income (May)',     value: '₹24.6L',  trend: '+8.2%',   trendUp: true },
          { label: 'Total Expenses (May)',   value: '₹18.4L',  trend: '+3.1%',   trendUp: false },
          { label: 'Net Surplus (May)',      value: '₹6.2L',   trend: '+22.4%',  trendUp: true },
          { label: 'Outstanding Dues',       value: '₹4.2L',   trend: '68 students', trendUp: false },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className={`text-xs mt-1 font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-500'}`}>{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {REPORT_CARDS.map(report => {
          const Icon = report.icon
          const period = periods[report.id]
          return (
            <div key={report.id} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${report.iconBg}`}>
                  <Icon className={`w-5 h-5 ${report.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800">{report.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{report.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Last generated: {report.lastGenerated}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                {/* Period selector */}
                <div className="flex bg-gray-100 rounded-xl p-0.5">
                  {PERIODS.map(p => (
                    <button
                      key={p}
                      onClick={() => setPeriod(report.id, p)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        period === p
                          ? 'bg-white text-[#1e3a5f] shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {}}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] text-white rounded-xl text-xs font-medium hover:bg-[#162d4a] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> CSV
                  </button>
                  <button
                    onClick={() => {}}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Generate section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Custom Date Range Report</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">From Date</label>
            <input type="date" defaultValue="2025-05-01" className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">To Date</label>
            <input type="date" defaultValue="2025-05-31" className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Report Type</label>
            <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
              {REPORT_CARDS.map(r => <option key={r.id}>{r.title}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => {}} className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#162d4a] transition-colors">
              <Download className="w-4 h-4" /> Generate & Download
            </button>
            <button onClick={() => {}} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
