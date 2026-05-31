'use client'
import React, { useState } from 'react'
import { Plus, Phone, Mail, User, X, ChevronRight, GraduationCap, Calendar, MessageSquare, ArrowRight } from 'lucide-react'

type Stage = 'New' | 'Contacted' | 'Visit Scheduled' | 'Admitted' | 'Lost'

interface Enquiry {
  id: string; name: string; parentName: string; phone: string; email: string;
  class: string; source: string; stage: Stage; date: string; notes: string;
}

const STAGES: Stage[] = ['New', 'Contacted', 'Visit Scheduled', 'Admitted', 'Lost']

const STAGE_CONFIG: Record<Stage, { color: string; bg: string; dot: string }> = {
  'New':             { color: 'text-blue-700',  bg: 'bg-blue-50',   dot: 'bg-blue-400' },
  'Contacted':       { color: 'text-yellow-700', bg: 'bg-yellow-50', dot: 'bg-yellow-400' },
  'Visit Scheduled': { color: 'text-purple-700', bg: 'bg-purple-50', dot: 'bg-purple-400' },
  'Admitted':        { color: 'text-green-700',  bg: 'bg-green-50',  dot: 'bg-green-500' },
  'Lost':            { color: 'text-red-600',    bg: 'bg-red-50',    dot: 'bg-red-400' },
}

const MOCK: Enquiry[] = [
  { id: '1', name: 'Vikram Tiwari', parentName: 'Suresh Tiwari', phone: '9811234567', email: 'suresh@gmail.com', class: '6', source: 'Walk-in', stage: 'New', date: '2025-01-30', notes: 'Interested in Class 6 admission for 2025-26.' },
  { id: '2', name: 'Meera Joshi', parentName: 'Rakesh Joshi', phone: '9922334455', email: 'rakesh@yahoo.com', class: '9', source: 'Website', stage: 'Contacted', date: '2025-01-28', notes: 'Called back, interested in science stream.' },
  { id: '3', name: 'Aditya Rao', parentName: 'Venkat Rao', phone: '9833445566', email: 'venkat@gmail.com', class: '11', source: 'Referral', stage: 'Visit Scheduled', date: '2025-01-25', notes: 'Visit scheduled for Feb 5, 2025 at 11 AM.' },
  { id: '4', name: 'Shreya Gupta', parentName: 'Amit Gupta', phone: '9744556677', email: 'amit@gmail.com', class: '8', source: 'Advertisement', stage: 'Admitted', date: '2025-01-20', notes: 'Documents submitted. Roll no assigned.' },
  { id: '5', name: 'Karan Malhotra', parentName: 'Raj Malhotra', phone: '9655667788', email: 'raj@outlook.com', class: '10', source: 'Walk-in', stage: 'Lost', date: '2025-01-18', notes: 'Chose another school due to distance.' },
  { id: '6', name: 'Prachi Verma', parentName: 'Deepak Verma', phone: '9566778899', email: 'deepak@gmail.com', class: '7', source: 'Website', stage: 'New', date: '2025-01-31', notes: '' },
]

