'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import {
  Bus, Route, Users, UserCheck, AlertTriangle, CheckCircle2, Clock,
  ArrowRight, MapPin, RefreshCw,
} from 'lucide-react'

interface BusFleet {
  id: string
  plate: string
  route: string
  driver: string
  capacity: number
  students: number
  status: 'Active' | 'Maintenance' | 'Idle'
}

const FLEET: BusFleet[] = [
  { id: '1', plate: 'KA-01-AB-1234', route: 'Route 1 – Whitefield', driver: 'Rajan Kumar', capacity: 52, students: 48, status: 'Active' },
  { id: '2', plate: 'KA-01-AB-1235', route: 'Route 2 – Koramangala', driver: 'Suresh Nair', capacity: 52, students: 45, status: 'Active' },
  { id: '3', plate: 'KA-01-AB-1236', route: 'Route 3 – Indiranagar', driver: 'Mohan Das', capacity: 40, students: 38, status: 'Active' },
  { id: '4', plate: 'KA-01-AB-1237', route: 'Route 4 – Marathahalli', driver: 'Vijay Singh', capacity: 52, students: 50, status: 'Active' },
  { id: '5', plate: 'KA-01-AB-1238', route: 'Route 5 – HSR Layout', driver: 'Anil Sharma', capacity: 40, students: 36, status: 'Active' },
  { id: '6', plate: 'KA-01-AB-1239', route: 'Route 6 – JP Nagar', driver: 'Ramesh Patil', capacity: 52, students: 47, status: 'Maintenance' },
  { id: '7', plate: 'KA-01-AB-1240', route: 'Route 7 – BTM Layout', driver: 'Deepak Rao', capacity: 40, students: 35, status: 'Active' },
  { id: '8', plate: 'KA-01-AB-1241', route: 'Route 8 – Electronic City', driver: 'Sanjay Mehta', capacity: 52, students: 49, status: 'Active' },
  { id: '9', plate: 'KA-01-AB-1242', route: 'Route 9 – Bannerghatta', driver: 'Manoj Yadav', capacity: 40, students: 30, status: 'Idle' },
  { id: '10', plate: 'KA-01-AB-1243', route: 'Route 10 – Hebbal', driver: 'Pradeep Kumar', capacity: 52, students: 51, status: 'Active' },
  { id: '11', plate: 'KA-01-AB-1244', route: 'Route 11 – Yelahanka', driver: 'Ravi Verma', capacity: 52, students: 44, status: 'Active' },
  { id: '12', plate: 'KA-01-AB-1245', route: 'Route 12 – Tumkur Road', driver: 'Kishore Reddy', capacity: 40, students: 39, status: 'Maintenance' },
]

const ALERTS = [
  { id: '1', type: 'warning', message: 'Bus KA-01-AB-1237 (Route 4) delayed by 15 min — heavy traffic near Marathahalli signal', time: '07:42 AM' },
  { id: '2', type: 'info', message: 'Bus KA-01-AB-1239 (Route 6) under maintenance — replacement arranged', time: '06:30 AM' },
  { id: '3', type: 'warning', message: 'Driver Ramesh Patil reported sick — backup driver assigned for Route 6', time: '06:15 AM' },
  { id: '4', type: 'success', message: 'All morning routes completed — 836 students picked up on time', time: '09:10 AM' },
]

const QUICK_LINKS = [
  { label: 'Vehicles', href: '/admin/transport/vehicles', icon: Bus, desc: 'Manage bus fleet' },
  { label: 'Routes', href: '/admin/transport/routes', icon: Route, desc: 'Configure routes & stops' },
  { label: 'Drivers', href: '/admin/transport/drivers', icon: UserCheck, desc: 'Driver management' },
  { label: 'Live Tracking', href: '/admin/transport/tracking', icon: MapPin, desc: 'Real-time bus tracking' },
]

const STATUS_STYLES: Record<string, string> = {
  Active: 'bg-green-50 text-green-700',
  Maintenance: 'bg-orange-50 text-orange-700',
  Idle: 'bg-gray-100 text-gray-500',
}

export default function TransportPage() {
  const [lastRefresh] = useState('Today, 09:15 AM')

  const active = FLEET.filter(b => b.status === 'Active').length
  const maintenance = FLEET.filter(b => b.status === 'Maintenance').length
  const idle = FLEET.filter(b => b.status === 'Idle').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transport Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Fleet management · Academic Year 2024–25</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Buses', value: '18', sub: `${active} active`, icon: Bus, color: 'text-[#1e3a5f]', bg: 'bg-[#1e3a5f]/10' },
          { label: 'Routes', value: '12', sub: 'All operational', icon: Route, color: 'text-[#d4a017]', bg: 'bg-[#d4a017]/10' },
          { label: 'Students Using Transport', value: '842', sub: '94.3% occupancy', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Drivers', value: '18', sub: '16 on duty today', icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{k.label}</p>
              <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center`}>
                <k.icon className={`w-5 h-5 ${k.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{k.value}</p>
            <p className="text-xs mt-1 text-gray-500">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Fleet Status Grid */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">Bus Fleet Status</h3>
          <span className="text-xs text-gray-400">Last updated: {lastRefresh}</span>
        </div>
        <div className="flex gap-4 mb-5">
          <span className="flex items-center gap-1.5 text-xs text-green-700"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />{active} Active</span>
          <span className="flex items-center gap-1.5 text-xs text-orange-700"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />{maintenance} Maintenance</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />{idle} Idle</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {FLEET.map(bus => (
            <div key={bus.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{bus.plate}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{bus.route}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[bus.status]}`}>
                  {bus.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> {bus.driver}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {bus.students}/{bus.capacity}</span>
              </div>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#1e3a5f]"
                  style={{ width: `${Math.round((bus.students / bus.capacity) * 100)}%` }}
                />
              </div>
              <p className="text-right text-xs text-gray-400 mt-1">{Math.round((bus.students / bus.capacity) * 100)}% full</p>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Alerts */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Today's Alerts</h3>
        <div className="space-y-3">
          {ALERTS.map(alert => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-100' :
                alert.type === 'success' ? 'bg-green-50 border-green-100' :
                'bg-blue-50 border-blue-100'
              }`}
            >
              {alert.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" /> :
               alert.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" /> :
               <Clock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">{alert.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_LINKS.map(link => (
            <Link key={link.label} href={link.href}
              className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:border-[#1e3a5f]/30 hover:bg-[#1e3a5f]/5 transition-all group">
              <div className="w-9 h-9 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <link.icon className="w-5 h-5 text-[#1e3a5f]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{link.label}</p>
                <p className="text-xs text-gray-400">{link.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#1e3a5f] transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
