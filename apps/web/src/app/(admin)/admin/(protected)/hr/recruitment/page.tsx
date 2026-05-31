'use client'
import React, { useState } from 'react'
import { Briefcase, Users, Plus, X, ChevronDown, ArrowRight, Calendar, User } from 'lucide-react'

type Stage = 'Applications Received' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Joined'

interface Applicant {
  id: string; name: string; position: string; experience: string
  applied: string; stage: Stage; email: string; phone: string
}

interface Opening {
  id: string; title: string; department: string; vacancies: number; posted: string; deadline: string
}

const STAGES: Stage[] = ['Applications Received','Shortlisted','Interview Scheduled','Selected','Joined']

const MOCK_OPENINGS: Opening[] = [
  { id:'1', title:'Physics Teacher', department:'Science', vacancies:2, posted:'2025-01-01', deadline:'2025-01-31' },
  { id:'2', title:'Computer Science Teacher', department:'IT', vacancies:1, posted:'2025-01-05', deadline:'2025-02-05' },
  { id:'3', title:'Physical Education Teacher', department:'Sports', vacancies:1, posted:'2025-01-08', deadline:'2025-02-10' },
]

const MOCK_APPLICANTS: Applicant[] = [
  { id:'1', name:'Arun Krishnan', position:'Physics Teacher', experience:'5 years', applied:'2025-01-03', stage:'Applications Received', email:'arun@email.com', phone:'9876543210' },
  { id:'2', name:'Divya Menon', position:'Physics Teacher', experience:'7 years', applied:'2025-01-05', stage:'Shortlisted', email:'divya@email.com', phone:'9876543211' },
  { id:'3', name:'Rohit Gupta', position:'Computer Science Teacher', experience:'3 years', applied:'2025-01-07', stage:'Interview Scheduled', email:'rohit@email.com', phone:'9876543212' },
  { id:'4', name:'Sunita Rao', position:'Computer Science Teacher', experience:'6 years', applied:'2025-01-06', stage:'Selected', email:'sunita@email.com', phone:'9876543213' },
  { id:'5', name:'Karthik Pillai', position:'Physical Education Teacher', experience:'8 years', applied:'2025-01-09', stage:'Joined', email:'karthik@email.com', phone:'9876543214' },
  { id:'6', name:'Lakshmi Iyer', position:'Physics Teacher', experience:'4 years', applied:'2025-01-10', stage:'Shortlisted', email:'lakshmi@email.com', phone:'9876543215' },
]

const stageColor: Record<Stage, string> = {
  'Applications Received': 'border-gray-200 bg-gray-50',
  'Shortlisted': 'border-blue-200 bg-blue-50',
  'Interview Scheduled': 'border-yellow-200 bg-yellow-50',
  'Selected': 'border-green-200 bg-green-50',
  'Joined': 'border-[#1e3a5f]/30 bg-[#1e3a5f]/5',
}
const stageHeaderColor: Record<Stage, string> = {
  'Applications Received': 'bg-gray-100 text-gray-700',
  'Shortlisted': 'bg-blue-100 text-blue-700',
  'Interview Scheduled': 'bg-yellow-100 text-yellow-700',
  'Selected': 'bg-green-100 text-green-700',
  'Joined': 'bg-[#1e3a5f]/10 text-[#1e3a5f]',
}

const emptyForm = { name:'', position:'', experience:'', applied:'', email:'', phone:'' }

