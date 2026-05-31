'use client'
import React, { useState, useMemo } from 'react'
import { CheckCircle2, XCircle, Clock, Save, ChevronDown, Users, TrendingUp, BarChart2, AlertCircle } from 'lucide-react'

type Status = 'P' | 'A' | 'L' | null

interface StudentRow { id: string; name: string; rollNo: string; status: Status }

const CLASS_DATA: Record<string, Record<string, { name: string; rollNo: string }[]>> = {
  '10': {
    'A': [
      { name: 'Aarav Sharma', rollNo: 'KVL-001' }, { name: 'Priya Singh', rollNo: 'KVL-002' },
      { name: 'Rohan Verma', rollNo: 'KVL-003' }, { name: 'Ananya Gupta', rollNo: 'KVL-004' },
      { name: 'Arjun Mishra', rollNo: 'KVL-005' }, { name: 'Kavya Patel', rollNo: 'KVL-006' },
      { name: 'Dev Agarwal', rollNo: 'KVL-007' }, { name: 'Sneha Yadav', rollNo: 'KVL-008' },
    ],
    'B': [
      { name: 'Rahul Tiwari', rollNo: 'KVL-009' }, { name: 'Pooja Sharma', rollNo: 'KVL-010' },
      { name: 'Vivek Joshi', rollNo: 'KVL-011' }, { name: 'Riya Pandey', rollNo: 'KVL-012' },
    ],
  },
  '9': {
    'A': [
      { name: 'Harsh Singh', rollNo: 'KVL-013' }, { name: 'Nisha Gupta', rollNo: 'KVL-014' },
      { name: 'Amit Kumar', rollNo: 'KVL-015' }, { name: 'Sanya Verma', rollNo: 'KVL-016' },
      { name: 'Deepak Rao', rollNo: 'KVL-017' },
    ],
  },
  '11': {
    'A': [
      { name: 'Akash Dubey', rollNo: 'KVL-018' }, { name: 'Simran Kaur', rollNo: 'KVL-019' },
      { name: 'Nikhil Shukla', rollNo: 'KVL-020' }, { name: 'Preeti Singh', rollNo: 'KVL-021' },
    ],
  },
}

const today = new Date().toISOString().slice(0, 10)

