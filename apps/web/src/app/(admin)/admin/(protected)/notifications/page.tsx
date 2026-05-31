'use client'
import React, { useState } from 'react'
import {
  Bell, Send, CheckCheck, Trash2, Filter, Search, X, RefreshCw,
  BookOpen, DollarSign, UserPlus, Settings, AlertTriangle,
  CheckCircle2, Info, Users, Megaphone,
} from 'lucide-react'

type NotifCategory = 'Academic' | 'Finance' | 'Admission' | 'System'
type NotifChannel = 'Push' | 'In-App' | 'SMS' | 'Email' | 'All'
type NotifTarget = 'All Users' | 'Students' | 'Parents' | 'Staff' | 'Class 10' | 'Class 11' | 'Class 12'

interface Notification {
  id: string
  title: string
  message: string
  category: NotifCategory
  time: string
  read: boolean
  type: 'success' | 'warning' | 'info' | 'error'
}

const MOCK_NOTIFS: Notification[] = [
  { id: '1', title: 'Fee Payment Received', message: 'Arjun Sharma (Class 10A) paid ₹45,000 tuition fee for Q1 2025.', category: 'Finance', time: '09:32 AM', read: false, type: 'success' },
  { id: '2', title: 'New Admission Application', message: 'A new admission application received for Class 8. Applicant: Priya Patel. Pending review.', category: 'Admission', time: '09:15 AM', read: false, type: 'info' },
  { id: '3', title: 'Attendance Alert', message: 'Class 11B has below 75% attendance today. 8 students absent without notice.', category: 'Academic', time: '08:50 AM', read: false, type: 'warning' },
  { id: '4', title: 'Exam Result Published', message: 'Mid-term results for Classes 9–12 have been published on the student portal.', category: 'Academic', time: '08:30 AM', read: true, type: 'success' },
  { id: '5', title: 'Low Stock Alert – Library', message: 'Mathematics textbook (Class 10) stock is critically low. Only 3 copies remaining.', category: 'System', time: '08:10 AM', read: false, type: 'warning' },
  { id: '6', title: 'Staff Salary Processed', message: 'May 2025 salary disbursed to 84 staff members. Total: ₹18.4L.', category: 'Finance', time: 'Yesterday', read: true, type: 'success' },
  { id: '7', title: 'System Maintenance Scheduled', message: 'Planned maintenance on June 5, 2025 from 11 PM – 2 AM. Services may be unavailable.', category: 'System', time: 'Yesterday', read: true, type: 'info' },
  { id: '8', title: 'Admission Interview Scheduled', message: 'Interview for 14 shortlisted candidates scheduled on June 3, 2025 at 10 AM.', category: 'Admission', time: 'Yesterday', read: true, type: 'info' },
  { id: '9', title: 'Fee Overdue – 12 Students', message: '12 students have overdue fees exceeding 30 days. Automated reminders sent to parents.', category: 'Finance', time: '2 days ago', read: true, type: 'error' },
  { id: '10', title: 'Assignment Submitted', message: '156 students submitted their Science project before the deadline.', category: 'Academic', time: '2 days ago', read: true, type: 'success' },
  { id: '11', title: 'New Teacher Onboarded', message: 'Ms. Kavitha Rao joined as Mathematics teacher for Class 11 & 12 today.', category: 'System', time: '3 days ago', read: true, type: 'info' },
  { id: '12', title: 'Admission Form Deadline Extended', message: 'Admission deadline for 2025–26 extended to June 15, 2025 by management decision.', category: 'Admission', time: '3 days ago', read: true, type: 'info' },
]

const CATEGORY_ICONS: Record<NotifCategory, React.ReactNode> = {
  Academic: <BookOpen className="w-4 h-4 text-blue-600" />,
  Finance: <DollarSign className="w-4 h-4 text-green-600" />,
  Admission: <UserPlus className="w-4 h-4 text-purple-600" />,
  System: <Settings className="w-4 h-4 text-gray-500" />,
}

const CATEGORY_BG: Record<NotifCategory, string> = {
  Academic: 'bg-blue-50',
  Finance: 'bg-green-50',
  Admission: 'bg-purple-50',
  System: 'bg-gray-100',
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  success: <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />,
  warning: <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />,
  info: <Info className="w-3.5 h-3.5 text-blue-500" />,
  error: <AlertTriangle className="w-3.5 h-3.5 text-red-500" />,
}

const TARGETS: NotifTarget[] = ['All Users', 'Students', 'Parents', 'Staff', 'Class 10', 'Class 11', 'Class 12']
const CHANNELS: NotifChannel[] = ['Push', 'In-App', 'SMS', 'Email', 'All']
const CATEGORIES: NotifCategory[] = ['Academic', 'Finance', 'Admission', 'System']

