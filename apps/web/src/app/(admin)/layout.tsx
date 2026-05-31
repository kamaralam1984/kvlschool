import { AdminAuthProvider } from '@/components/admin/providers/AuthProvider'
import React from 'react'

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>
}
