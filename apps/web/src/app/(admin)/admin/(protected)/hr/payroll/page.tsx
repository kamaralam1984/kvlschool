'use client'
import React, { useState } from 'react'
import { DollarSign, Clock, CheckCircle, ChevronDown, X, Download, CreditCard } from 'lucide-react'

interface Employee {
  id: string; empId: string; name: string; designation: string; department: string
  basic: number; hra: number; da: number; otherAllowances: number
  pf: number; tds: number; otherDeductions: number
  status: 'Pending' | 'Processed' | 'Paid'
}

const MOCK: Employee[] = [
  { id:'1', empId:'EMP001', name:'Rajesh Kumar', designation:'Principal', department:'Administration', basic:85000, hra:25500, da:17000, otherAllowances:5000, pf:10200, tds:8500, otherDeductions:2000, status:'Paid' },
  { id:'2', empId:'EMP002', name:'Priya Sharma', designation:'Vice Principal', department:'Administration', basic:70000, hra:21000, da:14000, otherAllowances:4000, pf:8400, tds:6500, otherDeductions:1500, status:'Paid' },
  { id:'3', empId:'EMP003', name:'Anita Verma', designation:'Senior Teacher', department:'Science', basic:55000, hra:16500, da:11000, otherAllowances:3000, pf:6600, tds:4000, otherDeductions:1000, status:'Processed' },
  { id:'4', empId:'EMP004', name:'Suresh Patel', designation:'Teacher', department:'Mathematics', basic:45000, hra:13500, da:9000, otherAllowances:2500, pf:5400, tds:2500, otherDeductions:800, status:'Processed' },
  { id:'5', empId:'EMP005', name:'Meena Joshi', designation:'Teacher', department:'English', basic:45000, hra:13500, da:9000, otherAllowances:2500, pf:5400, tds:2500, otherDeductions:800, status:'Pending' },
  { id:'6', empId:'EMP006', name:'Vikram Singh', designation:'Lab Assistant', department:'Science', basic:30000, hra:9000, da:6000, otherAllowances:1500, pf:3600, tds:1000, otherDeductions:500, status:'Pending' },
  { id:'7', empId:'EMP007', name:'Kavitha Nair', designation:'Librarian', department:'Library', basic:28000, hra:8400, da:5600, otherAllowances:1000, pf:3360, tds:800, otherDeductions:400, status:'Pending' },
  { id:'8', empId:'EMP008', name:'Mohan Das', designation:'Peon', department:'Administration', basic:18000, hra:5400, da:3600, otherAllowances:500, pf:2160, tds:0, otherDeductions:200, status:'Pending' },
]

const MONTHS = ['January 2025','February 2025','March 2025','April 2025','May 2025','June 2025']
const statusColor: Record<string, string> = {
  Pending: 'bg-yellow-50 text-yellow-700',
  Processed: 'bg-blue-50 text-blue-700',
  Paid: 'bg-green-50 text-green-700',
}
const gross = (e: Employee) => e.basic + e.hra + e.da + e.otherAllowances
const totalDed = (e: Employee) => e.pf + e.tds + e.otherDeductions
const netSal = (e: Employee) => gross(e) - totalDed(e)
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

