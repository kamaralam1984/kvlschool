'use client'

import { useState } from 'react'
import { Save, Send, ChevronDown, Plus, CheckCircle2 } from 'lucide-react'

const EXAMS = [
  { id: 'e1', name: 'Unit Test 1 — April', maxMarks: 25, status: 'published' },
  { id: 'e2', name: 'Mid-Term Exam', maxMarks: 50, status: 'published' },
  { id: 'e3', name: 'Unit Test 2 — May', maxMarks: 25, status: 'draft' },
  { id: 'e4', name: 'Term 2 Final', maxMarks: 100, status: 'upcoming' },
]

const students: Record<string, { id: number; name: string; roll: string }[]> = {
  'Class 10A': [
    { id: 1, name: 'Priya Sharma', roll: '10A01' },
    { id: 2, name: 'Rohan Verma', roll: '10A02' },
    { id: 3, name: 'Ananya Singh', roll: '10A03' },
    { id: 4, name: 'Kabir Mehta', roll: '10A04' },
    { id: 5, name: 'Divya Patel', roll: '10A05' },
    { id: 6, name: 'Aryan Nair', roll: '10A06' },
  ],
  'Class 10B': [
    { id: 7, name: 'Arjun Mehta', roll: '10B01' },
    { id: 8, name: 'Kavya Nair', roll: '10B02' },
    { id: 9, name: 'Vivek Sharma', roll: '10B03' },
    { id: 10, name: 'Pooja Reddy', roll: '10B04' },
  ],
  'Class 9A': [
    { id: 11, name: 'Sneha Patel', roll: '9A01' },
    { id: 12, name: 'Aditya Rao', roll: '9A02' },
    { id: 13, name: 'Tanya Kapoor', roll: '9A03' },
    { id: 14, name: 'Nikhil Verma', roll: '9A04' },
  ],
}

const mockSavedMarks: Record<string, Record<number, number>> = {
  'e1-Class 10A': { 1: 22, 2: 18, 3: 24, 4: 15, 5: 20, 6: 23 },
  'e2-Class 10A': { 1: 45, 2: 38, 3: 47, 4: 32, 5: 43, 6: 48 },
}

function getGrade(score: number, max: number): { grade: string; color: string } {
  const pct = (score / max) * 100
  if (pct >= 90) return { grade: 'A+', color: 'text-green-600 bg-green-50' }
  if (pct >= 80) return { grade: 'A',  color: 'text-green-600 bg-green-50' }
  if (pct >= 70) return { grade: 'B',  color: 'text-blue-600 bg-blue-50' }
  if (pct >= 60) return { grade: 'C',  color: 'text-indigo-600 bg-indigo-50' }
  if (pct >= 50) return { grade: 'D',  color: 'text-amber-600 bg-amber-50' }
  return { grade: 'F', color: 'text-red-600 bg-red-50' }
}