export default function RecruitmentPage() {
  const [applicants, setApplicants] = useState<Applicant[]>(MOCK_APPLICANTS)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })
  const [viewApplicant, setViewApplicant] = useState<Applicant | null>(null)

  function moveStage(id: string, direction: 1 | -1) {
    setApplicants(prev => prev.map(a => {
      if (a.id !== id) return a
      const idx = STAGES.indexOf(a.stage)
      const newIdx = Math.max(0, Math.min(STAGES.length - 1, idx + direction))
      return { ...a, stage: STAGES[newIdx] }
    }))
  }

  function handleAdd() {
    const newApplicant: Applicant = {
      id: String(Date.now()), name: form.name, position: form.position,
      experience: form.experience, applied: form.applied || new Date().toISOString().split('T')[0],
      stage: 'Applications Received', email: form.email, phone: form.phone
    }
    setApplicants(prev => [newApplicant, ...prev])
    setShowModal(false)
    setForm({ ...emptyForm })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruitment Pipeline</h1>
          <p className="text-gray-500 text-sm mt-1">Manage job openings and applicant progress</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Plus className="w-4 h-4" /> Add Applicant
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label:'Open Positions', value:String(MOCK_OPENINGS.length), sub:'Active job openings', icon: Briefcase, color:'bg-blue-50 text-blue-600' },
          { label:'Total Applicants', value:String(applicants.length), sub:'Across all stages', icon: Users, color:'bg-purple-50 text-purple-600' },
          { label:'Joined This Month', value:String(applicants.filter(a => a.stage === 'Joined').length), sub:'January 2025', icon: User, color:'bg-green-50 text-green-600' },
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

      {/* Current Openings */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[#1e3a5f]" /> Current Openings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MOCK_OPENINGS.map(o => (
            <div key={o.id} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-semibold text-gray-900">{o.title}</p>
                <span className="px-2 py-0.5 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] text-xs font-medium flex-shrink-0">{o.vacancies} {o.vacancies > 1 ? 'posts' : 'post'}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{o.department}</p>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>Deadline: {o.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {STAGES.map(stage => {
          const stageApplicants = applicants.filter(a => a.stage === stage)
          return (
            <div key={stage} className={`rounded-2xl border p-3 min-h-[200px] ${stageColor[stage]}`}>
              <div className={`rounded-xl px-3 py-2 mb-3 flex items-center justify-between ${stageHeaderColor[stage]}`}>
                <p className="text-xs font-semibold">{stage}</p>
                <span className="text-xs font-bold">{stageApplicants.length}</span>
              </div>
              <div className="space-y-2">
                {stageApplicants.map(a => (
                  <div key={a.id} className="bg-white rounded-xl p-3 shadow-sm border border-white/80 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setViewApplicant(a)}>
                    <p className="text-xs font-semibold text-gray-900">{a.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.position}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.experience} exp.</p>
                    <p className="text-xs text-gray-400">Applied: {a.applied}</p>
                    <div className="flex gap-1 mt-2" onClick={e => e.stopPropagation()}>
                      {STAGES.indexOf(stage) > 0 && (
                        <button onClick={() => moveStage(a.id, -1)}
                          className="flex-1 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs transition-colors">← Back</button>
                      )}
                      {STAGES.indexOf(stage) < STAGES.length - 1 && (
                        <button onClick={() => moveStage(a.id, 1)}
                          className="flex-1 py-1 rounded-lg bg-[#1e3a5f]/10 text-[#1e3a5f] hover:bg-[#1e3a5f]/20 text-xs transition-colors flex items-center justify-center gap-0.5">
                          Next <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {stageApplicants.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">No applicants</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Applicant Detail Modal */}
      {viewApplicant && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Applicant Profile</h2>
              <button onClick={() => setViewApplicant(null)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1e3a5f]/10 flex items-center justify-center">
                  <User className="w-7 h-7 text-[#1e3a5f]" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{viewApplicant.name}</p>
                  <p className="text-sm text-gray-500">{viewApplicant.position}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${stageHeaderColor[viewApplicant.stage]}`}>{viewApplicant.stage}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[['Experience', viewApplicant.experience],['Applied On', viewApplicant.applied],['Email', viewApplicant.email],['Phone', viewApplicant.phone]].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                    <p className="text-sm font-medium text-gray-800">{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setViewApplicant(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Applicant Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add New Applicant</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label:'Full Name', key:'name', type:'text' },
                { label:'Applied Position', key:'position', type:'text' },
                { label:'Experience', key:'experience', type:'text' },
                { label:'Applied Date', key:'applied', type:'date' },
                { label:'Email', key:'email', type:'email' },
                { label:'Phone', key:'phone', type:'tel' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleAdd} className="px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] transition-colors">Add Applicant</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
