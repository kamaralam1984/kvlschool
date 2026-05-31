'use client'
import React, { useState } from 'react'
import { FileText, Download, FileSpreadsheet, Printer, Filter, BarChart2, Users, CreditCard, GraduationCap, Clock, CheckCircle2 } from 'lucide-react'

interface ReportConfig {
  id: string; title: string; description: string; icon: React.ElementType;
  color: string; bg: string; category: string;
  generate: () => { headers: string[]; rows: string[][] }
}

const REPORTS: ReportConfig[] = [
  {
    id: 'student-list',
    title: 'Student Directory',
    description: 'Complete list of all enrolled students with class, section, and contact details.',
    icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', category: 'Students',
    generate: () => ({
      headers: ['Roll No', 'Name', 'Class', 'Section', 'Gender', 'Parent', 'Phone', 'Fee Status', 'Admission Date'],
      rows: [
        ['KVL-2024-001', 'Aarav Sharma', '10', 'A', 'Male', 'Ramesh Sharma', '9876543210', 'Paid', '2020-06-01'],
        ['KVL-2024-002', 'Priya Singh', '10', 'B', 'Female', 'Suresh Singh', '9876543211', 'Pending', '2020-06-01'],
        ['KVL-2024-003', 'Rohan Verma', '9', 'A', 'Male', 'Mohan Verma', '9876543212', 'Paid', '2021-06-01'],
        ['KVL-2024-004', 'Ananya Gupta', '11', 'A', 'Female', 'Rajesh Gupta', '9876543213', 'Overdue', '2019-06-01'],
        ['KVL-2024-005', 'Arjun Mishra', '8', 'C', 'Male', 'Vijay Mishra', '9876543214', 'Pending', '2022-06-01'],
        ['KVL-2024-006', 'Kavya Patel', '12', 'B', 'Female', 'Dinesh Patel', '9876543215', 'Paid', '2018-06-01'],
      ],
    }),
  },
  {
    id: 'attendance-report',
    title: 'Attendance Report',
    description: 'Daily/monthly attendance summary for all classes with present/absent counts.',
    icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', category: 'Attendance',
    generate: () => ({
      headers: ['Date', 'Class', 'Section', 'Total Students', 'Present', 'Absent', 'Leave', 'Percentage'],
      rows: [
        ['2025-01-31', '10', 'A', '42', '40', '1', '1', '95.2%'],
        ['2025-01-31', '10', 'B', '40', '37', '2', '1', '92.5%'],
        ['2025-01-31', '9', 'A', '38', '36', '2', '0', '94.7%'],
        ['2025-01-31', '11', 'A', '45', '43', '1', '1', '95.6%'],
        ['2025-01-31', '8', 'C', '35', '32', '3', '0', '91.4%'],
        ['2025-01-31', '12', 'B', '41', '39', '2', '0', '95.1%'],
      ],
    }),
  },
  {
    id: 'fee-collection',
    title: 'Fee Collection Report',
    description: 'Fee collection status with paid, pending, and overdue amounts by student.',
    icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50', category: 'Finance',
    generate: () => ({
      headers: ['Roll No', 'Name', 'Class', 'Fee Type', 'Amount', 'Due Date', 'Status', 'Paid Date', 'Transaction ID'],
      rows: [
        ['KVL-2024-001', 'Aarav Sharma', '10-A', 'Tuition Fee', '₹18500', '2025-01-10', 'Paid', '2025-01-08', 'TXN-8821'],
        ['KVL-2024-002', 'Priya Singh', '10-B', 'Tuition Fee', '₹18500', '2025-01-10', 'Pending', '-', '-'],
        ['KVL-2024-004', 'Ananya Gupta', '11-A', 'Hostel Fee', '₹12000', '2024-12-31', 'Overdue', '-', '-'],
        ['KVL-2024-003', 'Rohan Verma', '9-A', 'Transport Fee', '₹4500', '2025-01-10', 'Pending', '-', '-'],
        ['KVL-2024-006', 'Kavya Patel', '12-B', 'Exam Fee', '₹1200', '2025-01-15', 'Paid', '2025-01-10', 'TXN-9931'],
      ],
    }),
  },
  {
    id: 'exam-results',
    title: 'Exam Results Report',
    description: 'Student-wise exam scores, grade, pass/fail status for all exams.',
    icon: GraduationCap, color: 'text-yellow-600', bg: 'bg-yellow-50', category: 'Exams',
    generate: () => ({
      headers: ['Roll No', 'Name', 'Class', 'Exam', 'Subject', 'Total Marks', 'Obtained', 'Grade', 'Result'],
      rows: [
        ['KVL-2024-001', 'Aarav Sharma', '10', 'Mid-Term', 'Mathematics', '100', '87', 'A', 'Pass'],
        ['KVL-2024-002', 'Priya Singh', '10', 'Mid-Term', 'Mathematics', '100', '91', 'A+', 'Pass'],
        ['KVL-2024-003', 'Rohan Verma', '9', 'Unit Test', 'Science', '50', '38', 'B+', 'Pass'],
        ['KVL-2024-004', 'Ananya Gupta', '11', 'Mid-Term', 'Physics', '100', '72', 'B', 'Pass'],
        ['KVL-2024-005', 'Arjun Mishra', '8', 'Unit Test', 'English', '50', '22', 'C', 'Pass'],
        ['KVL-2024-006', 'Kavya Patel', '12', 'Pre-Board', 'Chemistry', '100', '94', 'A+', 'Pass'],
      ],
    }),
  },
  {
    id: 'revenue-summary',
    title: 'Revenue Summary',
    description: 'Monthly revenue breakdown by fee category — tuition, hostel, transport, others.',
    icon: BarChart2, color: 'text-red-600', bg: 'bg-red-50', category: 'Finance',
    generate: () => ({
      headers: ['Month', 'Tuition Fee', 'Hostel Fee', 'Transport Fee', 'Exam Fee', 'Other', 'Total'],
      rows: [
        ['July 2024', '₹4,20,000', '₹85,000', '₹32,000', '₹12,000', '₹8,000', '₹5,57,000'],
        ['Aug 2024', '₹5,10,000', '₹91,000', '₹35,000', '₹14,000', '₹9,500', '₹6,59,500'],
        ['Sep 2024', '₹4,80,000', '₹89,000', '₹33,000', '₹11,000', '₹7,200', '₹6,20,200'],
        ['Oct 2024', '₹5,25,000', '₹94,000', '₹36,000', '₹15,000', '₹10,000', '₹6,80,000'],
        ['Jan 2025', '₹5,40,000', '₹96,000', '₹38,000', '₹18,000', '₹11,000', '₹7,03,000'],
      ],
    }),
  },
  {
    id: 'teacher-report',
    title: 'Staff & Teacher Report',
    description: 'Staff list with designations, subjects, attendance, and leave records.',
    icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', category: 'HR',
    generate: () => ({
      headers: ['Employee ID', 'Name', 'Designation', 'Subject', 'Department', 'Joining Date', 'Status'],
      rows: [
        ['EMP-001', 'Mr. Rajesh Kumar', 'Senior Teacher', 'Mathematics', 'Academic', '2015-06-01', 'Active'],
        ['EMP-002', 'Ms. Priya Sharma', 'Teacher', 'Physics', 'Academic', '2018-06-01', 'Active'],
        ['EMP-003', 'Mrs. Anita Singh', 'Teacher', 'English', 'Academic', '2016-06-01', 'Active'],
        ['EMP-004', 'Mr. Suresh Patel', 'HOD', 'Chemistry', 'Academic', '2012-06-01', 'Active'],
      ],
    }),
  },
]

