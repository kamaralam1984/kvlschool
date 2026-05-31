'use client'
import React, { useState, useMemo } from 'react'
import { Search, Plus, Edit2, Trash2, Eye, X, ChevronDown, Phone, Mail, GraduationCap, Award, Filter } from 'lucide-react'

interface Teacher {
  id: string
  name: string
  teacherId: string
  subjects: string[]
  classTeacherOf: string
  qualification: string
  experience: number
  phone: string
  email: string
  department: string
  status: 'Active' | 'On Leave' | 'Inactive'
  joinDate: string
  address: string
}

const MOCK: Teacher[] = [
  {
    id: 'T001', name: 'Mr. Anil Kumar', teacherId: 'KVL-T-001', subjects: ['Mathematics'], classTeacherOf: '10A',
    qualification: 'M.Sc Mathematics, B.Ed', experience: 14, phone: '9876543210', email: 'anil.kumar@kvlschool.edu.in',
    department: 'Science & Mathematics', status: 'Active', joinDate: '01 Apr 2012', address: '24, MG Road, Bangalore - 560001',
  },
  {
    id: 'T002', name: 'Mrs. Priya Sharma', teacherId: 'KVL-T-002', subjects: ['Chemistry', 'Science'], classTeacherOf: '11A',
    qualification: 'M.Sc Chemistry, B.Ed', experience: 9, phone: '9876543211', email: 'priya.sharma@kvlschool.edu.in',
    department: 'Science & Mathematics', status: 'Active', joinDate: '15 Jun 2016', address: '12, Koramangala, Bangalore - 560034',
  },
  {
    id: 'T003', name: 'Mrs. Kavita Rao', teacherId: 'KVL-T-003', subjects: ['English', 'English Literature'], classTeacherOf: '12A',
    qualification: 'MA English, B.Ed', experience: 18, phone: '9876543212', email: 'kavita.rao@kvlschool.edu.in',
    department: 'Languages', status: 'Active', joinDate: '10 Jul 2008', address: '8, Indiranagar, Bangalore - 560038',
  },
  {
    id: 'T004', name: 'Mr. Suresh Pillai', teacherId: 'KVL-T-004', subjects: ['Physics'], classTeacherOf: '12B',
    qualification: 'M.Sc Physics, B.Ed', experience: 11, phone: '9876543213', email: 'suresh.pillai@kvlschool.edu.in',
    department: 'Science & Mathematics', status: 'Active', joinDate: '20 Jan 2015', address: '5, Whitefield, Bangalore - 560066',
  },
  {
    id: 'T005', name: 'Mrs. Deepa Nair', teacherId: 'KVL-T-005', subjects: ['History', 'Social Science'], classTeacherOf: '9A',
    qualification: 'MA History, B.Ed', experience: 7, phone: '9876543214', email: 'deepa.nair@kvlschool.edu.in',
    department: 'Social Sciences', status: 'On Leave', joinDate: '03 Mar 2019', address: '19, Jayanagar, Bangalore - 560041',
  },
  {
    id: 'T006', name: 'Mrs. Sneha Joshi', teacherId: 'KVL-T-006', subjects: ['Computer Science', 'Python Programming'], classTeacherOf: '11B',
    qualification: 'MCA, B.Ed', experience: 6, phone: '9876543215', email: 'sneha.joshi@kvlschool.edu.in',
    department: 'Technology', status: 'Active', joinDate: '12 Aug 2020', address: '31, BTM Layout, Bangalore - 560076',
  },
  {
    id: 'T007', name: 'Mr. Rajesh Gupta', teacherId: 'KVL-T-007', subjects: ['Hindi', 'Sanskrit'], classTeacherOf: '9B',
    qualification: 'MA Hindi, B.Ed', experience: 13, phone: '9876543216', email: 'rajesh.gupta@kvlschool.edu.in',
    department: 'Languages', status: 'Active', joinDate: '05 Sep 2013', address: '22, Rajajinagar, Bangalore - 560010',
  },
  {
    id: 'T008', name: 'Mrs. Anita Menon', teacherId: 'KVL-T-008', subjects: ['Biology', 'Environmental Science'], classTeacherOf: '10B',
    qualification: 'M.Sc Biology, B.Ed', experience: 10, phone: '9876543217', email: 'anita.menon@kvlschool.edu.in',
    department: 'Science & Mathematics', status: 'Active', joinDate: '22 Nov 2015', address: '14, HSR Layout, Bangalore - 560102',
  },
]

