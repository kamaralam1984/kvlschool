'use client'
import React from 'react'
import { Menu, Bell, Search, User } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { ModeToggle } from '@/components/mode/ModeToggle'
import { useMode } from '@/contexts/ModeContext'

interface Props { onMobileMenuOpen: () => void; sidebarCollapsed: boolean }

export function AdminTopbar({ onMobileMenuOpen }: Props) {
  const { user, logout } = useAuth()
  const { isCoaching } = useMode()

  return (
    <header className={`h-16 border-b flex items-center justify-between px-4 lg:px-6 flex-shrink-0 transition-colors duration-300 ${
      isCoaching
        ? 'bg-violet-900 border-violet-800'
        : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className={`lg:hidden p-2 rounded-lg ${isCoaching ? 'hover:bg-violet-800 text-violet-200' : 'hover:bg-gray-50 text-gray-500'}`}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className={`hidden sm:flex items-center gap-2 border rounded-xl px-3 py-2 w-64 transition-colors ${
          isCoaching
            ? 'bg-violet-800 border-violet-700'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <Search className={`w-4 h-4 flex-shrink-0 ${isCoaching ? 'text-violet-300' : 'text-gray-400'}`} />
          <input
            placeholder={isCoaching ? 'Search students, batches, tests…' : 'Search students, fees, exams…'}
            className={`bg-transparent text-sm outline-none w-full ${
              isCoaching ? 'text-violet-100 placeholder-violet-400' : 'text-gray-600 placeholder-gray-400'
            }`}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Mode Toggle */}
        <ModeToggle />

        <button className={`relative p-2 rounded-lg ${isCoaching ? 'hover:bg-violet-800 text-violet-200' : 'hover:bg-gray-50 text-gray-500'}`}>
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <button
          onClick={logout}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
            isCoaching ? 'hover:bg-violet-800' : 'hover:bg-gray-50'
          }`}
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
            isCoaching ? 'bg-orange-500' : 'bg-navy-700'
          }`}>
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <span className={`hidden sm:block text-sm font-medium max-w-24 truncate ${
            isCoaching ? 'text-violet-100' : 'text-gray-700'
          }`}>
            {user?.name ?? 'Admin'}
          </span>
        </button>
      </div>
    </header>
  )
}
