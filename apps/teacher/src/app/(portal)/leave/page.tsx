'use client'

import { useState } from 'react'
import { Plus, CheckCircle2, XCircle, Clock, Calendar, X } from 'lucide-react'

const leaveBalance = [
  { type: 'Casual Leave',  used: 8,  total: 12, color: 'bg-blue-500' },
  { type: 'Medical Leave', used: 5,  total: 6,  color: 'bg-green-500' },
  { type: 'Personal Leave', used: 2, total: 5,  color: 'bg-purple-500' },
  { type: 'Emergency Leave', used: 0, total: 2, color: 'bg-red-500' },
]

const leaveHistory = [
  { id: 1, type: 'Casual',  from: '12 May 2026', to: '12 May 2026', days: 1, reason: 'Personal work', status: 'approved', appliedOn: '10 May 2026' },
  { id: 2, type: 'Medical', from: '3 Apr 2026',  to: '5 Apr 2026',  days: 3, reason: 'Fever and flu', status: 'approved', appliedOn: '3 Apr 2026' },
  { id: 3, type: 'Casual',  from: '2 Jun 2026',  to: '2 Jun 2026',  days: 1, reason: 'Family function', status: 'pending', appliedOn: '30 May 2026' },
  { id: 4, type: 'Casual',  from: '15 Mar 2026', to: '16 Mar 2026', days: 2, reason: 'Travel', status: 'rejected', appliedOn: '13 Mar 2026' },
  { id: 5, type: 'Medical', from: '1 Feb 2026',  to: '2 Feb 2026',  days: 2, reason: 'Dental procedure', status: 'approved', appliedOn: '1 Feb 2026' },
]

const upcomingLeaves = [
  { date: '2 Jun 2026', type: 'Casual', status: 'pending' },
]

const LEAVE_TYPES = ['Casual Leave', 'Medical Leave', 'Personal Leave', 'Emergency Leave']

export default function LeavePage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'Casual Leave', from: '', to: '', reason: '' })
  const [submitted, setSubmitted] = useState(false)

  const calcDays = () => {
    if (!form.from || !form.to) return 0
    const diff = new Date(form.to).getTime() - new Date(form.from).getTime()
    return Math.max(0, Math.floor(diff / 86400000) + 1)
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setShowForm(false)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Leave Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Apply and track your leave requests</p>
        </div>
        <button onClick={() => setShowForm(o => !o)} className="btn-primary">
          <Plus size={15} /> Apply for Leave
        </button>
      </div>

      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-2 text-green-700">
          <CheckCircle2 size={16} /> Leave application submitted successfully. Pending approval.
        </div>
      )}

      {/* Apply Form */}
      {showForm && (
        <div className="card border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Leave Application</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="form-label">Leave Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LEAVE_TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                      form.type === t
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="form-label">From Date</label>
              <input
                type="date"
                className="form-input"
                value={form.from}
                onChange={e => setForm(f => ({ ...f, from: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label">To Date</label>
              <input
                type="date"
                className="form-input"
                value={form.to}
                onChange={e => setForm(f => ({ ...f, to: e.target.value }))}
              />
            </div>
            {calcDays() > 0 && (
              <div className="sm:col-span-2">
                <span className="badge bg-indigo-100 text-indigo-700">{calcDays()} working day{calcDays() > 1 ? 's' : ''} leave</span>
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="form-label">Reason</label>
              <textarea
                rows={3}
                className="form-input resize-none"
                placeholder="State the reason for leave..."
                value={form.reason}
                onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
              />
            </div>
            {form.type === 'Medical Leave' && (
              <div className="sm:col-span-2">
                <label className="form-label">Medical Certificate (if applicable)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-indigo-300 transition-colors">
                  <p className="text-xs text-gray-500">Upload medical certificate PDF or image</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSubmit}
              disabled={!form.from || !form.to || !form.reason}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Application
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Leave Balance */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Leave Balance — Academic Year 2025–26</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {leaveBalance.map(lb => {
            const pct = Math.round((lb.used / lb.total) * 100)
            const remaining = lb.total - lb.used
            return (
              <div key={lb.type} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-800">{lb.type}</p>
                  <span className={`badge ${remaining === 0 ? 'bg-red-100 text-red-600' : remaining <= 1 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                    {remaining} left
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full ${lb.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{lb.used} used</span>
                  <span>{lb.total} total</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Leave History */}
        <div className="card lg:col-span-2 p-0 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-sm text-gray-700">Leave History</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {leaveHistory.map(l => (
              <div key={l.id} className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50/60">
                <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${
                  l.status === 'approved' ? 'bg-green-100' :
                  l.status === 'rejected' ? 'bg-red-100' : 'bg-amber-100'
                }`}>
                  {l.status === 'approved' ? <CheckCircle2 size={14} className="text-green-600" /> :
                   l.status === 'rejected' ? <XCircle size={14} className="text-red-500" /> :
                   <Clock size={14} className="text-amber-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-gray-800">{l.type} Leave</p>
                    <span className={`badge text-xs ${
                      l.status === 'approved' ? 'bg-green-100 text-green-700' :
                      l.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {l.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {l.from}{l.from !== l.to ? ` → ${l.to}` : ''} · {l.days} day{l.days > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{l.reason}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-gray-400">Applied {l.appliedOn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Approved Leaves */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-indigo-600" /> Upcoming Leaves
          </h3>
          {upcomingLeaves.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No upcoming leaves</p>
          ) : (
            <div className="space-y-2">
              {upcomingLeaves.map((l, i) => (
                <div key={i} className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <p className="text-sm font-medium text-amber-800">{l.date}</p>
                  <p className="text-xs text-amber-600">{l.type} Leave</p>
                  <span className="badge bg-amber-100 text-amber-700 mt-1 text-xs">{l.status}</span>
                </div>
              ))}
            </div>
          )}

          {/* Mini Calendar Placeholder */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-medium mb-3">June 2026</p>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['S','M','T','W','T','F','S'].map((d, i) => (
                <div key={i} className="text-[10px] font-medium text-gray-400">{d}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                <div
                  key={d}
                  className={`text-xs w-6 h-6 mx-auto flex items-center justify-center rounded-full ${
                    d === 2 ? 'bg-amber-400 text-white font-bold' :
                    d === 31 ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              <span className="inline-block w-2.5 h-2.5 bg-amber-400 rounded-full mr-1" />Pending leave
              <span className="inline-block w-2.5 h-2.5 bg-indigo-600 rounded-full mr-1 ml-3" />Today
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
