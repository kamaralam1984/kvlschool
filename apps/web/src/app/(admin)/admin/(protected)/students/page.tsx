'use client'
import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Search, Plus, Filter, Edit2, Trash2, Eye, X, GraduationCap, Phone, Mail, MapPin, ChevronDown, RefreshCw } from 'lucide-react'
import { studentsApi, type StudentAPI } from '@/lib/api'

interface Student {
  id: string; name: string; rollNo: string; class: string; section: string;
  gender: 'Male' | 'Female'; dob: string; phone: string; email: string;
  address: string; status: 'Active' | 'Inactive' | 'Transfer'; feeStatus: 'Paid' | 'Pending' | 'Overdue';
  admissionDate: string; parentName: string; photo?: string;
}

function mapApiToStudent(s: StudentAPI): Student {
  return {
    id: s._id,
    name: s.userId?.name ?? 'Unknown',
    rollNo: s.rollNo ?? s.admissionNo ?? '—',
    class: s.class ?? '—',
    section: s.section ?? '—',
    gender: (s.gender === 'female' ? 'Female' : 'Male') as 'Male' | 'Female',
    dob: s.dateOfBirth ? new Date(s.dateOfBirth).toISOString().slice(0, 10) : '',
    phone: (s.userId as any)?.phone ?? '—',
    email: s.userId?.email ?? '—',
    address: s.address ? `${s.address.city}, ${s.address.state}` : '—',
    status: s.isActive ? 'Active' : 'Inactive',
    feeStatus: (s.feeStatus as any) ?? 'Pending',
    admissionDate: s.admissionDate ? new Date(s.admissionDate).toISOString().slice(0, 10) : '',
    parentName: '—',
  }
}

// Fallback mock for when API has no data yet
const MOCK: Student[] = [
  { id: '1', name: 'Aarav Sharma', rollNo: 'KVL-2024-001', class: '10', section: 'A', gender: 'Male', dob: '2009-04-12', phone: '9876543210', email: 'aarav@example.com', address: 'Lucknow, UP', status: 'Active', feeStatus: 'Paid', admissionDate: '2020-06-01', parentName: 'Ramesh Sharma' },
  { id: '2', name: 'Priya Singh', rollNo: 'KVL-2024-002', class: '10', section: 'B', gender: 'Female', dob: '2009-07-22', phone: '9876543211', email: 'priya@example.com', address: 'Kanpur, UP', status: 'Active', feeStatus: 'Pending', admissionDate: '2020-06-01', parentName: 'Suresh Singh' },
  { id: '3', name: 'Rohan Verma', rollNo: 'KVL-2024-003', class: '9', section: 'A', gender: 'Male', dob: '2010-01-15', phone: '9876543212', email: 'rohan@example.com', address: 'Agra, UP', status: 'Active', feeStatus: 'Paid', admissionDate: '2021-06-01', parentName: 'Mohan Verma' },
  { id: '4', name: 'Ananya Gupta', rollNo: 'KVL-2024-004', class: '11', section: 'A', gender: 'Female', dob: '2008-11-30', phone: '9876543213', email: 'ananya@example.com', address: 'Varanasi, UP', status: 'Active', feeStatus: 'Overdue', admissionDate: '2019-06-01', parentName: 'Rajesh Gupta' },
  { id: '5', name: 'Arjun Mishra', rollNo: 'KVL-2024-005', class: '8', section: 'C', gender: 'Male', dob: '2011-03-08', phone: '9876543214', email: 'arjun@example.com', address: 'Allahabad, UP', status: 'Inactive', feeStatus: 'Pending', admissionDate: '2022-06-01', parentName: 'Vijay Mishra' },
  { id: '6', name: 'Kavya Patel', rollNo: 'KVL-2024-006', class: '12', section: 'B', gender: 'Female', dob: '2007-09-19', phone: '9876543215', email: 'kavya@example.com', address: 'Mathura, UP', status: 'Active', feeStatus: 'Paid', admissionDate: '2018-06-01', parentName: 'Dinesh Patel' },
  { id: '7', name: 'Dev Agarwal', rollNo: 'KVL-2024-007', class: '7', section: 'A', gender: 'Male', dob: '2012-06-25', phone: '9876543216', email: 'dev@example.com', address: 'Meerut, UP', status: 'Active', feeStatus: 'Paid', admissionDate: '2022-06-01', parentName: 'Sunil Agarwal' },
  { id: '8', name: 'Sneha Yadav', rollNo: 'KVL-2024-008', class: '9', section: 'B', gender: 'Female', dob: '2010-12-05', phone: '9876543217', email: 'sneha@example.com', address: 'Bareilly, UP', status: 'Transfer', feeStatus: 'Paid', admissionDate: '2021-06-01', parentName: 'Manoj Yadav' },
]

const CLASSES = ['All', '7', '8', '9', '10', '11', '12']
const STATUSES = ['All', 'Active', 'Inactive', 'Transfer']
const FEE_STATUSES = ['All', 'Paid', 'Pending', 'Overdue']

const feeColor: Record<string, string> = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Overdue: 'bg-red-100 text-red-700',
}
const statusColor: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-gray-100 text-gray-600',
  Transfer: 'bg-blue-100 text-blue-700',
}

