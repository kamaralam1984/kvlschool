'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Menu, Bell, Search, User, X, ChevronDown, CreditCard, UserPlus,
  CheckSquare, FileText, AlertTriangle, Package, Settings, Lock,
  LogOut, RefreshCw, Building2, Check, Clock
} from 'lucide-react'
import { useAdminAuth } from '@/components/admin/providers/AuthProvider'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Notification {
  id: string
  type: 'fee' | 'admission' | 'attendance' | 'exam' | 'alert' | 'stock'
  title: string
  description: string
  time: string
  group: 'Today' | 'Yesterday' | 'Earlier'
  read: boolean
}

interface SearchResult {
  id: string
  category: 'Students' | 'Exams' | 'Finance' | 'Staff'
  label: string
  sub: string
}

interface Institution {
  id: string
  name: string
}

// ─── Static mock data ─────────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'fee',        title: 'Fee Payment Received',    description: 'Amara Osei paid ₦45,000 for Term 2',         time: '10 min ago',  group: 'Today',     read: false },
  { id: '2', type: 'admission',  title: 'New Admission Request',   description: 'Fatima Al-Hassan — JSS 1 application',        time: '1 hr ago',    group: 'Today',     read: false },
  { id: '3', type: 'attendance', title: 'Attendance Submitted',    description: 'SSS 2A attendance marked by Mr. Bello',       time: '2 hrs ago',   group: 'Today',     read: false },
  { id: '4', type: 'exam',       title: 'Exam Results Published',  description: 'Mid-term results for JSS 3 are live',         time: '3 hrs ago',   group: 'Today',     read: false },
  { id: '5', type: 'alert',      title: 'System Alert',            description: 'Backup completed successfully',               time: '5 hrs ago',   group: 'Today',     read: false },
  { id: '6', type: 'stock',      title: 'Low Stock Warning',       description: 'Exercise books below threshold (12 left)',     time: 'Yesterday',   group: 'Yesterday', read: true  },
  { id: '7', type: 'fee',        title: 'Overdue Fees Reminder',   description: '14 students have outstanding Term 1 balance',  time: 'Yesterday',   group: 'Yesterday', read: true  },
  { id: '8', type: 'admission',  title: 'New Admission Approved',  description: 'Chidi Nwosu enrolled in SSS 1',               time: '2 days ago',  group: 'Earlier',   read: true  },
]

const MOCK_SEARCH: SearchResult[] = [
  { id: 's1', category: 'Students', label: 'Amara Osei',        sub: 'JSS 2B · Student ID #10421' },
  { id: 's2', category: 'Students', label: 'Fatima Al-Hassan',  sub: 'SSS 1A · Student ID #10389' },
  { id: 's3', category: 'Students', label: 'Chidi Nwosu',       sub: 'SSS 1C · Student ID #10412' },
  { id: 's4', category: 'Exams',    label: 'Mid-Term Exams',    sub: 'JSS 3 — Results published'  },
  { id: 's5', category: 'Exams',    label: 'End-of-Term Exams', sub: 'Scheduled: Dec 12–16'       },
  { id: 's6', category: 'Finance',  label: 'Fee Collection',    sub: 'Term 2 · 78% collected'     },
  { id: 's7', category: 'Finance',  label: 'Outstanding Fees',  sub: '14 students overdue'        },
  { id: 's8', category: 'Staff',    label: 'Mr. Bello',         sub: 'Mathematics · SSS Department'},
  { id: 's9', category: 'Staff',    label: 'Mrs. Adeyemi',      sub: 'English · JSS Department'   },
]

const RECENT_SEARCHES = ['Amara Osei', 'Term 2 Fees', 'JSS 3 Exams', 'Attendance Report']

