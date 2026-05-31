'use client'

import React, { useState } from 'react'
import {
  Bus, MapPin, Users, Phone, Shield, Plus, Download,
  CheckCircle, AlertCircle, Clock, Eye, Edit, Navigation
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ROUTES = [
  { id: 'RT01', name: 'Route 1 — Andheri East', driver: 'Ramesh Kumar', phone: '9811001122', vehicle: 'MH-01-AB-1234', capacity: 42, students: 38, stops: ['Andheri Station', 'MTNL Chowk', 'DN Nagar', 'School'], status: 'Active', timing: '7:15 AM' },
  { id: 'RT02', name: 'Route 2 — Bandra West', driver: 'Suresh Patil', phone: '9822002233', vehicle: 'MH-01-CD-5678', capacity: 40, students: 35, stops: ['Bandra Station', 'Carter Road', 'Linking Road', 'School'], status: 'Active', timing: '7:30 AM' },
  { id: 'RT03', name: 'Route 3 — Powai', driver: 'Mahesh Yadav', phone: '9833003344', vehicle: 'MH-01-EF-9012', capacity: 45, students: 42, stops: ['Powai Lake', 'Hiranandani', 'IIT Gate', 'School'], status: 'Active', timing: '7:00 AM' },
  { id: 'RT04', name: 'Route 4 — Thane', driver: 'Dinesh Singh', phone: '9844004455', vehicle: 'MH-04-GH-3456', capacity: 50, students: 47, stops: ['Thane Station', 'Kopri', 'Mulund', 'School'], status: 'Maintenance', timing: '6:45 AM' },
  { id: 'RT05', name: 'Route 5 — Navi Mumbai', driver: 'Rajesh Gupta', phone: '9855005566', vehicle: 'MH-05-IJ-7890', capacity: 48, students: 40, stops: ['Vashi', 'Sanpada', 'Ghansoli', 'School'], status: 'Active', timing: '6:30 AM' },
]

const VEHICLES = [
  { number: 'MH-01-AB-1234', type: 'Bus', capacity: 42, model: 'Tata StarBus', year: 2021, insurance: '2026-12-31', fitness: '2026-09-30', status: 'Active' },
  { number: 'MH-01-CD-5678', type: 'Bus', capacity: 40, model: 'Ashok Leyland Falcon', year: 2020, insurance: '2026-11-30', fitness: '2026-08-31', status: 'Active' },
  { number: 'MH-01-EF-9012', type: 'Bus', capacity: 45, model: 'Tata StarBus', year: 2022, insurance: '2027-01-31', fitness: '2026-10-31', status: 'Active' },
  { number: 'MH-04-GH-3456', type: 'Bus', capacity: 50, model: 'Force Traveller', year: 2019, insurance: '2026-08-31', fitness: '2026-06-30', status: 'Maintenance' },
  { number: 'MH-05-IJ-7890', type: 'Bus', capacity: 48, model: 'Tata StarBus', year: 2023, insurance: '2027-03-31', fitness: '2026-12-31', status: 'Active' },
]

export default function TransportPage() {
  const [activeTab, setActiveTab] = useState<'routes' | 'vehicles' | 'students'>('routes')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transport</h1>
          <p className="text-sm text-gray-500 mt-0.5">Bus routes, vehicles and student transport management</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Route
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Routes', value: '12', icon: Navigation, color: 'bg-blue-500', sub: 'active routes' },
          { label: 'Vehicles', value: '14', icon: Bus, color: 'bg-indigo-500', sub: '12 active, 2 maintenance' },
          { label: 'Students Using Bus', value: '892', icon: Users, color: 'bg-green-500', sub: '21% of total' },
          { label: 'Today\'s Attendance', value: '98.2%', icon: CheckCircle, color: 'bg-emerald-500', sub: '876 of 892 boarded' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', s.color)}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['routes', 'vehicles', 'students'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-1.5 text-sm rounded-md capitalize transition-all', activeTab === tab ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700')}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'routes' && (
        <div className="space-y-4">
          {ROUTES.map(r => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', r.status === 'Active' ? 'bg-blue-500' : 'bg-yellow-400')}>
                    <Bus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{r.name}</h3>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', r.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>{r.status}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">Driver: {r.driver} · {r.vehicle}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{r.phone}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Pickup: {r.timing}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{r.students}/{r.capacity} students</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-yellow-50 rounded text-gray-400 hover:text-yellow-600"><Edit className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {r.stops.map((stop, i) => (
                    <React.Fragment key={stop}>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <MapPin className={cn('w-3.5 h-3.5', i === r.stops.length - 1 ? 'text-blue-500' : 'text-gray-400')} />
                        <span className={cn('text-xs', i === r.stops.length - 1 ? 'font-medium text-blue-600' : 'text-gray-500')}>{stop}</span>
                      </div>
                      {i < r.stops.length - 1 && <div className="w-6 h-px bg-gray-300 flex-shrink-0" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Occupancy</span>
                  <span>{r.students}/{r.capacity}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className={cn('h-1.5 rounded-full', r.students / r.capacity > 0.9 ? 'bg-red-400' : 'bg-green-400')} style={{ width: `${(r.students / r.capacity) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'vehicles' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Vehicle No.', 'Type', 'Model', 'Capacity', 'Insurance', 'Fitness', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {VEHICLES.map(v => {
                  const insuranceDue = new Date(v.insurance) < new Date('2026-08-31')
                  const fitnessDue = new Date(v.fitness) < new Date('2026-08-31')
                  return (
                    <tr key={v.number} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-sm font-medium text-gray-900">{v.number}</td>
                      <td className="px-4 py-3 text-gray-600">{v.type}</td>
                      <td className="px-4 py-3 text-gray-600">{v.model} ({v.year})</td>
                      <td className="px-4 py-3 text-gray-500">{v.capacity} seats</td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs', insuranceDue ? 'text-red-500 font-medium' : 'text-gray-500')}>{v.insurance}</span>
                        {insuranceDue && <AlertCircle className="w-3 h-3 text-red-400 inline ml-1" />}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs', fitnessDue ? 'text-orange-500 font-medium' : 'text-gray-500')}>{v.fitness}</span>
                        {fitnessDue && <AlertCircle className="w-3 h-3 text-orange-400 inline ml-1" />}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', v.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>{v.status}</span>
                      </td>
                      <td className="px-4 py-3 flex gap-1">
                        <button className="p-1 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="p-1 hover:bg-yellow-50 rounded text-gray-400 hover:text-yellow-600"><Edit className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700">Student-Route Assignment</h3>
          <p className="text-sm text-gray-400 mt-1">View and manage which students are assigned to which routes</p>
          <button className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Manage Assignments</button>
        </div>
      )}
    </div>
  )
}
