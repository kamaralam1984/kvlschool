'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Zap, Shield } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

const schema = z.object({
  email:    z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
})
type FormData = z.infer<typeof schema>

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)

      const adminRoles = ['super_admin','chairman','director','principal','vice_principal','admin','accountant','hr','teacher','librarian','hostel_manager','transport_manager','receptionist']
      if (!adminRoles.includes(json.data.user.role)) {
        throw new Error('Access denied. This portal is for staff only.')
      }

      login(json.data.tokens.accessToken, json.data.tokens.refreshToken, json.data.user)
      router.replace('/dashboard')
    } catch (err: any) {
      setError(err.message ?? 'Login failed.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-navy-700 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">KVL Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Authorised personnel only</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="admin@kvlschool.edu.in"
                autoComplete="email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/60 text-sm transition-colors"
              />
              {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/60 text-sm transition-colors pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-900/30 border border-red-800/50 text-red-400 text-sm">
                <Shield className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating…</>
                : 'Sign In to Admin Panel'
              }
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          © 2025 KVL International School — Restricted Access
        </p>
      </motion.div>
    </div>
  )
}
