'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  Bell,
  Menu,
  X,
  GraduationCap,
  LogOut,
  ChevronDown,
  CalendarCheck,
  MessageSquare,
  Award,
} from 'lucide-react'

const NAV = [
  { href: '/dashboard',  label: 'Dashboard',        icon: LayoutDashboard },
  { href: '/fees',       label: 'Fee Payment',       icon: CreditCard      },
  { href: '/progress',   label: "Child's Progress",  icon: TrendingUp      },
  { href: '/attendance', label: 'Attendance',        icon: CalendarCheck   },
  { href: '/results',    label: 'Exam Results',      icon: Award           },
  { href: '/notices',    label: 'Notices',           icon: Bell            },
  { href: '/messages',   label: 'Messages',          icon: MessageSquare   },
]

export default function ParentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-amber-50/20">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-amber-100 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-amber-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-900 leading-tight">KVL International</p>
            <p className="text-xs text-amber-600 font-medium">Parent Portal</p>
          </div>
        </div>

        {/* Child selector */}
        <div className="px-4 py-3 border-b border-amber-100">
          <button className="w-full flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-left hover:bg-amber-100 transition-colors">
            <div>
              <p className="text-xs text-amber-700 font-medium">Viewing</p>
              <p className="text-sm font-semibold text-stone-900">Aarav Sharma</p>
              <p className="text-xs text-stone-500">Class 10-A</p>
            </div>
            <ChevronDown className="w-4 h-4 text-amber-600 shrink-0" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-200'
                    : 'text-stone-600 hover:bg-amber-50 hover:text-amber-700'
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-amber-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
              RS
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-stone-900 truncate">Mr. Ramesh Sharma</p>
              <p className="text-xs text-stone-500 truncate">ramesh.sharma@email.com</p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-xs text-stone-500 hover:text-red-500 transition-colors px-1">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <p className="font-bold text-stone-900 text-sm">KVL Parent Portal</p>
              </div>
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5 text-stone-500" /></button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-amber-500 text-white'
                        : 'text-stone-600 hover:bg-amber-50 hover:text-amber-700'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    {label}
                  </Link>
                )
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-amber-100 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <button className="md:hidden p-2 rounded-lg hover:bg-amber-50" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5 text-stone-600" />
          </button>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-stone-900">Welcome, Mr. Sharma</p>
            <p className="text-xs text-stone-500">KVL International School</p>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 rounded-xl hover:bg-amber-50 transition-colors">
              <Bell className="w-5 h-5 text-stone-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
              RS
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
