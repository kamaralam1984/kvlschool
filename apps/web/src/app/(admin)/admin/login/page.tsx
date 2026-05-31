'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Shield, Zap } from 'lucide-react'
import { useAdminAuth } from '@/components/admin/providers/AuthProvider'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user, isLoading } = useAdminAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!isLoading && user) router.replace('/admin/dashboard')
  }, [user, isLoading, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)

      const staffRoles = ['super_admin','chairman','director','principal','vice_principal','admin','accountant','hr','teacher','librarian','hostel_manager','transport_manager','receptionist']
      if (!staffRoles.includes(json.data.user.role)) throw new Error('Access denied. Staff only.')

      login(json.data.tokens.accessToken, json.data.tokens.refreshToken, json.data.user)
      router.replace('/admin/dashboard')
    } catch (err: any) {
      setError(err.message ?? 'Login failed.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#060d1a] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-navy-700 flex items-center justify-center mx-auto mb-5 shadow-glow-navy">
            <Zap className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="text-3xl font-bold text-white font-display">KVL Admin</h1>
          <p className="text-gray-400 text-sm mt-1.5">School Management System</p>
        </div>

        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-8 shadow-premium-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <input
                value={email} onChange={e => setEmail(e.target.value)}
                type="email" placeholder="admin@kvlschool.edu.in" required autoComplete="email"
                className="w-full px-4 py-3.5 bg-navy-800 border border-navy-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 text-sm transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  value={password} onChange={e => setPassword(e.target.value)}
                  type={showPwd ? 'text' : 'password'} placeholder="••••••••" required autoComplete="current-password"
                  className="w-full px-4 py-3.5 bg-navy-800 border border-navy-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 text-sm transition-all pr-12"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-900/20 border border-red-800/40 text-red-400 text-sm">
                <Shield className="w-4 h-4 flex-shrink-0" />{error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold rounded-xl transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-glow-gold">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Authenticating…</> : 'Sign In to Admin Panel'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">© 2025 KVL International School — Restricted Access</p>
      </motion.div>
    </div>
  )
}