const INSTITUTIONS: Institution[] = [
  { id: 'i1', name: 'KVL International School' },
  { id: 'i2', name: 'KVL Nursery & Primary'    },
  { id: 'i3', name: 'KVL College of Science'   },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<SearchResult['category'], string> = {
  Students: 'bg-blue-100 text-blue-700',
  Exams:    'bg-purple-100 text-purple-700',
  Finance:  'bg-yellow-100 text-yellow-700',
  Staff:    'bg-green-100 text-green-700',
}

function NotifIcon({ type }: { type: Notification['type'] }) {
  const base = 'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0'
  switch (type) {
    case 'fee':        return <div className={`${base} bg-yellow-100`}><CreditCard  className="w-4 h-4 text-yellow-600" /></div>
    case 'admission':  return <div className={`${base} bg-blue-100`}><UserPlus    className="w-4 h-4 text-blue-600"   /></div>
    case 'attendance': return <div className={`${base} bg-green-100`}><CheckSquare className="w-4 h-4 text-green-600"  /></div>
    case 'exam':       return <div className={`${base} bg-purple-100`}><FileText   className="w-4 h-4 text-purple-600" /></div>
    case 'alert':      return <div className={`${base} bg-red-100`}><AlertTriangle className="w-4 h-4 text-red-600"   /></div>
    case 'stock':      return <div className={`${base} bg-orange-100`}><Package    className="w-4 h-4 text-orange-600" /></div>
  }
}

function getInitials(name?: string | null) {
  if (!name) return 'A'
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

// ─── Search Overlay ───────────────────────────────────────────────────────────

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const results = query.trim().length > 0
    ? MOCK_SEARCH.filter(r =>
        r.label.toLowerCase().includes(query.toLowerCase()) ||
        r.sub.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    acc[r.category] = acc[r.category] ?? []
    acc[r.category].push(r)
    return acc
  }, {})

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search students, fees, exams, staff…"
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-gray-400 bg-gray-100 rounded border border-gray-200">ESC</kbd>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {/* Empty state — show recent */}
          {query.trim().length === 0 && (
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Recent Searches</p>
              <div className="flex flex-wrap gap-2">
                {RECENT_SEARCHES.map(s => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Access</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['Students', 'Exams', 'Finance', 'Staff'] as const).map(cat => (
                    <button key={cat} onClick={() => setQuery(cat)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${CATEGORY_COLORS[cat]} hover:opacity-80`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {query.trim().length > 0 && results.length === 0 && (
            <div className="p-8 text-center text-sm text-gray-400">No results for "{query}"</div>
          )}

          {query.trim().length > 0 && results.length > 0 && (
            <div className="p-2">
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} className="mb-2">
                  <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">{cat}</p>
                  {items.map(item => (
                    <button key={item.id} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category as SearchResult['category']]}`}>{item.category[0]}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">Tip: Press <kbd className="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-gray-500">Ctrl K</kbd> to open search</span>
          {results.length > 0 && <span className="text-xs text-gray-400">{results.length} result{results.length !== 1 ? 's' : ''}</span>}
        </div>
      </div>
    </div>
  )
}

// ─── Notification Dropdown ────────────────────────────────────────────────────

function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)

  useOutsideClick(ref, onClose)

  const markAll = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  const groups: Notification['group'][] = ['Today', 'Yesterday', 'Earlier']

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-40 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
              {notifications.filter(n => !n.read).length} new
            </span>
          )}
        </div>
        <button
          onClick={markAll}
          className="flex items-center gap-1 text-xs text-[#1e3a5f] font-medium hover:underline transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
          Mark all as read
        </button>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
        {groups.map(group => {
          const items = notifications.filter(n => n.group === group)
          if (!items.length) return null
          return (
            <div key={group}>
              <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/60">{group}</p>
              {items.map(n => (
                <button
                  key={n.id}
                  onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                  className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${!n.read ? 'bg-blue-50/60' : ''}`}
                >
                  <NotifIcon type={n.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{n.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                </button>
              ))}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 text-center">
        <button className="text-sm font-medium text-[#1e3a5f] hover:underline transition-colors">
          View all notifications
        </button>
      </div>
    </div>
  )
}

// ─── User Profile Dropdown ────────────────────────────────────────────────────

function ProfileDropdown({ user, logout, onClose }: { user: any; logout: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useOutsideClick(ref, onClose)

  const role: string = user?.role ?? 'Admin'
  const isSuperAdmin = role.toLowerCase().includes('super')

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-40 overflow-hidden"
    >
      {/* Profile info */}
      <div className="px-4 py-4 bg-gradient-to-br from-[#1e3a5f]/5 to-[#d4a017]/5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name ?? 'Admin User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email ?? 'admin@kvl.edu.ng'}</p>
            <RoleBadge role={role} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="py-2">
        <ProfileMenuItem icon={<User className="w-4 h-4" />}     label="Edit Profile"      />
        <ProfileMenuItem icon={<Lock className="w-4 h-4" />}     label="Change Password"   />
        {isSuperAdmin && (
          <ProfileMenuItem icon={<RefreshCw className="w-4 h-4" />} label="Switch Role"    />
        )}
      </div>

      <div className="border-t border-gray-100 py-2">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )
}

function ProfileMenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
      <span className="text-gray-400">{icon}</span>
      {label}
    </button>
  )
}

// ─── Role Badge ───────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const lower = role.toLowerCase()
  let cls = 'bg-blue-100 text-blue-700'
  if (lower.includes('super')) cls = 'bg-[#d4a017]/20 text-[#b8860b]'
  else if (lower.includes('principal')) cls = 'bg-indigo-100 text-indigo-700'
  else if (lower.includes('finance')) cls = 'bg-green-100 text-green-700'

  return (
    <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
      {role}
    </span>
  )
}

// ─── Institution Switcher ─────────────────────────────────────────────────────

function InstitutionSwitcher() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(INSTITUTIONS[0])
  const ref = useRef<HTMLDivElement>(null)
  useOutsideClick(ref, () => setOpen(false))

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#1e3a5f] bg-[#1e3a5f]/5 hover:bg-[#1e3a5f]/10 rounded-xl transition-colors border border-[#1e3a5f]/10"
      >
        <Building2 className="w-4 h-4" />
        <span className="max-w-[180px] truncate">{current.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-40 py-1.5 overflow-hidden">
          {INSTITUTIONS.map(inst => (
            <button
              key={inst.id}
              onClick={() => { setCurrent(inst); setOpen(false) }}
              className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors ${inst.id === current.id ? 'bg-[#1e3a5f]/5 text-[#1e3a5f] font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <span className="truncate">{inst.name}</span>
              {inst.id === current.id && <Check className="w-4 h-4 flex-shrink-0 text-[#1e3a5f]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props { onMobileMenuOpen: () => void; sidebarCollapsed: boolean }

export function AdminTopbar({ onMobileMenuOpen }: Props) {
  const { user, logout } = useAdminAuth()

  const [searchOpen,  setSearchOpen]  = useState(false)
  const [notifOpen,   setNotifOpen]   = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const closeAll = useCallback(() => {
    setNotifOpen(false)
    setProfileOpen(false)
  }, [])

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 relative z-30">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuOpen}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <InstitutionSwitcher />

          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 w-56 transition-colors group"
          >
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-400 flex-1 text-left">Search…</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-gray-400 bg-white border border-gray-200 rounded px-1 py-0.5 group-hover:border-gray-300 transition-colors">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => { closeAll(); setNotifOpen(v => !v) }}
              className="relative p-2 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && <NotificationDropdown onClose={() => setNotifOpen(false)} />}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { closeAll(); setProfileOpen(v => !v) }}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {getInitials(user?.name)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-800 max-w-[100px] truncate leading-tight">{user?.name ?? 'Admin'}</p>
                <RoleBadge role={user?.role ?? 'Admin'} />
              </div>
              <ChevronDown className={`hidden sm:block w-3.5 h-3.5 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
            {profileOpen && (
              <ProfileDropdown user={user} logout={logout} onClose={() => setProfileOpen(false)} />
            )}
          </div>
        </div>
      </header>

      {/* Search overlay — rendered outside header so it covers full screen */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  )
}
