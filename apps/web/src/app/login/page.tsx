'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, ArrowLeft, GraduationCap, Users, UserCheck, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  email:    z.string().email('Valid email required'),
  password: z.string().min(6, 'Password required'),
  role:     z.enum(['student', 'parent', 'teacher', 'admin']),
})
type FormData = z.infer<typeof schema>

const roles = [
  { value: 'student', label: 'Student',       icon: GraduationCap, color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   active: 'border-blue-500 bg-blue-50' },
  { value: 'parent',  label: 'Parent',         icon: Users,         color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  active: 'border-green-500 bg-green-50' },
  { value: 'teacher', label: 'Teacher',        icon: UserCheck,     color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', active: 'border-purple-500 bg-purple-50' },
  { value: 'admin',   label: 'Admin / Staff',  icon: Shield,        color: 'text-gold-600',   bg: 'bg-gold-50',   border: 'border-gold-200',   active: 'border-gold-500 bg-gold-50' },
] as const

const portalUrls: Record<string, string> = {
  student: 'http://localhost:3002',
  parent:  'http://localhost:3003',
  teacher: 'http://localhost:3004',
  admin:   'http://localhost:3001',
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'student' },
  })

  const selectedRole = watch('role')

  async function onSubmit(data: FormData) {
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)

      localStorage.setItem('accessToken', json.data.tokens.accessToken)
      localStorage.setItem('refreshToken', json.data.tokens.refreshToken)
      localStorage.setItem('user', JSON.stringify(json.data.user))

      // Redirect to the appropriate portal
      window.location.href = portalUrls[data.role] ?? '/'
    } catch (err: any) {
      setError(err.message ?? 'Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201,146,42,0.8) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />

        <div className="relative">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-lg leading-none">KVL International</p>
              <p className="text-gold-400 text-xs font-medium tracking-widest uppercase mt-0.5">School of Excellence</p>
            </div>
          </Link>
        </div>

        <div className="relative">
          <h1 className="font-display text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Welcome to<br />
            <span className="text-gold-400">Your Portal</span>
          </h1>
          <p className="text-ivory-400 leading-relaxed mb-10 max-w-sm">
            Access your personalised KVL dashboard — track progress, manage academics,
            connect with teachers, and stay on top of everything that matters.
          </p>

          <div className="space-y-4">
            {[
              'Real-time attendance & progress tracking',
              'Online exams & result management',
              'Fee payment & financial overview',
              'Live class streaming & recordings',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                </div>
                <span className="text-ivory-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-6 text-ivory-500 text-xs">
            <Link href="/privacy" className="hover:text-ivory-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ivory-300 transition-colors">Terms of Use</Link>
            <span>© 2025 KVL International School</span>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-ivory-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-navy-500 hover:text-navy-800 text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to website
          </Link>

          <h2 className="font-display text-3xl font-bold text-navy-900 mb-1">Sign in</h2>
          <p className="text-navy-400 text-sm mb-8">Select your role and enter your credentials</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {roles.map((role) => {
              const Icon = role.icon
              const isActive = selectedRole === role.value
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setValue('role', role.value)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-150 text-left',
                    isActive ? role.active + ' shadow-sm' : `bg-white ${role.border} hover:border-gray-300`
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', role.bg)}>
                    <Icon className={cn('w-4 h-4', role.color)} />
                  </div>
                  <span className={cn('font-medium text-sm', isActive ? 'text-navy-900' : 'text-navy-500')}>
                    {role.label}
                  </span>
                </button>
              )
            })}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-navy-700">Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@kvlschool.edu.in"
                autoComplete="email"
                className="input-premium"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-navy-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-gold-500 hover:text-gold-400 transition-colors font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="input-premium pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                : 'Sign In to Portal'
              }
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-ivory-200 text-center">
            <p className="text-navy-400 text-xs">
              Having trouble? Call{' '}
              <a href="tel:+919876543210" className="text-navy-600 font-medium hover:text-gold-500 transition-colors">
                +91 98765 43210
              </a>{' '}
              or email{' '}
              <a href="mailto:support@kvlschool.edu.in" className="text-navy-600 font-medium hover:text-gold-500 transition-colors">
                support@kvlschool.edu.in
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
