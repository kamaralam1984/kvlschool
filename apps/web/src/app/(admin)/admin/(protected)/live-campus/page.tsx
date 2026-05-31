'use client'
import React, { useState } from 'react'
import {
  Video, Users, Clock, Play, Square, Plus, X, Link2, Copy, CheckCheck,
  Mic, MicOff, Camera, CameraOff, Hand, MessageSquare, BarChart2,
  Zap, Settings, ExternalLink, CheckCircle, AlertCircle, Radio,
  Youtube, Monitor, Globe, Calendar, Download, Eye, ChevronDown,
  Send, Timer, Award, LayoutGrid, List, RefreshCw
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

interface LiveSession {
  id: string
  title: string
  subject: string
  class: string
  instructor: string
  platform: 'Zoom' | 'Google Meet' | 'MS Teams' | 'YouTube Live' | 'Facebook Live'
  link: string
  startedAt: string
  duration: number // minutes elapsed
  studentsJoined: number
  totalStudents: number
  status: 'live' | 'scheduled' | 'ended'
  raiseHands: number
  chatCount: number
}

interface PastSession {
  id: string
  title: string
  subject: string
  class: string
  instructor: string
  date: string
  duration: number
  studentsAttended: number
  totalStudents: number
  platform: string
  recording: boolean
  summary: string
}

interface PollOption { text: string; votes: number }

interface Poll {
  question: string
  options: PollOption[]
  active: boolean
  launched: boolean
}

// ── Mock data ──────────────────────────────────────────────────────────────

const LIVE_SESSIONS: LiveSession[] = [
  {
    id: 'ls1',
    title: 'Quadratic Equations — Live Session',
    subject: 'Mathematics',
    class: 'Class 10-A',
    instructor: 'Mr. Rajesh Kumar',
    platform: 'Zoom',
    link: 'https://zoom.us/j/123456789',
    startedAt: '09:00 AM',
    duration: 28,
    studentsJoined: 42,
    totalStudents: 48,
    status: 'live',
    raiseHands: 5,
    chatCount: 34,
  },
  {
    id: 'ls2',
    title: 'Cell Biology Revision',
    subject: 'Science',
    class: 'Class 9-B',
    instructor: 'Ms. Priya Sharma',
    platform: 'Google Meet',
    link: 'https://meet.google.com/abc-xyz-def',
    startedAt: '11:00 AM',
    duration: 12,
    studentsJoined: 37,
    totalStudents: 40,
    status: 'live',
    raiseHands: 2,
    chatCount: 18,
  },
  {
    id: 'ls3',
    title: 'Essay Writing Workshop',
    subject: 'English',
    class: 'Class 12-All',
    instructor: 'Mrs. Anita Singh',
    platform: 'MS Teams',
    link: 'https://teams.microsoft.com/l/meetup-join/abc',
    startedAt: '02:00 PM',
    duration: 0,
    studentsJoined: 0,
    totalStudents: 95,
    status: 'scheduled',
    raiseHands: 0,
    chatCount: 0,
  },
]

const PAST_SESSIONS: PastSession[] = [
  { id: 'ps1', title: 'Algebra Introduction', subject: 'Mathematics', class: 'Class 8-A', instructor: 'Mr. Rajesh Kumar', date: '30 May 2025', duration: 55, studentsAttended: 38, totalStudents: 42, platform: 'Zoom', recording: true, summary: 'Covered linear equations, introduced variables and constants. Students completed 3 practice problems live.' },
  { id: 'ps2', title: 'Photosynthesis Deep Dive', subject: 'Biology', class: 'Class 9-A', instructor: 'Ms. Priya Sharma', date: '29 May 2025', duration: 48, studentsAttended: 41, totalStudents: 44, platform: 'Google Meet', recording: true, summary: 'Interactive session on light & dark reactions. Used live poll — 87% correctly identified Calvin Cycle products.' },
  { id: 'ps3', title: 'World War II — Causes', subject: 'History', class: 'Class 10-B', instructor: 'Mr. Suresh Pillai', date: '28 May 2025', duration: 60, studentsAttended: 29, totalStudents: 46, platform: 'MS Teams', recording: false, summary: 'Timeline analysis of pre-war events. Attendance was lower than average — follow-up recommended.' },
  { id: 'ps4', title: 'Python Basics — Functions', subject: 'Computer Science', class: 'Class 11-A', instructor: 'Ms. Deepa Nair', date: '27 May 2025', duration: 70, studentsAttended: 52, totalStudents: 55, platform: 'YouTube Live', recording: true, summary: 'Live coding session. Students wrote and tested their first functions. 94% completion rate on in-session tasks.' },
]

const PLATFORMS = [
  { name: 'Zoom', icon: Video, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', connected: true, status: 'Connected' },
  { name: 'Google Meet', icon: Video, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', connected: true, status: 'Connected' },
  { name: 'MS Teams', icon: Monitor, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', connected: false, status: 'Not connected' },
  { name: 'YouTube Live', icon: Youtube, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', connected: true, status: 'Connected' },
  { name: 'Facebook Live', icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', connected: false, status: 'Not connected' },
]

const PLATFORM_OPTIONS = ['Zoom', 'Google Meet', 'MS Teams', 'YouTube Live', 'Custom RTMP'] as const

const emptyForm = {
  title: '', subject: '', class: '10', section: 'A', instructor: '',
  date: '', time: '09:00', duration: 60, platform: 'Zoom' as typeof PLATFORM_OPTIONS[number],
  capacity: 50, enablePolls: true, enableQuiz: true, enableChat: true, generateLink: true,
}

// ── Helpers ────────────────────────────────────────────────────────────────

function platformColor(p: string) {
  const map: Record<string, string> = {
    'Zoom': 'text-blue-600 bg-blue-50',
    'Google Meet': 'text-green-600 bg-green-50',
    'MS Teams': 'text-purple-600 bg-purple-50',
    'YouTube Live': 'text-red-600 bg-red-50',
    'Facebook Live': 'text-indigo-600 bg-indigo-50',
  }
  return map[p] ?? 'text-gray-600 bg-gray-50'
}

// ── Main component ──────────────────────────────────────────────────────────

export default function LiveCampusPage() {
  const [sessions, setSessions] = useState<LiveSession[]>(LIVE_SESSIONS)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [copied, setCopied] = useState<string | null>(null)
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Live controls state
  const [raiseHandCount, setRaiseHandCount] = useState(5)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { from: 'Aryan M.', msg: 'Can you repeat the formula for discriminant?', time: '09:14' },
    { from: 'Sneha K.', msg: 'Sir the screen share is lagging a bit', time: '09:16' },
    { from: 'Rohan P.', msg: 'Got it! Thank you', time: '09:18' },
  ])
  const [poll, setPoll] = useState<Poll>({
    question: '',
    options: [{ text: '', votes: 0 }, { text: '', votes: 0 }, { text: '', votes: 0 }],
    active: false,
    launched: false,
  })
  const [quizQuestion, setQuizQuestion] = useState('')
  const [quizTimer, setQuizTimer] = useState(30)
  const [quizActive, setQuizActive] = useState(false)
  const [attendanceSnapped, setAttendanceSnapped] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)

  // Chat
  const sendChat = () => {
    if (!chatInput.trim()) return
    setChatMessages(p => [...p, { from: 'You (Admin)', msg: chatInput, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }])
    setChatInput('')
  }

  // Poll launch
  const launchPoll = () => {
    if (!poll.question || poll.options.every(o => !o.text)) return
    const mockVoted = poll.options.map(o => ({ ...o, votes: o.text ? Math.floor(Math.random() * 30) + 2 : 0 }))
    setPoll(p => ({ ...p, launched: true, active: false, options: mockVoted }))
  }

  // Schedule
  const handleCreate = () => {
    const newSession: LiveSession = {
      id: String(Date.now()),
      title: form.title,
      subject: form.subject,
      class: `Class ${form.class}-${form.section}`,
      instructor: form.instructor,
      platform: (form.platform === 'Custom RTMP' ? 'Zoom' : form.platform) as LiveSession['platform'],
      link: form.generateLink ? `https://meet.kvlinternational.edu/${Math.random().toString(36).slice(2, 8)}` : '',
      startedAt: form.time,
      duration: 0,
      studentsJoined: 0,
      totalStudents: form.capacity,
      status: 'scheduled',
      raiseHands: 0,
      chatCount: 0,
    }
    setSessions(p => [newSession, ...p])
    setShowCreate(false)
    setForm(emptyForm)
  }

  const copyLink = async (link: string, id: string) => {
    await navigator.clipboard.writeText(link)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const liveCount = sessions.filter(s => s.status === 'live').length
  const totalLiveStudents = sessions.filter(s => s.status === 'live').reduce((a, s) => a + s.studentsJoined, 0)

  // ── CONTROL PANEL VIEW ────────────────────────────────────────────────────
  if (activeSession) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        {/* Top bar */}
        <div className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 font-semibold text-sm uppercase tracking-wide">Live</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">{activeSession.title}</p>
              <p className="text-gray-400 text-xs">{activeSession.class} · {activeSession.instructor} · Started {activeSession.startedAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-2">
              <Users size={14} className="text-green-400" />
              <span className="text-white text-sm font-semibold">{activeSession.studentsJoined}</span>
              <span className="text-gray-400 text-xs">/ {activeSession.totalStudents} joined</span>
            </div>
            <button onClick={() => setMicOn(p => !p)} className={`p-2 rounded-xl transition-colors ${micOn ? 'bg-gray-700 text-white' : 'bg-red-900 text-red-400'}`}>
              {micOn ? <Mic size={16} /> : <MicOff size={16} />}
            </button>
            <button onClick={() => setCamOn(p => !p)} className={`p-2 rounded-xl transition-colors ${camOn ? 'bg-gray-700 text-white' : 'bg-red-900 text-red-400'}`}>
              {camOn ? <Camera size={16} /> : <CameraOff size={16} />}
            </button>
            <button
              onClick={() => { setSessions(p => p.map(s => s.id === activeSession.id ? { ...s, status: 'ended' } : s)); setActiveSession(null) }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <Square size={14} /> End Session
            </button>
            <button onClick={() => setActiveSession(null)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Main controls */}
        <div className="flex-1 flex gap-0 overflow-hidden">
          {/* Left — controls */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Students Joined', value: activeSession.studentsJoined, icon: Users, color: 'text-green-400' },
                { label: 'Hands Raised', value: raiseHandCount, icon: Hand, color: 'text-yellow-400' },
                { label: 'Chat Messages', value: chatMessages.length, icon: MessageSquare, color: 'text-blue-400' },
                { label: 'Duration', value: `${activeSession.duration}m`, icon: Clock, color: 'text-purple-400' },
              ].map(stat => (
                <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <stat.icon size={20} className={stat.color} />
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Raise hand panel */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Hand size={16} className="text-yellow-400" />
                  <h3 className="text-white font-semibold text-sm">Raise Hand</h3>
                  {raiseHandCount > 0 && <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full font-medium">{raiseHandCount} pending</span>}
                </div>
                <button onClick={() => setRaiseHandCount(0)} className="text-xs text-gray-400 hover:text-white transition-colors">Clear all</button>
              </div>
              <div className="space-y-2">
                {['Aryan Mehta', 'Sneha Kapoor', 'Rohan Patel', 'Diya Singh', 'Kabir Sharma'].slice(0, raiseHandCount).map(name => (
                  <div key={name} className="flex items-center justify-between bg-gray-800 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <span className="text-yellow-400 text-xs font-bold">{name[0]}</span>
                      </div>
                      <span className="text-white text-sm">{name}</span>
                    </div>
                    <button onClick={() => setRaiseHandCount(p => Math.max(0, p - 1))} className="text-xs text-gray-400 hover:text-green-400 transition-colors">Acknowledge</button>
                  </div>
                ))}
                {raiseHandCount === 0 && <p className="text-gray-500 text-xs text-center py-2">No hands raised</p>}
              </div>
            </div>

            {/* Live Poll */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 size={16} className="text-blue-400" />
                <h3 className="text-white font-semibold text-sm">Live Poll</h3>
              </div>
              {!poll.launched ? (
                <div className="space-y-2">
                  <input
                    value={poll.question}
                    onChange={e => setPoll(p => ({ ...p, question: e.target.value }))}
                    placeholder="Poll question..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  {poll.options.map((opt, i) => (
                    <input
                      key={i}
                      value={opt.text}
                      onChange={e => setPoll(p => { const ops = [...p.options]; ops[i] = { ...ops[i], text: e.target.value }; return { ...p, options: ops } })}
                      placeholder={`Option ${i + 1}`}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  ))}
                  <button
                    onClick={launchPoll}
                    disabled={!poll.question}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40"
                  >
                    <Zap size={13} className="inline mr-1" /> Launch Poll
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-white text-sm font-medium mb-2">{poll.question}</p>
                  {poll.options.filter(o => o.text).map((opt, i) => {
                    const total = poll.options.reduce((a, o) => a + o.votes, 0)
                    const pct = total ? Math.round((opt.votes / total) * 100) : 0
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-300">{opt.text}</span>
                          <span className="text-blue-400 font-semibold">{pct}% ({opt.votes})</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                  <button onClick={() => setPoll({ question: '', options: [{ text: '', votes: 0 }, { text: '', votes: 0 }, { text: '', votes: 0 }], active: false, launched: false })}
                    className="w-full py-1.5 border border-gray-700 text-gray-400 hover:text-white text-xs rounded-xl transition-colors mt-1">
                    New Poll
                  </button>
                </div>
              )}
            </div>

            {/* Quick Quiz */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Award size={16} className="text-purple-400" />
                <h3 className="text-white font-semibold text-sm">Quick Quiz</h3>
              </div>
              {!quizActive ? (
                <div className="space-y-2">
                  <input value={quizQuestion} onChange={e => setQuizQuestion(e.target.value)} placeholder="Enter quiz question..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
                  <div className="flex items-center gap-2">
                    <Timer size={13} className="text-gray-400" />
                    <span className="text-gray-400 text-xs">Timer (seconds):</span>
                    <input type="number" value={quizTimer} onChange={e => setQuizTimer(Number(e.target.value))} min={10} max={120} className="w-16 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-sm text-white text-center focus:outline-none" />
                  </div>
                  <button onClick={() => setQuizActive(true)} disabled={!quizQuestion} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40">
                    Start Quiz
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-white text-sm">{quizQuestion}</p>
                  <div className="flex items-center gap-3 bg-purple-900/30 border border-purple-800 rounded-xl px-3 py-2">
                    <Timer size={14} className="text-purple-400" />
                    <span className="text-purple-300 text-sm font-mono">{quizTimer}s remaining</span>
                    <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs">23 / {activeSession.studentsJoined} answered</p>
                  <button onClick={() => { setQuizActive(false); setQuizQuestion('') }} className="w-full py-1.5 border border-gray-700 text-gray-400 hover:text-white text-xs rounded-xl transition-colors">End Quiz</button>
                </div>
              )}
            </div>

            {/* Attendance Snapshot */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />
                  <h3 className="text-white font-semibold text-sm">Attendance Snapshot</h3>
                </div>
                {attendanceSnapped && <span className="text-xs text-green-400 flex items-center gap-1"><CheckCheck size={12} /> Captured</span>}
              </div>
              <p className="text-gray-400 text-xs mb-3">Capture who is currently in the session as attendance for today.</p>
              <button
                onClick={() => setAttendanceSnapped(true)}
                className={`w-full py-2 text-sm font-semibold rounded-xl transition-colors ${attendanceSnapped ? 'bg-green-800 text-green-300' : 'bg-green-600 hover:bg-green-700 text-white'}`}
              >
                {attendanceSnapped ? `✓ Captured — ${activeSession.studentsJoined} marked present` : 'Take Attendance Snapshot'}
              </button>
            </div>
          </div>

          {/* Right — Chat */}
          <div className="w-72 border-l border-gray-800 flex flex-col bg-gray-900">
            <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
              <MessageSquare size={15} className="text-blue-400" />
              <h3 className="text-white font-semibold text-sm">Live Chat</h3>
              <span className="ml-auto text-xs text-gray-500">{chatMessages.length} messages</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((m, i) => (
                <div key={i} className="space-y-0.5">
                  <p className="text-xs text-gray-400">{m.from} <span className="text-gray-600">· {m.time}</span></p>
                  <p className="text-sm text-gray-200">{m.msg}</p>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-800 flex gap-2">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder="Message to all..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button onClick={sendChat} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── MAIN DASHBOARD VIEW ───────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Radio size={22} className="text-red-500" />
            Live Campus
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            <span className="text-red-500 font-semibold">{liveCount} sessions live</span>
            {' · '}{totalLiveStudents} students currently in class
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-[#1e3a5f] text-white' : 'text-gray-400 hover:bg-gray-50'}`}><LayoutGrid size={15} /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-[#1e3a5f] text-white' : 'text-gray-400 hover:bg-gray-50'}`}><List size={15} /></button>
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white text-sm font-semibold rounded-xl hover:bg-[#16304f] transition-colors">
            <Plus size={16} /> Schedule Session
          </button>
        </div>
      </div>

      {/* Live Sessions */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Active &amp; Scheduled Sessions</h2>
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
          {sessions.filter(s => s.status !== 'ended').map(session => (
            <div key={session.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {session.status === 'live' ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-100 rounded-full">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-red-600 text-xs font-semibold">LIVE</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full">
                      <Calendar size={11} className="text-blue-500" />
                      <span className="text-blue-600 text-xs font-semibold">SCHEDULED</span>
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${platformColor(session.platform)}`}>{session.platform}</span>
                </div>
                {session.status === 'live' && (
                  <span className="text-xs text-gray-400">{session.duration}m elapsed</span>
                )}
              </div>

              <h3 className="text-gray-900 font-bold text-sm mb-1 leading-tight">{session.title}</h3>
              <p className="text-gray-500 text-xs mb-3">{session.class} · {session.instructor}</p>

              {session.status === 'live' && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span className="flex items-center gap-1"><Users size={11} /> {session.studentsJoined} joined</span>
                    <span>{session.studentsJoined}/{session.totalStudents}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${(session.studentsJoined / session.totalStudents) * 100}%` }} />
                  </div>
                </div>
              )}

              {session.status === 'live' && (
                <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Hand size={11} className="text-yellow-500" /> {session.raiseHands} hands</span>
                  <span className="flex items-center gap-1"><MessageSquare size={11} className="text-blue-500" /> {session.chatCount} chats</span>
                </div>
              )}

              {session.status === 'scheduled' && (
                <p className="text-gray-400 text-xs mb-3 flex items-center gap-1"><Clock size={11} /> Starts at {session.startedAt} · {session.totalStudents} students expected</p>
              )}

              <div className="flex gap-2">
                {session.status === 'live' && (
                  <>
                    <button onClick={() => setActiveSession(session)} className="flex-1 py-2 bg-[#1e3a5f] text-white text-xs font-semibold rounded-xl hover:bg-[#16304f] transition-colors flex items-center justify-center gap-1">
                      <Play size={12} /> Join &amp; Control
                    </button>
                    <button
                      onClick={() => copyLink(session.link, session.id)}
                      className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:text-[#1e3a5f] hover:border-[#1e3a5f]/30 transition-colors"
                    >
                      {copied === session.id ? <CheckCheck size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                    <button
                      onClick={() => setSessions(p => p.map(s => s.id === session.id ? { ...s, status: 'ended' } : s))}
                      className="p-2 border border-red-200 rounded-xl text-red-400 hover:bg-red-50 transition-colors"
                    >
                      <Square size={14} />
                    </button>
                  </>
                )}
                {session.status === 'scheduled' && (
                  <>
                    <button onClick={() => setSessions(p => p.map(s => s.id === session.id ? { ...s, status: 'live', startedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) } : s))} className="flex-1 py-2 bg-green-600 text-white text-xs font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-1">
                      <Radio size={12} /> Start Now
                    </button>
                    <button onClick={() => copyLink(session.link || 'https://meet.kvlinternational.edu/new', session.id)} className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:text-[#1e3a5f] transition-colors">
                      {copied === session.id ? <CheckCheck size={14} className="text-green-500" /> : <Link2 size={14} />}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Quick Connect */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Platform Connections</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {PLATFORMS.map(p => (
            <div key={p.name} className={`bg-white border ${p.connected ? 'border-gray-100' : 'border-dashed border-gray-200'} rounded-2xl p-4 flex flex-col items-center gap-2 text-center`}>
              <div className={`w-10 h-10 ${p.bg} rounded-xl flex items-center justify-center`}>
                <p.icon size={20} className={p.color} />
              </div>
              <p className="text-xs font-semibold text-gray-700">{p.name}</p>
              <div className={`flex items-center gap-1 text-xs ${p.connected ? 'text-green-600' : 'text-gray-400'}`}>
                {p.connected ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                {p.status}
              </div>
              <button className={`w-full py-1.5 text-xs font-medium rounded-xl transition-colors ${p.connected ? 'border border-gray-200 text-gray-600 hover:bg-gray-50' : 'bg-[#1e3a5f] text-white hover:bg-[#16304f]'}`}>
                {p.connected ? 'Manage' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Past Sessions */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Past Sessions</h2>
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Session', 'Class · Instructor', 'Date', 'Duration', 'Attendance', 'Platform', 'Recording', 'Summary', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {PAST_SESSIONS.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-800 text-xs">{s.title}</p>
                    <p className="text-gray-400 text-xs">{s.subject}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    <p>{s.class}</p>
                    <p className="text-gray-400">{s.instructor}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{s.date}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{s.duration} min</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-700">{s.studentsAttended}/{s.totalStudents}</span>
                      <span className={`text-xs ${(s.studentsAttended / s.totalStudents) >= 0.85 ? 'text-green-600' : 'text-red-500'}`}>
                        ({Math.round((s.studentsAttended / s.totalStudents) * 100)}%)
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${platformColor(s.platform)}`}>{s.platform}</span>
                  </td>
                  <td className="px-4 py-3">
                    {s.recording ? (
                      <button className="flex items-center gap-1 text-xs text-[#1e3a5f] hover:underline">
                        <Download size={11} /> Watch
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="text-xs text-gray-500 truncate" title={s.summary}>{s.summary}</p>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 text-gray-400 hover:text-[#1e3a5f] hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Create / Schedule Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-900">Schedule Live Session</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Session Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Quadratic Equations Live" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Subject</label>
                  <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Mathematics" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Instructor</label>
                  <input value={form.instructor} onChange={e => setForm(p => ({ ...p, instructor: e.target.value }))} placeholder="Mr. Kumar" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Class</label>
                  <select value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white">
                    {['7','8','9','10','11','12'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Section</label>
                  <select value={form.section} onChange={e => setForm(p => ({ ...p, section: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white">
                    {['A','B','C','D','All'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Time</label>
                  <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Duration (min)</label>
                  <input type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))} min={15} max={180} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Capacity</label>
                  <input type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: Number(e.target.value) }))} min={1} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
              </div>

              {/* Platform */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Platform</label>
                <div className="grid grid-cols-3 gap-2">
                  {PLATFORM_OPTIONS.map(pl => (
                    <button key={pl} onClick={() => setForm(p => ({ ...p, platform: pl }))}
                      className={`py-2 px-3 text-xs font-medium rounded-xl border transition-colors ${form.platform === pl ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'border-gray-200 text-gray-600 hover:border-[#1e3a5f]/30'}`}>
                      {pl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2">
                {[
                  { key: 'generateLink', label: 'Auto-generate unique meeting link' },
                  { key: 'enablePolls', label: 'Enable live polls during session' },
                  { key: 'enableQuiz', label: 'Enable quick quiz feature' },
                  { key: 'enableChat', label: 'Enable student chat' },
                ].map(toggle => (
                  <label key={toggle.key} className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setForm(p => ({ ...p, [toggle.key]: !p[toggle.key as keyof typeof p] }))}
                      className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${form[toggle.key as keyof typeof form] ? 'bg-[#1e3a5f]' : 'bg-gray-200'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${form[toggle.key as keyof typeof form] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                    <span className="text-sm text-gray-600">{toggle.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={!form.title || !form.date} className="flex-1 py-2.5 bg-[#1e3a5f] text-white text-sm font-semibold rounded-xl hover:bg-[#163050] disabled:opacity-50 transition-colors">
                Schedule Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
