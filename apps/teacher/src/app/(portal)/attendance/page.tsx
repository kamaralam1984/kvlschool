'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, Clock, Save, ChevronDown, Calendar } from 'lucide-react'

type AttendanceStatus = 'P' | 'A' | 'L'

const CLASSES = ['Class 10A', 'Class 10B', 'Class 9A']

const studentsByClass: Record<string, { id: number; name: string; roll: string }[]> = {
  'Class 10A': [
    { id: 1, name: 'Priya Sharma', roll: '10A01' },
    { id: 2, name: 'Rohan Verma', roll: '10A02' },
    { id: 3, name: 'Ananya Singh', roll: '10A03' },
    { id: 4, name: 'Kabir Mehta', roll: '10A04' },
    { id: 5, name: 'Divya Patel', roll: '10A05' },
    { id: 6, name: 'Aryan Nair', roll: '10A06' },
    { id: 7, name: 'Riya Gupta', roll: '10A07' },
    { id: 8, name: 'Siddharth Kumar', roll: '10A08' },
  ],
  'Class 10B': [
    { id: 9, name: 'Arjun Mehta', roll: '10B01' },
    { id: 10, name: 'Kavya Nair', roll: '10B02' },
    { id: 11, name: 'Vivek Sharma', roll: '10B03' },
    { id: 12, name: 'Pooja Reddy', roll: '10B04' },
    { id: 13, name: 'Harsh Agarwal', roll: '10B05' },
    { id: 14, name: 'Meera Joshi', roll: '10B06' },
  ],
  'Class 9A': [
    { id: 15, name: 'Sneha Patel', roll: '9A01' },
    { id: 16, name: 'Aditya Rao', roll: '9A02' },
    { id: 17, name: 'Tanya Kapoor', roll: '9A03' },
    { id: 18, name: 'Nikhil Verma', roll: '9A04' },
    { id: 19, name: 'Ishaan Bose', roll: '9A05' },
    { id: 20, name: 'Ruchika Singh', roll: '9A06' },
  ],
}

const historyData = [
  { date: '30 May', class: 'Class 10A', present: 40, absent: 2, leave: 0, total: 42 },
  { date: '30 May', class: 'Class 10B', present: 37, absent: 3, leave: 0, total: 40 },
  { date: '29 May', class: 'Class 9A', present: 36, absent: 1, leave: 1, total: 38 },
  { date: '29 May', class: 'Class 10A', present: 42, absent: 0, leave: 0, total: 42 },
  { date: '28 May', class: 'Class 10B', present: 38, absent: 2, leave: 0, total: 40 },
]

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState('Class 10A')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>({})
  const [submitted, setSubmitted] = useState(false)

  const students = studentsByClass[selectedClass] || []

  const markAll = (status: AttendanceStatus) => {
    const all: Record<number, AttendanceStatus> = {}
    students.forEach(s => { all[s.id] = status })
    setAttendance(all)
  }

  const toggle = (id: number, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [id]: status }))
  }

  const presentCount = students.filter(s => attendance[s.id] === 'P').length
  const absentCount = students.filter(s => attendance[s.id] === 'A').length
  const leaveCount = students.filter(s => attendance[s.id] === 'L').length
  const unmarked = students.length - presentCount - absentCount - leaveCount

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Mark Attendance</h2>
        <p className="text-sm text-gray-500 mt-0.5">Record daily attendance for your classes</p>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="form-label">Select Class</label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={e => { setSelectedClass(e.target.value); setAttendance({}) }}
                className="form-input appearance-none pr-8"
              >
                {CLASSES.map(c => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="form-label">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => markAll('P')} className="btn-secondary text-green-700 border-green-200 bg-green-50 hover:bg-green-100">All Present</button>
            <button onClick={() => markAll('A')} className="btn-secondary text-red-700 border-red-200 bg-red-50 hover:bg-red-100">All Absent</button>
          </div>
        </div>

        {/* Summary badges */}
        <div className="flex gap-3 mt-4">
          {[
            { label: 'Present', count: presentCount, color: 'bg-green-100 text-green-700' },
            { label: 'Absent', count: absentCount, color: 'bg-red-100 text-red-700' },
            { label: 'Leave', count: leaveCount, color: 'bg-amber-100 text-amber-700' },
            { label: 'Unmarked', count: unmarked, color: 'bg-gray-100 text-gray-600' },
          ].map(s => (
            <span key={s.label} className={`badge ${s.color} gap-1`}>
              {s.count} {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Student List */}
      <div className="card overflow-hidden p-0">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 className="font-semibold text-sm text-gray-700">{selectedClass} — {students.length} Students</h3>
          <span className="text-xs text-gray-400">{selectedDate}</span>
        </div>
        <div className="divide-y divide-gray-50">
          {students.map((student, idx) => {
            const status = attendance[student.id]
            return (
              <div key={student.id} className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                status === 'P' ? 'bg-green-50/40' :
                status === 'A' ? 'bg-red-50/40' :
                status === 'L' ? 'bg-amber-50/40' : ''
              }`}>
                <span className="text-xs text-gray-400 w-6">{idx + 1}</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{student.name}</p>
                  <p className="text-xs text-gray-400">Roll: {student.roll}</p>
                </div>
                <div className="flex gap-1.5">
                  {(['P', 'A', 'L'] as AttendanceStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => toggle(student.id, s)}
                      className={`w-9 h-9 rounded-lg text-xs font-bold border transition-all ${
                        status === s
                          ? s === 'P' ? 'bg-green-500 text-white border-green-500' :
                            s === 'A' ? 'bg-red-500 text-white border-red-500' :
                            'bg-amber-500 text-white border-amber-500'
                          : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500">{unmarked} students not yet marked</p>
          <button
            onClick={handleSubmit}
            disabled={unmarked > 0}
            className={`btn-primary ${unmarked > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Save size={15} />
            {submitted ? 'Saved!' : 'Submit Attendance'}
          </button>
        </div>
      </div>

      {/* History */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-indigo-600" /> Recent Attendance Records
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th rounded-tl-lg">Date</th>
                <th className="table-th">Class</th>
                <th className="table-th">Present</th>
                <th className="table-th">Absent</th>
                <th className="table-th">Leave</th>
                <th className="table-th rounded-tr-lg">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {historyData.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="table-td">{r.date}</td>
                  <td className="table-td font-medium">{r.class}</td>
                  <td className="table-td">
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 size={12} /> {r.present}
                    </span>
                  </td>
                  <td className="table-td">
                    <span className="flex items-center gap-1 text-red-600">
                      <XCircle size={12} /> {r.absent}
                    </span>
                  </td>
                  <td className="table-td">
                    <span className="flex items-center gap-1 text-amber-600">
                      <Clock size={12} /> {r.leave}
                    </span>
                  </td>
                  <td className="table-td">
                    <span className={`badge ${
                      (r.present / r.total) >= 0.95 ? 'bg-green-100 text-green-700' :
                      (r.present / r.total) >= 0.85 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {Math.round((r.present / r.total) * 100)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
