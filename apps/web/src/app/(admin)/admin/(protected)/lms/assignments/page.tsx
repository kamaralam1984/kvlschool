'use client'
import React, { useState } from 'react'
import { BookOpen, CheckCircle, Clock, Plus, X, ChevronDown, Eye, FileText, Upload } from 'lucide-react'

type AssignmentStatus = 'Active' | 'Closed' | 'Graded'

interface Student {
  id: string; name: string; rollNo: string; submitted: boolean; marks: number | null; submittedOn?: string
}

interface Assignment {
  id: string; title: string; subject: string; class: string
  assignedDate: string; dueDate: string; maxMarks: number
  totalStudents: number; submissions: number
  status: AssignmentStatus; description: string
  students: Student[]
}

const MOCK_STUDENTS: Student[] = [
  { id:'s1', name:'Arjun Mehta', rollNo:'R001', submitted:true, marks:88, submittedOn:'2025-01-14' },
  { id:'s2', name:'Priya Nair', rollNo:'R002', submitted:true, marks:92, submittedOn:'2025-01-13' },
  { id:'s3', name:'Rohit Singh', rollNo:'R003', submitted:false, marks:null },
  { id:'s4', name:'Sneha Patel', rollNo:'R004', submitted:true, marks:75, submittedOn:'2025-01-15' },
  { id:'s5', name:'Dev Kumar', rollNo:'R005', submitted:true, marks:null, submittedOn:'2025-01-14' },
  { id:'s6', name:'Ananya Verma', rollNo:'R006', submitted:false, marks:null },
  { id:'s7', name:'Kiran Rao', rollNo:'R007', submitted:true, marks:95, submittedOn:'2025-01-12' },
]

const MOCK: Assignment[] = [
  { id:'1', title:'Newton\'s Laws of Motion — Problems Set', subject:'Physics', class:'Class 11-A', assignedDate:'2025-01-08', dueDate:'2025-01-15', maxMarks:50, totalStudents:52, submissions:45, status:'Graded', description:'Solve all 20 problems from Chapter 5 covering Newton\'s three laws with diagrams.', students: MOCK_STUDENTS },
  { id:'2', title:'Essay: The French Revolution', subject:'History', class:'Class 10-B', assignedDate:'2025-01-10', dueDate:'2025-01-20', maxMarks:30, totalStudents:48, submissions:32, status:'Active', description:'Write a 1000-word essay on the causes and effects of the French Revolution.', students: MOCK_STUDENTS.slice(0,5) },
  { id:'3', title:'Quadratic Equations — Worksheet', subject:'Mathematics', class:'Class 9-A', assignedDate:'2025-01-05', dueDate:'2025-01-12', maxMarks:25, totalStudents:50, submissions:50, status:'Graded', description:'Complete all exercises from the quadratic equations worksheet, showing full working.', students: MOCK_STUDENTS },
  { id:'4', title:'Lab Report: Acid-Base Titration', subject:'Chemistry', class:'Class 11-B', assignedDate:'2025-01-12', dueDate:'2025-01-25', maxMarks:40, totalStudents:45, submissions:18, status:'Active', description:'Write a complete lab report for the acid-base titration experiment conducted in class.', students: MOCK_STUDENTS.slice(0,4) },
  { id:'5', title:'Poem Analysis: The Road Not Taken', subject:'English', class:'Class 8-A', assignedDate:'2025-01-03', dueDate:'2025-01-10', maxMarks:20, totalStudents:55, submissions:55, status:'Closed', description:'Analyze the poem "The Road Not Taken" by Robert Frost covering theme, tone, and literary devices.', students: MOCK_STUDENTS },
  { id:'6', title:'Map Work: Rivers of India', subject:'Geography', class:'Class 7-B', assignedDate:'2025-01-14', dueDate:'2025-01-28', maxMarks:15, totalStudents:52, submissions:10, status:'Active', description:'Mark and label major rivers of India on the outline map provided in class.', students: MOCK_STUDENTS.slice(0,3) },
]

const statusColor: Record<AssignmentStatus, string> = {
  Active: 'bg-green-50 text-green-700',
  Closed: 'bg-gray-100 text-gray-600',
  Graded: 'bg-blue-50 text-blue-700',
}

