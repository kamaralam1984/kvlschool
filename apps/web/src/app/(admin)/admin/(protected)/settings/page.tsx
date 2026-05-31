'use client'
import React, { useState } from 'react'
import { School, Calendar, Bell, Shield, Settings, Save, Upload, ChevronDown, Check, Plus, Trash2 } from 'lucide-react'

type Tab = 'school' | 'academic' | 'notifications' | 'roles' | 'system'

// --- School Info ---
const initialSchoolInfo = {
  name: 'KVL International School',
  address: '45, Vidyanagar Road, Bengaluru, Karnataka - 560001',
  cbseCode: '830256',
  affiliationNo: 'CBSE/AFF/830256/2009',
  principalName: 'Mrs. Rekha Krishnamurthy',
  phone: '080-2345-6789',
  email: 'info@kvlschool.edu.in',
  website: 'www.kvlschool.edu.in',
  established: '2009',
  type: 'Co-Education',
}

// --- Academic Year ---
const initialAcademic = {
  currentYear: '2025-2026',
  term1Start: '2025-04-01',
  term1End: '2025-09-30',
  term2Start: '2025-10-01',
  term2End: '2026-03-31',
}

const initialHolidays = [
  { id: 'h1', name: 'Independence Day', date: '15 Aug 2025', type: 'National' },
  { id: 'h2', name: 'Gandhi Jayanti', date: '02 Oct 2025', type: 'National' },
  { id: 'h3', name: 'Diwali Break', date: '20–24 Oct 2025', type: 'Festival' },
  { id: 'h4', name: 'Christmas Break', date: '25–31 Dec 2025', type: 'Festival' },
  { id: 'h5', name: 'Republic Day', date: '26 Jan 2026', type: 'National' },
  { id: 'h6', name: 'Holi', date: '14 Mar 2026', type: 'Festival' },
]

// --- Notifications ---
const initialNotifications = {
  smsAttendance: true,
  emailAttendance: true,
  smsFeeReminder: true,
  emailFeeReminder: true,
  smsExamResults: true,
  emailExamResults: true,
  smsCircular: false,
  emailCircular: true,
  smsLeaveSanction: true,
  emailLeaveSanction: true,
  smsAdmission: false,
  emailAdmission: true,
}

// --- Roles ---
const ROLES_INIT = [
  { id: 'r1', name: 'Super Admin', description: 'Full system access', permissions: { dashboard: true, students: true, teachers: true, finance: true, lms: true, hr: true, settings: true, reports: true } },
  { id: 'r2', name: 'Principal', description: 'Academic & admin oversight', permissions: { dashboard: true, students: true, teachers: true, finance: false, lms: true, hr: true, settings: false, reports: true } },
  { id: 'r3', name: 'Teacher', description: 'Classroom management', permissions: { dashboard: true, students: true, teachers: false, finance: false, lms: true, hr: false, settings: false, reports: false } },
  { id: 'r4', name: 'Accountant', description: 'Finance & fee management', permissions: { dashboard: true, students: false, teachers: false, finance: true, lms: false, hr: false, settings: false, reports: true } },
  { id: 'r5', name: 'Librarian', description: 'Library operations', permissions: { dashboard: true, students: true, teachers: false, finance: false, lms: false, hr: false, settings: false, reports: false } },
]

const PERMISSION_KEYS = ['dashboard', 'students', 'teachers', 'finance', 'lms', 'hr', 'settings', 'reports'] as const

// --- System ---
const initialSystem = {
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  language: 'English',
  sessionTimeout: '30',
  autoBackup: true,
  backupFrequency: 'Daily',
}

const TIMEZONES = ['Asia/Kolkata', 'Asia/Dubai', 'UTC', 'America/New_York', 'Europe/London']
const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex w-10 h-5 rounded-full transition-colors ${checked ? 'bg-[#1e3a5f]' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  )
}

