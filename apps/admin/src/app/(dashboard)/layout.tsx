'use client'

import React, { useState } from 'react'
import { AdminSidebar } from '@/components/dashboard/AdminSidebar'
import { AdminTopbar } from '@/components/dashboard/AdminTopbar'
import { ProtectedRoute } from '@/components/providers/ProtectedRoute'
import { ModeProvider, useMode } from '@/contexts/ModeContext'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { isCoaching } = useMode()

  return (
    <ProtectedRoute>
      <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${
        isCoaching ? 'bg-violet-50' : 'bg-gray-50'
      }`}>
        <AdminSidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminTopbar
            onMobileMenuOpen={() => setMobileSidebarOpen(true)}
            sidebarCollapsed={sidebarCollapsed}
          />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModeProvider>
      <DashboardContent>{children}</DashboardContent>
    </ModeProvider>
  )
}
