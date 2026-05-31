'use client'

import { Users, GraduationCap, UserCheck, UserX, BookOpen, Settings, Home, Bus, Library, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

const DEPT_STATS = [
  { dept: 'Academic',    count: 68, icon: BookOpen,      color: 'text-blue-600',   bg: 'bg-blue-50' },
  { dept: 'Admin',       count: 18, icon: Settings,      color: 'text-purple-600', bg: 'bg-purple-50' },
  { dept: 'Hostel',      count: 12, icon: Home,          color: 'text-green-600',  bg: 'bg-green-50' },
  { dept: 'Transport',   count: 16, icon: Bus,           color: 'text-orange-600', bg: 'bg-orange-50' },
  { dept: 'Library',     count: 10, icon: Library,       color: 'text-indigo-600', bg: 'bg-indigo-50' },
]

const RECENT_JOINS = [
  { name: 'Dr. Aishwarya Menon', role: 'Physics Teacher',      dept: 'Academic',  date: '2025-05-28', type: 'join' },
  { name: 'Mr. Suresh Babu',     role: 'Bus Driver',           dept: 'Transport', date: '2025-05-25', type: 'join' },
  { name: 'Ms. Kavita Jain',     role: 'Admin Coordinator',    dept: 'Admin',     date: '2025-05-20', type: 'join' },
  { name: 'Mr. Ramesh Pillai',   role: 'Chemistry Teacher',    dept: 'Academic',  date: '2025-05-10', type: 'exit' },
  { name: 'Ms. Deepa Nair',      role: 'Librarian',            dept: 'Library',   date: '2025-04-30', type: 'exit' },
]

const QUICK_LINKS = [
  { label: 'Staff Directory',    href: '/admin/hr/staff',         icon: Users },
  { label: 'Payroll',           href: '/admin/hr/payroll',        icon: TrendingUp },
  { label: 'Leave Management',  href: '/admin/hr/leave',          icon: UserX },
  { label: 'Performance',       href: '/admin/hr/performance',    icon: TrendingDown },
  { label: 'Recruitment',       href: '/admin/hr/recruitment',    icon: UserCheck },
]

export default function HrPage() {
  const totalStaff  = 124
  const teachers    = 68
  const nonTeaching = 56
  const onLeave     = 8
  const maleCount   = 71
  const femaleCount = 53

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">HR Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Human resources dashboard for KVL International School.</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Staff',        value: totalStaff,  sub: 'All departments',  icon: Users,       color: 'text-[#1e3a5f] bg-blue-50' },
          { label: 'Teaching Staff',     value: teachers,    sub: '68 active',        icon: GraduationCap, color: 'text-green-600 bg-green-50' },
          { label: 'Non-Teaching',       value: nonTeaching, sub: 'Support staff',    icon: UserCheck,   color: 'text-purple-600 bg-purple-50' },
          { label: 'On Leave Today',     value: onLeave,     sub: 'Absent today',     icon: UserX,       color: 'text-orange-600 bg-orange-50' },
        ].map(stat => {
          const Icon = stat.icon
          const [textColor, bgColor] = stat.color.split(' ')
          return (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor}`}>
                  <Icon className={`w-5 h-5 ${textColor}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              <p className="text-xs text-gray-400">{stat.sub}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department breakdown */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Department-wise Staff Count</h2>
          <div className="space-y-3">
            {DEPT_STATS.map(dept => {
              const Icon = dept.icon
              const pct = Math.round((dept.count / totalStaff) * 100)
              return (
                <div key={dept.dept} className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${dept.bg} flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${dept.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{dept.dept}</span>
                      <span className="text-sm font-bold text-gray-900">{dept.count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: '#1e3a5f' }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Gender ratio + quick links */}
        <div className="space-y-4">
          {/* Gender ratio */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Gender Ratio</h2>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-4 rounded-full overflow-hidden flex flex-1">
                <div className="h-full bg-[#1e3a5f] transition-all" style={{ width: `${Math.round((maleCount / totalStaff) * 100)}%` }} />
                <div className="h-full bg-[#d4a017] transition-all flex-1" />
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#1e3a5f]" />
                <span className="text-gray-600">Male</span>
                <span className="font-bold text-gray-800 ml-1">{maleCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#d4a017]" />
                <span className="text-gray-600">Female</span>
                <span className="font-bold text-gray-800 ml-1">{femaleCount}</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Quick Links</h2>
            <div className="space-y-1">
              {QUICK_LINKS.map(link => {
                const Icon = link.icon
                return (
                  <Link key={link.href} href={link.href} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#1e3a5f]" />
                      <span className="text-sm text-gray-700 group-hover:text-[#1e3a5f]">{link.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#1e3a5f] opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent joins/exits */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Recent Joins &amp; Exits</h2>
        <div className="space-y-3">
          {RECENT_JOINS.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                item.type === 'join' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {item.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">{item.role} · {item.dept}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  item.type === 'join' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {item.type === 'join' ? 'Joined' : 'Exited'}
                </span>
                <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
