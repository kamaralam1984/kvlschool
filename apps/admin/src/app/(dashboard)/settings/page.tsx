'use client'

import React, { useState } from 'react'
import {
  Settings, School, Bell, Shield, Palette, Globe, Database,
  Save, Upload, Eye, EyeOff, ChevronRight, User, Key, Mail
} from 'lucide-react'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { id: 'school', label: 'School Info', icon: School },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: Globe },
  { id: 'backup', label: 'Backup & Data', icon: Database },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('school')
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState({
    emailFeeReminders: true, smsAttendance: true, appNotices: true,
    emailResults: false, smsExams: true, appLeaveApproval: true,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Configure school preferences and system settings</p>
        </div>
        <button onClick={handleSave} className={cn('flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all', saved ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800')}>
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={cn('w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-l-2', activeSection === s.id ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' : 'border-transparent text-gray-600 hover:bg-gray-50')}>
                <s.icon className="w-4 h-4" />
                {s.label}
                <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-4">
          {activeSection === 'school' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
              <h2 className="font-semibold text-gray-900">School Information</h2>

              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                  <School className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">School Logo</p>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                    <Upload className="w-3 h-3" /> Upload Logo
                  </button>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB. Recommended: 200×200px</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'School Name', value: 'KVL International School', type: 'text' },
                  { label: 'Affiliation Board', value: 'CBSE', type: 'text' },
                  { label: 'School Code', value: 'KVL-MH-001', type: 'text' },
                  { label: 'Established Year', value: '2005', type: 'number' },
                  { label: 'Principal Name', value: 'Dr. A.K. Sharma', type: 'text' },
                  { label: 'Contact Email', value: 'info@kvlinternational.edu.in', type: 'email' },
                  { label: 'Phone', value: '+91 22 2345 6789', type: 'tel' },
                  { label: 'Website', value: 'www.kvlinternational.edu.in', type: 'url' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                    <input type={f.type} defaultValue={f.value} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                <textarea rows={3} defaultValue="123 Education Lane, Andheri East, Mumbai - 400069, Maharashtra, India" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Academic Year Start', value: 'June', type: 'select', options: ['April', 'May', 'June', 'July'] },
                  { label: 'Session End Month', value: 'March', type: 'select', options: ['February', 'March', 'April'] },
                  { label: 'Working Days/Week', value: '6', type: 'select', options: ['5', '6'] },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                    <select defaultValue={f.value} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none">
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
              <h2 className="font-semibold text-gray-900">Notification Preferences</h2>
              {[
                { key: 'emailFeeReminders', label: 'Fee Payment Reminders', desc: 'Email parents when fees are due or overdue', channel: 'Email' },
                { key: 'smsAttendance', label: 'Attendance Alerts', desc: 'SMS to parents when student is absent', channel: 'SMS' },
                { key: 'appNotices', label: 'School Notices', desc: 'Push notifications for new notices on the app', channel: 'App' },
                { key: 'emailResults', label: 'Exam Results', desc: 'Email when exam results are published', channel: 'Email' },
                { key: 'smsExams', label: 'Exam Reminders', desc: 'SMS reminders before upcoming exams', channel: 'SMS' },
                { key: 'appLeaveApproval', label: 'Leave Approvals', desc: 'Notify teachers when leave is approved/rejected', channel: 'App' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-800">{n.label}</p>
                      <span className={cn('px-1.5 py-0.5 rounded text-xs', n.channel === 'Email' ? 'bg-blue-100 text-blue-700' : n.channel === 'SMS' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700')}>{n.channel}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(p => ({ ...p, [n.key]: !p[n.key as keyof typeof p] }))}
                    className={cn('relative w-11 h-6 rounded-full transition-colors flex-shrink-0', notifications[n.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-300')}
                  >
                    <span className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', notifications[n.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0.5')} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2"><User className="w-4 h-4" />Account Security</h2>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} placeholder="Enter current password" className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                    <button onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                    <input type="password" placeholder="New password" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Confirm Password</label>
                    <input type="password" placeholder="Confirm password" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                </div>
                <button className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800">Update Password</button>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4"><Key className="w-4 h-4" />Two-Factor Authentication</h2>
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div>
                    <p className="font-medium text-green-800 text-sm">2FA is enabled</p>
                    <p className="text-xs text-green-600 mt-0.5">Your account is protected with Google Authenticator</p>
                  </div>
                  <button className="px-3 py-1.5 text-xs border border-green-300 text-green-700 rounded-lg hover:bg-green-100">Manage</button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4"><Shield className="w-4 h-4" />Session Management</h2>
                <div className="space-y-3">
                  {[
                    { device: 'Chrome on Windows', location: 'Mumbai, India', time: 'Active now', current: true },
                    { device: 'Safari on iPhone', location: 'Mumbai, India', time: '2 hours ago', current: false },
                    { device: 'Chrome on MacBook', location: 'Pune, India', time: '1 day ago', current: false },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{session.device}</p>
                        <p className="text-xs text-gray-500">{session.location} · {session.time}</p>
                      </div>
                      {session.current
                        ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Current</span>
                        : <button className="text-xs text-red-500 hover:underline">Revoke</button>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
              <h2 className="font-semibold text-gray-900">Appearance</h2>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Theme Mode</p>
                <div className="flex gap-3">
                  {['Light', 'Dark', 'System'].map(theme => (
                    <button key={theme} className={cn('px-4 py-2 text-sm rounded-lg border transition-all', theme === 'Light' ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-50')}>
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Accent Color</p>
                <div className="flex gap-3">
                  {['#2563eb', '#7c3aed', '#0891b2', '#16a34a', '#dc2626', '#d97706'].map(color => (
                    <button key={color} className={cn('w-8 h-8 rounded-full border-2 transition-all', color === '#2563eb' ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105')} style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Font Size</p>
                <div className="flex gap-3">
                  {['Small', 'Medium', 'Large'].map(size => (
                    <button key={size} className={cn('px-4 py-2 text-sm rounded-lg border', size === 'Medium' ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-50')}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(activeSection === 'integrations' || activeSection === 'backup') && (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <Settings className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700 capitalize">{activeSection === 'integrations' ? 'Third-party Integrations' : 'Backup & Data Management'}</h3>
              <p className="text-sm text-gray-400 mt-1">{activeSection === 'integrations' ? 'Connect Razorpay, WhatsApp Business, Google Workspace and more' : 'Schedule automated backups, export school data, and manage data retention policies'}</p>
              <button className="mt-4 px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800">Configure</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