const STATUS_CONFIG = {
  P: { label: 'Present', color: 'bg-green-500', light: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 },
  A: { label: 'Absent',  color: 'bg-red-500',   light: 'bg-red-100 text-red-700 border-red-200',     icon: XCircle },
  L: { label: 'Leave',   color: 'bg-yellow-500', light: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
}

export default function AttendancePage() {
  const [cls, setCls] = useState('10')
  const [section, setSection] = useState('A')
  const [date, setDate] = useState(today)
  const [saved, setSaved] = useState(false)

  const sections = Object.keys(CLASS_DATA[cls] ?? {})
  const rawStudents = CLASS_DATA[cls]?.[section] ?? []

  const [attendance, setAttendance] = useState<Record<string, Status>>({})

  const students: StudentRow[] = rawStudents.map((s, i) => ({
    id: `${cls}-${section}-${i}`,
    name: s.name,
    rollNo: s.rollNo,
    status: attendance[`${cls}-${section}-${i}`] ?? null,
  }))

  function mark(id: string, status: Status) {
    setAttendance(p => ({ ...p, [id]: p[id] === status ? null : status }))
    setSaved(false)
  }

  function markAll(status: Status) {
    const patch: Record<string, Status> = {}
    students.forEach(s => { patch[s.id] = status })
    setAttendance(p => ({ ...p, ...patch }))
    setSaved(false)
  }

  const counts = useMemo(() => {
    const vals = students.map(s => attendance[s.id] ?? null)
    return {
      P: vals.filter(v => v === 'P').length,
      A: vals.filter(v => v === 'A').length,
      L: vals.filter(v => v === 'L').length,
      unmarked: vals.filter(v => v === null).length,
    }
  }, [students, attendance])

  const pct = students.length > 0 ? Math.round((counts.P / students.length) * 100) : 0

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const classes = Object.keys(CLASS_DATA)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500 text-sm mt-1">Mark daily attendance for each class</p>
        </div>
        <button onClick={handleSave} disabled={counts.unmarked > 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] disabled:opacity-40 transition-all">
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : `Save Attendance${counts.unmarked > 0 ? ` (${counts.unmarked} left)` : ''}`}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500">Class</label>
          <div className="relative">
            <select value={cls} onChange={e => { setCls(e.target.value); setSection(Object.keys(CLASS_DATA[e.target.value])[0]) }}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-gray-50">
              {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500">Section</label>
          <div className="relative">
            <select value={section} onChange={e => setSection(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-gray-50">
              {sections.map(s => <option key={s} value={s}>Section {s}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-gray-50" />
        </div>
        <div className="ml-auto flex gap-2">
          {(['P', 'A', 'L'] as Status[]).map(s => (
            <button key={s} onClick={() => markAll(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${STATUS_CONFIG[s!].light}`}>
              Mark All {STATUS_CONFIG[s!].label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: students.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Present', value: counts.P, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Absent', value: counts.A, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'On Leave', value: counts.L, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Progress Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Class {cls}-{section} · {date}</span>
          <span className="text-sm font-bold text-gray-900">{pct}% attendance</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
          <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${(counts.P / Math.max(students.length, 1)) * 100}%` }} />
          <div className="bg-red-400 h-full transition-all duration-500" style={{ width: `${(counts.A / Math.max(students.length, 1)) * 100}%` }} />
          <div className="bg-yellow-400 h-full transition-all duration-500" style={{ width: `${(counts.L / Math.max(students.length, 1)) * 100}%` }} />
        </div>
        <div className="flex gap-4 mt-2">
          {[['green', 'Present', counts.P], ['red', 'Absent', counts.A], ['yellow', 'Leave', counts.L]].map(([c, l, v]) => (
            <span key={l as string} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className={`w-2 h-2 rounded-full bg-${c}-500`} style={{ background: c === 'green' ? '#22c55e' : c === 'red' ? '#f87171' : '#facc15' }} />
              {l}: {v}
            </span>
          ))}
        </div>
      </div>

      {/* Student Grid */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">{students.length} Students</h3>
          {counts.unmarked > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5" />{counts.unmarked} unmarked
            </span>
          )}
        </div>
        <div className="divide-y divide-gray-50">
          {students.map((student, i) => {
            const current = attendance[student.id] ?? null
            return (
              <div key={student.id}
                className={`flex items-center px-5 py-3.5 gap-4 transition-colors ${current === null ? 'bg-amber-50/40' : 'hover:bg-gray-50/50'}`}>
                <span className="w-6 text-center text-xs font-medium text-gray-400">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-400 font-mono">{student.rollNo}</p>
                </div>
                <div className="flex gap-2">
                  {(['P', 'A', 'L'] as const).map(s => {
                    const cfg = STATUS_CONFIG[s]
                    const active = current === s
                    return (
                      <button key={s} onClick={() => mark(student.id, s)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all border-2 ${
                          active
                            ? s === 'P' ? 'bg-green-500 border-green-500 text-white shadow-md' :
                              s === 'A' ? 'bg-red-500 border-red-500 text-white shadow-md' :
                              'bg-yellow-400 border-yellow-400 text-white shadow-md'
                            : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:bg-gray-50'
                        }`}>
                        {s}
                      </button>
                    )
                  })}
                </div>
                {current && (
                  <span className={`hidden sm:flex text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_CONFIG[current].light} min-w-[70px] justify-center`}>
                    {STATUS_CONFIG[current].label}
                  </span>
                )}
              </div>
            )
          })}
          {students.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-gray-400">No students in this class/section.</div>
          )}
        </div>
      </div>
    </div>
  )
}