const emptyForm = { name: '', parentName: '', phone: '', email: '', class: '6', source: 'Walk-in', notes: '' }

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(MOCK)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [selected, setSelected] = useState<Enquiry | null>(null)

  function handleAdd() {
    const e: Enquiry = { id: String(Date.now()), ...form, stage: 'New', date: new Date().toISOString().slice(0, 10) }
    setEnquiries(prev => [e, ...prev])
    setForm(emptyForm)
    setShowAdd(false)
  }

  function moveStage(id: string, dir: 1 | -1) {
    setEnquiries(prev => prev.map(e => {
      if (e.id !== id) return e
      const idx = STAGES.indexOf(e.stage)
      const next = STAGES[Math.min(Math.max(idx + dir, 0), STAGES.length - 1)]
      return { ...e, stage: next }
    }))
  }

  function deleteEnquiry(id: string) {
    setEnquiries(prev => prev.filter(e => e.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const byStage = (stage: Stage) => enquiries.filter(e => e.stage === stage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admission Enquiries</h1>
          <p className="text-gray-500 text-sm mt-1">{enquiries.length} total · {byStage('Admitted').length} admitted · {byStage('New').length} new</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Plus className="w-4 h-4" /> New Enquiry
        </button>
      </div>

      {/* Pipeline Stats */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {STAGES.map((stage, i) => {
          const count = byStage(stage).length
          const cfg = STAGE_CONFIG[stage]
          return (
            <div key={stage} className="flex items-center gap-2 flex-shrink-0">
              <div className={`${cfg.bg} rounded-2xl px-5 py-3 min-w-[140px]`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  <span className={`text-xs font-medium ${cfg.color}`}>{stage}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
              </div>
              {i < STAGES.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
            </div>
          )
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {STAGES.map(stage => {
          const cards = byStage(stage)
          const cfg = STAGE_CONFIG[stage]
          return (
            <div key={stage} className="bg-gray-50 rounded-2xl p-3 min-h-[200px]">
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                <span className="text-xs font-semibold text-gray-700">{stage}</span>
                <span className={`ml-auto text-xs font-bold ${cfg.color} ${cfg.bg} px-2 py-0.5 rounded-full`}>{cards.length}</span>
              </div>
              <div className="space-y-2">
                {cards.map(e => {
                  const stageIdx = STAGES.indexOf(e.stage)
                  return (
                    <div key={e.id} onClick={() => setSelected(e)}
                      className="bg-white rounded-xl p-3.5 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-semibold text-gray-900 truncate">{e.name}</p>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">Parent: {e.parentName}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1"><GraduationCap className="w-3 h-3" />Class {e.class}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3" />{e.date}</p>
                      <div className="flex gap-1 mt-2.5">
                        {stageIdx > 0 && stageIdx < STAGES.length - 1 && (
                          <button onClick={e2 => { e2.stopPropagation(); moveStage(e.id, -1) }}
                            className="text-xs px-2 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">← Back</button>
                        )}
                        {stageIdx < STAGES.length - 1 && (
                          <button onClick={e2 => { e2.stopPropagation(); moveStage(e.id, 1) }}
                            className={`flex-1 text-xs px-2 py-1 rounded-lg flex items-center justify-center gap-1 font-medium transition-colors ${cfg.bg} ${cfg.color} hover:opacity-80`}>
                            {STAGES[stageIdx + 1]} <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
                {cards.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-6">No enquiries</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-end" onClick={() => setSelected(null)}>
          <div className="bg-white h-full w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Enquiry Detail</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto h-full pb-20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1e3a5f]/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#1e3a5f]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selected.name}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${STAGE_CONFIG[selected.stage].bg} ${STAGE_CONFIG[selected.stage].color}`}>
                    {selected.stage}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Parent', val: selected.parentName, icon: User },
                  { label: 'Class', val: `Class ${selected.class}`, icon: GraduationCap },
                  { label: 'Phone', val: selected.phone, icon: Phone },
                  { label: 'Email', val: selected.email, icon: Mail },
                  { label: 'Source', val: selected.source, icon: MessageSquare },
                  { label: 'Date', val: selected.date, icon: Calendar },
                ].map(f => (
                  <div key={f.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><f.icon className="w-3 h-3" />{f.label}</p>
                    <p className="text-sm font-medium text-gray-800 break-all">{f.val || '—'}</p>
                  </div>
                ))}
              </div>
              {selected.notes && (
                <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
                  <p className="text-xs font-medium text-yellow-700 mb-1">Notes</p>
                  <p className="text-sm text-gray-700">{selected.notes}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">Move Stage</p>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map(s => (
                    <button key={s} onClick={() => { setEnquiries(prev => prev.map(e => e.id === selected.id ? { ...e, stage: s } : e)); setSelected(p => p ? { ...p, stage: s } : null) }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${selected.stage === s ? `${STAGE_CONFIG[s].bg} ${STAGE_CONFIG[s].color} border-current` : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => deleteEnquiry(selected.id)} className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors">
                Delete Enquiry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Enquiry Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">New Enquiry</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-3">
              {[
                { label: 'Student Name', key: 'name', type: 'text', placeholder: 'Full name' },
                { label: 'Parent Name', key: 'parentName', type: 'text', placeholder: "Parent's name" },
                { label: 'Phone', key: 'phone', type: 'tel', placeholder: '10-digit mobile' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'parent@email.com' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} placeholder={f.placeholder}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Class Applying</label>
                  <select value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white">
                    {['Nursery','KG','1','2','3','4','5','6','7','8','9','10','11','12'].map(c => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Source</label>
                  <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white">
                    {['Walk-in','Website','Referral','Advertisement','Social Media','Phone'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  rows={2} placeholder="Initial notes…"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} disabled={!form.name || !form.phone}
                className="px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] disabled:opacity-50 transition-colors">
                Add Enquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
