'use client'
import React, { useState } from 'react'
import { Plus, X, Video, Clock, Users, Link2, PlayCircle, Calendar, Trash2, Copy, CheckCheck } from 'lucide-react'

interface LiveClass {
  id: string; title: string; subject: string; class: string; section: string;
  instructor: string; date: string; time: string; duration: number;
  platform: 'Zoom' | 'Google Meet' | 'MS Teams'; meetLink: string;
  status: 'Upcoming' | 'Live' | 'Completed'; studentsJoined?: number;
}

const MOCK: LiveClass[] = [
  { id: '1', title: 'Quadratic Equations — Live Session', subject: 'Mathematics', class: '10', section: 'A', instructor: 'Mr. Rajesh Kumar', date: '2025-02-05', time: '09:00', duration: 60, platform: 'Zoom', meetLink: 'https://zoom.us/j/123456789', status: 'Upcoming' },
  { id: '2', title: 'Cell Biology Revision', subject: 'Science', class: '9', section: 'B', instructor: 'Ms. Priya Sharma', date: '2025-02-03', time: '11:00', duration: 45, platform: 'Google Meet', meetLink: 'https://meet.google.com/abc-xyz-def', status: 'Upcoming' },
  { id: '3', title: 'Essay Writing Workshop', subject: 'English', class: '12', section: 'All', instructor: 'Mrs. Anita Singh', date: '2025-01-28', time: '10:00', duration: 90, platform: 'Zoom', meetLink: 'https://zoom.us/j/987654321', status: 'Completed', studentsJoined: 87 },
]

const platforms = ['Zoom', 'Google Meet', 'MS Teams'] as const
const statusStyle: Record<string, string> = {
  Upcoming: 'bg-blue-100 text-blue-700',
  Live: 'bg-green-100 text-green-700 animate-pulse',
  Completed: 'bg-gray-100 text-gray-600',
}

const emptyForm = { title: '', subject: '', class: '10', section: 'A', instructor: '', date: '', time: '09:00', duration: 60, platform: 'Zoom' as const, meetLink: '' }

export default function LiveClassesPage() {
  const [classes, setClasses] = useState<LiveClass[]>(MOCK)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [copied, setCopied] = useState<string | null>(null)

  function handleCreate() {
    const lc: LiveClass = { id: String(Date.now()), ...form, duration: Number(form.duration), status: 'Upcoming' }
    setClasses(prev => [lc, ...prev])
    setShowCreate(false)
    setForm(emptyForm)
  }

  function deleteClass(id: string) {
    if (confirm('Delete this live class?')) setClasses(prev => prev.filter(c => c.id !== id))
  }

  async function copyLink(link: string, id: string) {
    await navigator.clipboard.writeText(link)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const upcoming = classes.filter(c => c.status !== 'Completed')
  const past = classes.filter(c => c.status === 'Completed')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Classes</h1>
          <p className="text-gray-500 text-sm mt-1">{upcoming.length} upcoming · {past.length} completed</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Plus className="w-4 h-4" /> Schedule Class
        </button>
      </div>

      {/* Upcoming */}
      <div>
        <h2 className="text-sm font-semibold text-gray-600 mb-3">Upcoming & Live</h2>
        <div className="space-y-3">
          {upcoming.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-sm text-gray-400">No upcoming classes. Schedule one!</div>
          )}
          {upcoming.map(c => (
            <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${c.status === 'Live' ? 'bg-green-100' : 'bg-[#1e3a5f]/10'}`}>
                <Video className={`w-6 h-6 ${c.status === 'Live' ? 'text-green-600' : 'text-[#1e3a5f]'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{c.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${statusStyle[c.status]}`}>{c.status}</span>
                </div>
                <p className="text-xs text-gray-500">{c.subject} · Class {c.class} – {c.section} · by {c.instructor}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{c.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.time} ({c.duration}min)</span>
                  <span className="flex items-center gap-1 capitalize"><PlayCircle className="w-3 h-3" />{c.platform}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => copyLink(c.meetLink, c.id)}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  {copied === c.id ? <CheckCheck className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === c.id ? 'Copied!' : 'Copy Link'}
                </button>
                <a href={c.meetLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-xl text-xs font-medium hover:bg-green-700 transition-colors">
                  <Link2 className="w-3.5 h-3.5" /> Join
                </a>
                <button onClick={() => deleteClass(c.id)} className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-3">Past Classes</h2>
          <div className="space-y-3">
            {past.map(c => (
              <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 opacity-70">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Video className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-700 text-sm truncate">{c.title}</h3>
                  <p className="text-xs text-gray-400">{c.subject} · {c.date} at {c.time}</p>
                  {c.studentsJoined && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Users className="w-3 h-3" />{c.studentsJoined} students joined
                    </p>
                  )}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[c.status]}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Schedule Live Class</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Class Title</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Quadratic Equations Live Session"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
              </div>
              {[
                { label: 'Subject', key: 'subject', type: 'text', placeholder: 'Mathematics' },
                { label: 'Instructor', key: 'instructor', type: 'text', placeholder: 'Mr. Rajesh Kumar' },
                { label: 'Date', key: 'date', type: 'date', placeholder: '' },
                { label: 'Time', key: 'time', type: 'time', placeholder: '' },
                { label: 'Duration (minutes)', key: 'duration', type: 'number', placeholder: '60' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} placeholder={f.placeholder}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
              ))}
              {[
                { label: 'Class', key: 'class', opts: ['7','8','9','10','11','12'] },
                { label: 'Section', key: 'section', opts: ['A','B','C','D','All'] },
                { label: 'Platform', key: 'platform', opts: platforms },
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
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Meeting Link</label>
                <input value={form.meetLink} onChange={e => setForm(p => ({ ...p, meetLink: e.target.value }))}
                  placeholder="https://zoom.us/j/..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowCreate(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} disabled={!form.title || !form.date}
                className="px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] disabled:opacity-50 transition-colors">
                Schedule Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
