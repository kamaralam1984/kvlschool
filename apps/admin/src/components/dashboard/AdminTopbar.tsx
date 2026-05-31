'use client'
import React from 'react'
import { Menu, Bell, Search, User } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

interface Props { onMobileMenuOpen: () => void; sidebarCollapsed: boolean }

export function AdminTopbar({ onMobileMenuOpen }: Props) {
  const { user, logout } = useAuth()
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMobileMenuOpen} className="lg:hidden p-2 rounded-lg hover:bg-gray-50 text-gray-500">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-64">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input placeholder="Search students, fees, exams…" className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-gray-50 text-gray-500">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-7 h-7 rounded-full bg-navy-700 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-24 truncate">{user?.name ?? 'Admin'}</span>
        </button>
      </div>
    </header>
  )
}
