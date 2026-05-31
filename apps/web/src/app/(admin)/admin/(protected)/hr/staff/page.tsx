'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, Download, Eye, Pencil, Trash2, X, Users, UserCheck, UserX } from 'lucide-react'

type Department = 'Academic' | 'Admin' | 'Hostel' | 'Transport' | 'Library'
type StaffStatus = 'Active' | 'On Leave' | 'Resigned'

interface StaffMember {
  id: string
  employeeId: string
  name: string
  designation: string
  department: Department
  phone: string
  email: string
  joiningDate: string
  status: StaffStatus
  gender: 'Male' | 'Female'
}

const STATUS_CONFIG: Record<StaffStatus, { color: string; bg: string }> = {
  'Active':   { color: 'text-green-700',  bg: 'bg-green-50' },
  'On Leave': { color: 'text-yellow-700', bg: 'bg-yellow-50' },
  'Resigned': { color: 'text-red-700',    bg: 'bg-red-50' },
}

const DEPARTMENTS: Department[] = ['Academic', 'Admin', 'Hostel', 'Transport', 'Library']

const MOCK: StaffMember[] = [
  { id: '1', employeeId: 'KVL-001', name: 'Dr. Aishwarya Menon',   designation: 'Physics Teacher',        department: 'Academic',   phone: '9876543210', email: 'aishwarya@kvlschool.edu.in',  joiningDate: '2020-06-01', status: 'Active',   gender: 'Female' },
  { id: '2', employeeId: 'KVL-002', name: 'Mr. Rajan Pillai',       designation: 'Mathematics Teacher',    department: 'Academic',   phone: '9876543211', email: 'rajan@kvlschool.edu.in',       joiningDate: '2018-07-15', status: 'Active',   gender: 'Male' },
  { id: '3', employeeId: 'KVL-003', name: 'Ms. Kavita Jain',        designation: 'Admin Coordinator',      department: 'Admin',      phone: '9876543212', email: 'kavita@kvlschool.edu.in',      joiningDate: '2022-03-10', status: 'Active',   gender: 'Female' },
  { id: '4', employeeId: 'KVL-004', name: 'Mr. Suresh Babu',        designation: 'Bus Driver',              department: 'Transport',  phone: '9876543213', email: 'suresh@kvlschool.edu.in',      joiningDate: '2021-08-01', status: 'Active',   gender: 'Male' },
  { id: '5', employeeId: 'KVL-005', name: 'Ms. Preethi Varma',      designation: 'Hostel Warden',           department: 'Hostel',     phone: '9876543214', email: 'preethi@kvlschool.edu.in',     joiningDate: '2019-04-20', status: 'On Leave', gender: 'Female' },
  { id: '6', employeeId: 'KVL-006', name: 'Mr. Vinod Sharma',       designation: 'Librarian',               department: 'Library',    phone: '9876543215', email: 'vinod@kvlschool.edu.in',       joiningDate: '2017-11-05', status: 'Active',   gender: 'Male' },
  { id: '7', employeeId: 'KVL-007', name: 'Ms. Nithya Krishnan',    designation: 'English Teacher',        department: 'Academic',   phone: '9876543216', email: 'nithya@kvlschool.edu.in',      joiningDate: '2023-06-15', status: 'Active',   gender: 'Female' },
  { id: '8', employeeId: 'KVL-008', name: 'Mr. Deepak Nair',        designation: 'Admin Manager',          department: 'Admin',      phone: '9876543217', email: 'deepak@kvlschool.edu.in',      joiningDate: '2016-09-01', status: 'Resigned', gender: 'Male' },
]