const CATEGORIES = ['All', 'Students', 'Attendance', 'Finance', 'Exams', 'HR']

function downloadCSV(headers: string[], rows: string[][], filename: string) {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function printReport(title: string, headers: string[], rows: string[][]) {
  const html = `
    <html><head><title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; }
      h1 { font-size: 20px; margin-bottom: 4px; color: #1e3a5f; }
      p { font-size: 12px; color: #6b7280; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th { background: #1e3a5f; color: white; padding: 8px 10px; text-align: left; }
      td { padding: 7px 10px; border-bottom: 1px solid #f3f4f6; }
      tr:nth-child(even) { background: #f9fafb; }
    </style></head>
    <body>
      <h1>${title}</h1>
      <p>KVL International School · Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <table>
        <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </body></html>
  `
  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => { w.print(); w.close() }, 300)
}

export default function ReportsPage() {
  const [category, setCategory] = useState('All')
  const [generating, setGenerating] = useState<string | null>(null)

  const filtered = REPORTS.filter(r => category === 'All' || r.category === category)

  async function handleAction(report: ReportConfig, action: 'csv' | 'pdf') {
    setGenerating(report.id + action)
    await new Promise(r => setTimeout(r, 400))
    const { headers, rows } = report.generate()
    if (action === 'csv') {
      downloadCSV(headers, rows, report.id)
    } else {
      printReport(report.title, headers, rows)
    }
    setGenerating(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Generate and export reports as PDF or Excel (CSV)</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === c ? 'bg-[#1e3a5f] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(report => {
          const Icon = report.icon
          const isGeneratingCSV = generating === report.id + 'csv'
          const isGeneratingPDF = generating === report.id + 'pdf'

          return (
            <div key={report.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-11 h-11 ${report.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${report.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{report.title}</h3>
                  <span className="text-xs text-gray-400">{report.category}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">{report.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(report, 'csv')}
                  disabled={!!generating}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" />
                  {isGeneratingCSV ? 'Exporting…' : 'Excel (CSV)'}
                </button>
                <button
                  onClick={() => handleAction(report, 'pdf')}
                  disabled={!!generating}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
                  <Printer className="w-3.5 h-3.5 text-red-600" />
                  {isGeneratingPDF ? 'Opening…' : 'Print / PDF'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
