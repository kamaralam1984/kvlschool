'use client'
import React, { useState, useMemo } from 'react'
import { Search, Plus, Edit2, Trash2, X, BookOpen, ChevronDown } from 'lucide-react'

interface Subject {
  id: string
  name: string
  code: string
  class: string
  teacher: string
  periodsPerWeek: number
  department: 'Science' | 'Arts' | 'Commerce' | 'Language' | 'Physical'
  status: 'Active' | 'Inactive'
}

const MOCK: Subject[] = [
  { id: '1', name: 'Mathematics', code: 'MATH01', class: '10', teacher: 'Mr. Rajesh Kumar', periodsPerWeek: 6, department: 'Science', status: 'Active' },
  { id: '2', name: 'Physics', code: 'PHY01', class: '11', teacher: 'Mrs. Sunita Sharma', periodsPerWeek: 5, department: 'Science', status: 'Active' },
  { id: '3', name: 'Chemistry', code: 'CHEM01', class: '11', teacher: 'Mr. Anil Verma', periodsPerWeek: 5, department: 'Science', status: 'Active' },
  { id: '4', name: 'English', code: 'ENG01', class: '9', teacher: 'Mrs. Priya Mehta', periodsPerWeek: 5, department: 'Language', status: 'Active' },
  { id: '5', name: 'Hindi', code: 'HIN01', class: '8', teacher: 'Mr. Dinesh Tiwari', periodsPerWeek: 4, department: 'Language', status: 'Active' },
  { id: '6', name: 'Social Science', code: 'SST01', class: '9', teacher: 'Mrs. Kavita Singh', periodsPerWeek: 4, department: 'Arts', status: 'Active' },
  { id: '7', name: 'Computer Science', code: 'CS01', class: '12', teacher: 'Mr. Rahul Gupta', periodsPerWeek: 4, department: 'Science', status: 'Active' },
  { id: '8', name: 'Biology', code: 'BIO01', class: '12', teacher: 'Mrs. Anita Joshi', periodsPerWeek: 5, department: 'Science', status: 'Active' },
  { id: '9', name: 'Physical Education', code: 'PE01', class: '10', teacher: 'Mr. Sanjay Rawat', periodsPerWeek: 2, department: 'Physical', status: 'Active' },
  { id: '10', name: 'Sanskrit', code: 'SKT01', class: '7', teacher: 'Mrs. Meena Pandey', periodsPerWeek: 3, department: 'Language', status: 'Inactive' },
  { id: '11', name: 'Accountancy', code: 'ACC01', class: '11', teacher: 'Mr. Vikas Agarwal', periodsPerWeek: 5, department: 'Commerce', status: 'Active' },
  { id: '12', name: 'Economics', code: 'ECO01', class: '12', teacher: 'Mrs. Rekha Yadav', periodsPerWeek: 4, department: 'Commerce', status: 'Active' },
]

const DEPT_COLORS: Record<string, string> = {
  Science: 'bg-green-100 text-green-700',
  Arts: 'bg-yellow-100 text-yellow-700',
  Commerce: 'bg-blue-100 text-blue-700',
  Language: 'bg-pink-100 text-pink-700',
  Physical: 'bg-orange-100 text-orange-700',
}

const CLASSES = ['All', '7', '8', '9', '10', '11', '12']
const DEPTS = ['All', 'Science', 'Arts', 'Commerce', 'Language', 'Physical']
const TEACHERS = ['Mr. Rajesh Kumar', 'Mrs. Sunita Sharma', 'Mr. Anil Verma', 'Mrs. Priya Mehta', 'Mr. Dinesh Tiwari', 'Mrs. Kavita Singh', 'Mr. Rahul Gupta', 'Mrs. Anita Joshi', 'Mr. Sanjay Rawat', 'Mrs. Meena Pandey', 'Mr. Vikas Agarwal', 'Mrs. Rekha Yadav']

const emptyForm = { name: '', code: '', class: '7', teacher: TEACHERS[0], periodsPerWeek: 4, department: 'Science' as Subject['department'], status: 'Active' as Subject['status'] }

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>(MOCK)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('All')
  const [deptFilter, setDeptFilter] = useState('All')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [selected, setSelected] = useState<Subject | null>(null)
  const [form, setForm] = useState<Omit<Subject, 'id'>>(emptyForm)

  const filtered = useMemo(() => subjects.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.teacher.toLowerCase().includes(q)
    const matchClass = classFilter === 'All' || s.class === classFilter
    const matchDept = deptFilter === 'All' || s.department === deptFilter
    return matchSearch && matchClass && matchDept
  }), [subjects, search, classFilter, deptFilter])

  function openAdd() { setForm(emptyForm); setModal('add') }
  function openEdit(s: Subject) { setSelected(s); setForm({ name: s.name, code: s.code, class: s.class, teacher: s.teacher, periodsPerWeek: s.periodsPerWeek, department: s.department, status: s.status }); setModal('edit') }
  function closeModal() { setModal(null); setSelected(null) }

  function handleSave() {
    if (modal === 'add') {
      setSubjects(prev => [...prev, { ...form, id: String(Date.now()) }])
    } else if (modal === 'edit' && selected) {
      setSubjects(prev => prev.map(s => s.id === selected.id ? { ...form, id: s.id } : s))
    }
    closeModal()
  }

  function handleDelete(id: string) {
    if (confirm('Delete this subject?')) setSubjects(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
          <p className="text-gray-500 text-sm mt-1">Manage curriculum subjects, teachers, and scheduling.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#162d4a] transition-colors">
          <Plus size={16} /> Add Subject
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search subjects, teachers..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
          />
        </div>
        <div className="relative">
          <select value={classFilter} onChange={e => setClassFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 bg-white">
            {CLASSES.map(c => <option key={c}>{c === 'All' ? 'All Classes' : `Class ${c}`}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 bg-white">
            {DEPTS.map(d => <option key={d}>{d === 'All' ? 'All Departments' : d}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="text-sm text-gray-500 self-center">{filtered.length} subjects</div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Subject</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Code</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Class</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Teacher</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Periods/Wk</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Department</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center">
                        <BookOpen size={14} className="text-[#1e3a5f]" />
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600 font-mono">{s.code}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">Class {s.class}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{s.teacher}</td>
                  <td className="px-5 py-3 text-sm text-gray-700 text-center">{s.periodsPerWeek}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${DEPT_COLORS[s.department]}`}>{s.department}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{s.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400 text-sm">No subjects found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">{modal === 'add' ? 'Add Subject' : 'Edit Subject'}</h2>
              <button onClick={closeModal} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={16} /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Subject Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" placeholder="e.g. Mathematics" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Subject Code</label>
                  <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" placeholder="e.g. MATH01" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Class</label>
                  <select value={form.class} onChange={e => setForm(f => ({ ...f, class: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 bg-white">
                    {['7','8','9','10','11','12'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Periods / Week</label>
                  <input type="number" min={1} max={10} value={form.periodsPerWeek} onChange={e => setForm(f => ({ ...f, periodsPerWeek: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Teacher</label>
                <select value={form.teacher} onChange={e => setForm(f => ({ ...f, teacher: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 bg-white">
                  {TEACHERS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Department</label>
                  <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value as Subject['department'] }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 bg-white">
                    {['Science','Arts','Commerce','Language','Physical'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Subject['status'] }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 bg-white">
                    <option>Active</option><option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={closeModal} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-[#1e3a5f] text-white rounded-xl hover:bg-[#162d4a]">{modal === 'add' ? 'Add Subject' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
