'use client'

import { useState } from 'react'
import {
  Building2, Users, TrendingUp, Activity, Plus, X, ChevronRight,
  GraduationCap, BookOpen, FlaskConical, ToggleLeft, ToggleRight,
  DollarSign, Shield, Bell, Clock, CheckCircle2, AlertCircle, School,
  BarChart3, Layers, Truck, Library, Brain, UserCog, ShoppingBag,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
interface Institution {
  id: string
  name: string
  type: 'School' | 'College' | 'Coaching' | 'University'
  students: number
  staff: number
  revenue: string
  status: 'Active' | 'Inactive'
  logo: string
  color: string
}

interface Module {
  id: string
  label: string
  icon: React.ReactNode
}

interface ModuleFlags {
  [institutionId: string]: { [moduleId: string]: boolean }
}

// ── Static data ────────────────────────────────────────────────────────────
const INSTITUTIONS: Institution[] = [
  { id: 'kvl-intl', name: 'KVL International School', type: 'School', students: 6240, staff: 312, revenue: '₹98.4L', status: 'Active', logo: 'KI', color: '#1e3a5f' },
  { id: 'kvl-junior', name: 'KVL Junior School', type: 'School', students: 3840, staff: 198, revenue: '₹54.2L', status: 'Active', logo: 'KJ', color: '#d4a017' },
  { id: 'kvl-coaching', name: 'KVL Coaching Institute', type: 'Coaching', students: 2400, staff: 87, revenue: '₹32.8L', status: 'Active', logo: 'KC', color: '#2d6a4f' },
]

const MODULES: Module[] = [
  { id: 'students', label: 'Students', icon: <Users size={14} /> },
  { id: 'attendance', label: 'Attendance', icon: <CheckCircle2 size={14} /> },
  { id: 'lms', label: 'LMS', icon: <BookOpen size={14} /> },
  { id: 'exams', label: 'Exams', icon: <FlaskConical size={14} /> },
  { id: 'finance', label: 'Finance', icon: <DollarSign size={14} /> },
  { id: 'store', label: 'Store', icon: <ShoppingBag size={14} /> },
  { id: 'library', label: 'Library', icon: <Library size={14} /> },
  { id: 'transport', label: 'Transport', icon: <Truck size={14} /> },
  { id: 'hr', label: 'HR', icon: <UserCog size={14} /> },
  { id: 'ai', label: 'AI', icon: <Brain size={14} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={14} /> },
]

const ACTIVITY_FEED = [
  { id: 1, institution: 'KVL International', action: 'New student enrolled', user: 'Priya Sharma', time: '2 min ago', type: 'success' },
  { id: 2, institution: 'KVL Junior', action: 'Fee payment received ₹12,500', user: 'Rahul Verma', time: '8 min ago', type: 'success' },
  { id: 3, institution: 'KVL Coaching', action: 'Exam schedule published', user: 'Admin', time: '15 min ago', type: 'info' },
  { id: 4, institution: 'KVL International', action: 'Transport route updated', user: 'Vikram Singh', time: '32 min ago', type: 'info' },
  { id: 5, institution: 'KVL Junior', action: 'Leave request pending', user: 'Anjali Patel', time: '1 hr ago', type: 'warning' },
  { id: 6, institution: 'KVL Coaching', action: 'New batch created — JEE 2026', user: 'Admin', time: '2 hr ago', type: 'success' },
]

const INSTITUTION_TYPES = ['School', 'College', 'Coaching', 'University']
const PLANS = ['Basic', 'Pro', 'Enterprise']

const defaultFlags: ModuleFlags = Object.fromEntries(
  INSTITUTIONS.map(inst => [
    inst.id,
    Object.fromEntries(MODULES.map(m => [m.id, true])),
  ])
)

// ── Add Institution Modal ──────────────────────────────────────────────────
function AddInstitutionModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: '', type: 'School', domain: '', adminEmail: '', plan: 'Pro',
  })
  const [enabledModules, setEnabledModules] = useState<string[]>(MODULES.map(m => m.id))

  const toggleModule = (id: string) =>
    setEnabledModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-[#1e3a5f]">Add Institution</h2>
            <p className="text-xs text-gray-500 mt-0.5">Onboard a new institution to the platform</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Institution Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. KVL University"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white"
              >
                {INSTITUTION_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Plan</label>
              <select
                value={form.plan}
                onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white"
              >
                {PLANS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Domain</label>
            <div className="flex items-center border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-[#1e3a5f]/20 focus-within:border-[#1e3a5f]">
              <span className="px-3 py-2.5 text-sm text-gray-400 border-r border-gray-200">https://</span>
              <input
                type="text"
                value={form.domain}
                onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}
                placeholder="kvluniversity.edu.in"
                className="flex-1 px-3 py-2.5 text-sm focus:outline-none rounded-r-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Admin Email</label>
            <input
              type="email"
              value={form.adminEmail}
              onChange={e => setForm(f => ({ ...f, adminEmail: e.target.value }))}
              placeholder="admin@kvluniversity.edu.in"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Modules to Enable</label>
            <div className="grid grid-cols-3 gap-2">
              {MODULES.map(mod => (
                <label key={mod.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all text-xs font-medium ${enabledModules.includes(mod.id) ? 'bg-[#1e3a5f]/5 border-[#1e3a5f]/30 text-[#1e3a5f]' : 'border-gray-200 text-gray-500'}`}>
                  <input
                    type="checkbox"
                    checked={enabledModules.includes(mod.id)}
                    onChange={() => toggleModule(mod.id)}
                    className="sr-only"
                  />
                  <span className={enabledModules.includes(mod.id) ? 'text-[#1e3a5f]' : 'text-gray-400'}>{mod.icon}</span>
                  {mod.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-6 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-[#1e3a5f] rounded-xl hover:bg-[#162d4a] transition-colors">
            Create Institution
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Institution Card ───────────────────────────────────────────────────────
function InstitutionCard({ inst }: { inst: Institution }) {
  const typeIcons: Record<string, React.ReactNode> = {
    School: <School size={12} />, College: <GraduationCap size={12} />,
    Coaching: <BookOpen size={12} />, University: <Layers size={12} />,
  }
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: inst.color }}>
            {inst.logo}
          </div>
          <div>
            <h3 className="font-semibold text-[#1e3a5f] text-sm leading-tight">{inst.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-gray-400">{typeIcons[inst.type]}</span>
              <span className="text-xs text-gray-500">{inst.type}</span>
            </div>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${inst.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
          {inst.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2.5 bg-gray-50 rounded-xl">
          <p className="text-sm font-bold text-[#1e3a5f]">{inst.students.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-0.5">Students</p>
        </div>
        <div className="text-center p-2.5 bg-gray-50 rounded-xl">
          <p className="text-sm font-bold text-[#1e3a5f]">{inst.staff}</p>
          <p className="text-xs text-gray-500 mt-0.5">Staff</p>
        </div>
        <div className="text-center p-2.5 bg-amber-50 rounded-xl">
          <p className="text-sm font-bold text-[#d4a017]">{inst.revenue}</p>
          <p className="text-xs text-gray-500 mt-0.5">Revenue</p>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#1e3a5f] border border-[#1e3a5f]/20 rounded-xl hover:bg-[#1e3a5f] hover:text-white transition-all group-hover:border-[#1e3a5f]/40">
        Manage <ChevronRight size={13} />
      </button>
    </div>
  )
}

// ── Platform Stat Card ─────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${accent ? 'bg-amber-50 text-[#d4a017]' : 'bg-[#1e3a5f]/5 text-[#1e3a5f]'}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-[#1e3a5f]">{value}</p>
      <p className="text-sm text-gray-600 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-emerald-600 mt-1 font-medium">{sub}</p>}
    </div>
  )
}

// ── Module Toggle Row ──────────────────────────────────────────────────────
function ModuleToggleRow({ mod, flags, onToggle }: { mod: Module; flags: ModuleFlags; onToggle: (instId: string, modId: string) => void }) {
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="text-[#1e3a5f]">{mod.icon}</span>
          <span className="text-sm font-medium text-gray-700">{mod.label}</span>
        </div>
      </td>
      {INSTITUTIONS.map(inst => (
        <td key={inst.id} className="py-3 px-4 text-center">
          <button
            onClick={() => onToggle(inst.id, mod.id)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${flags[inst.id]?.[mod.id] ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
          >
            {flags[inst.id]?.[mod.id]
              ? <><ToggleRight size={14} /> On</>
              : <><ToggleLeft size={14} /> Off</>
            }
          </button>
        </td>
      ))}
    </tr>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function SuperAdminPage() {
  const [showModal, setShowModal] = useState(false)
  const [flags, setFlags] = useState<ModuleFlags>(defaultFlags)

  const toggleFlag = (instId: string, modId: string) => {
    setFlags(prev => ({
      ...prev,
      [instId]: { ...prev[instId], [modId]: !prev[instId]?.[modId] },
    }))
  }

  const activityColor = (type: string) => {
    if (type === 'success') return 'bg-emerald-100 text-emerald-700'
    if (type === 'warning') return 'bg-amber-100 text-amber-700'
    return 'bg-blue-100 text-blue-700'
  }
  const activityIcon = (type: string) => {
    if (type === 'success') return <CheckCircle2 size={13} />
    if (type === 'warning') return <AlertCircle size={13} />
    return <Activity size={13} />
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={18} className="text-[#d4a017]" />
            <span className="text-xs font-semibold text-[#d4a017] uppercase tracking-widest">God Mode</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Super Admin Control Center</h1>
          <p className="text-sm text-gray-500 mt-0.5">Multi-Institution Management — KVL Education OS</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1e3a5f] text-white text-sm font-semibold rounded-xl hover:bg-[#162d4a] transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Institution
        </button>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Building2 size={20} />} label="Total Institutions" value="3" sub="+1 pending" />
        <StatCard icon={<Users size={20} />} label="Total Students" value="12,480" sub="↑ 4.2% this month" />
        <StatCard icon={<TrendingUp size={20} />} label="Total Revenue" value="₹2.4Cr" sub="↑ 12% vs last month" accent />
        <StatCard icon={<Activity size={20} />} label="Active Users" value="1,847" sub="Right now" />
      </div>

      {/* Institution Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#1e3a5f]">Institution Overview</h2>
          <a href="/admin/super-admin/institutions" className="text-xs text-[#1e3a5f] font-medium hover:underline flex items-center gap-1">
            View all <ChevronRight size={13} />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INSTITUTIONS.map(inst => <InstitutionCard key={inst.id} inst={inst} />)}
        </div>
      </div>

      {/* Module Control + Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Module Control Table */}
        <div className="xl:col-span-2 bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-[#1e3a5f]">Module Control</h2>
            <p className="text-xs text-gray-500 mt-0.5">Toggle feature access per institution</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Module</th>
                  {INSTITUTIONS.map(inst => (
                    <th key={inst.id} className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {inst.logo}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MODULES.map(mod => (
                  <ModuleToggleRow key={mod.id} mod={mod} flags={flags} onToggle={toggleFlag} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#1e3a5f]">Recent Activity</h2>
              <p className="text-xs text-gray-500 mt-0.5">Cross-institution log</p>
            </div>
            <Bell size={16} className="text-gray-400" />
          </div>
          <div className="divide-y divide-gray-50">
            {ACTIVITY_FEED.map(item => (
              <div key={item.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${activityColor(item.type)}`}>
                    {activityIcon(item.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#1e3a5f] truncate">{item.institution}</p>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.action}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-gray-400">{item.user}</span>
                      <span className="text-gray-200">•</span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={10} /> {item.time}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100">
            <button className="w-full text-xs font-medium text-[#1e3a5f] hover:underline">View full audit log →</button>
          </div>
        </div>
      </div>

      {showModal && <AddInstitutionModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