const emptyForm = { title:'', subject:'', class:'Class 9-A', dueDate:'', maxMarks:50, description:'' }
const CLASSES = ['Class 7-A','Class 7-B','Class 8-A','Class 8-B','Class 9-A','Class 9-B','Class 10-A','Class 10-B','Class 11-A','Class 11-B','Class 12-A','Class 12-B']

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK)
  const [statusFilter, setStatusFilter] = useState('All')
  const [classFilter, setClassFilter] = useState('All')
  const [showAdd, setShowAdd] = useState(false)
  const [viewSubmissions, setViewSubmissions] = useState<Assignment | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [marks, setMarks] = useState<Record<string, string>>({})

  const filtered = assignments.filter(a =>
    (statusFilter === 'All' || a.status === statusFilter) &&
    (classFilter === 'All' || a.class === classFilter)
  )

  const active = assignments.filter(a => a.status === 'Active').length
  const graded = assignments.filter(a => a.status === 'Graded').length
  const totalSubs = assignments.reduce((s, a) => s + a.submissions, 0)

  function handleAdd() {
    const newAssignment: Assignment = {
      id: String(Date.now()), title: form.title, subject: form.subject, class: form.class,
      assignedDate: new Date().toISOString().split('T')[0], dueDate: form.dueDate,
      maxMarks: form.maxMarks, totalStudents: 48, submissions: 0,
      status: 'Active', description: form.description, students: []
    }
    setAssignments(prev => [newAssignment, ...prev])
    setShowAdd(false)
    setForm({ ...emptyForm })
  }

  function saveMarks(assignmentId: string) {
    setAssignments(prev => prev.map(a => {
      if (a.id !== assignmentId) return a
      const updatedStudents = a.students.map(s => ({
        ...s,
        marks: marks[s.id] !== undefined ? Number(marks[s.id]) : s.marks
      }))
      return { ...a, students: updatedStudents, status: 'Graded' }
    }))
    setViewSubmissions(null)
    setMarks({})
  }

  const allClasses = ['All', ...Array.from(new Set(MOCK.map(a => a.class)))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignment Management</h1>
          <p className="text-gray-500 text-sm mt-1">Create, track, and grade student assignments</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Plus className="w-4 h-4" /> Add Assignment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label:'Active Assignments', value:String(active), sub:'Pending submissions', icon: BookOpen, color:'bg-green-50 text-green-600' },
          { label:'Graded', value:String(graded), sub:'Completed & graded', icon: CheckCircle, color:'bg-blue-50 text-blue-600' },
          { label:'Total Submissions', value:String(totalSubs), sub:'Across all assignments', icon: FileText, color:'bg-purple-50 text-purple-600' },
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
          { label:'Status', val: statusFilter, set: setStatusFilter, opts: ['All','Active','Closed','Graded'] },
          { label:'Class', val: classFilter, set: setClassFilter, opts: allClasses },
        ].map(f => (
          <div key={f.label} className="relative">
            <select value={f.val} onChange={e => f.set(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#1e3a5f]/40 bg-white cursor-pointer">
              {f.opts.map(o => <option key={o}>{o === 'All' ? `${f.label}: All` : o}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        ))}
        <p className="ml-auto text-sm text-gray-500">{filtered.length} assignments</p>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Title','Subject','Class','Assigned','Due Date','Max Marks','Submissions','Status','Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(a => {
                const pct = Math.round((a.submissions / a.totalStudents) * 100)
                return (
                  <tr key={a.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-900 max-w-[200px] truncate">{a.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{a.description}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 whitespace-nowrap">{a.subject}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 whitespace-nowrap">{a.class}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{a.assignedDate}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {a.dueDate}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{a.maxMarks}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div className="bg-[#1e3a5f] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-sm text-gray-700 whitespace-nowrap">{a.submissions}/{a.totalStudents}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[a.status]}`}>{a.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => { setViewSubmissions(a); setMarks({}) }}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-700 transition-colors text-xs font-medium">
                        <Eye className="w-3.5 h-3.5" /> Submissions
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-sm text-gray-400">No assignments match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submissions Modal */}
      {viewSubmissions && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Submissions</h2>
                <p className="text-sm text-gray-500">{viewSubmissions.title}</p>
              </div>
              <button onClick={() => setViewSubmissions(null)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <div className="flex items-center justify-between mb-4 text-sm">
                <span className="text-gray-500">{viewSubmissions.submissions}/{viewSubmissions.totalStudents} submitted</span>
                <span className="text-gray-500">Max Marks: <strong>{viewSubmissions.maxMarks}</strong></span>
              </div>
              <div className="space-y-2">
                {viewSubmissions.students.map(s => (
                  <div key={s.id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
                    <div className="w-8 h-8 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[#1e3a5f]">{s.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.rollNo}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {s.submitted ? (
                        <>
                          <span className="text-xs text-green-600 font-medium">Submitted {s.submittedOn}</span>
                          <div className="flex items-center gap-1">
                            <input type="number" min={0} max={viewSubmissions.maxMarks}
                              value={marks[s.id] !== undefined ? marks[s.id] : (s.marks !== null ? String(s.marks) : '')}
                              onChange={e => setMarks(p => ({ ...p, [s.id]: e.target.value }))}
                              placeholder="—"
                              className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:border-[#1e3a5f]/40" />
                            <span className="text-xs text-gray-400">/{viewSubmissions.maxMarks}</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-red-500 font-medium">Not Submitted</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setViewSubmissions(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Close</button>
              <button onClick={() => saveMarks(viewSubmissions.id)} className="px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] transition-colors">Save Marks & Grade</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add New Assignment</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[{ label:'Assignment Title', key:'title', type:'text', span:true },
                  { label:'Subject', key:'subject', type:'text', span:false },
                  { label:'Due Date', key:'dueDate', type:'date', span:false },
                  { label:'Max Marks', key:'maxMarks', type:'number', span:false },
                ].map(f => (
                  <div key={f.key} className={f.span ? 'col-span-2' : ''}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                    <input type={f.type} value={(form as any)[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Class</label>
                  <div className="relative">
                    <select value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value }))}
                      className="w-full appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 bg-white">
                      {CLASSES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Attachment (Mock)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#1e3a5f]/30 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload or drag & drop</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOCX, JPG up to 10MB</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleAdd} className="px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] transition-colors">Create Assignment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
