'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/marks', label: 'Marks & Results', icon: '📊' },
  { href: '/attendance', label: 'Attendance', icon: '📅' },
  { href: '/timetable', label: 'Timetable', icon: '🕐' },
  { href: '/assignments', label: 'Assignments', icon: '📝' },
  { href: '/fees', label: 'Fees', icon: '💳' },
  { href: '/library', label: 'Library', icon: '📚' },
  { href: '/notices', label: 'Notices', icon: '📢' },
]

interface Props {
  collapsed: boolean
  mobileOpen: boolean
  onMobileClose: () => void
  onToggleCollapse: () => void
}

export function StudentSidebar({ collapsed, mobileOpen, onMobileClose, onToggleCollapse }: Props) {
  const pathname = usePathname()

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-teal-800 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-teal-700 font-bold text-sm">KVL</span>
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-semibold text-sm leading-tight">KVL International</p>
            <p className="text-teal-300 text-xs">Student Portal</p>
          </div>
        )}
      </div>

      {/* Student info strip */}
      {!collapsed && (
        <div className="px-4 py-3 bg-teal-800/50 border-b border-teal-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">AS</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">Aarav Sharma</p>
              <p className="text-teal-300 text-xs truncate">Class 10-A · Roll KVL-001</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-teal-100 hover:bg-white/10 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-teal-800 space-y-0.5">
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-teal-200 hover:bg-white/10 hover:text-white text-sm transition-all"
        >
          <span className="text-base">{collapsed ? '→' : '←'}</span>
          {!collapsed && <span>Collapse</span>}
        </button>
        <button className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-teal-200 hover:bg-red-500/20 hover:text-red-300 text-sm transition-all ${collapsed ? 'justify-center' : ''}`}>
          <span className="text-base">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-teal-700 to-teal-900 transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:flex flex-col bg-gradient-to-b from-teal-700 to-teal-900 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        } flex-shrink-0`}
      >
        <SidebarContent />
      </div>
    </>
  )
}
