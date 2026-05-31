'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BookOpen,
  FileText,
  Calendar,
  GraduationCap,
  CalendarOff,
  MessageSquare,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard',   label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/classes',     label: 'My Classes',   icon: GraduationCap },
  { href: '/attendance',  label: 'Attendance',   icon: ClipboardCheck },
  { href: '/assignments', label: 'Assignments',  icon: BookOpen },
  { href: '/marks',       label: 'Marks Entry',  icon: FileText },
  { href: '/timetable',   label: 'Timetable',    icon: Calendar },
  { href: '/students',    label: 'Students',     icon: Users },
  { href: '/leave',       label: 'Leave',        icon: CalendarOff },
  { href: '/messages',    label: 'Messages',     icon: MessageSquare },
]

interface TeacherShellProps {
  children: React.ReactNode
}

export default function TeacherShell({ children }: TeacherShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications] = useState(4)

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-indigo-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-400 rounded-lg flex items-center justify-center font-bold text-white text-sm">
            KVL
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">KVL International</p>
            <p className="text-indigo-300 text-xs">Teacher Portal</p>
          </div>
        </div>
      </div>

      {/* Teacher Profile */}
      <div className="px-5 py-4 border-b border-indigo-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            RK
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium text-sm truncate">Mr. Rajesh Kumar</p>
            <p className="text-indigo-300 text-xs truncate">Senior Teacher | Mathematics</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
              isActive(href)
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
            }`}
          >
            <Icon size={17} className="flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {isActive(href) && <ChevronRight size={14} className="opacity-60" />}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-indigo-800">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-200 hover:bg-indigo-800 hover:text-white transition-all duration-150 w-full">
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-indigo-950 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-indigo-950 flex flex-col shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-gray-900 leading-tight">
                Academic Year 2024–25
              </h1>
              <p className="text-xs text-gray-500">Term 2 · Mathematics Department</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
              <Bell size={18} />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              RK
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
