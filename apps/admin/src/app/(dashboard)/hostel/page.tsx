'use client'

import React, { useState } from 'react'
import {
  Home, Users, Bed, AlertCircle, CheckCircle, Plus,
  Download, Eye, Edit, Phone, Search, Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ROOMS = [
  { number: 'A-101', floor: 'Ground', capacity: 4, occupied: 4, type: 'Standard', block: 'Block A', status: 'Full', amenities: ['AC', 'Wi-Fi', 'Attached Bath'] },
  { number: 'A-102', floor: 'Ground', capacity: 4, occupied: 3, type: 'Standard', block: 'Block A', status: 'Available', amenities: ['AC', 'Wi-Fi', 'Attached Bath'] },
  { number: 'A-103', floor: 'Ground', capacity: 2, occupied: 1, type: 'Premium', block: 'Block A', status: 'Available', amenities: ['AC', 'Wi-Fi', 'Attached Bath', 'Balcony'] },
  { number: 'B-201', floor: 'First', capacity: 6, occupied: 6, type: 'Economy', block: 'Block B', status: 'Full', amenities: ['Fan', 'Wi-Fi', 'Common Bath'] },
  { number: 'B-202', floor: 'First', capacity: 6, occupied: 5, type: 'Economy', block: 'Block B', status: 'Available', amenities: ['Fan', 'Wi-Fi', 'Common Bath'] },
  { number: 'B-203', floor: 'First', capacity: 4, occupied: 0, type: 'Standard', block: 'Block B', status: 'Maintenance', amenities: ['AC', 'Wi-Fi', 'Common Bath'] },
  { number: 'C-301', floor: 'Second', capacity: 2, occupied: 2, type: 'Premium', block: 'Block C', status: 'Full', amenities: ['AC', 'Wi-Fi', 'Attached Bath', 'Study Room'] },
  { number: 'C-302', floor: 'Second', capacity: 4, occupied: 3, type: 'Standard', block: 'Block C', status: 'Available', amenities: ['AC', 'Wi-Fi', 'Attached Bath'] },
]

const RESIDENTS = [
  { name: 'Arjun Patel', class: 'IX-B', room: 'A-101', block: 'Block A', guardianPhone: '9765432109', joinDate: '2025-06-01', fees: 'Paid' },
  { name: 'Vikram Singh', class: 'XI-A', room: 'A-101', block: 'Block A', guardianPhone: '9876543210', joinDate: '2025-06-01', fees: 'Pending' },
  { name: 'Rahul Kumar', class: 'X-B', room: 'B-201', block: 'Block B', guardianPhone: '9988776655', joinDate: '2025-07-15', fees: 'Paid' },
  { name: 'Amit Sharma', class: 'XII-A', room: 'C-301', block: 'Block C', guardianPhone: '9876012345', joinDate: '2024-06-01', fees: 'Paid' },
  { name: 'Suresh Reddy', class: 'VIII-A', room: 'B-201', block: 'Block B', guardianPhone: '9654890123', joinDate: '2025-06-01', fees: 'Overdue' },
]

const COMPLAINTS = [
  { id: 'CP001', room: 'B-201', type: 'Plumbing', desc: 'Tap leaking in bathroom', reporter: 'Rahul Kumar', date: '2026-05-30', status: 'Open' },
  { id: 'CP002', room: 'A-102', type: 'Electrical', desc: 'Fan not working', reporter: 'Sneha Singh', date: '2026-05-29', status: 'In Progress' },
  { id: 'CP003', room: 'C-302', type: 'Cleanliness', desc: 'Room not cleaned for 2 days', reporter: 'Priya Nair', date: '2026-05-28', status: 'Resolved' },
]

const statusColor: Record<string, string> = {
  Full: 'bg-red-100 text-red-700',
  Available: 'bg-green-100 text-green-700',
  Maintenance: 'bg-yellow-100 text-yellow-700',
}

const complaintStatusColor: Record<string, string> = {
  Open: 'bg-red-100 text-red-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Resolved: 'bg-green-100 text-green-700',
}

const totalCapacity = ROOMS.reduce((a, r) => a + r.capacity, 0)
const totalOccupied = ROOMS.reduce((a, r) => a + r.occupied, 0)

export default function HostelPage() {
  const [activeTab, setActiveTab] = useState<'rooms' | 'residents' | 'complaints'>('rooms')
  const [blockFilter, setBlockFilter] = useState('All')

  const filteredRooms = ROOMS.filter(r => blockFilter === 'All' || r.block === blockFilter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hostel</h1>
          <p className="text-sm text-gray-500 mt-0.5">Room management, residents and maintenance</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            <Plus className="w-4 h-4" /> Add Room
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Rooms', value: '48', icon: Home, color: 'bg-teal-500', sub: 'across 3 blocks' },
          { label: 'Total Capacity', value: totalCapacity, icon: Bed, color: 'bg-blue-500', sub: 'beds available' },
          { label: 'Occupied', value: totalOccupied, icon: Users, color: 'bg-purple-500', sub: `${((totalOccupied / totalCapacity) * 100).toFixed(0)}% occupancy` },
          { label: 'Pending Complaints', value: '4', icon: AlertCircle, color: 'bg-red-400', sub: 'need attention' },
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
        {(['rooms', 'residents', 'complaints'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-1.5 text-sm rounded-md capitalize transition-all', activeTab === tab ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700')}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'rooms' && (
        <>
          <div className="flex gap-2">
            {['All', 'Block A', 'Block B', 'Block C'].map(b => (
              <button key={b} onClick={() => setBlockFilter(b)}
                className={cn('px-3 py-1.5 text-sm rounded-lg border transition-all', blockFilter === b ? 'bg-teal-600 text-white border-teal-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50')}>
                {b}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRooms.map(r => (
              <div key={r.number} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{r.number}</h3>
                    <p className="text-xs text-gray-400">{r.block} · {r.floor} Floor · {r.type}</p>
                  </div>
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium', statusColor[r.status])}>{r.status}</span>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">Occupancy</span>
                    <span className="font-medium">{r.occupied}/{r.capacity}</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: r.capacity }).map((_, i) => (
                      <div key={i} className={cn('flex-1 h-2 rounded-full', i < r.occupied ? 'bg-teal-500' : 'bg-gray-100')} />
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {r.amenities.map(a => (
                    <span key={a} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">{a}</span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 text-xs py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">View</button>
                  {r.status !== 'Maintenance' && r.occupied < r.capacity &&
                    <button className="flex-1 text-xs py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Assign</button>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'residents' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Resident', 'Room', 'Guardian Contact', 'Join Date', 'Hostel Fees', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RESIDENTS.map(r => (
                  <tr key={r.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.class}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-gray-700">{r.room}</span>
                      <p className="text-xs text-gray-400">{r.block}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-500 text-xs"><Phone className="w-3 h-3" />{r.guardianPhone}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.joinDate}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium',
                        r.fees === 'Paid' ? 'bg-green-100 text-green-700' :
                        r.fees === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700')}>{r.fees}</span>
                    </td>
                    <td className="px-4 py-3 flex gap-1">
                      <button className="p-1 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1 hover:bg-yellow-50 rounded text-gray-400 hover:text-yellow-600"><Edit className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'complaints' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Maintenance Complaints</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
              <Plus className="w-3.5 h-3.5" /> Add Complaint
            </button>
          </div>
          {COMPLAINTS.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-4">
              <div className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0', c.status === 'Open' ? 'bg-red-400' : c.status === 'In Progress' ? 'bg-yellow-400' : 'bg-green-400')} />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-gray-900">{c.type} — Room {c.room}</h3>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', complaintStatusColor[c.status])}>{c.status}</span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{c.desc}</p>
                <p className="text-xs text-gray-400 mt-1">Reported by {c.reporter} · {c.date} · {c.id}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-xs text-blue-600 hover:underline">Update</button>
                {c.status !== 'Resolved' && <button className="text-xs text-green-600 hover:underline">Resolve</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