const DEPARTMENTS = ['All', 'Science & Mathematics', 'Languages', 'Social Sciences', 'Technology']
const SUBJECTS_ALL = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Computer Science', 'Hindi']
const STATUSES = ['All', 'Active', 'On Leave', 'Inactive']

const emptyTeacher: Omit<Teacher, 'id'> = {
  name: '', teacherId: '', subjects: [], classTeacherOf: '', qualification: '', experience: 0,
  phone: '', email: '', department: '', status: 'Active', joinDate: '', address: '',
}

function statusBadge(status: string) {
  if (status === 'Active') return 'bg-green-100 text-green-700'
  if (status === 'On Leave') return 'bg-amber-100 text-amber-700'
  return 'bg-gray-100 text-gray-500'
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modal, setModal] = useState<'add' | 'edit' | 'view' | null>(null)
  const [selected, setSelected] = useState<Teacher | null>(null)
  const [form, setForm] = useState<Omit<Teacher, 'id'>>(emptyTeacher)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = useMemo(() => teachers.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.teacherId.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === 'All' || t.department === deptFilter
    const matchSubject = subjectFilter === 'All' || t.subjects.some((s) => s === subjectFilter)
    const matchStatus = statusFilter === 'All' || t.status === statusFilter
    return matchSearch && matchDept && matchSubject && matchStatus
  }), [teachers, search, deptFilter, subjectFilter, statusFilter])

  const openAdd = () => { setForm(emptyTeacher); setModal('add') }
  const openEdit = (t: Teacher) => { setSelected(t); setForm({ ...t }); setModal('edit') }
  const openView = (t: Teacher) => { setSelected(t); setModal('view') }
  const closeModal = () => { setModal(null); setSelected(null) }

  const handleSave = () => {
    if (modal === 'add') {
      setTeachers((prev) => [...prev, { ...form, id: `T${Date.now()}` }])
    } else if (modal === 'edit' && selected) {
      setTeachers((prev) => prev.map((t) => t.id === selected.id ? { ...form, id: t.id } : t))
    }
    closeModal()
  }

  const handleDelete = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id))
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers Directory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all teaching staff records for KVL International School</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#16304f] transition-colors"
        >
          <Plus size={16} />Add Teacher
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Teachers', value: teachers.length, color: 'text-[#1e3a5f]' },
          { label: 'Active', value: teachers.filter(t => t.status === 'Active').length, color: 'text-green-600' },
          { label: 'On Leave', value: teachers.filter(t => t.status === 'On Leave').length, color: 'text-amber-600' },
          { label: 'Avg Experience', value: `${Math.round(teachers.reduce((a, t) => a + t.experience, 0) / teachers.length)} yrs`, color: 'text-purple-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID or email..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
          />
        </div>
        {[
          { label: 'Department', value: deptFilter, set: setDeptFilter, options: DEPARTMENTS },
          { label: 'Subject', value: subjectFilter, set: setSubjectFilter, options: SUBJECTS_ALL },
          { label: 'Status', value: statusFilter, set: setStatusFilter, options: STATUSES },
        ].map(({ label, value, set, options }) => (
          <div key={label} className="relative">
            <select
              value={value}
              onChange={(e) => set(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none bg-white"
            >
              {options.map((o) => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        ))}
        <span className="ml-auto flex items-center text-sm text-gray-500 gap-1"><Filter size={13} />{filtered.length} teachers</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Teacher ID', 'Name', 'Subject(s)', 'Class Teacher Of', 'Qualification', 'Exp (yrs)', 'Phone', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-gray-500">{t.teacherId}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {t.subjects.map((s) => (
                        <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-medium">{t.classTeacherOf || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[180px]">
                    <p className="truncate text-xs">{t.qualification}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-medium text-center">{t.experience}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{t.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge(t.status)}`}>{t.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openView(t)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Eye size={14} /></button>
                      <button onClick={() => openEdit(t)} className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteConfirm(t.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <GraduationCap size={36} className="mx-auto mb-3 text-gray-200" />
              <p className="text-sm">No teachers match your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-[#1e3a5f] p-6 text-white relative">
              <button onClick={closeModal} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg"><X size={16} /></button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
                  {selected.name.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selected.name}</h2>
                  <p className="text-blue-200 text-sm">{selected.teacherId} · {selected.department}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Subjects', value: selected.subjects.join(', '), icon: GraduationCap },
                  { label: 'Class Teacher Of', value: selected.classTeacherOf || 'Not Assigned', icon: Award },
                  { label: 'Phone', value: selected.phone, icon: Phone },
                  { label: 'Email', value: selected.email, icon: Mail },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={12} className="text-[#1e3a5f]" />
                      <p className="text-xs text-gray-500">{label}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Experience', value: `${selected.experience} yrs` },
                  { label: 'Join Date', value: selected.joinDate },
                  { label: 'Status', value: selected.status },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-0.5">Qualification</p>
                <p className="text-sm text-gray-800">{selected.qualification}</p>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => openEdit(selected)} className="flex-1 bg-[#1e3a5f] text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                  <Edit2 size={14} />Edit Profile
                </button>
                <button onClick={closeModal} className="flex-1 border border-gray-200 py-2 rounded-xl text-sm">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-bold text-gray-900">{modal === 'add' ? 'Add New Teacher' : 'Edit Teacher'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Full Name', key: 'name', placeholder: 'e.g. Mr. Anil Kumar' },
                  { label: 'Teacher ID', key: 'teacherId', placeholder: 'e.g. KVL-T-009' },
                  { label: 'Class Teacher Of', key: 'classTeacherOf', placeholder: 'e.g. 10A' },
                  { label: 'Experience (years)', key: 'experience', placeholder: '0', type: 'number' },
                  { label: 'Phone', key: 'phone', placeholder: '9876543210' },
                  { label: 'Email', key: 'email', placeholder: 'teacher@kvlschool.edu.in' },
                  { label: 'Join Date', key: 'joinDate', placeholder: 'e.g. 01 Apr 2020' },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key} className={key === 'email' || key === 'joinDate' ? 'col-span-2' : ''}>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
                    <input
                      type={type || 'text'}
                      value={(form as any)[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: type === 'number' ? +e.target.value : e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Subjects (comma-separated)</label>
                <input
                  value={form.subjects.join(', ')}
                  onChange={(e) => setForm((f) => ({ ...f, subjects: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
                  placeholder="e.g. Mathematics, Statistics"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none bg-white"
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.slice(1).map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Teacher['status'] }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none bg-white"
                  >
                    {STATUSES.slice(1).map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Qualification</label>
                <input
                  value={form.qualification}
                  onChange={(e) => setForm((f) => ({ ...f, qualification: e.target.value }))}
                  placeholder="e.g. M.Sc Mathematics, B.Ed"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Address</label>
                <input
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Full address"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={closeModal} className="flex-1 border border-gray-200 py-2 rounded-xl text-sm">Cancel</button>
                <button onClick={handleSave} className="flex-1 bg-[#1e3a5f] text-white py-2 rounded-xl text-sm font-medium">
                  {modal === 'add' ? 'Add Teacher' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Delete Teacher?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone. All records for this teacher will be removed.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 py-2 rounded-xl text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
