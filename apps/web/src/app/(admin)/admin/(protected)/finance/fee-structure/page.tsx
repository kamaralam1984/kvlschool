'use client'
import React, { useState } from 'react'
import { Plus, X, Edit2, Trash2, IndianRupee, CheckCircle2, ChevronDown } from 'lucide-react'

type Frequency = 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Annually' | 'One-time'

interface FeeType {
  id: string; name: string; amount: number; frequency: Frequency;
  applicableClasses: string[]; category: string; isOptional: boolean; description: string;
}

const ALL_CLASSES = ['Nursery', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const CATEGORIES = ['Academic', 'Hostel', 'Transport', 'Activity', 'Infrastructure', 'Other']

const MOCK: FeeType[] = [
  { id: '1', name: 'Tuition Fee', amount: 18500, frequency: 'Monthly', applicableClasses: ['9','10','11','12'], category: 'Academic', isOptional: false, description: 'Monthly tuition fee for senior classes' },
  { id: '2', name: 'Tuition Fee', amount: 15000, frequency: 'Monthly', applicableClasses: ['6','7','8'], category: 'Academic', isOptional: false, description: 'Monthly tuition fee for middle classes' },
  { id: '3', name: 'Hostel Fee', amount: 12000, frequency: 'Monthly', applicableClasses: ALL_CLASSES.slice(4), category: 'Hostel', isOptional: true, description: 'For hostel residents only' },
  { id: '4', name: 'Transport Fee', amount: 4500, frequency: 'Monthly', applicableClasses: ALL_CLASSES, category: 'Transport', isOptional: true, description: 'School bus facility' },
  { id: '5', name: 'Annual Development', amount: 25000, frequency: 'Annually', applicableClasses: ALL_CLASSES, category: 'Infrastructure', isOptional: false, description: 'Annual infrastructure development charge' },
  { id: '6', name: 'Exam Fee', amount: 1200, frequency: 'Half-Yearly', applicableClasses: ['9','10','11','12'], category: 'Academic', isOptional: false, description: 'Board and internal exam fee' },
  { id: '7', name: 'Sports Fee', amount: 2000, frequency: 'Annually', applicableClasses: ALL_CLASSES, category: 'Activity', isOptional: true, description: 'Sports facilities and equipment' },
]

const freqColor: Record<Frequency, string> = {
  Monthly: 'bg-blue-100 text-blue-700',
  Quarterly: 'bg-purple-100 text-purple-700',
  'Half-Yearly': 'bg-indigo-100 text-indigo-700',
  Annually: 'bg-green-100 text-green-700',
  'One-time': 'bg-gray-100 text-gray-700',
}

const emptyForm: Omit<FeeType, 'id'> = {
  name: '', amount: 0, frequency: 'Monthly', applicableClasses: [],
  category: 'Academic', isOptional: false, description: '',
}

export default function FeeStructurePage() {
  const [fees, setFees] = useState<FeeType[]>(MOCK)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<FeeType | null>(null)
  const [form, setForm] = useState<Omit<FeeType, 'id'>>(emptyForm)
  const [catFilter, setCatFilter] = useState('All')

  function openAdd() { setEditing(null); setForm(emptyForm); setShowModal(true) }
  function openEdit(f: FeeType) { setEditing(f); setForm({ ...f }); setShowModal(true) }

  function toggleClass(cls: string) {
    setForm(p => ({
      ...p,
      applicableClasses: p.applicableClasses.includes(cls)
        ? p.applicableClasses.filter(c => c !== cls)
        : [...p.applicableClasses, cls],
    }))
  }

  function handleSave() {
    if (editing) {
      setFees(prev => prev.map(f => f.id === editing.id ? { ...form, id: f.id } : f))
    } else {
      setFees(prev => [...prev, { ...form, id: String(Date.now()) }])
    }
    setShowModal(false)
  }

  function deleteFee(id: string) {
    if (confirm('Delete this fee type?')) setFees(prev => prev.filter(f => f.id !== id))
  }

  const filtered = catFilter === 'All' ? fees : fees.filter(f => f.category === catFilter)
  const totalMonthly = fees.filter(f => f.frequency === 'Monthly' && !f.isOptional).reduce((s, f) => s + f.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Structure</h1>
          <p className="text-gray-500 text-sm mt-1">Define and manage all fee types</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Plus className="w-4 h-4" /> Add Fee Type
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Fee Types', value: fees.length, sub: `${fees.filter(f => f.isOptional).length} optional` },
          { label: 'Mandatory Monthly', value: `₹${totalMonthly.toLocaleString('en-IN')}`, sub: 'per student (senior)' },
          { label: 'Annual Total', value: `₹${(totalMonthly * 12 + fees.filter(f => f.frequency === 'Annually').reduce((s, f) => s + f.amount, 0)).toLocaleString('en-IN')}`, sub: 'estimated per student' },
        ].map(c => (
          <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <IndianRupee className="w-4 h-4 text-[#1e3a5f]" />
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
            </div>
            <p className="text-sm font-medium text-gray-600">{c.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['All', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${catFilter === c ? 'bg-[#1e3a5f] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Fee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(f => (
          <div key={f.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{f.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{f.category}</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => openEdit(f)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => deleteFee(f.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-2xl font-bold text-gray-900">₹{f.amount.toLocaleString('en-IN')}</span>
              <span className="text-sm text-gray-500">/ {f.frequency.toLowerCase()}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${freqColor[f.frequency]}`}>{f.frequency}</span>
              {f.isOptional && <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Optional</span>}
              {!f.isOptional && <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1e3a5f]/10 text-[#1e3a5f]">Mandatory</span>}
            </div>
            {f.description && <p className="text-xs text-gray-400 mb-3">{f.description}</p>}
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1.5">Applicable Classes</p>
              <div className="flex flex-wrap gap-1">
                {f.applicableClasses.slice(0, 8).map(c => (
                  <span key={c} className="w-6 h-6 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium flex items-center justify-center">{c}</span>
                ))}
                {f.applicableClasses.length > 8 && <span className="text-xs text-gray-400">+{f.applicableClasses.length - 8}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg my-6 shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Fee Type' : 'Add Fee Type'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Fee Name</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Tuition Fee"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Amount (₹)</label>
                  <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Frequency</label>
                  <select value={form.frequency} onChange={e => setForm(p => ({ ...p, frequency: e.target.value as Frequency }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white">
                    {['Monthly', 'Quarterly', 'Half-Yearly', 'Annually', 'One-time'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <button onClick={() => setForm(p => ({ ...p, isOptional: !p.isOptional }))}
                    className={`w-10 h-6 rounded-full transition-all ${form.isOptional ? 'bg-[#1e3a5f]' : 'bg-gray-200'}`}>
                    <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${form.isOptional ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                  <span className="text-sm text-gray-700">Optional fee</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Applicable Classes</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setForm(p => ({ ...p, applicableClasses: p.applicableClasses.length === ALL_CLASSES.length ? [] : ALL_CLASSES }))}
                    className="px-3 py-1 rounded-lg border border-[#1e3a5f]/30 text-[#1e3a5f] text-xs font-medium hover:bg-[#1e3a5f]/5">
                    {form.applicableClasses.length === ALL_CLASSES.length ? 'Deselect All' : 'Select All'}
                  </button>
                  {ALL_CLASSES.map(c => (
                    <button key={c} onClick={() => toggleClass(c)}
                      className={`w-10 h-8 rounded-lg text-xs font-medium border-2 transition-all ${form.applicableClasses.includes(c) ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={!form.name || !form.amount || form.applicableClasses.length === 0}
                className="px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] disabled:opacity-50 transition-colors">
                {editing ? 'Save Changes' : 'Add Fee Type'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
