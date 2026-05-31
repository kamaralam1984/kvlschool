'use client'
import React, { useState } from 'react'
import { Bus, Plus, X, Search, Filter, Wrench, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'

type VehicleStatus = 'Active' | 'Maintenance' | 'Idle'

interface Vehicle {
  id: string
  busNo: string
  registration: string
  model: string
  capacity: number
  assignedRoute: string
  driver: string
  lastService: string
  nextService: string
  fitnessExpiry: string
  status: VehicleStatus
}

const MOCK_VEHICLES: Vehicle[] = [
  { id: '1', busNo: 'BUS-01', registration: 'KA-01-AB-1234', model: 'Tata Starbus 52', capacity: 52, assignedRoute: 'Route 1 – Whitefield', driver: 'Rajan Kumar', lastService: '2025-04-10', nextService: '2025-07-10', fitnessExpiry: '2026-03-15', status: 'Active' },
  { id: '2', busNo: 'BUS-02', registration: 'KA-01-AB-1235', model: 'Tata Starbus 52', capacity: 52, assignedRoute: 'Route 2 – Koramangala', driver: 'Suresh Nair', lastService: '2025-03-22', nextService: '2025-06-22', fitnessExpiry: '2025-12-20', status: 'Active' },
  { id: '3', busNo: 'BUS-03', registration: 'KA-01-AB-1236', model: 'Ashok Leyland Lynx', capacity: 40, assignedRoute: 'Route 3 – Indiranagar', driver: 'Mohan Das', lastService: '2025-05-01', nextService: '2025-08-01', fitnessExpiry: '2026-05-10', status: 'Active' },
  { id: '4', busNo: 'BUS-04', registration: 'KA-01-AB-1237', model: 'Tata Starbus 52', capacity: 52, assignedRoute: 'Route 4 – Marathahalli', driver: 'Vijay Singh', lastService: '2025-02-14', nextService: '2025-05-14', fitnessExpiry: '2025-11-30', status: 'Maintenance' },
  { id: '5', busNo: 'BUS-05', registration: 'KA-01-AB-1238', model: 'Ashok Leyland Lynx', capacity: 40, assignedRoute: 'Route 5 – HSR Layout', driver: 'Anil Sharma', lastService: '2025-04-28', nextService: '2025-07-28', fitnessExpiry: '2026-04-01', status: 'Active' },
  { id: '6', busNo: 'BUS-06', registration: 'KA-01-AB-1239', model: 'Tata Starbus 52', capacity: 52, assignedRoute: 'Route 6 – JP Nagar', driver: 'Ramesh Patil', lastService: '2025-01-30', nextService: '2025-06-10', fitnessExpiry: '2025-08-15', status: 'Maintenance' },
  { id: '7', busNo: 'BUS-07', registration: 'KA-01-AB-1240', model: 'Force Traveller 26', capacity: 26, assignedRoute: 'Route 7 – BTM Layout', driver: 'Deepak Rao', lastService: '2025-05-10', nextService: '2025-08-10', fitnessExpiry: '2026-02-28', status: 'Active' },
  { id: '8', busNo: 'BUS-08', registration: 'KA-01-AB-1241', model: 'Tata Starbus 52', capacity: 52, assignedRoute: 'Route 8 – Electronic City', driver: 'Sanjay Mehta', lastService: '2025-03-05', nextService: '2025-06-05', fitnessExpiry: '2025-09-10', status: 'Idle' },
]

const STATUS_STYLES: Record<VehicleStatus, string> = {
  Active: 'bg-green-50 text-green-700',
  Maintenance: 'bg-orange-50 text-orange-700',
  Idle: 'bg-gray-100 text-gray-500',
}

const ROUTES = ['Route 1 – Whitefield', 'Route 2 – Koramangala', 'Route 3 – Indiranagar', 'Route 4 – Marathahalli', 'Route 5 – HSR Layout', 'Route 6 – JP Nagar', 'Route 7 – BTM Layout', 'Route 8 – Electronic City']

const EMPTY_FORM = { busNo: '', registration: '', model: '', capacity: '', assignedRoute: '', driver: '', lastService: '', nextService: '', fitnessExpiry: '', status: 'Active' as VehicleStatus }

function daysUntil(dateStr: string): number {
  const today = new Date()
  const target = new Date(dateStr)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'All' | VehicleStatus>('All')
  const [filterRoute, setFilterRoute] = useState('All')

  const total = vehicles.length
  const active = vehicles.filter(v => v.status === 'Active').length
  const maintenance = vehicles.filter(v => v.status === 'Maintenance').length

  const filtered = vehicles.filter(v => {
    const matchSearch = v.busNo.toLowerCase().includes(search.toLowerCase()) ||
      v.registration.toLowerCase().includes(search.toLowerCase()) ||
      v.driver.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || v.status === filterStatus
    const matchRoute = filterRoute === 'All' || v.assignedRoute === filterRoute
    return matchSearch && matchStatus && matchRoute
  })

  function handleAdd() {
    if (!form.busNo || !form.registration || !form.model) return
    const newVehicle: Vehicle = {
      id: String(Date.now()),
      busNo: form.busNo,
      registration: form.registration,
      model: form.model,
      capacity: Number(form.capacity) || 0,
      assignedRoute: form.assignedRoute,
      driver: form.driver,
      lastService: form.lastService,
      nextService: form.nextService,
      fitnessExpiry: form.fitnessExpiry,
      status: form.status,
    }
    setVehicles(prev => [newVehicle, ...prev])
    setForm(EMPTY_FORM)
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
          <p className="text-gray-500 text-sm mt-1">Bus fleet · fitness & service tracking</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Vehicles', value: total, icon: Bus, color: 'text-[#1e3a5f]', bg: 'bg-[#1e3a5f]/10' },
          { label: 'Active', value: active, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Under Maintenance', value: maintenance, icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search bus, registration, driver…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as 'All' | VehicleStatus)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#1e3a5f] bg-white">
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Idle">Idle</option>
          </select>
          <select value={filterRoute} onChange={e => setFilterRoute(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#1e3a5f] bg-white">
            <option value="All">All Routes</option>
            {ROUTES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Bus No</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Registration</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Model</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Capacity</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Route</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Driver</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Last Service</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Next Service</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Fitness Expiry</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(v => {
                const serviceIn = daysUntil(v.nextService)
                const fitnessIn = daysUntil(v.fitnessExpiry)
                const serviceSoon = serviceIn <= 30
                const fitnessSoon = fitnessIn <= 90
                return (
                  <tr key={v.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-900">{v.busNo}</td>
                    <td className="px-5 py-3.5 text-gray-700">{v.registration}</td>
                    <td className="px-5 py-3.5 text-gray-700">{v.model}</td>
                    <td className="px-5 py-3.5 text-gray-700">{v.capacity}</td>
                    <td className="px-5 py-3.5 text-gray-700 max-w-36 truncate">{v.assignedRoute}</td>
                    <td className="px-5 py-3.5 text-gray-700">{v.driver}</td>
                    <td className="px-5 py-3.5 text-gray-500">{formatDate(v.lastService)}</td>
                    <td className={`px-5 py-3.5 font-medium ${serviceSoon ? 'text-orange-600' : 'text-gray-700'}`}>
                      <span className="flex items-center gap-1">
                        {serviceSoon && <AlertTriangle className="w-3.5 h-3.5" />}
                        {formatDate(v.nextService)}
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 font-medium ${fitnessSoon ? 'text-red-600' : 'text-gray-700'}`}>
                      <span className="flex items-center gap-1">
                        {fitnessSoon && <AlertTriangle className="w-3.5 h-3.5" />}
                        {formatDate(v.fitnessExpiry)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[v.status]}`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">No vehicles match the current filters.</div>
          )}
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Add New Vehicle</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Bus Number', key: 'busNo', placeholder: 'BUS-09' },
                { label: 'Registration No', key: 'registration', placeholder: 'KA-01-AB-XXXX' },
                { label: 'Model', key: 'model', placeholder: 'Tata Starbus 52' },
                { label: 'Seating Capacity', key: 'capacity', placeholder: '52', type: 'number' },
                { label: 'Driver Name', key: 'driver', placeholder: 'Driver name' },
                { label: 'Last Service Date', key: 'lastService', placeholder: '', type: 'date' },
                { label: 'Next Service Date', key: 'nextService', placeholder: '', type: 'date' },
                { label: 'Fitness Certificate Expiry', key: 'fitnessExpiry', placeholder: '', type: 'date' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    value={(form as Record<string, string>)[field.key]}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Assigned Route</label>
                <select value={form.assignedRoute} onChange={e => setForm(prev => ({ ...prev, assignedRoute: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f] bg-white">
                  <option value="">Select route</option>
                  {ROUTES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value as VehicleStatus }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f] bg-white">
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Idle">Idle</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd}
                className="px-4 py-2 text-sm bg-[#1e3a5f] text-white rounded-xl hover:bg-[#163050] transition-colors">
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
