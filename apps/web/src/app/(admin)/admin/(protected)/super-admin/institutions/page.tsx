'use client'

import { useState } from 'react'
import {
  Building2, Search, Filter, ChevronRight, X, Upload, Users, BookOpen,
  DollarSign, Globe, Mail, Shield, CheckCircle2, ToggleLeft, ToggleRight,
  BarChart3, Cpu, School, GraduationCap, Layers, CreditCard, Calendar,
  TrendingUp, Activity, Settings, ArrowLeft,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
interface Institution {
  id: string
  name: string
  type: string
  domain: string
  adminEmail: string
  plan: 'Basic' | 'Pro' | 'Enterprise'
  students: number
  staff: number
  revenue: string
  storage: string
  storageUsed: number
  status: 'Active' | 'Inactive' | 'Trial'
  logo: string
  primaryColor: string
  accentColor: string
  joinedDate: string
  admins: { name: string; email: string; role: string }[]
  modules: string[]
}

const MODULES_ALL = [
  'Students', 'Attendance', 'LMS', 'Exams', 'Finance',
  'Store', 'Library', 'Transport', 'HR', 'AI', 'Analytics',
]

const PLAN_CONFIG = {
  Basic: { color: 'bg-gray-100 text-gray-600', badge: 'gray' },
  Pro: { color: 'bg-blue-50 text-blue-700', badge: 'blue' },
  Enterprise: { color: 'bg-amber-50 text-[#d4a017]', badge: 'amber' },
}

const INSTITUTIONS: Institution[] = [
  {
    id: 'kvl-intl', name: 'KVL International School', type: 'School',
    domain: 'kvlinternational.edu.in', adminEmail: 'admin@kvlinternational.edu.in',
    plan: 'Enterprise', students: 6240, staff: 312, revenue: '₹98.4L',
    storage: '100 GB', storageUsed: 68,
    status: 'Active', logo: 'KI', primaryColor: '#1e3a5f', accentColor: '#d4a017',
    joinedDate: 'Jan 2023',
    admins: [
      { name: 'Dr. Kavita Sharma', email: 'kavita@kvlinternational.edu.in', role: 'Principal' },
      { name: 'Rajesh Mehta', email: 'rajesh@kvlinternational.edu.in', role: 'Admin Manager' },
    ],
    modules: ['Students', 'Attendance', 'LMS', 'Exams', 'Finance', 'Store', 'Library', 'Transport', 'HR', 'AI', 'Analytics'],
  },
  {
    id: 'kvl-junior', name: 'KVL Junior School', type: 'School',
    domain: 'kvljunior.edu.in', adminEmail: 'admin@kvljunior.edu.in',
    plan: 'Pro', students: 3840, staff: 198, revenue: '₹54.2L',
    storage: '50 GB', storageUsed: 42,
    status: 'Active', logo: 'KJ', primaryColor: '#d4a017', accentColor: '#1e3a5f',
    joinedDate: 'Mar 2023',
    admins: [
      { name: 'Sunita Patel', email: 'sunita@kvljunior.edu.in', role: 'Principal' },
    ],
    modules: ['Students', 'Attendance', 'LMS', 'Exams', 'Finance', 'Library', 'Transport', 'Analytics'],
  },
  {
    id: 'kvl-coaching', name: 'KVL Coaching Institute', type: 'Coaching',
    domain: 'kvlcoaching.edu.in', adminEmail: 'admin@kvlcoaching.edu.in',
    plan: 'Pro', students: 2400, staff: 87, revenue: '₹32.8L',
    storage: '50 GB', storageUsed: 21,
    status: 'Active', logo: 'KC', primaryColor: '#2d6a4f', accentColor: '#d4a017',
    joinedDate: 'Jun 2023',
    admins: [
      { name: 'Prof. Anand Kumar', email: 'anand@kvlcoaching.edu.in', role: 'Director' },
    ],
    modules: ['Students', 'Attendance', 'LMS', 'Exams', 'Finance', 'Analytics'],
  },
]

// ── Institution Detail Panel ───────────────────────────────────────────────
function InstitutionDetail({ inst, onClose }: { inst: Institution; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'branding' | 'modules' | 'billing' | 'admins'>('overview')
  const [modules, setModules] = useState(inst.modules)
  const [primaryColor, setPrimaryColor] = useState(inst.primaryColor)
  const [accentColor, setAccentColor] = useState(inst.accentColor)

  const toggleModule = (mod: string) =>
    setModules(prev => prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={14} /> },
    { id: 'branding', label: 'Branding', icon: <Settings size={14} /> },
    { id: 'modules', label: 'Modules', icon: <Cpu size={14} /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={14} /> },
    { id: 'admins', label: 'Admins', icon: <Shield size={14} /> },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-gray-50/80 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-4xl mx-auto my-8 px-4">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
          {/* Detail Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ArrowLeft size={18} className="text-gray-500" />
              </button>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: inst.primaryColor }}>
                {inst.logo}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-[#1e3a5f] truncate">{inst.name}</h2>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-500">{inst.type}</span>
                  <span className="text-gray-200">•</span>
                  <span className="text-xs text-gray-500">{inst.domain}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PLAN_CONFIG[inst.plan].color}`}>{inst.plan}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${inst.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                {inst.status}
              </span>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-5 bg-gray-50 p-1 rounded-xl">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center ${activeTab === tab.id ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Students', value: inst.students.toLocaleString(), icon: <Users size={16} />, color: 'text-[#1e3a5f]' },
                    { label: 'Staff', value: inst.staff.toString(), icon: <Shield size={16} />, color: 'text-[#1e3a5f]' },
                    { label: 'Revenue', value: inst.revenue, icon: <TrendingUp size={16} />, color: 'text-[#d4a017]' },
                    { label: 'Active Users', value: '1,247', icon: <Activity size={16} />, color: 'text-emerald-600' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-gray-50 rounded-xl p-4">
                      <div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
                      <p className="text-lg font-bold text-[#1e3a5f]">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-3">Storage Usage</h4>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">{inst.storageUsed}% of {inst.storage}</span>
                      <span className="text-xs font-medium text-[#1e3a5f]">{Math.round(inst.storageUsed * parseInt(inst.storage) / 100)} GB used</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${inst.storageUsed}%`, backgroundColor: inst.primaryColor }} />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-3">Domain Config</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Globe size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-600">{inst.domain}</span>
                        <CheckCircle2 size={12} className="text-emerald-500 ml-auto" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-600">{inst.adminEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-600">Member since {inst.joinedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Branding */}
            {activeTab === 'branding' && (
              <div className="space-y-5">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="text-sm font-semibold text-[#1e3a5f] mb-4">Logo</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl" style={{ backgroundColor: primaryColor }}>
                      {inst.logo}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-white transition-colors">
                      <Upload size={14} /> Upload Logo
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-[#1e3a5f] mb-3">Primary Color</h4>
                    <div className="flex items-center gap-3">
                      <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                        className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                      <span className="text-sm font-mono text-gray-600">{primaryColor}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {['#1e3a5f', '#2d6a4f', '#7c3aed', '#dc2626', '#0891b2'].map(c => (
                        <button key={c} onClick={() => setPrimaryColor(c)}
                          className="w-7 h-7 rounded-lg border-2 transition-all hover:scale-110" style={{ backgroundColor: c, borderColor: primaryColor === c ? '#000' : 'transparent' }} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-[#1e3a5f] mb-3">Accent Color</h4>
                    <div className="flex items-center gap-3">
                      <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)}
                        className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                      <span className="text-sm font-mono text-gray-600">{accentColor}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {['#d4a017', '#f59e0b', '#10b981', '#f97316', '#8b5cf6'].map(c => (
                        <button key={c} onClick={() => setAccentColor(c)}
                          className="w-7 h-7 rounded-lg border-2 transition-all hover:scale-110" style={{ backgroundColor: c, borderColor: accentColor === c ? '#000' : 'transparent' }} />
                      ))}
                    </div>
                  </div>
                </div>
                <button className="px-5 py-2.5 bg-[#1e3a5f] text-white text-sm font-semibold rounded-xl hover:bg-[#162d4a] transition-colors">
                  Save Branding
                </button>
              </div>
            )}

            {/* Modules */}
            {activeTab === 'modules' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">Toggle module access for this institution</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {MODULES_ALL.map(mod => (
                    <button
                      key={mod}
                      onClick={() => toggleModule(mod)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all text-sm font-medium ${modules.includes(mod) ? 'bg-[#1e3a5f]/5 border-[#1e3a5f]/20 text-[#1e3a5f]' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
                    >
                      {mod}
                      {modules.includes(mod) ? <ToggleRight size={18} className="text-[#1e3a5f]" /> : <ToggleLeft size={18} className="text-gray-300" />}
                    </button>
                  ))}
                </div>
                <button className="mt-2 px-5 py-2.5 bg-[#1e3a5f] text-white text-sm font-semibold rounded-xl hover:bg-[#162d4a] transition-colors">
                  Save Module Access
                </button>
              </div>
            )}

            {/* Billing */}
            {activeTab === 'billing' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {(['Basic', 'Pro', 'Enterprise'] as const).map(plan => (
                    <div key={plan} className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${inst.plan === plan ? 'border-[#1e3a5f] bg-[#1e3a5f]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-[#1e3a5f]">{plan}</span>
                        {inst.plan === plan && <CheckCircle2 size={14} className="text-[#1e3a5f]" />}
                      </div>
                      <p className="text-xs text-gray-500">
                        {plan === 'Basic' && 'Up to 500 students, 5 modules'}
                        {plan === 'Pro' && 'Up to 5,000 students, all modules'}
                        {plan === 'Enterprise' && 'Unlimited students, all modules + AI'}
                      </p>
                      <p className="text-sm font-bold text-[#d4a017] mt-2">
                        {plan === 'Basic' && '₹4,999/mo'}
                        {plan === 'Pro' && '₹14,999/mo'}
                        {plan === 'Enterprise' && '₹39,999/mo'}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Billing History</h4>
                  <div className="space-y-2">
                    {['May 2026', 'Apr 2026', 'Mar 2026'].map(month => (
                      <div key={month} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-xs text-gray-600">{month}</span>
                        <span className="text-xs font-semibold text-[#1e3a5f]">₹39,999</span>
                        <span className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 rounded-full">Paid</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Admins */}
            {activeTab === 'admins' && (
              <div className="space-y-3">
                {inst.admins.map(admin => (
                  <div key={admin.email} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center text-[#1e3a5f] font-bold text-sm">
                      {admin.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1e3a5f]">{admin.name}</p>
                      <p className="text-xs text-gray-500">{admin.email}</p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-medium bg-white border border-gray-200 rounded-lg text-gray-600">{admin.role}</span>
                  </div>
                ))}
                <button className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-colors w-full justify-center">
                  + Invite Admin User
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function InstitutionsPage() {
  const [search, setSearch] = useState('')
  const [filterPlan, setFilterPlan] = useState<string>('All')
  const [selected, setSelected] = useState<Institution | null>(null)

  const filtered = INSTITUTIONS.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.domain.includes(search.toLowerCase())
    const matchPlan = filterPlan === 'All' || i.plan === filterPlan
    return matchSearch && matchPlan
  })

  const typeIcon = (type: string) => {
    const m: Record<string, React.ReactNode> = { School: <School size={14} />, Coaching: <BookOpen size={14} />, College: <GraduationCap size={14} />, University: <Layers size={14} /> }
    return m[type] ?? <Building2 size={14} />
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Institutions</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage all institutions on the KVL Education OS platform</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-60">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search institutions or domains..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          {['All', 'Basic', 'Pro', 'Enterprise'].map(plan => (
            <button key={plan} onClick={() => setFilterPlan(plan)}
              className={`px-3 py-2 text-xs font-medium rounded-xl transition-all ${filterPlan === plan ? 'bg-[#1e3a5f] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1e3a5f]/30'}`}>
              {plan}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Institution</th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Students</th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Revenue</th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan</th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Modules</th>
                <th className="py-3.5 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inst => (
                <tr key={inst.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{ backgroundColor: inst.primaryColor }}>
                        {inst.logo}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1e3a5f]">{inst.name}</p>
                        <p className="text-xs text-gray-400">{inst.domain}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span className="text-gray-400">{typeIcon(inst.type)}</span>
                      {inst.type}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-[#1e3a5f]">{inst.students.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-semibold text-[#d4a017]">{inst.revenue}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${PLAN_CONFIG[inst.plan].color}`}>{inst.plan}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${inst.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                      {inst.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-[#1e3a5f]">{inst.modules.length}</span>
                      <span className="text-xs text-gray-400">/ {MODULES_ALL.length}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button onClick={() => setSelected(inst)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#1e3a5f] border border-[#1e3a5f]/20 rounded-lg hover:bg-[#1e3a5f] hover:text-white transition-all">
                      Manage <ChevronRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Building2 size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No institutions match your search</p>
          </div>
        )}
      </div>

      {selected && <InstitutionDetail inst={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
