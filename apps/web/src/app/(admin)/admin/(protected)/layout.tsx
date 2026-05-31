'use client'

import React, { useState } from 'react'
import { AdminSidebar } from '@/components/admin/dashboard/AdminSidebar'
import { AdminTopbar } from '@/components/admin/dashboard/AdminTopbar'
import { AdminProtectedRoute } from '@/components/admin/providers/ProtectedRoute'

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <AdminProtectedRoute>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        <AdminSidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminTopbar
            onMobileMenuOpen={() => setMobileOpen(true)}
            sidebarCollapsed={collapsed}
          />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}
