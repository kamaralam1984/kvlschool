import { Suspense } from 'react'
import { DashboardStats } from '@/components/admin/dashboard/DashboardStats'
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart'
import { AttendanceChart } from '@/components/admin/dashboard/AttendanceChart'
import { RecentAdmissions } from '@/components/admin/dashboard/RecentAdmissions'
import { UpcomingEvents } from '@/components/admin/dashboard/UpcomingEvents'
import { FeeCollection } from '@/components/admin/dashboard/FeeCollection'
import { LiveUsers } from '@/components/admin/dashboard/LiveUsers'
import { QuickActions } from '@/components/admin/dashboard/QuickActions'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning, Admin 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here&apos;s what&apos;s happening at KVL today.</p>
        </div>
        <LiveUsers />
      </div>
      <QuickActions />
      <Suspense fallback={<div className="h-32 animate-pulse bg-gray-100 rounded-2xl" />}>
        <DashboardStats />
      </Suspense>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><RevenueChart /></div>
        <AttendanceChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><RecentAdmissions /></div>
        <div className="space-y-6"><FeeCollection /><UpcomingEvents /></div>
      </div>
    </div>
  )
}
