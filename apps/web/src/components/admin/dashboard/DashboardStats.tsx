'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Users, CreditCard, TrendingUp, UserCheck, BookOpen, Bus, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { analyticsApi, studentsApi } from '@/lib/api'

interface DashStats {
  totalStudents: number
  attendancePct: number
  attendancePresent: number
  feeCollected: string
  newAdmissions: number
  activeTeachers: number
  onlineClasses: number
  transportRoutes: number
  pendingFees: string
  feeDefaulters: number
}

const DEFAULTS: DashStats = {
  totalStudents: 0, attendancePct: 0, attendancePresent: 0,
  feeCollected: '₹0', newAdmissions: 0, activeTeachers: 0,
  onlineClasses: 0, transportRoutes: 0, pendingFees: '₹0', feeDefaulters: 0,
}

function fmtINR(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000)   return `₹${(n / 1000).toFixed(1)}K`
  return `₹${n}`
}

export function DashboardStats() {
  const [data, setData]       = useState<DashStats>(DEFAULTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [analyticsRes, studentsRes] = await Promise.allSettled([
          analyticsApi.dashboard(),
          studentsApi.list({ limit: 1 }),
        ])

        const dash = analyticsRes.status === 'fulfilled' ? (analyticsRes.value as any)?.data ?? {} : {}
        const studentMeta = studentsRes.status === 'fulfilled' ? (studentsRes.value as any)?.meta : null

        setData({
          totalStudents:    studentMeta?.total ?? dash.totalStudents ?? 0,
          attendancePct:    dash.attendancePct ?? 0,
          attendancePresent: dash.attendancePresent ?? 0,
          feeCollected:     fmtINR(dash.feeCollectedMonth ?? 0),
          newAdmissions:    dash.newAdmissions ?? 0,
          activeTeachers:   dash.activeTeachers ?? 0,
          onlineClasses:    dash.onlineClasses ?? 0,
          transportRoutes:  dash.transportRoutes ?? 0,
          pendingFees:      fmtINR(dash.pendingFees ?? 0),
          feeDefaulters:    dash.feeDefaulters ?? 0,
        })
      } catch {
        // keep defaults
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = [
    { label: 'Total Students',       value: loading ? '—' : data.totalStudents.toLocaleString('en-IN'),  change: 'Enrolled students',          trend: 'up',      icon: GraduationCap, iconBg: 'bg-blue-100',   iconColor: 'text-blue-600' },
    { label: "Today's Attendance",   value: loading ? '—' : `${data.attendancePct}%`,                    change: `${data.attendancePresent} present`, trend: 'up', icon: UserCheck,     iconBg: 'bg-green-100',  iconColor: 'text-green-600' },
    { label: 'Fee Collection (Month)',value: loading ? '—' : data.feeCollected,                           change: 'This month',                trend: 'up',      icon: CreditCard,    iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { label: 'New Admissions',        value: loading ? '—' : String(data.newAdmissions),                 change: 'This session',              trend: 'up',      icon: TrendingUp,    iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { label: 'Active Teachers',       value: loading ? '—' : String(data.activeTeachers),                change: 'Staff members',             trend: 'neutral', icon: Users,         iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
    { label: 'Online Classes Today',  value: loading ? '—' : String(data.onlineClasses),                 change: 'Live sessions',             trend: 'up',      icon: BookOpen,      iconBg: 'bg-cyan-100',   iconColor: 'text-cyan-600' },
    { label: 'Transport Routes',      value: loading ? '—' : String(data.transportRoutes),               change: 'Active routes',             trend: 'neutral', icon: Bus,           iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
    { label: 'Pending Fee Dues',      value: loading ? '—' : data.pendingFees,                           change: `${data.feeDefaulters} defaulters`, trend: 'down', icon: AlertCircle, iconBg: 'bg-red-100',  iconColor: 'text-red-600' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <motion.div key={stat.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.iconBg)}>
                <Icon className={cn('w-5 h-5', stat.iconColor)} />
              </div>
              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full',
                stat.trend === 'up'      && 'bg-green-100 text-green-700',
                stat.trend === 'down'    && 'bg-red-100 text-red-700',
                stat.trend === 'neutral' && 'bg-gray-100 text-gray-600',
              )}>
                {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'}
              </span>
            </div>
            {loading
              ? <div className="h-7 w-16 bg-gray-100 rounded-lg animate-pulse mb-1" />
              : <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            }
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
          </motion.div>
        )
      })}
    </div>
  )
}
