'use client'
import React, { useState, useRef } from 'react'
import { Plus, X, Upload, Play, BookOpen, Users, Clock, Trash2, Edit2, Video } from 'lucide-react'

interface Course {
  id: string; title: string; subject: string; class: string;
  description: string; instructor: string; totalLessons: number;
  enrolledStudents: number; duration: string; thumbnail?: string;
  videoUrl?: string; status: 'Draft' | 'Published' | 'Archived';
}

const MOCK: Course[] = [
  { id: '1', title: 'Algebra Fundamentals', subject: 'Mathematics', class: '10', description: 'Complete algebra course covering equations, polynomials, and graphs.', instructor: 'Mr. Rajesh Kumar', totalLessons: 24, enrolledStudents: 142, duration: '18h 30m', status: 'Published' },
  { id: '2', title: 'Newton\'s Laws of Motion', subject: 'Physics', class: '11', description: 'Deep dive into classical mechanics and Newton\'s three laws.', instructor: 'Ms. Priya Sharma', totalLessons: 18, enrolledStudents: 98, duration: '14h 15m', status: 'Published' },
  { id: '3', title: 'English Literature', subject: 'English', class: '12', description: 'Analysis of prose, poetry, and drama for board exam preparation.', instructor: 'Mrs. Anita Singh', totalLessons: 30, enrolledStudents: 115, duration: '22h 00m', status: 'Draft' },
]

const statusStyle: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-600',
  Published: 'bg-green-100 text-green-700',
  Archived: 'bg-yellow-100 text-yellow-700',
}

const emptyForm = { title: '', subject: '', class: '10', description: '', instructor: '', duration: '', totalLessons: 0 }

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(MOCK)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbFile, setThumbFile] = useState<File | null>(null)
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const videoRef = useRef<HTMLInputElement>(null)
  const thumbRef = useRef<HTMLInputElement>(null)

  function handleThumb(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setThumbFile(file)
    setThumbPreview(URL.createObjectURL(file))
  }

  function handleVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setVideoFile(file)
  }

  async function handleCreate() {
    setUploading(true)
    await new Promise(r => setTimeout(r, 800))
    const course: Course = {
      id: String(Date.now()),
      ...form,
      totalLessons: Number(form.totalLessons),
      enrolledStudents: 0,
      thumbnail: thumbPreview ?? undefined,
      status: 'Draft',
    }
    setCourses(prev => [course, ...prev])
    setShowCreate(false)
    setForm(emptyForm)
    setVideoFile(null)
    setThumbFile(null)
    setThumbPreview(null)
    setUploading(false)
  }

  function deleteCourse(id: string) {
    if (confirm('Delete this course?')) setCourses(prev => prev.filter(c => c.id !== id))
  }

  function publish(id: string) {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status: 'Published' } : c))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-500 text-sm mt-1">{courses.length} courses · {courses.filter(c => c.status === 'Published').length} published</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Plus className="w-4 h-4" /> Create Course
        </button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {courses.map(c => (
          <div key={c.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-36 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a96] flex items-center justify-center">
              {c.thumbnail
                ? <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                : <Play className="w-12 h-12 text-white/30" />
              }
              <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${statusStyle[c.status]}`}>{c.status}</span>
            </div>
            <div className="p-4">
              <p className="text-xs text-[#1e3a5f] font-semibold mb-1">{c.subject} · Class {c.class}</p>
              <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{c.title}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{c.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{c.totalLessons} lessons</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{c.enrolledStudents}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{c.duration}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">by {c.instructor}</p>
              <div className="flex gap-2">
                {c.status === 'Draft' && (
                  <button onClick={() => publish(c.id)}
                    className="flex-1 py-2 bg-green-600 text-white rounded-xl text-xs font-medium hover:bg-green-700 transition-colors">
                    Publish
                  </button>
                )}
                <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"><Edit2 className="w-3.5 h-3.5 text-gray-500" /></button>
                <button onClick={() => deleteCourse(c.id)} className="p-2 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors"><Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-red-500" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl my-6 shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Create New Course</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Thumbnail Upload */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Course Thumbnail</label>
                <div onClick={() => thumbRef.current?.click()}
                  className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-[#1e3a5f]/40 transition-colors overflow-hidden">
                  {thumbPreview
                    ? <img src={thumbPreview} alt="thumb" className="w-full h-full object-cover" />
                    : <div className="text-center"><Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" /><p className="text-xs text-gray-400">Click to upload thumbnail</p></div>
                  }
                </div>
                <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={handleThumb} />
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Intro Video</label>
                <div onClick={() => videoRef.current?.click()}
                  className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-[#1e3a5f]/40 transition-colors">
                  <Video className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">{videoFile ? videoFile.name : 'Click to upload intro video (MP4, max 200MB)'}</span>
                </div>
                <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleVideo} />
              </div>

              {/* Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Course Title</label>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Algebra Fundamentals"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
                  <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    placeholder="Mathematics"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Class</label>
                  <select value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 bg-white">
                    {['7','8','9','10','11','12'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Instructor</label>
                  <input value={form.instructor} onChange={e => setForm(p => ({ ...p, instructor: e.target.value }))}
                    placeholder="Mr. Rajesh Kumar"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Total Lessons</label>
                  <input type="number" value={form.totalLessons} onChange={e => setForm(p => ({ ...p, totalLessons: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    rows={3} placeholder="Brief course description…"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 resize-none" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowCreate(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} disabled={uploading || !form.title}
                className="px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] disabled:opacity-50 transition-colors">
                {uploading ? 'Creating…' : 'Create Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
