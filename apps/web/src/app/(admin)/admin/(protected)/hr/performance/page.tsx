'use client'
import React, { useState } from 'react'
import { Star, TrendingUp, Award, Plus, X, ChevronDown, Filter } from 'lucide-react'

type Grade = 'A' | 'B' | 'C' | 'D'

interface Review {
  id: string; empId: string; name: string; designation: string; department: string
  period: string; punctuality: number; teachingQuality: number; studentFeedback: number
  overall: number; grade: Grade; notes: string
}

const MOCK: Review[] = [
  { id:'1', empId:'EMP001', name:'Rajesh Kumar', designation:'Principal', department:'Administration', period:'Q4 2024', punctuality:5, teachingQuality:5, studentFeedback:4.8, overall:4.9, grade:'A', notes:'Exceptional leadership and management skills.' },
  { id:'2', empId:'EMP002', name:'Priya Sharma', designation:'Vice Principal', department:'Administration', period:'Q4 2024', punctuality:4.8, teachingQuality:4.7, studentFeedback:4.6, overall:4.7, grade:'A', notes:'Strong academic leadership, great coordination.' },
  { id:'3', empId:'EMP003', name:'Anita Verma', designation:'Senior Teacher', department:'Science', period:'Q4 2024', punctuality:4.5, teachingQuality:4.8, studentFeedback:4.7, overall:4.7, grade:'A', notes:'Outstanding science educator, innovative teaching methods.' },
  { id:'4', empId:'EMP004', name:'Suresh Patel', designation:'Teacher', department:'Mathematics', period:'Q4 2024', punctuality:4.0, teachingQuality:4.2, studentFeedback:4.0, overall:4.1, grade:'B', notes:'Good command over subject, needs improvement in student interaction.' },
  { id:'5', empId:'EMP005', name:'Meena Joshi', designation:'Teacher', department:'English', period:'Q4 2024', punctuality:3.5, teachingQuality:3.8, studentFeedback:3.7, overall:3.7, grade:'C', notes:'Average performance, attendance issues noted.' },
  { id:'6', empId:'EMP006', name:'Vikram Singh', designation:'Lab Assistant', department:'Science', period:'Q4 2024', punctuality:4.2, teachingQuality:4.0, studentFeedback:3.8, overall:4.0, grade:'B', notes:'Reliable lab management, proactive support to teachers.' },
]

const gradeColor: Record<Grade, string> = {
  A: 'bg-green-50 text-green-700',
  B: 'bg-blue-50 text-blue-700',
  C: 'bg-yellow-50 text-yellow-700',
  D: 'bg-red-50 text-red-700',
}

const DEPARTMENTS = ['All','Administration','Science','Mathematics','English','Library']
const PERIODS = ['All','Q4 2024','Q3 2024','Q2 2024','Q1 2024']

