'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User { id: string; name: string; email: string; role: string; avatar?: string }
interface AuthCtx {
  user: User | null
  token: string | null
  login: (token: string, refreshToken: string, user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('admin_token')
    const u = localStorage.getItem('admin_user')
    if (t && u) { setToken(t); try { setUser(JSON.parse(u)) } catch {} }
    setIsLoading(false)
  }, [])

  function login(accessToken: string, refreshToken: string, userData: User) {
    localStorage.setItem('admin_token', accessToken)
    localStorage.setItem('admin_refresh', refreshToken)
    localStorage.setItem('admin_user', JSON.stringify(userData))
    setToken(accessToken); setUser(userData)
  }

  function logout() {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_refresh')
    localStorage.removeItem('admin_user')
    setToken(null); setUser(null)
    window.location.href = '/admin/login'
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAdminAuth must be inside AdminAuthProvider')
  return ctx
}
