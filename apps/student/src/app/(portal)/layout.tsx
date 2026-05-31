'use client'

import React, { useState } from 'react'
import { StudentSidebar } from '@/components/student/StudentSidebar'
import { StudentTopbar } from '@/components/student/StudentTopbar'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <StudentSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <StudentTopbar onMobileMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