const emptyStudent: Omit<Student, 'id'> = {
  name: '', rollNo: '', class: '10', section: 'A', gender: 'Male', dob: '',
  phone: '', email: '', address: '', status: 'Active', feeStatus: 'Pending',
  admissionDate: new Date().toISOString().slice(0, 10), parentName: '',
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(MOCK)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [feeFilter, setFeeFilter] = useState('All')
  const [modal, setModal] = useState<'add' | 'edit' | 'view' | null>(null)
  const [selected, setSelected] = useState<Student | null>(null)
  const [form, setForm] = useState<Omit<Student, 'id'>>(emptyStudent)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await studentsApi.list({ limit: 100 })
      if (res.data && res.data.length > 0) {
        setStudents(res.data.map(mapApiToStudent))
        setTotal(res.meta.total)
        setApiError(false)
      } else {
        // API returned empty — use mock data for demo
        setStudents(MOCK)
        setTotal(MOCK.length)
      }
    } catch {
      setApiError(true)
      setStudents(MOCK)
      setTotal(MOCK.length)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  const filtered = useMemo(() => students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.parentName.toLowerCase().includes(search.toLowerCase())
    const matchClass = classFilter === 'All' || s.class === classFilter
    const matchStatus = statusFilter === 'All' || s.status === statusFilter
    const matchFee = feeFilter === 'All' || s.feeStatus === feeFilter
    return matchSearch && matchClass && matchStatus && matchFee
  }), [students, search, classFilter, statusFilter, feeFilter])

  function openAdd() { setForm(emptyStudent); setModal('add') }
  function openEdit(s: Student) { setSelected(s); setForm({ ...s }); setModal('edit') }
  function openView(s: Student) { setSelected(s); setModal('view') }
  function closeModal() { setModal(null); setSelected(null) }

  function handleSave() {
    if (modal === 'add') {
      setStudents(prev => [...prev, { ...form, id: String(Date.now()) }])
    } else if (modal === 'edit' && selected) {
      setStudents(prev => prev.map(s => s.id === selected.id ? { ...form, id: s.id } : s))
    }
    closeModal()
  }

  function handleDelete(id: string) {
    if (confirm('Delete this student?')) setStudents(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-500 text-sm">{total || students.length} total · {filtered.length} shown</p>
            {apiError && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Demo data</span>}
            {!apiError && !loading && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">● Live</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchStudents} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, roll no, parent…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 focus:ring-1 focus:ring-[#1e3a5f]/10" />
          </div>
          {[
            { label: 'Class', val: classFilter, set: setClassFilter, opts: CLASSES },
            { label: 'Status', val: statusFilter, set: setStatusFilter, opts: STATUSES },
            { label: 'Fee', val: feeFilter, set: setFeeFilter, opts: FEE_STATUSES },
          ].map(f => (
            <div key={f.label} className="relative">
              <select value={f.val} onChange={e => f.set(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#1e3a5f]/40 bg-white cursor-pointer">
                {f.opts.map(o => <option key={o} value={o}>{f.label}: {o}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Student', 'Roll No', 'Class', 'Parent', 'Phone', 'Status', 'Fee', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-4 h-4 text-[#1e3a5f]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 font-mono">{s.rollNo}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">Class {s.class} – {s.section}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{s.parentName}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{s.phone}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${feeColor[s.feeStatus]}`}>{s.feeStatus}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openView(s)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400">No students match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{modal === 'add' ? 'Add New Student' : 'Edit Student'}</h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Full Name', key: 'name', type: 'text' },
                { label: 'Roll No', key: 'rollNo', type: 'text' },
                { label: 'Date of Birth', key: 'dob', type: 'date' },
                { label: 'Phone', key: 'phone', type: 'tel' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Parent Name', key: 'parentName', type: 'text' },
                { label: 'Admission Date', key: 'admissionDate', type: 'date' },
                { label: 'Address', key: 'address', type: 'text' },
              ].map(f => (
                <div key={f.key} className={f.key === 'address' ? 'col-span-2' : ''}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
              ))}
              {[
                { label: 'Class', key: 'class', opts: ['7','8','9','10','11','12'] },
                { label: 'Section', key: 'section', opts: ['A','B','C','D'] },
                { label: 'Gender', key: 'gender', opts: ['Male','Female'] },
                { label: 'Status', key: 'status', opts: ['Active','Inactive','Transfer'] },
                { label: 'Fee Status', key: 'feeStatus', opts: ['Paid','Pending','Overdue'] },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <select value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 bg-white">
                    {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] transition-colors">
                {modal === 'add' ? 'Add Student' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Student Profile</h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#1e3a5f]/10 flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-[#1e3a5f]" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{selected.name}</p>
                  <p className="text-sm text-gray-500">{selected.rollNo}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[selected.status]}`}>{selected.status}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${feeColor[selected.feeStatus]}`}>{selected.feeStatus}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { icon: GraduationCap, label: 'Class', val: `${selected.class} – ${selected.section}` },
                  { icon: GraduationCap, label: 'Gender', val: selected.gender },
                  { icon: Phone, label: 'Phone', val: selected.phone },
                  { icon: Mail, label: 'Email', val: selected.email },
                  { icon: GraduationCap, label: 'Parent', val: selected.parentName },
                  { icon: MapPin, label: 'Address', val: selected.address },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                    <p className="font-medium text-gray-800 text-xs">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