const emptyForm: Omit<StaffMember, 'id'> = {
  employeeId: '', name: '', designation: '', department: 'Academic', phone: '', email: '', joiningDate: '', status: 'Active', gender: 'Male',
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(MOCK)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modal, setModal] = useState<'add' | 'edit' | 'view' | null>(null)
  const [selected, setSelected] = useState<StaffMember | null>(null)
  const [form, setForm] = useState<Omit<StaffMember, 'id'>>(emptyForm)

  const filtered = useMemo(() => staff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.designation.toLowerCase().includes(search.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(search.toLowerCase())
    const matchDept   = deptFilter === 'All' || s.department === deptFilter
    const matchStatus = statusFilter === 'All' || s.status === statusFilter
    return matchSearch && matchDept && matchStatus
  }), [staff, search, deptFilter, statusFilter])

  function openAdd()                { setForm(emptyForm); setModal('add') }
  function openEdit(s: StaffMember) { setSelected(s); setForm({ ...s }); setModal('edit') }
  function openView(s: StaffMember) { setSelected(s); setModal('view') }
  function closeModal()             { setModal(null); setSelected(null) }

  function handleSave() {
    if (modal === 'add') {
      setStaff(prev => [...prev, { ...form, id: String(Date.now()) }])
    } else if (modal === 'edit' && selected) {
      setStaff(prev => prev.map(s => s.id === selected.id ? { ...form, id: s.id } : s))
    }
    closeModal()
  }

  function handleDelete(id: string) {
    if (confirm('Remove this staff member?')) setStaff(prev => prev.filter(s => s.id !== id))
  }

  const activeCount   = staff.filter(s => s.status === 'Active').length
  const onLeaveCount  = staff.filter(s => s.status === 'On Leave').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Directory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all school staff records and details.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => {}} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#162d4a] transition-colors">
            <Plus className="w-4 h-4" /> Add Staff
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Staff',  value: staff.length,  icon: Users,      color: 'text-[#1e3a5f] bg-blue-50' },
          { label: 'Active',       value: activeCount,   icon: UserCheck,  color: 'text-green-600 bg-green-50' },
          { label: 'On Leave',     value: onLeaveCount,  icon: UserX,      color: 'text-yellow-600 bg-yellow-50' },
        ].map(card => {
          const Icon = card.icon
          const [textColor, bgColor] = card.color.split(' ')
          return (
            <div key={card.label} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor}`}>
                <Icon className={`w-5 h-5 ${textColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500">{card.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48 border border-gray-200 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, ID, designation..." className="flex-1 text-sm outline-none" />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
          <option value="All">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
          <option value="All">All Status</option>
          {(['Active', 'On Leave', 'Resigned'] as StaffStatus[]).map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Emp ID', 'Name', 'Designation', 'Department', 'Phone', 'Email', 'Joining Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => {
                const cfg = STATUS_CONFIG[s.status]
                return (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[#1e3a5f] font-semibold">{s.employeeId}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center text-xs font-bold text-[#1e3a5f] flex-shrink-0">
                          {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-gray-900 whitespace-nowrap">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.designation}</td>
                    <td className="px-4 py-3 text-gray-500">{s.department}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{s.phone}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{s.email}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{s.joiningDate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openView(s)} title="View" className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye className="w-3.5 h-3.5 text-gray-500" /></button>
                        <button onClick={() => openEdit(s)} title="Edit" className="p-1.5 hover:bg-blue-50 rounded-lg"><Pencil className="w-3.5 h-3.5 text-blue-500" /></button>
                        <button onClick={() => handleDelete(s.id)} title="Delete" className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{modal === 'add' ? 'Add Staff Member' : 'Edit Staff Member'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Employee ID',  key: 'employeeId',   type: 'text',   placeholder: 'KVL-XXX' },
                { label: 'Full Name',    key: 'name',         type: 'text',   placeholder: 'Full name' },
                { label: 'Designation', key: 'designation',  type: 'text',   placeholder: 'Role title' },
                { label: 'Phone',       key: 'phone',        type: 'tel',    placeholder: '9XXXXXXXXX' },
                { label: 'Email',       key: 'email',        type: 'email',  placeholder: 'email@kvlschool.edu.in', colSpan: true },
                { label: 'Joining Date', key: 'joiningDate', type: 'date',   placeholder: '' },
              ].map(field => (
                <div key={field.key} className={field.colSpan ? 'col-span-2' : ''}>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={(form as Record<string, string>)[field.key] || ''}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1e3a5f]/40"
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Department</label>
                <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value as Department }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as StaffStatus }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
                  {(['Active', 'On Leave', 'Resigned'] as StaffStatus[]).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Gender</label>
                <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value as 'Male' | 'Female' }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={closeModal} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#162d4a]">{modal === 'add' ? 'Add Staff' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Staff Profile</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#1e3a5f]/10 flex items-center justify-center text-xl font-bold text-[#1e3a5f]">
                  {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{selected.name}</p>
                  <p className="text-sm text-gray-500">{selected.designation} · {selected.department}</p>
                  <span className={`mt-1 inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_CONFIG[selected.status].bg} ${STATUS_CONFIG[selected.status].color}`}>{selected.status}</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Employee ID',   value: selected.employeeId },
                  { label: 'Phone',         value: selected.phone },
                  { label: 'Email',         value: selected.email },
                  { label: 'Joining Date',  value: selected.joiningDate },
                  { label: 'Gender',        value: selected.gender },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                    <span className="text-gray-500">{row.label}</span>
                    <span className="font-medium text-gray-800">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={closeModal} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">Close</button>
              <button onClick={() => { closeModal(); openEdit(selected) }} className="flex-1 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#162d4a] flex items-center justify-center gap-2"><Pencil className="w-4 h-4" /> Edit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
