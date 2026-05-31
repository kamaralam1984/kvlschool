'use client'

import { useState } from 'react'
import { Plus, X, Award, Users, IndianRupee, TrendingUp } from 'lucide-react'

type ScholarshipType = 'Amount' | 'Percentage'
type RecipientStatus = 'Active' | 'Suspended' | 'Completed'

interface Scholarship {
  id: string
  name: string
  criteria: string
  type: ScholarshipType
  value: number
  maxStudents: number
  recipients: number
}

interface Recipient {
  id: string
  studentName: string
  class: string
  scholarshipName: string
  amount: number
  startDate: string
  status: RecipientStatus
}

const MOCK_SCHOLARSHIPS: Scholarship[] = [
  { id: '1', name: 'Merit Excellence Award',   criteria: 'Top 5% academic rank',           type: 'Percentage', value: 50, maxStudents: 20, recipients: 18 },
  { id: '2', name: 'Sports Achiever Grant',    criteria: 'State/National level sports rep', type: 'Amount',     value: 12000, maxStudents: 10, recipients: 7 },
  { id: '3', name: 'Need-Based Assistance',    criteria: 'Annual family income < ₹3L',      type: 'Percentage', value: 75, maxStudents: 30, recipients: 28 },
  { id: '4', name: 'Staff Ward Concession',    criteria: 'Ward of KVL staff member',        type: 'Percentage', value: 25, maxStudents: 50, recipients: 32 },
]

const MOCK_RECIPIENTS: Recipient[] = [
  { id: '1', studentName: 'Aarav Sharma',   class: '10-A', scholarshipName: 'Merit Excellence Award',   amount: 9000,  startDate: '2025-04-01', status: 'Active' },
  { id: '2', studentName: 'Priya Nair',     class: '8-B',  scholarshipName: 'Need-Based Assistance',    amount: 12750, startDate: '2025-04-01', status: 'Active' },
  { id: '3', studentName: 'Rohan Mehta',    class: '12-C', scholarshipName: 'Merit Excellence Award',   amount: 10750, startDate: '2025-04-01', status: 'Active' },
  { id: '4', studentName: 'Sneha Patel',    class: '6-A',  scholarshipName: 'Staff Ward Concession',    amount: 3500,  startDate: '2025-04-01', status: 'Active' },
  { id: '5', studentName: 'Kiran Reddy',    class: '9-B',  scholarshipName: 'Sports Achiever Grant',    amount: 12000, startDate: '2025-04-01', status: 'Active' },
  { id: '6', studentName: 'Ananya Singh',   class: '11-A', scholarshipName: 'Need-Based Assistance',    amount: 14250, startDate: '2024-04-01', status: 'Completed' },
]

const STATUS_CONFIG: Record<RecipientStatus, { color: string; bg: string }> = {
  Active:    { color: 'text-green-700',  bg: 'bg-green-50' },
  Suspended: { color: 'text-yellow-700', bg: 'bg-yellow-50' },
  Completed: { color: 'text-gray-600',   bg: 'bg-gray-100' },
}

