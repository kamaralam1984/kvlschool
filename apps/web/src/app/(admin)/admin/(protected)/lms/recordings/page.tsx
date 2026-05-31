'use client'
import React, { useState, useMemo } from 'react'
import { Search, Upload, Play, Download, ChevronDown, Eye, Clock, Calendar, Video, Filter } from 'lucide-react'

interface Recording {
  id: string
  title: string
  subject: string
  class: string
  teacher: string
  dateRecorded: string
  duration: string
  views: number
  size: string
  thumbnailColor: string
}

const MOCK: Recording[] = [
  {
    id: 'R001', title: 'Newton\'s Laws of Motion — Part 2', subject: 'Physics', class: 'Grade 12',
    teacher: 'Mr. Suresh Pillai', dateRecorded: '28 May 2026', duration: '48:32', views: 142, size: '1.2 GB',
    thumbnailColor: 'from-blue-600 to-blue-800',
  },
  {
    id: 'R002', title: 'Organic Chemistry: Reactions & Mechanisms', subject: 'Chemistry', class: 'Grade 11',
    teacher: 'Mrs. Priya Sharma', dateRecorded: '27 May 2026', duration: '55:14', views: 98, size: '1.4 GB',
    thumbnailColor: 'from-green-600 to-green-800',
  },
  {
    id: 'R003', title: 'Quadratic Equations — Problem Solving', subject: 'Mathematics', class: 'Grade 10',
    teacher: 'Mr. Anil Kumar', dateRecorded: '26 May 2026', duration: '42:07', views: 215, size: '1.0 GB',
    thumbnailColor: 'from-purple-600 to-purple-800',
  },
  {
    id: 'R004', title: 'The Renaissance — History & Impact', subject: 'History', class: 'Grade 9',
    teacher: 'Mrs. Deepa Nair', dateRecorded: '25 May 2026', duration: '38:50', views: 87, size: '900 MB',
    thumbnailColor: 'from-amber-600 to-amber-800',
  },
  {
    id: 'R005', title: 'Python Functions & Recursion', subject: 'Computer Science', class: 'Grade 11',
    teacher: 'Mrs. Sneha Joshi', dateRecorded: '24 May 2026', duration: '61:20', views: 176, size: '1.5 GB',
    thumbnailColor: 'from-indigo-600 to-indigo-800',
  },
  {
    id: 'R006', title: 'Shakespeare\'s Macbeth — Act 3 Analysis', subject: 'English', class: 'Grade 12',
    teacher: 'Mrs. Kavita Rao', dateRecorded: '22 May 2026', duration: '44:55', views: 63, size: '1.1 GB',
    thumbnailColor: 'from-rose-600 to-rose-800',
  },
]

const SUBJECTS = ['All', 'Physics', 'Chemistry', 'Mathematics', 'History', 'Computer Science', 'English']
const CLASSES = ['All', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']

export default function RecordingsPage() {
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [classFilter, setClassFilter] = useState('All')
  const [playing, setPlaying] = useState<string | null>(null)
  const [showUpload, setShowUpload] = useState(false)

  const filtered = useMemo(() => MOCK.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.teacher.toLowerCase().includes(search.toLowerCase())
    const matchSubject = subjectFilter === 'All' || r.subject === subjectFilter
    const matchClass = classFilter === 'All' || r.class === classFilter
    return matchSearch && matchSubject && matchClass
  }), [search, subjectFilter, classFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Recordings</h1>
          <p className="text-gray-500 text-sm mt-1">Browse, watch and download recorded class sessions</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#16304f] transition-colors"
        >
          <Upload size={16} />
          Upload Recording
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Recordings', value: '94', icon: Video, color: 'bg-blue-50 text-blue-600' },
          { label: 'Total Views', value: '3,812', icon: Eye, color: 'bg-purple-50 text-purple-600' },
          { label: 'Total Duration', value: '186 hrs', icon: Clock, color: 'bg-green-50 text-green-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.color}`}><s.icon size={20} /></div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
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
            placeholder="Search by title or teacher..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
          />
        </div>
        {[
          { label: 'Subject', value: subjectFilter, set: setSubjectFilter, options: SUBJECTS },
          { label: 'Class', value: classFilter, set: setClassFilter, options: CLASSES },
        ].map(({ label, value, set, options }) => (
          <div key={label} className="relative">
            <select
              value={value}
              onChange={(e) => set(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 bg-white"
            >
              {options.map((o) => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        ))}
        <span className="ml-auto flex items-center text-sm text-gray-500 gap-1">
          <Filter size={13} />{filtered.length} recordings
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            {/* Thumbnail */}
            <div className={`relative h-40 bg-gradient-to-br ${r.thumbnailColor} flex items-center justify-center`}>
              <button
                onClick={() => setPlaying(r.id)}
                className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Play size={24} className="text-white ml-1" fill="white" />
              </button>
              <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                <Clock size={10} />{r.duration}
              </span>
              <span className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-md">{r.subject}</span>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">{r.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{r.teacher} · {r.class}</p>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span className="flex items-center gap-1"><Calendar size={11} />{r.dateRecorded}</span>
                <span className="flex items-center gap-1"><Eye size={11} />{r.views} views</span>
                <span>{r.size}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPlaying(r.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#1e3a5f] text-white py-1.5 rounded-xl text-xs font-medium hover:bg-[#16304f] transition-colors"
                >
                  <Play size={12} />Watch
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-1.5 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors">
                  <Download size={12} />Download
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <Video size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm">No recordings match your filters.</p>
          </div>
        )}
      </div>

      {/* Watch Modal */}
      {playing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-black rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3 bg-gray-900">
              <p className="text-white text-sm font-medium truncate">
                {MOCK.find((r) => r.id === playing)?.title}
              </p>
              <button onClick={() => setPlaying(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className={`aspect-video bg-gradient-to-br ${MOCK.find(r => r.id === playing)?.thumbnailColor} flex items-center justify-center`}>
              <div className="text-center text-white">
                <Play size={48} className="mx-auto mb-2 opacity-60" />
                <p className="text-sm opacity-60">Video player — connect media server to stream</p>
              </div>
            </div>
            <div className="bg-gray-900 p-4 flex items-center justify-between text-sm text-gray-400">
              <span>{MOCK.find(r => r.id === playing)?.teacher} · {MOCK.find(r => r.id === playing)?.class}</span>
              <span>{MOCK.find(r => r.id === playing)?.duration}</span>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Upload Recording</h2>
              <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-gray-100 rounded-xl"><span>✕</span></button>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <Upload size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">Drag & drop video file here</p>
              <p className="text-xs text-gray-400 mt-1">MP4, MKV, MOV up to 4 GB</p>
              <button className="mt-3 text-xs text-[#1e3a5f] font-medium border border-[#1e3a5f] px-3 py-1.5 rounded-lg hover:bg-[#1e3a5f]/5">Browse File</button>
            </div>
            {[
              { label: 'Title', placeholder: 'Recording title...' },
              { label: 'Subject', placeholder: 'Select subject' },
              { label: 'Class', placeholder: 'Select class' },
            ].map(({ label, placeholder }) => (
              <div key={label}>
                <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
                <input placeholder={placeholder} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowUpload(false)} className="flex-1 border border-gray-200 py-2 rounded-xl text-sm">Cancel</button>
              <button onClick={() => setShowUpload(false)} className="flex-1 bg-[#1e3a5f] text-white py-2 rounded-xl text-sm font-medium">Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
