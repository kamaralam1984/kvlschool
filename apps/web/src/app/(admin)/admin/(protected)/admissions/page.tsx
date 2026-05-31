'use client'
import React, { useState } from 'react'
import { Users, FileText, CheckCircle2, BookOpen, TrendingUp, ClipboardList, Upload, UserCheck, ArrowRight, Bell } from 'lucide-react'
import Link from 'next/link'

const STATS = [
  { label: 'Total Enquiries', value: 142, icon: Users, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
  { label: 'Applications Received', value: 89, icon: FileText, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  { label: 'Admitted', value: 54, icon: CheckCircle2, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
  { label: 'Seats Available', value: 200, icon: BookOpen, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
]

const MONTHLY = [
  { month: 'Aug', apps: 4 },
  { month: 'Sep', apps: 7 },
  { month: 'Oct', apps: 12 },
  { month: 'Nov', apps: 9 },
  { month: 'Dec', apps: 6 },
  { month: 'Jan', apps: 18 },
  { month: 'Feb', apps: 22 },
  { month: 'Mar', apps: 11 },
]

const MAX_APPS = 22

const QUICK_LINKS = [
  { label: 'Enquiries', href: '/admin/admissions/enquiries', icon: Users, desc: '142 total' },
  { label: 'Applications', href: '/admin/admissions/applications', icon: ClipboardList, desc: '89 received' },
  { label: 'Documents', href: '/admin/admissions/documents', icon: Upload, desc: 'Verification tracker' },
  { label: 'Enrollment', href: '/admin/admissions/enrollment', icon: UserCheck, desc: '12 pending' },
]

const ACTIVITY = [
  { id: 1, action: 'Application APP-2025-047 approved', user: 'Admin', time: '2 min ago', type: 'success' },
  { id: 2, action: 'New enquiry from Priya Mehta (Class 5)', user: 'System', time: '18 min ago', type: 'info' },
  { id: 3, action: 'Documents verified for Rohan Gupta', user: 'Ms. Sharma', time: '45 min ago', type: 'success' },
  { id: 4, action: 'Application APP-2025-031 rejected', user: 'Admin', time: '1 hr ago', type: 'error' },
  { id: 5, action: 'Enrollment completed for Ananya Singh', user: 'Mr. Verma', time: '2 hr ago', type: 'success' },
]

const activityDot: Record<string, string> = {
  success: 'bg-green-500',
  info: 'bg-blue-400',
  error: 'bg-red-400',
}

export default function AdmissionsPage() {
  const [activeMonth, setActiveMonth] = useState<string | null>(null)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Admissions Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Academic Year 2025-26</p>
        </div>
        <span className="text-sm bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full font-medium">
          Admissions Open
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className={`bg-white border ${s.border} rounded-2xl p-5`}>
            <div className={`inline-flex p-2.5 rounded-xl ${s.color} mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold text-[#1e3a5f]">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-[#1e3a5f]">Monthly Applications</h2>
              <p className="text-xs text-gray-500 mt-0.5">2024-25 Academic Year</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#d4a017]" />
          </div>
          <div className="flex items-end gap-3 h-40">
            {MONTHLY.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-[#1e3a5f]">{m.apps}</span>
                <div
                  className={`w-full rounded-t-lg cursor-pointer transition-all ${activeMonth === m.month ? 'bg-[#d4a017]' : 'bg-[#1e3a5f]/20 hover:bg-[#1e3a5f]/50'}`}
                  style={{ height: `${(m.apps / MAX_APPS) * 100}%` }}
                  onClick={() => setActiveMonth(activeMonth === m.month ? null : m.month)}
                  title={`${m.apps} applications`}
                />
                <span className="text-xs text-gray-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-[#1e3a5f] mb-4">Quick Links</h2>
          <div className="space-y-3">
            {QUICK_LINKS.map(l => (
              <Link
                key={l.label}
                href={l.href}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1e3a5f]/10 rounded-lg">
                    <l.icon className="w-4 h-4 text-[#1e3a5f]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{l.label}</div>
                    <div className="text-xs text-gray-400">{l.desc}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#1e3a5f] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-4 h-4 text-[#d4a017]" />
          <h2 className="text-base font-semibold text-[#1e3a5f]">Recent Activity</h2>
        </div>
        <div className="space-y-0">
          {ACTIVITY.map(a => (
            <div key={a.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${activityDot[a.type]}`} />
                <span className="text-sm text-gray-700">{a.action}</span>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-xs text-gray-400">{a.time}</div>
                <div className="text-xs text-gray-400">{a.user}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