const EMPTY_FORM = { title: '', message: '', type: 'info' as Notification['type'], category: 'Academic' as NotifCategory, target: 'All Users' as NotifTarget, channel: 'Push' as NotifChannel }

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFS)
  const [tab, setTab] = useState<'all' | 'send'>('all')
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<'All' | NotifCategory>('All')
  const [filterRead, setFilterRead] = useState<'All' | 'Unread' | 'Read'>('All')
  const [form, setForm] = useState(EMPTY_FORM)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const unread = notifications.filter(n => !n.read).length
  const sentToday = 8
  const deliveryRate = '94.2%'

  const filtered = notifications.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCategory === 'All' || n.category === filterCategory
    const matchRead = filterRead === 'All' || (filterRead === 'Unread' ? !n.read : n.read)
    return matchSearch && matchCat && matchRead
  })

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function deleteNotif(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  async function handleSend() {
    if (!form.title || !form.message) return
    setSending(true)
    await new Promise(r => setTimeout(r, 800))
    const newNotif: Notification = {
      id: String(Date.now()),
      title: form.title,
      message: form.message,
      category: form.category,
      time: 'Just now',
      read: true,
      type: form.type,
    }
    setNotifications(prev => [newNotif, ...prev])
    setSending(false)
    setSent(true)
    setTimeout(() => { setSent(false); setForm(EMPTY_FORM) }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notification Center</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and send push & in-app notifications</p>
        </div>
        <button onClick={() => setTab('send')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Send className="w-4 h-4" /> Send Notification
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Unread', value: unread, icon: Bell, color: 'text-[#d4a017]', bg: 'bg-[#d4a017]/10', sub: 'notifications' },
          { label: 'Sent Today', value: sentToday, icon: Send, color: 'text-[#1e3a5f]', bg: 'bg-[#1e3a5f]/10', sub: 'messages' },
          { label: 'Delivery Rate', value: deliveryRate, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', sub: 'this week' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label} · {s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { key: 'all', label: 'All Notifications', icon: Bell },
            { key: 'send', label: 'Send Notification', icon: Send },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as 'all' | 'send')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                tab === t.key
                  ? 'border-[#1e3a5f] text-[#1e3a5f]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.key === 'all' && unread > 0 && (
                <span className="ml-1 bg-[#d4a017] text-white text-xs px-1.5 py-0.5 rounded-full">{unread}</span>
              )}
            </button>
          ))}
        </div>

        {/* All Notifications Tab */}
        {tab === 'all' && (
          <div>
            {/* Filters row */}
            <div className="flex flex-wrap gap-3 items-center p-4 border-b border-gray-100">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search notifications…"
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value as 'All' | NotifCategory)}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#1e3a5f] bg-white">
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={filterRead} onChange={e => setFilterRead(e.target.value as 'All' | 'Unread' | 'Read')}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#1e3a5f] bg-white">
                  <option value="All">All</option>
                  <option value="Unread">Unread</option>
                  <option value="Read">Read</option>
                </select>
              </div>
              {unread > 0 && (
                <button onClick={markAllRead}
                  className="flex items-center gap-1.5 text-sm text-[#1e3a5f] font-medium hover:underline px-3 py-2">
                  <CheckCheck className="w-4 h-4" /> Mark all read
                </button>
              )}
            </div>

            {/* Category filter pills */}
            <div className="flex gap-2 px-4 py-3 border-b border-gray-100 overflow-x-auto">
              {['All', ...CATEGORIES].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat as 'All' | NotifCategory)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    filterCategory === cat
                      ? 'bg-[#1e3a5f] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat !== 'All' && CATEGORY_ICONS[cat as NotifCategory]}
                  {cat}
                  {cat !== 'All' && (
                    <span className="ml-0.5 text-xs opacity-70">
                      ({notifications.filter(n => n.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Notification list */}
            <div className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <div className="py-12 text-center text-gray-400 text-sm">No notifications match your filters.</div>
              )}
              {filtered.map(notif => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-gray-50/60 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                  onClick={() => markRead(notif.id)}
                >
                  {/* Category icon */}
                  <div className={`w-9 h-9 rounded-xl ${CATEGORY_BG[notif.category]} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    {CATEGORY_ICONS[notif.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {TYPE_ICON[notif.type]}
                      <p className={`text-sm font-medium ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>{notif.title}</p>
                      {!notif.read && <span className="w-2 h-2 bg-[#d4a017] rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{notif.message}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-gray-400">{notif.time}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_BG[notif.category]} ${notif.category === 'Finance' ? 'text-green-700' : notif.category === 'Academic' ? 'text-blue-700' : notif.category === 'Admission' ? 'text-purple-700' : 'text-gray-600'}`}>
                        {notif.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); deleteNotif(notif.id) }}
                    className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Send Notification Tab */}
        {tab === 'send' && (
          <div className="p-6 max-w-2xl">
            <h3 className="text-sm font-semibold text-gray-700 mb-5 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#1e3a5f]" /> Compose Notification
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Title *</label>
                <input
                  value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Notification title"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Message *</label>
                <textarea
                  value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Write your notification message here…"
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value as NotifCategory }))}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f] bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value as Notification['type'] }))}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f] bg-white">
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Alert / Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    <Users className="w-3.5 h-3.5 inline mr-1" />Target Users
                  </label>
                  <select value={form.target} onChange={e => setForm(prev => ({ ...prev, target: e.target.value as NotifTarget }))}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f] bg-white">
                    {TARGETS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Channel</label>
                  <select value={form.channel} onChange={e => setForm(prev => ({ ...prev, channel: e.target.value as NotifChannel }))}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f] bg-white">
                    {CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Preview */}
              {form.title && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Preview</p>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bell className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{form.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{form.message || 'Your message will appear here…'}</p>
                      <p className="text-xs text-gray-400 mt-1">To: {form.target} · via {form.channel}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSend}
                  disabled={sending || sent || !form.title || !form.message}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    sent ? 'bg-green-500 text-white' :
                    sending ? 'bg-[#1e3a5f]/60 text-white cursor-wait' :
                    !form.title || !form.message ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                    'bg-[#1e3a5f] text-white hover:bg-[#163050]'
                  }`}
                >
                  {sent ? <><CheckCircle2 className="w-4 h-4" /> Sent!</> :
                   sending ? <><RefreshCw className="w-4 h-4 animate-spin" /> Sending…</> :
                   <><Send className="w-4 h-4" /> Send Notification</>}
                </button>
                <button onClick={() => setForm(EMPTY_FORM)}
                  className="px-4 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-1.5">
                  <X className="w-4 h-4" /> Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

