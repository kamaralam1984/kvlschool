'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/marks': 'Marks & Results',
  '/attendance': 'Attendance',
  '/timetable': 'Timetable',
  '/assignments': 'Assignments',
  '/fees': 'Fees',
  '/library': 'Library',
  '/notices': 'Notices',
}

interface Props {
  onMobileMenuOpen: () => void
}

export function StudentTopbar({ onMobileMenuOpen }: Props) {
  const pathname = usePathname()
  const pageTitle = breadcrumbMap[pathname] ?? 'Student Portal'

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h2 className="text-sm font-semibold text-slate-800">{pageTitle}</h2>
          <p className="text-xs text-slate-400 hidden sm:block">KVL International School · AY 2024–25</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile */}
        <Link href="/profile" className="flex items-center gap-2 pl-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">AS</span>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-slate-700 leading-tight">Aarav Sharma</p>
            <p className="text-xs text-slate-400 leading-tight">Class 10-A</p>
          </div>
        </Link>
      </div>
    </header>
  )
}
