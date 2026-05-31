'use client'

import React, { useState } from 'react'
import {
  MessageSquare, Bell, Mail, Send, Plus, Search,
  Users, Star, Trash2, Eye, Pin, AlertCircle, CheckCircle,
  Phone, Megaphone
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NOTICES = [
  { id: 'N001', title: 'Mid-Term Examination Schedule Released', category: 'Academic', audience: 'All', date: '2026-05-30', priority: 'High', views: 1240, pinned: true },
  { id: 'N002', title: 'School Closed on June 5 — World Environment Day', category: 'Holiday', audience: 'All', date: '2026-05-29', priority: 'Medium', views: 980, pinned: false },
  { id: 'N003', title: 'PTM Scheduled for June 12, 2026', category: 'Event', audience: 'Parents', date: '2026-05-28', priority: 'High', views: 620, pinned: true },
  { id: 'N004', title: 'New Library Books Available — Please Explore', category: 'Library', audience: 'Students', date: '2026-05-27', priority: 'Low', views: 340, pinned: false },
  { id: 'N005', title: 'Staff Meeting on June 1 at 3:00 PM', category: 'Admin', audience: 'Teachers', date: '2026-05-26', priority: 'High', views: 187, pinned: false },
]

const MESSAGES = [
  { from: 'Mrs. Sharma (Parent)', subject: 'Regarding Aisha\'s leave', preview: 'Aisha will be absent from June 3-5 due to family...', time: '10:30 AM', read: false, avatar: 'MS' },
  { from: 'Mr. Ravi Kumar (Teacher)', subject: 'Lab equipment request', preview: 'We need new microscopes for the biology lab...', time: '9:15 AM', read: false, avatar: 'RK' },
  { from: 'Transport Department', subject: 'Route 4 bus service disruption', preview: 'Bus MH-04-GH-3456 is under maintenance...', time: 'Yesterday', read: true, avatar: 'TD' },
  { from: 'Rohan Mehta (Parent)', subject: 'Fee payment query', preview: 'I am unable to pay fees online. Can you...', time: 'Yesterday', read: true, avatar: 'RM' },
  { from: 'Principal Office', subject: 'Annual Day preparations', preview: 'Please submit your department\'s plan for Annual Day...', time: 'May 29', read: true, avatar: 'PO' },
]

const QUICK_SEND = [
  { label: 'Send SMS to All Parents', icon: Phone, color: 'bg-green-500' },
  { label: 'Email to All Teachers', icon: Mail, color: 'bg-blue-500' },
  { label: 'Push Notification — App', icon: Bell, color: 'bg-purple-500' },
  { label: 'Broadcast Announcement', icon: Megaphone, color: 'bg-orange-500' },
]

const priorityColor: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-gray-100 text-gray-600',
}

const categoryColor: Record<string, string> = {
  Academic: 'bg-blue-100 text-blue-700',
  Holiday: 'bg-green-100 text-green-700',
  Event: 'bg-purple-100 text-purple-700',
  Library: 'bg-amber-100 text-amber-700',
  Admin: 'bg-gray-100 text-gray-700',
}

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<'notices' | 'messages' | 'compose'>('notices')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="text-sm text-gray-500 mt-0.5">Notices, messages and announcements</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => setActiveTab('compose')}>
            <Plus className="w-4 h-4" /> New Notice
          </button>
        </div>
      </div>

      {/* Quick Send */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {QUICK_SEND.map(q => (
          <button key={q.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-md transition-shadow text-left group">
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', q.color)}>
              <q.icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">{q.label}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['notices', 'messages', 'compose'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-1.5 text-sm rounded-md capitalize transition-all', activeTab === tab ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700')}>
            {tab === 'compose' ? '+ Compose' : tab}
          </button>
        ))}
      </div>

      {activeTab === 'notices' && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input placeholder="Search notices..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none">
              <option>All Audiences</option>
              <option>All</option>
              <option>Students</option>
              <option>Parents</option>
              <option>Teachers</option>
            </select>
          </div>

          {NOTICES.map(n => (
            <div key={n.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-4 hover:shadow-sm transition-shadow">
              {n.pinned && <Pin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />}
              {!n.pinned && <div className="w-4 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-gray-900 flex-1">{n.title}</h3>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0', priorityColor[n.priority])}>{n.priority}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                  <span className={cn('px-2 py-0.5 rounded-full font-medium', categoryColor[n.category])}>{n.category}</span>
                  <span className="text-gray-400">To: {n.audience}</span>
                  <span className="text-gray-400">{n.date}</span>
                  <span className="flex items-center gap-1 text-gray-400"><Eye className="w-3 h-3" />{n.views} views</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Inbox</h2>
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">2 unread</span>
          </div>
          <div className="divide-y divide-gray-50">
            {MESSAGES.map((m, i) => (
              <div key={i} className={cn('px-5 py-4 flex items-start gap-4 hover:bg-gray-50 cursor-pointer', !m.read && 'bg-blue-50/30')}>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {m.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn('text-sm', !m.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700')}>{m.from}</p>
                    <p className="text-xs text-gray-400 flex-shrink-0">{m.time}</p>
                  </div>
                  <p className={cn('text-sm', !m.read ? 'font-medium text-gray-800' : 'text-gray-600')}>{m.subject}</p>
                  <p className="text-xs text-gray-400 truncate">{m.preview}</p>
                </div>
                {!m.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'compose' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-2xl">
          <h2 className="font-semibold text-gray-900 mb-5">Compose Notice / Message</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Notice title..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
                  <option>Academic</option>
                  <option>Holiday</option>
                  <option>Event</option>
                  <option>Admin</option>
                  <option>Library</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Send To</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
                  <option>All</option>
                  <option>Students</option>
                  <option>Parents</option>
                  <option>Teachers</option>
                  <option>Staff</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Channels</label>
                <div className="flex gap-3 items-center h-9">
                  {['App', 'SMS', 'Email'].map(c => (
                    <label key={c} className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea rows={5} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" placeholder="Write your notice or message here..." />
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                <Send className="w-4 h-4" /> Send Now
              </button>
              <button className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 text-gray-600">Save as Draft</button>
              <button className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 text-gray-600">Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
