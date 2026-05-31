'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { Loader2 } from 'lucide-react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-navy-600" />
          <p className="text-gray-400 text-sm">Loading your workspace…</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
