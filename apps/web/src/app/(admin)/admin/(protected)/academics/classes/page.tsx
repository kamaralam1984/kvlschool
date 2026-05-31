'use client'
import React, { useState, useMemo } from 'react'
import { Search, Plus, X, Users, BookOpen, ChevronDown, Edit2, Trash2 } from 'lucide-react'

interface ClassData {
  id: string
  name: string
  section: string
  stream?: string
  classTeacher: string
  room: string
  strength: number
  boys: number
  girls: number
  subjects: number
}

const MOCK: ClassData[] = [
  { id: '1', name: '7', section: 'A', classTeacher: 'Mrs. Priya Mehta', room: 'R-101', strength: 42, boys: 22, girls: 20, subjects: 8 },
  { id: '2', name: '7', section: 'B', classTeacher: 'Mr. Dinesh Tiwari', room: 'R-102', strength: 40, boys: 20, girls: 20, subjects: 8 },
  { id: '3', name: '8', section: 'A', classTeacher: 'Mrs. Sunita Sharma', room: 'R-201', strength: 38, boys: 18, girls: 20, subjects: 9 },
  { id: '4', name: '8', section: 'B', classTeacher: 'Mr. Anil Verma', room: 'R-202', strength: 36, boys: 19, girls: 17, subjects: 9 },
  { id: '5', name: '9', section: 'A', classTeacher: 'Mrs. Kavita Singh', room: 'R-301', strength: 40, boys: 22, girls: 18, subjects: 9 },
  { id: '6', name: '9', section: 'B', classTeacher: 'Mr. Rajesh Kumar', room: 'R-302', strength: 38, boys: 20, girls: 18, subjects: 9 },
  { id: '7', name: '10', section: 'A', classTeacher: 'Mrs. Anita Joshi', room: 'R-401', strength: 36, boys: 18, girls: 18, subjects: 10 },
  { id: '8', name: '10', section: 'B', classTeacher: 'Mr. Sanjay Rawat', room: 'R-402', strength: 34, boys: 17, girls: 17, subjects: 10 },
  { id: '9', name: '11', section: 'A', stream: 'Science', classTeacher: 'Mrs. Sunita Sharma', room: 'R-501', strength: 30, boys: 16, girls: 14, subjects: 6 },
  { id: '10', name: '11', section: 'A', stream: 'Commerce', classTeacher: 'Mr. Vikas Agarwal', room: 'R-502', strength: 28, boys: 12, girls: 16, subjects: 6 },
  { id: '11', name: '12', section: 'A', stream: 'Science', classTeacher: 'Mrs. Anita Joshi', room: 'R-601', strength: 26, boys: 14, girls: 12, subjects: 6 },
  { id: '12', name: '12', section: 'A', stream: 'Commerce', classTeacher: 'Mrs. Rekha Yadav', room: 'R-602', strength: 24, boys: 10, girls: 14, subjects: 6 },
]

const TEACHERS = ['Mrs. Priya Mehta', 'Mr. Dinesh Tiwari', 'Mrs. Sunita Sharma', 'Mr. Anil Verma', 'Mrs. Kavita Singh', 'Mr. Rajesh Kumar', 'Mrs. Anita Joshi', 'Mr. Sanjay Rawat', 'Mr. Vikas Agarwal', 'Mrs. Rekha Yadav']
const emptyForm: Omit<ClassData, 'id'> = { name: '7', section: 'A', stream: '', classTeacher: TEACHERS[0], room: '', strength: 30, boys: 15, girls: 15, subjects: 8 }

function classLabel(c: ClassData) {
  return `${c.name}${c.section}${c.stream ? ` (${c.stream})` : ''}`
}

