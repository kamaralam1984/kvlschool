import { Suspense } from 'react'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { AttendanceChart } from '@/components/dashboard/AttendanceChart'
import { RecentAdmissions } from '@/components/dashboard/RecentAdmissions'
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents'
import { FeeCollection } from '@/components/dashboard/FeeCollection'
import { LiveUsers } from '@/components/dashboard/LiveUsers'
import { QuickActions } from '@/components/dashboard/QuickActions'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning, Admin 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here&apos;s what&apos;s happening at KVL today.</p>
        </div>
        <LiveUsers />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Grid */}
      <Suspense fallback={<div className="h-32 animate-pulse bg-gray-100 rounded-2xl" />}>
        <DashboardStats />
      </Suspense>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="h-80 animate-pulse bg-gray-100 rounded-2xl" />}>
            <RevenueChart />
          </Suspense>
        </div>
        <Suspense fallback={<div className="h-80 animate-pulse bg-gray-100 rounded-2xl" />}>
          <AttendanceChart />
        </Suspense>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={null}>
            <RecentAdmissions />
          </Suspense>
        </div>
        <div className="space-y-6">
          <Suspense fallback={null}>
            <FeeCollection />
          </Suspense>
          <Suspense fallback={null}>
            <UpcomingEvents />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