export default function MarksPage() {
  const [selectedClass, setSelectedClass] = useState('Class 10A')
  const [selectedExam, setSelectedExam] = useState('e1')
  const [marks, setMarks] = useState<Record<number, string>>({})
  const [showNew, setShowNew] = useState(false)
  const [saved, setSaved] = useState(false)

  const exam = EXAMS.find(e => e.id === selectedExam)!
  const classList = students[selectedClass] || []
  const cacheKey = `${selectedExam}-${selectedClass}`
  const saved_marks = mockSavedMarks[cacheKey] || {}

  const getMark = (id: number) => marks[id] !== undefined ? marks[id] : (saved_marks[id] !== undefined ? String(saved_marks[id]) : '')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const entered = classList.filter(s => getMark(s.id) !== '').length
  const avg = classList.length > 0
    ? classList.reduce((sum, s) => sum + (parseFloat(getMark(s.id)) || 0), 0) / (entered || 1)
    : 0

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Marks Entry</h2>
          <p className="text-sm text-gray-500 mt-0.5">Enter and manage examination marks</p>
        </div>
        <button
          onClick={() => setShowNew(o => !o)}
          className="btn-primary"
        >
          <Plus size={15} /> New Exam
        </button>
      </div>

      {/* New Exam Form */}
      {showNew && (
        <div className="card border-indigo-100 bg-indigo-50/30">
          <h3 className="font-semibold text-gray-800 mb-3">Create New Exam</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="form-label">Exam Name</label>
              <input className="form-input" placeholder="e.g. Unit Test 3" />
            </div>
            <div>
              <label className="form-label">Max Marks</label>
              <input type="number" className="form-input" placeholder="100" />
            </div>
            <div>
              <label className="form-label">Exam Date</label>
              <input type="date" className="form-input" />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary">Create Exam</button>
            <button onClick={() => setShowNew(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Exam Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {EXAMS.map(exam => (
          <button
            key={exam.id}
            onClick={() => setSelectedExam(exam.id)}
            className={`text-left p-4 rounded-xl border transition-all ${
              selectedExam === exam.id
                ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                : 'border-gray-100 bg-white hover:border-indigo-200'
            }`}
          >
            <p className="text-sm font-semibold text-gray-800 mb-1">{exam.name}</p>
            <p className="text-xs text-gray-500">Max: {exam.maxMarks} marks</p>
            <span className={`badge mt-2 text-xs ${
              exam.status === 'published' ? 'bg-green-100 text-green-700' :
              exam.status === 'draft' ? 'bg-amber-100 text-amber-700' :
              'bg-gray-100 text-gray-500'
            }`}>
              {exam.status}
            </span>
          </button>
        ))}
      </div>

      {/* Class selector + marks table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Class:</label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={e => { setSelectedClass(e.target.value); setMarks({}) }}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 pr-7 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.keys(students).map(c => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <span className="text-sm text-gray-500">·</span>
          <span className="text-sm font-medium text-indigo-700">{exam.name}</span>
          <span className="text-sm text-gray-400">({exam.maxMarks} max)</span>
          <div className="ml-auto flex gap-3">
            <span className="text-xs text-gray-500">{entered}/{classList.length} entered</span>
            <span className="text-xs text-gray-500">Avg: {avg.toFixed(1)}</span>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr>
              <th className="table-th">#</th>
              <th className="table-th">Student</th>
              <th className="table-th">Roll No.</th>
              <th className="table-th">Marks /{exam.maxMarks}</th>
              <th className="table-th">Grade</th>
              <th className="table-th">%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {classList.map((s, idx) => {
              const val = getMark(s.id)
              const num = parseFloat(val)
              const valid = !isNaN(num) && num >= 0 && num <= exam.maxMarks
              const grade = valid ? getGrade(num, exam.maxMarks) : null
              return (
                <tr key={s.id} className="hover:bg-gray-50/60">
                  <td className="table-td text-gray-400">{idx + 1}</td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-800">{s.name}</span>
                    </div>
                  </td>
                  <td className="table-td text-gray-500">{s.roll}</td>
                  <td className="table-td">
                    <input
                      type="number"
                      min={0}
                      max={exam.maxMarks}
                      value={val}
                      onChange={e => setMarks(prev => ({ ...prev, [s.id]: e.target.value }))}
                      className={`w-20 border rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        val && !valid ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="—"
                    />
                  </td>
                  <td className="table-td">
                    {grade && (
                      <span className={`badge font-bold ${grade.color}`}>{grade.grade}</span>
                    )}
                  </td>
                  <td className="table-td">
                    {valid && (
                      <span className="text-sm text-gray-600">
                        {Math.round((num / exam.maxMarks) * 100)}%
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 items-center justify-end">
          <button onClick={handleSave} className="btn-secondary">
            <Save size={15} /> Save Draft
          </button>
          <button className="btn-primary">
            <Send size={15} /> Submit for Review
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle2 size={14} /> Saved!
            </span>
          )}
        </div>
      </div>

      {/* Published Results Summary */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">Published Results — {selectedClass}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Highest', value: '48/50', color: 'text-green-600' },
            { label: 'Lowest', value: '32/50', color: 'text-red-500' },
            { label: 'Average', value: '43.2', color: 'text-indigo-600' },
            { label: 'Pass Rate', value: '100%', color: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
