'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-navy-500 hover:text-navy-800 text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="card-premium p-8">
          {!submitted ? (
            <>
              <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center mb-5">
                <Mail className="w-6 h-6 text-navy-600" />
              </div>
              <h1 className="font-display text-2xl font-bold text-navy-900 mb-2">Forgot Password?</h1>
              <p className="text-navy-500 text-sm mb-6">Enter your registered email address. We&apos;ll send you a password reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-navy-700">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@kvlschool.edu.in" required className="input-premium" />
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3.5 disabled:opacity-60">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-navy-900 mb-2">Check Your Email</h2>
              <p className="text-navy-500 text-sm mb-6">If <strong>{email}</strong> is registered, a reset link has been sent. Check your inbox and spam folder.</p>
              <Link href="/login" className="btn-primary justify-center w-full">Back to Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