const CLASS_COLORS = ['bg-blue-50 border-blue-200', 'bg-purple-50 border-purple-200', 'bg-green-50 border-green-200', 'bg-yellow-50 border-yellow-200', 'bg-pink-50 border-pink-200', 'bg-indigo-50 border-indigo-200']

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassData[]>(MOCK)
  const [search, setSearch] = useState('')
  const [gradeFilter, setGradeFilter] = useState('All')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [selected, setSelected] = useState<ClassData | null>(null)
  const [form, setForm] = useState<Omit<ClassData, 'id'>>(emptyForm)

  const filtered = useMemo(() => classes.filter(c => {
    const q = search.toLowerCase()
    const label = classLabel(c).toLowerCase()
    const matchSearch = label.includes(q) || c.classTeacher.toLowerCase().includes(q) || c.room.toLowerCase().includes(q)
    const matchGrade = gradeFilter === 'All' || c.name === gradeFilter
    return matchSearch && matchGrade
  }), [classes, search, gradeFilter])

  function openAdd() { setForm(emptyForm); setModal('add') }
  function openEdit(c: ClassData) { setSelected(c); setForm({ ...c }); setModal('edit') }
  function closeModal() { setModal(null); setSelected(null) }

  function handleSave() {
    if (modal === 'add') {
      setClasses(prev => [...prev, { ...form, id: String(Date.now()) }])
    } else if (modal === 'edit' && selected) {
      setClasses(prev => prev.map(c => c.id === selected.id ? { ...form, id: c.id } : c))
    }
    closeModal()
  }

  function handleDelete(id: string) {
    if (confirm('Delete this class?')) setClasses(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes & Sections</h1>
          <p className="text-gray-500 text-sm mt-1">Manage class sections, teachers, and student strength.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#162d4a] transition-colors">
          <Plus size={16} /> Add Class
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Classes', value: classes.length },
          { label: 'Total Students', value: classes.reduce((a, c) => a + c.strength, 0) },
          { label: 'Total Boys', value: classes.reduce((a, c) => a + c.boys, 0) },
          { label: 'Total Girls', value: classes.reduce((a, c) => a + c.girls, 0) },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-[#1e3a5f]">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search class, teacher, room..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
        </div>
        <div className="relative">
          <select value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white">
            {['All','7','8','9','10','11','12'].map(g => <option key={g}>{g === 'All' ? 'All Grades' : `Grade ${g}`}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="text-sm text-gray-500 self-center">{filtered.length} classes</div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((c, i) => (
          <div key={c.id} className={`bg-white border-2 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer group ${CLASS_COLORS[i % CLASS_COLORS.length]}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-[#1e3a5f]">Class {classLabel(c)}</h3>
                {c.stream && <span className="text-xs bg-[#d4a017]/20 text-[#d4a017] font-medium px-2 py-0.5 rounded-full">{c.stream}</span>}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={e => { e.stopPropagation(); openEdit(c) }} className="p-1.5 hover:bg-white rounded-lg text-blue-600"><Edit2 size={13} /></button>
                <button onClick={e => { e.stopPropagation(); handleDelete(c.id) }} className="p-1.5 hover:bg-white rounded-lg text-red-500"><Trash2 size={13} /></button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen size={13} className="text-gray-400" />
                <span>{c.classTeacher}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">{c.room}</span>
                <span className="text-gray-400">·</span>
                <span>{c.subjects} subjects</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-[#1e3a5f]" />
                  <span className="text-base font-bold text-[#1e3a5f]">{c.strength}</span>
                  <span className="text-xs text-gray-400">students</span>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="text-blue-600 font-medium">{c.boys}B</span>
                  <span className="text-gray-400"> / </span>
                  <span className="text-pink-600 font-medium">{c.girls}G</span>
                </div>
              </div>
              {/* Gender bar */}
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(c.boys / c.strength) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 text-sm">No classes found.</div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">{modal === 'add' ? 'Add Class' : 'Edit Class'}</h2>
              <button onClick={closeModal} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={16} /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Grade</label>
                  <select value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white">
                    {['7','8','9','10','11','12'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Section</label>
                  <select value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white">
                    {['A','B','C','D'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Stream</label>
                  <select value={form.stream || ''} onChange={e => setForm(f => ({ ...f, stream: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white">
                    <option value="">None</option>
                    <option>Science</option>
                    <option>Commerce</option>
                    <option>Arts</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Class Teacher</label>
                <select value={form.classTeacher} onChange={e => setForm(f => ({ ...f, classTeacher: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white">
                  {TEACHERS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Room Number</label>
                  <input value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" placeholder="e.g. R-101" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Subjects</label>
                  <input type="number" value={form.subjects} onChange={e => setForm(f => ({ ...f, subjects: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Strength</label>
                  <input type="number" value={form.strength} onChange={e => setForm(f => ({ ...f, strength: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Boys</label>
                  <input type="number" value={form.boys} onChange={e => setForm(f => ({ ...f, boys: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Girls</label>
                  <input type="number" value={form.girls} onChange={e => setForm(f => ({ ...f, girls: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={closeModal} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-[#1e3a5f] text-white rounded-xl hover:bg-[#162d4a]">{modal === 'add' ? 'Add Class' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
