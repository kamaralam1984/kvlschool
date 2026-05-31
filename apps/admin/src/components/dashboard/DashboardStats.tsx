'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Users, CreditCard, TrendingUp, UserCheck, BookOpen, Bus, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api-client'

interface StatItem {
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: React.ElementType
  color: string
  iconBg: string
}

const SKELETON_STATS: StatItem[] = [
  { label: 'Total Students',       value: '—', change: 'Loading…', trend: 'neutral', icon: GraduationCap, color: 'bg-blue-50 text-blue-600',    iconBg: 'bg-blue-100'   },
  { label: "Today's Attendance",   value: '—', change: 'Loading…', trend: 'neutral', icon: UserCheck,     color: 'bg-green-50 text-green-600',  iconBg: 'bg-green-100'  },
  { label: 'Fee Collection (Month)',value: '—', change: 'Loading…', trend: 'neutral', icon: CreditCard,    color: 'bg-yellow-50 text-yellow-600',iconBg: 'bg-yellow-100' },
  { label: 'New Admissions',       value: '—', change: 'Loading…', trend: 'neutral', icon: TrendingUp,    color: 'bg-purple-50 text-purple-600',iconBg: 'bg-purple-100' },
  { label: 'Active Teachers',      value: '—', change: 'Loading…', trend: 'neutral', icon: Users,         color: 'bg-indigo-50 text-indigo-600',iconBg: 'bg-indigo-100' },
  { label: 'Online Classes Today', value: '—', change: 'Loading…', trend: 'neutral', icon: BookOpen,      color: 'bg-cyan-50 text-cyan-600',    iconBg: 'bg-cyan-100'   },
  { label: 'Transport Routes',     value: '—', change: 'Loading…', trend: 'neutral', icon: Bus,           color: 'bg-orange-50 text-orange-600',iconBg: 'bg-orange-100' },
  { label: 'Pending Fee Dues',     value: '—', change: 'Loading…', trend: 'neutral', icon: AlertCircle,   color: 'bg-red-50 text-red-600',      iconBg: 'bg-red-100'    },
]

function fmtNum(n: number) {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`
  if (n >= 1000)   return n.toLocaleString('en-IN')
  return String(n)
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatItem[]>(SKELETON_STATS)

  useEffect(() => {
    async function load() {
      try {
        const [studentsRes, teachersRes, admissionsRes, paymentsRes] = await Promise.allSettled([
          api.get('/students?limit=1'),
          api.get('/teachers?limit=1'),
          api.get('/admissions?limit=1'),
          api.get('/finance/payments?limit=1'),
        ])

        const totalStudents = studentsRes.status === 'fulfilled' ? studentsRes.value.data.meta?.total ?? 0 : 0
        const totalTeachers = teachersRes.status === 'fulfilled' ? teachersRes.value.data.meta?.total ?? 0 : 0
        const totalAdmissions = admissionsRes.status === 'fulfilled' ? admissionsRes.value.data.meta?.total ?? 0 : 0
        const totalPayments = paymentsRes.status === 'fulfilled' ? paymentsRes.value.data.meta?.total ?? 0 : 0

        setStats([
          { label: 'Total Students',        value: fmtNum(totalStudents),  change: `Active students`,           trend: 'up',     icon: GraduationCap, color: 'bg-blue-50 text-blue-600',    iconBg: 'bg-blue-100'   },
          { label: "Today's Attendance",    value: '—',                    change: 'Mark attendance to track',  trend: 'neutral',icon: UserCheck,     color: 'bg-green-50 text-green-600',  iconBg: 'bg-green-100'  },
          { label: 'Fee Collection (Month)',value: '₹—',                   change: `${totalPayments} payments`, trend: 'up',     icon: CreditCard,    color: 'bg-yellow-50 text-yellow-600',iconBg: 'bg-yellow-100' },
          { label: 'New Admissions',        value: fmtNum(totalAdmissions),change: 'Total admissions',          trend: 'up',     icon: TrendingUp,    color: 'bg-purple-50 text-purple-600',iconBg: 'bg-purple-100' },
          { label: 'Active Teachers',       value: fmtNum(totalTeachers),  change: 'On roster',                 trend: 'neutral',icon: Users,         color: 'bg-indigo-50 text-indigo-600',iconBg: 'bg-indigo-100' },
          { label: 'Online Classes Today',  value: '—',                    change: 'Schedule classes in LMS',   trend: 'neutral',icon: BookOpen,      color: 'bg-cyan-50 text-cyan-600',    iconBg: 'bg-cyan-100'   },
          { label: 'Transport Routes',      value: '—',                    change: 'Add routes in transport',   trend: 'neutral',icon: Bus,           color: 'bg-orange-50 text-orange-600',iconBg: 'bg-orange-100' },
          { label: 'Pending Fee Dues',      value: '₹—',                   change: 'Check finance module',      trend: 'down',   icon: AlertCircle,   color: 'bg-red-50 text-red-600',      iconBg: 'bg-red-100'    },
        ])
      } catch {
        // Keep skeleton values on error
      }
    }
    load()
  }, [])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.iconBg)}>
                <Icon className={cn('w-5 h-5', stat.color.split(' ')[1])} />
              </div>
              <span className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full',
                stat.trend === 'up'      && 'bg-green-100 text-green-700',
                stat.trend === 'down'    && 'bg-red-100 text-red-700',
                stat.trend === 'neutral' && 'bg-gray-100 text-gray-600',
              )}>
                {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
          </motion.div>
        )
      })}
    </div>
  )
}
