'use client'

import { useState } from 'react'
import { Search, MessageSquare, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react'

const allStudents = [
  { id: 1, name: 'Priya Sharma', roll: '10A01', class: 'Class 10A', attendance: 96, lastMark: 48, maxMark: 50, pending: 0, trend: 'up', parent: 'Mrs. Sunita Sharma' },
  { id: 2, name: 'Rohan Verma', roll: '10A02', class: 'Class 10A', attendance: 91, lastMark: 38, maxMark: 50, pending: 1, trend: 'down', parent: 'Mr. Suresh Verma' },
  { id: 3, name: 'Ananya Singh', roll: '10A03', class: 'Class 10A', attendance: 98, lastMark: 47, maxMark: 50, pending: 0, trend: 'up', parent: 'Mrs. Rekha Singh' },
  { id: 4, name: 'Kabir Mehta', roll: '10A04', class: 'Class 10A', attendance: 85, lastMark: 32, maxMark: 50, pending: 2, trend: 'down', parent: 'Mr. Ravi Mehta' },
  { id: 5, name: 'Divya Patel', roll: '10A05', class: 'Class 10A', attendance: 94, lastMark: 43, maxMark: 50, pending: 0, trend: 'up', parent: 'Mrs. Leela Patel' },
  { id: 6, name: 'Aryan Nair', roll: '10A06', class: 'Class 10A', attendance: 99, lastMark: 49, maxMark: 50, pending: 0, trend: 'up', parent: 'Mr. Ajay Nair' },
  { id: 7, name: 'Arjun Mehta', roll: '10B01', class: 'Class 10B', attendance: 88, lastMark: 35, maxMark: 50, pending: 1, trend: 'up', parent: 'Mr. Vinod Mehta' },
  { id: 8, name: 'Kavya Nair', roll: '10B02', class: 'Class 10B', attendance: 97, lastMark: 50, maxMark: 50, pending: 0, trend: 'up', parent: 'Mrs. Geetha Nair' },
  { id: 9, name: 'Vivek Sharma', roll: '10B03', class: 'Class 10B', attendance: 82, lastMark: 28, maxMark: 50, pending: 3, trend: 'down', parent: 'Mr. Manoj Sharma' },
  { id: 10, name: 'Pooja Reddy', roll: '10B04', class: 'Class 10B', attendance: 95, lastMark: 45, maxMark: 50, pending: 0, trend: 'up', parent: 'Mrs. Priya Reddy' },
  { id: 11, name: 'Sneha Patel', roll: '9A01', class: 'Class 9A', attendance: 100, lastMark: 24, maxMark: 25, pending: 0, trend: 'up', parent: 'Mr. Hemant Patel' },
  { id: 12, name: 'Aditya Rao', roll: '9A02', class: 'Class 9A', attendance: 93, lastMark: 20, maxMark: 25, pending: 1, trend: 'up', parent: 'Mrs. Usha Rao' },
  { id: 13, name: 'Tanya Kapoor', roll: '9A03', class: 'Class 9A', attendance: 79, lastMark: 14, maxMark: 25, pending: 2, trend: 'down', parent: 'Mr. Anil Kapoor' },
  { id: 14, name: 'Nikhil Verma', roll: '9A04', class: 'Class 9A', attendance: 91, lastMark: 22, maxMark: 25, pending: 0, trend: 'up', parent: 'Mrs. Sunita Verma' },
]

const CLASSES = ['All Classes', 'Class 10A', 'Class 10B', 'Class 9A']

export default function StudentsPage() {
  const [search, setSearch] = useState('')
  const [filterClass, setFilterClass] = useState('All Classes')
  const [msgStudent, setMsgStudent] = useState<typeof allStudents[0] | null>(null)
  const [msgText, setMsgText] = useState('')

  const filtered = allStudents.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.toLowerCase().includes(search.toLowerCase())
    const matchClass = filterClass === 'All Classes' || s.class === filterClass
    return matchSearch && matchClass
  })

  const attRisk = filtered.filter(s => s.attendance < 85).length
  const lowMarks = filtered.filter(s => (s.lastMark / s.maxMark) < 0.6).length

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Students</h2>
        <p className="text-sm text-gray-500 mt-0.5">Overview of all students across your assigned classes</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Students', value: allStudents.length, color: 'bg-indigo-50 text-indigo-700' },
          { label: 'At-Risk Attendance', value: attRisk, color: 'bg-red-50 text-red-600' },
          { label: 'Low Performers', value: lowMarks, color: 'bg-amber-50 text-amber-600' },
          { label: 'Pending Grading', value: allStudents.reduce((s, st) => s + st.pending, 0), color: 'bg-purple-50 text-purple-600' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="form-input pl-9"
            placeholder="Search by name or roll no..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            value={filterClass}
            onChange={e => setFilterClass(e.target.value)}
            className="form-input appearance-none pr-8 min-w-[140px]"
          >
            {CLASSES.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Student Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="table-th">Student</th>
                <th className="table-th">Class</th>
                <th className="table-th">Attendance</th>
                <th className="table-th">Latest Marks</th>
                <th className="table-th">Pending</th>
                <th className="table-th">Trend</th>
                <th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => {
                const attColor = s.attendance >= 90 ? 'text-green-600' : s.attendance >= 80 ? 'text-amber-600' : 'text-red-600'
                const attBg = s.attendance >= 90 ? 'bg-green-100' : s.attendance >= 80 ? 'bg-amber-100' : 'bg-red-100'
                const markPct = Math.round((s.lastMark / s.maxMark) * 100)
                return (
                  <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {s.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.roll}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <span className="badge bg-indigo-50 text-indigo-700">{s.class}</span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <span className={`badge ${attBg} ${attColor} font-medium`}>{s.attendance}%</span>
                      </div>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${markPct >= 80 ? 'bg-green-500' : markPct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${markPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{s.lastMark}/{s.maxMark}</span>
                      </div>
                    </td>
                    <td className="table-td">
                      {s.pending > 0 ? (
                        <span className="badge bg-amber-100 text-amber-700">{s.pending} pending</span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="table-td">
                      {s.trend === 'up' ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs">
                          <TrendingUp size={13} /> Improving
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-500 text-xs">
                          <TrendingDown size={13} /> Declining
                        </span>
                      )}
                    </td>
                    <td className="table-td">
                      <button
                        onClick={() => { setMsgStudent(s); setMsgText('') }}
                        className="btn-secondary py-1 text-xs"
                      >
                        <MessageSquare size={12} /> Message
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center py-8 text-gray-400 text-sm">No students match your search</p>
        )}
      </div>

      {/* Message Modal */}
      {msgStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h3 className="font-semibold text-gray-900 mb-1">Send Message</h3>
            <p className="text-sm text-gray-500 mb-4">
              To: <strong>{msgStudent.name}</strong> ({msgStudent.class}) &amp; Parent: {msgStudent.parent}
            </p>
            <textarea
              rows={4}
              className="form-input resize-none mb-4"
              placeholder="Type your message..."
              value={msgText}
              onChange={e => setMsgText(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setMsgStudent(null)} className="btn-secondary">Cancel</button>
              <button className="btn-primary" onClick={() => setMsgStudent(null)}>Send Message</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