function SaveBar({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <div className="flex justify-end pt-4 border-t border-gray-100">
      <button
        onClick={onSave}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${saved ? 'bg-green-500 text-white' : 'bg-[#1e3a5f] text-white hover:bg-[#16304f]'}`}
      >
        {saved ? <><Check size={15} />Saved!</> : <><Save size={15} />Save Changes</>}
      </button>
    </div>
  )
}

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'school', label: 'School Info', icon: School },
  { id: 'academic', label: 'Academic Year', icon: Calendar },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  { id: 'system', label: 'System', icon: Settings },
]

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('school')
  const [saved, setSaved] = useState<Tab | null>(null)

  // School info
  const [schoolInfo, setSchoolInfo] = useState(initialSchoolInfo)
  // Academic
  const [academic, setAcademic] = useState(initialAcademic)
  const [holidays, setHolidays] = useState(initialHolidays)
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '', type: 'National' })
  // Notifications
  const [notif, setNotif] = useState(initialNotifications)
  // Roles
  const [roles, setRoles] = useState(ROLES_INIT)
  // System
  const [system, setSystem] = useState(initialSystem)

  const handleSave = (t: Tab) => {
    setSaved(t)
    setTimeout(() => setSaved(null), 2000)
  }

  const togglePermission = (roleId: string, perm: string) => {
    setRoles((prev) => prev.map((r) =>
      r.id === roleId ? { ...r, permissions: { ...r.permissions, [perm]: !(r.permissions as any)[perm] } } : r
    ))
  }

  const addHoliday = () => {
    if (!newHoliday.name || !newHoliday.date) return
    setHolidays((prev) => [...prev, { id: `h${Date.now()}`, ...newHoliday }])
    setNewHoliday({ name: '', date: '', type: 'National' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure school information, academic calendar, and system preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-52 flex-shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl p-2 space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${tab === id ? 'bg-[#1e3a5f] text-white font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-6">

          {/* ---- School Info ---- */}
          {tab === 'school' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-16 h-16 rounded-2xl bg-[#1e3a5f]/10 flex items-center justify-center">
                  <School size={28} className="text-[#1e3a5f]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{schoolInfo.name}</p>
                  <button className="text-xs text-[#1e3a5f] font-medium flex items-center gap-1 mt-0.5 hover:underline">
                    <Upload size={11} />Change Logo
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'School Name', key: 'name', span: 2 },
                  { label: 'CBSE School Code', key: 'cbseCode' },
                  { label: 'Affiliation No.', key: 'affiliationNo' },
                  { label: 'Principal Name', key: 'principalName' },
                  { label: 'Established Year', key: 'established' },
                  { label: 'Phone', key: 'phone' },
                  { label: 'Email', key: 'email' },
                  { label: 'Website', key: 'website' },
                  { label: 'School Type', key: 'type' },
                  { label: 'Address', key: 'address', span: 2 },
                ].map(({ label, key, span }) => (
                  <div key={key} className={span === 2 ? 'col-span-2' : ''}>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
                    <input
                      value={(schoolInfo as any)[key]}
                      onChange={(e) => setSchoolInfo((s) => ({ ...s, [key]: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                    />
                  </div>
                ))}
              </div>
              <SaveBar onSave={() => handleSave('school')} saved={saved === 'school'} />
            </div>
          )}

          {/* ---- Academic Year ---- */}
          {tab === 'academic' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Academic Year</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Current Academic Year', key: 'currentYear' },
                    { label: '', key: '' },
                    { label: 'Term 1 Start', key: 'term1Start', type: 'date' },
                    { label: 'Term 1 End', key: 'term1End', type: 'date' },
                    { label: 'Term 2 Start', key: 'term2Start', type: 'date' },
                    { label: 'Term 2 End', key: 'term2End', type: 'date' },
                  ].filter(f => f.key).map(({ label, key, type }) => (
                    <div key={key}>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
                      <input
                        type={type || 'text'}
                        value={(academic as any)[key]}
                        onChange={(e) => setAcademic((a) => ({ ...a, [key]: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Holiday List</h3>
                <div className="space-y-2 mb-3">
                  {holidays.map((h) => (
                    <div key={h.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${h.type === 'National' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{h.type}</span>
                      <p className="flex-1 text-sm text-gray-800">{h.name}</p>
                      <p className="text-xs text-gray-500">{h.date}</p>
                      <button onClick={() => setHolidays((prev) => prev.filter((x) => x.id !== h.id))} className="p-1 hover:bg-red-50 text-red-400 rounded-lg">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newHoliday.name} onChange={(e) => setNewHoliday((n) => ({ ...n, name: e.target.value }))} placeholder="Holiday name" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none" />
                  <input value={newHoliday.date} onChange={(e) => setNewHoliday((n) => ({ ...n, date: e.target.value }))} placeholder="Date" className="w-32 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none" />
                  <select value={newHoliday.type} onChange={(e) => setNewHoliday((n) => ({ ...n, type: e.target.value }))} className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none">
                    {['National', 'Festival', 'School'].map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <button onClick={addHoliday} className="px-3 py-2 bg-[#1e3a5f] text-white rounded-xl hover:bg-[#16304f]"><Plus size={16} /></button>
                </div>
              </div>
              <SaveBar onSave={() => handleSave('academic')} saved={saved === 'academic'} />
            </div>
          )}

          {/* ---- Notifications ---- */}
          {tab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Notification Preferences</h3>
                <div className="overflow-hidden border border-gray-100 rounded-2xl">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Event</th>
                        <th className="text-center text-xs font-semibold text-gray-500 px-4 py-3">SMS</th>
                        <th className="text-center text-xs font-semibold text-gray-500 px-4 py-3">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Attendance Alerts', smsKey: 'smsAttendance', emailKey: 'emailAttendance' },
                        { label: 'Fee Payment Reminders', smsKey: 'smsFeeReminder', emailKey: 'emailFeeReminder' },
                        { label: 'Exam Results', smsKey: 'smsExamResults', emailKey: 'emailExamResults' },
                        { label: 'Circulars & Notices', smsKey: 'smsCircular', emailKey: 'emailCircular' },
                        { label: 'Leave Sanctions', smsKey: 'smsLeaveSanction', emailKey: 'emailLeaveSanction' },
                        { label: 'Admission Updates', smsKey: 'smsAdmission', emailKey: 'emailAdmission' },
                      ].map(({ label, smsKey, emailKey }) => (
                        <tr key={label} className="border-b border-gray-50">
                          <td className="px-4 py-3 text-gray-700">{label}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center">
                              <Toggle checked={(notif as any)[smsKey]} onChange={() => setNotif((n) => ({ ...n, [smsKey]: !(n as any)[smsKey] }))} />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center">
                              <Toggle checked={(notif as any)[emailKey]} onChange={() => setNotif((n) => ({ ...n, [emailKey]: !(n as any)[emailKey] }))} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <SaveBar onSave={() => handleSave('notifications')} saved={saved === 'notifications'} />
            </div>
          )}

          {/* ---- Roles & Permissions ---- */}
          {tab === 'roles' && (
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-800">Roles & Permissions</h3>
              <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 w-36">Role</th>
                      {PERMISSION_KEYS.map((p) => (
                        <th key={p} className="text-center text-xs font-semibold text-gray-500 px-2 py-3 capitalize">{p}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => (
                      <tr key={role.id} className="border-b border-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800 text-sm">{role.name}</p>
                          <p className="text-xs text-gray-400">{role.description}</p>
                        </td>
                        {PERMISSION_KEYS.map((perm) => (
                          <td key={perm} className="px-2 py-3 text-center">
                            <div className="flex justify-center">
                              <Toggle
                                checked={(role.permissions as any)[perm]}
                                onChange={() => role.name !== 'Super Admin' && togglePermission(role.id, perm)}
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400">Note: Super Admin permissions cannot be modified.</p>
              <SaveBar onSave={() => handleSave('roles')} saved={saved === 'roles'} />
            </div>
          )}

          {/* ---- System ---- */}
          {tab === 'system' && (
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-800">System Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Timezone', key: 'timezone', options: TIMEZONES },
                  { label: 'Date Format', key: 'dateFormat', options: DATE_FORMATS },
                  { label: 'Language', key: 'language', options: ['English', 'Hindi', 'Kannada'] },
                  { label: 'Session Timeout (min)', key: 'sessionTimeout', options: ['15', '30', '60', '120'] },
                  { label: 'Backup Frequency', key: 'backupFrequency', options: ['Daily', 'Weekly', 'Monthly'] },
                ].map(({ label, key, options }) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
                    <div className="relative">
                      <select
                        value={(system as any)[key]}
                        onChange={(e) => setSystem((s) => ({ ...s, [key]: e.target.value }))}
                        className="appearance-none w-full px-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none bg-white"
                      >
                        {options.map((o) => <option key={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-800">Automatic Backup</p>
                  <p className="text-xs text-gray-500">Automatically backup school data at the set frequency</p>
                </div>
                <Toggle checked={system.autoBackup} onChange={() => setSystem((s) => ({ ...s, autoBackup: !s.autoBackup }))} />
              </div>
              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                <p className="text-sm font-semibold text-gray-800">Manual Backup</p>
                <p className="text-xs text-gray-500">Last backup: <strong>31 May 2026, 02:00 AM</strong></p>
                <button className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#16304f] transition-colors">
                  <Save size={14} />Download Backup Now
                </button>
              </div>
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-sm font-semibold text-red-700 mb-1">Danger Zone</p>
                <p className="text-xs text-red-500 mb-3">These actions are irreversible. Proceed with caution.</p>
                <button className="text-xs border border-red-300 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                  Reset All Settings to Default
                </button>
              </div>
              <SaveBar onSave={() => handleSave('system')} saved={saved === 'system'} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