export default function PayrollPage() {
  const [employees, setEmployees] = useState<Employee[]>(MOCK)
  const [month, setMonth] = useState('January 2025')
  const [deptFilter, setDeptFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [detailEmp, setDetailEmp] = useState<Employee | null>(null)

  const departments = ['All', ...Array.from(new Set(MOCK.map(e => e.department)))]

  const filtered = employees.filter(e =>
    (deptFilter === 'All' || e.department === deptFilter) &&
    (statusFilter === 'All' || e.status === statusFilter)
  )

  const processedCount = employees.filter(e => e.status === 'Processed' || e.status === 'Paid').length
  const pendingCount = employees.filter(e => e.status === 'Pending').length

  function processPayroll() {
    setEmployees(prev => prev.map(e => e.status === 'Pending' ? { ...e, status: 'Processed' } : e))
  }
  function markPaid(id: string) {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: 'Paid' } : e))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-500 text-sm mt-1">Process and manage employee salaries</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <select value={month} onChange={e => setMonth(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#1e3a5f]/40 bg-white cursor-pointer font-medium">
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          <button onClick={processPayroll} className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
            <CreditCard className="w-4 h-4" /> Process Payroll
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Payroll', value: '₹28.4L', sub: month, icon: DollarSign, color: 'bg-blue-50 text-blue-600' },
          { label: 'Processed', value: `${processedCount}/124`, sub: 'Employees processed', icon: CheckCircle, color: 'bg-green-50 text-green-600' },
          { label: 'Pending', value: String(pendingCount), sub: 'Awaiting processing', icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        {[
          { label: 'Department', val: deptFilter, set: setDeptFilter, opts: departments },
          { label: 'Status', val: statusFilter, set: setStatusFilter, opts: ['All','Pending','Processed','Paid'] },
        ].map(f => (
          <div key={f.label} className="relative">
            <select value={f.val} onChange={e => f.set(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#1e3a5f]/40 bg-white cursor-pointer">
              {f.opts.map(o => <option key={o}>{o === 'All' ? `${f.label}: All` : o}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        ))}
        <p className="ml-auto text-sm text-gray-500">{filtered.length} employees</p>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Emp ID','Name & Designation','Basic','HRA','DA','Other Allow.','Total Gross','PF','TDS','Other Ded.','Net Salary','Status','Action'].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3.5 text-sm text-gray-600 font-mono">{e.empId}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-gray-900 whitespace-nowrap">{e.name}</p>
                    <p className="text-xs text-gray-400">{e.designation} · {e.department}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-700 whitespace-nowrap">{fmt(e.basic)}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-700 whitespace-nowrap">{fmt(e.hra)}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-700 whitespace-nowrap">{fmt(e.da)}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-700 whitespace-nowrap">{fmt(e.otherAllowances)}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-gray-900 whitespace-nowrap">{fmt(gross(e))}</td>
                  <td className="px-4 py-3.5 text-sm text-red-600 whitespace-nowrap">-{fmt(e.pf)}</td>
                  <td className="px-4 py-3.5 text-sm text-red-600 whitespace-nowrap">-{fmt(e.tds)}</td>
                  <td className="px-4 py-3.5 text-sm text-red-600 whitespace-nowrap">-{fmt(e.otherDeductions)}</td>
                  <td className="px-4 py-3.5 text-sm font-bold text-[#1e3a5f] whitespace-nowrap">{fmt(netSal(e))}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[e.status]}`}>{e.status}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setDetailEmp(e)} className="px-2 py-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors text-xs">View</button>
                      {e.status === 'Processed' && (
                        <button onClick={() => markPaid(e.id)} className="px-2 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-medium transition-colors whitespace-nowrap">Mark Paid</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={13} className="px-5 py-12 text-center text-sm text-gray-400">No employees match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detailEmp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Salary Slip</h2>
                <p className="text-sm text-gray-500">{month}</p>
              </div>
              <button onClick={() => setDetailEmp(null)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-bold text-gray-900">{detailEmp.name}</p>
                <p className="text-sm text-gray-500">{detailEmp.designation} · {detailEmp.department}</p>
                <p className="text-xs text-gray-400 mt-1">{detailEmp.empId}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Earnings</p>
                  {[['Basic Salary', detailEmp.basic],['HRA', detailEmp.hra],['DA', detailEmp.da],['Other Allowances', detailEmp.otherAllowances]].map(([k, v]) => (
                    <div key={String(k)} className="flex justify-between text-sm py-1 border-b border-gray-50">
                      <span className="text-gray-600">{k}</span>
                      <span className="font-medium text-gray-900">{fmt(Number(v))}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm py-1.5 font-bold">
                    <span>Total Gross</span><span className="text-[#1e3a5f]">{fmt(gross(detailEmp))}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Deductions</p>
                  {[['PF', detailEmp.pf],['TDS', detailEmp.tds],['Other', detailEmp.otherDeductions]].map(([k, v]) => (
                    <div key={String(k)} className="flex justify-between text-sm py-1 border-b border-gray-50">
                      <span className="text-gray-600">{k}</span>
                      <span className="font-medium text-red-600">-{fmt(Number(v))}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm py-1.5 font-bold">
                    <span>Total Deductions</span><span className="text-red-600">-{fmt(totalDed(detailEmp))}</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#1e3a5f] rounded-xl p-4 flex justify-between items-center">
                <span className="text-white font-semibold">Net Salary</span>
                <span className="text-white text-xl font-bold">{fmt(netSal(detailEmp))}</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setDetailEmp(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Close</button>
              <button className="px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" /> Download Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