const emptyScholarship = { name: '', criteria: '', type: 'Amount' as ScholarshipType, value: 0, maxStudents: 10 }

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>(MOCK_SCHOLARSHIPS)
  const [recipients, setRecipients] = useState<Recipient[]>(MOCK_RECIPIENTS)
  const [modal, setModal] = useState<'add-scholarship' | 'assign' | null>(null)
  const [form, setForm] = useState(emptyScholarship)
  const [assignForm, setAssignForm] = useState({ studentName: '', class: '', scholarshipId: '' })

  const totalDisbursed = recipients.filter(r => r.status === 'Active').reduce((s, r) => s + r.amount, 0)

  function handleAddScholarship() {
    setScholarships(prev => [...prev, { ...form, id: String(Date.now()), recipients: 0 }])
    setModal(null)
    setForm(emptyScholarship)
  }

  function handleAssign() {
    const sch = scholarships.find(s => s.id === assignForm.scholarshipId)
    if (!sch) return
    const newRecipient: Recipient = {
      id: String(Date.now()),
      studentName: assignForm.studentName,
      class: assignForm.class,
      scholarshipName: sch.name,
      amount: sch.type === 'Amount' ? sch.value : Math.round(17000 * sch.value / 100),
      startDate: new Date().toISOString().slice(0, 10),
      status: 'Active',
    }
    setRecipients(prev => [newRecipient, ...prev])
    setScholarships(prev => prev.map(s => s.id === sch.id ? { ...s, recipients: s.recipients + 1 } : s))
    setModal(null)
    setAssignForm({ studentName: '', class: '', scholarshipId: '' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scholarships</h1>
          <p className="text-gray-500 text-sm mt-1">Manage scholarship programs and recipient assignments.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModal('assign')} className="flex items-center gap-2 px-4 py-2.5 border border-[#1e3a5f] text-[#1e3a5f] rounded-xl text-sm font-medium hover:bg-[#1e3a5f]/5 transition-colors">
            <Users className="w-4 h-4" /> Assign to Student
          </button>
          <button onClick={() => { setForm(emptyScholarship); setModal('add-scholarship') }} className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#162d4a] transition-colors">
            <Plus className="w-4 h-4" /> Add Scholarship
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Programs',       value: String(scholarships.length),                                        icon: Award,        color: 'text-[#1e3a5f] bg-blue-50' },
          { label: 'Active Recipients',    value: String(recipients.filter(r => r.status === 'Active').length),       icon: Users,        color: 'text-green-600 bg-green-50' },
          { label: 'Disbursed This Year',  value: `₹${(totalDisbursed / 1000).toFixed(1)}K`,                        icon: IndianRupee,  color: 'text-[#d4a017] bg-yellow-50' },
          { label: 'Max Capacity',         value: String(scholarships.reduce((s, sc) => s + sc.maxStudents, 0)),       icon: TrendingUp,   color: 'text-purple-600 bg-purple-50' },
        ].map(card => {
          const Icon = card.icon
          const [textColor, bgColor] = card.color.split(' ')
          return (
            <div key={card.label} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor}`}>
                <Icon className={`w-5 h-5 ${textColor}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{card.label}</p>
                <p className="text-xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Active Scholarships */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Active Scholarship Programs</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {scholarships.map(sch => (
            <div key={sch.id} className="border border-gray-100 rounded-xl p-4 hover:border-[#1e3a5f]/20 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{sch.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sch.criteria}</p>
                </div>
                <span className="text-lg font-bold text-[#d4a017]">
                  {sch.type === 'Percentage' ? `${sch.value}%` : `₹${sch.value.toLocaleString()}`}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Recipients</p>
                    <p className="text-sm font-bold text-gray-700">{sch.recipients}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Max Seats</p>
                    <p className="text-sm font-bold text-gray-700">{sch.maxStudents}</p>
                  </div>
                </div>
                <div className="flex-1 ml-6">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Capacity</span>
                    <span>{Math.round((sch.recipients / sch.maxStudents) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1e3a5f] rounded-full transition-all"
                      style={{ width: `${Math.min(100, (sch.recipients / sch.maxStudents) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipients Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Scholarship Recipients</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Student', 'Class', 'Scholarship', 'Amount/Month', 'Start Date', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recipients.map(r => {
                const cfg = STATUS_CONFIG[r.status]
                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.studentName}</td>
                    <td className="px-4 py-3 text-gray-500">{r.class}</td>
                    <td className="px-4 py-3 text-gray-600">{r.scholarshipName}</td>
                    <td className="px-4 py-3 font-semibold text-[#1e3a5f]">₹{r.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500">{r.startDate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>{r.status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Scholarship Modal */}
      {modal === 'add-scholarship' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add Scholarship Program</h2>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Program Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Merit Excellence Award" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Eligibility Criteria</label>
                <input value={form.criteria} onChange={e => setForm(f => ({ ...f, criteria: e.target.value }))} placeholder="e.g. Top 5% academic rank" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as ScholarshipType }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
                    <option value="Amount">Fixed Amount (₹)</option>
                    <option value="Percentage">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{form.type === 'Amount' ? 'Amount (₹)' : 'Percentage (%)'}</label>
                  <input type="number" value={form.value || ''} onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Max Students</label>
                <input type="number" value={form.maxStudents || ''} onChange={e => setForm(f => ({ ...f, maxStudents: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleAddScholarship} className="flex-1 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#162d4a]">Create Program</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {modal === 'assign' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Assign Scholarship</h2>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Student Name</label>
                <input value={assignForm.studentName} onChange={e => setAssignForm(f => ({ ...f, studentName: e.target.value }))} placeholder="Full name" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Class</label>
                <input value={assignForm.class} onChange={e => setAssignForm(f => ({ ...f, class: e.target.value }))} placeholder="e.g. 10-A" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Scholarship Program</label>
                <select value={assignForm.scholarshipId} onChange={e => setAssignForm(f => ({ ...f, scholarshipId: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
                  <option value="">Select program...</option>
                  {scholarships.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleAssign} className="flex-1 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#162d4a]">Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