function Stars({ val }: { val: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(val) ? 'text-[#d4a017] fill-[#d4a017]' : 'text-gray-200 fill-gray-200'}`} />
      ))}
      <span className="ml-1 text-xs text-gray-500">{val.toFixed(1)}</span>
    </div>
  )
}

const emptyForm = { name:'', designation:'', department:'Science', period:'Q4 2024', punctuality:3, teachingQuality:3, studentFeedback:3, notes:'' }

export default function PerformancePage() {
  const [reviews, setReviews] = useState<Review[]>(MOCK)
  const [deptFilter, setDeptFilter] = useState('All')
  const [periodFilter, setPeriodFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })

  const filtered = reviews.filter(r =>
    (deptFilter === 'All' || r.department === deptFilter) &&
    (periodFilter === 'All' || r.period === periodFilter)
  )

  const topPerformers = reviews.filter(r => r.grade === 'A').length
  const avgRating = (reviews.reduce((s, r) => s + r.overall, 0) / reviews.length).toFixed(1)

  function computeGrade(avg: number): Grade {
    if (avg >= 4.5) return 'A'
    if (avg >= 3.5) return 'B'
    if (avg >= 2.5) return 'C'
    return 'D'
  }

  function handleAdd() {
    const avg = (form.punctuality + form.teachingQuality + form.studentFeedback) / 3
    const newReview: Review = {
      id: String(Date.now()), empId: 'EMP000', name: form.name, designation: form.designation,
      department: form.department, period: form.period, punctuality: form.punctuality,
      teachingQuality: form.teachingQuality, studentFeedback: form.studentFeedback,
      overall: Math.round(avg * 10) / 10, grade: computeGrade(avg), notes: form.notes
    }
    setReviews(prev => [newReview, ...prev])
    setShowModal(false)
    setForm({ ...emptyForm })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Performance Reviews</h1>
          <p className="text-gray-500 text-sm mt-1">Track and evaluate staff performance</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label:'Avg Rating', value:avgRating, sub:'Across all staff', icon: Star, color:'bg-yellow-50 text-yellow-600' },
          { label:'Top Performers', value:String(topPerformers), sub:'Grade A employees', icon: Award, color:'bg-green-50 text-green-600' },
          { label:'Reviews This Quarter', value:String(reviews.length), sub:'Q4 2024', icon: TrendingUp, color:'bg-blue-50 text-blue-600' },
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

      {/* Performance Trend */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#1e3a5f]" /> Performance Overview — Q4 2024
        </h3>
        <div className="space-y-3">
          {MOCK.map(r => (
            <div key={r.id} className="flex items-center gap-3">
              <p className="text-sm text-gray-700 w-36 truncate flex-shrink-0">{r.name}</p>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                <div className="bg-[#1e3a5f] h-2.5 rounded-full transition-all" style={{ width: `${(r.overall / 5) * 100}%` }} />
              </div>
              <span className="text-xs font-semibold text-gray-700 w-8 text-right">{r.overall}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium w-8 text-center ${gradeColor[r.grade]}`}>{r.grade}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-gray-400" />
        {[
          { label:'Department', val: deptFilter, set: setDeptFilter, opts: DEPARTMENTS },
          { label:'Period', val: periodFilter, set: setPeriodFilter, opts: PERIODS },
        ].map(f => (
          <div key={f.label} className="relative">
            <select value={f.val} onChange={e => f.set(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#1e3a5f]/40 bg-white cursor-pointer">
              {f.opts.map(o => <option key={o}>{o === 'All' ? `${f.label}: All` : o}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        ))}
        <p className="ml-auto text-sm text-gray-500">{filtered.length} reviews</p>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Employee','Department','Period','Punctuality','Teaching Quality','Student Feedback','Overall','Grade'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(r => (
                <tr key={r.id} className={`hover:bg-gray-50/60 transition-colors ${r.grade === 'A' ? 'bg-green-50/20' : ''}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {r.grade === 'A' && <Award className="w-3.5 h-3.5 text-[#d4a017] flex-shrink-0" />}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{r.department}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{r.period}</td>
                  <td className="px-5 py-3.5"><Stars val={r.punctuality} /></td>
                  <td className="px-5 py-3.5"><Stars val={r.teachingQuality} /></td>
                  <td className="px-5 py-3.5"><Stars val={r.studentFeedback} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-[#1e3a5f] h-1.5 rounded-full" style={{ width: `${(r.overall/5)*100}%` }} />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{r.overall}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${gradeColor[r.grade]}`}>{r.grade}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400">No reviews match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Review Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add Performance Review</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[{ label:'Employee Name', key:'name' },{ label:'Designation', key:'designation' }].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                    <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                  </div>
                ))}
                {[{ label:'Department', key:'department', opts: DEPARTMENTS.slice(1) },{ label:'Review Period', key:'period', opts: PERIODS.slice(1) }].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                    <div className="relative">
                      <select value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 bg-white">
                        {f.opts.map(o => <option key={o}>{o}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
              {[{ label:'Punctuality (1-5)', key:'punctuality' },{ label:'Teaching Quality (1-5)', key:'teachingQuality' },{ label:'Student Feedback (1-5)', key:'studentFeedback' }].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <div className="flex items-center gap-3">
                    <input type="range" min={1} max={5} step={0.1} value={(form as any)[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: Number(e.target.value) }))}
                      className="flex-1 accent-[#1e3a5f]" />
                    <span className="text-sm font-bold text-[#1e3a5f] w-8">{(form as any)[f.key]}</span>
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleAdd} className="px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] transition-colors">Save Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
