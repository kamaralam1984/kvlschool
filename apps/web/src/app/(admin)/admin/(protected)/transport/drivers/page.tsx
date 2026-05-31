'use client'
import React, { useState } from 'react'
import { UserCheck, Plus, X, Search, AlertTriangle, Eye, Phone, Shield, Clock } from 'lucide-react'

type DriverStatus = 'Active' | 'On Leave' | 'Suspended'

interface Driver {
  id: string
  driverId: string
  name: string
  phone: string
  licenseNo: string
  licenseExpiry: string
  assignedBus: string
  assignedRoute: string
  experience: string
  status: DriverStatus
  address: string
  joinDate: string
}

const MOCK_DRIVERS: Driver[] = [
  { id: '1', driverId: 'DRV-001', name: 'Rajan Kumar', phone: '9845012345', licenseNo: 'KA0120190012345', licenseExpiry: '2026-08-15', assignedBus: 'BUS-01', assignedRoute: 'Route 1 – Whitefield', experience: '8 years', status: 'Active', address: '12, 3rd Cross, Rajajinagar, Bangalore', joinDate: '2017-06-01' },
  { id: '2', driverId: 'DRV-002', name: 'Suresh Nair', phone: '9741023456', licenseNo: 'KA0120180023456', licenseExpiry: '2025-07-20', assignedBus: 'BUS-02', assignedRoute: 'Route 2 – Koramangala', experience: '11 years', status: 'Active', address: '45, 7th Main, Malleshwaram, Bangalore', joinDate: '2016-03-15' },
  { id: '3', driverId: 'DRV-003', name: 'Mohan Das', phone: '9632034567', licenseNo: 'KA0120210034567', licenseExpiry: '2027-01-10', assignedBus: 'BUS-03', assignedRoute: 'Route 3 – Indiranagar', experience: '5 years', status: 'Active', address: '78, 1st Block, Jayanagar, Bangalore', joinDate: '2020-01-10' },
  { id: '4', driverId: 'DRV-004', name: 'Vijay Singh', phone: '9523045678', licenseNo: 'KA0120160045678', licenseExpiry: '2025-09-05', assignedBus: 'BUS-04', assignedRoute: 'Route 4 – Marathahalli', experience: '14 years', status: 'Active', address: '23, 5th Phase, JP Nagar, Bangalore', joinDate: '2014-07-20' },
  { id: '5', driverId: 'DRV-005', name: 'Anil Sharma', phone: '9414056789', licenseNo: 'KA0120200056789', licenseExpiry: '2026-11-30', assignedBus: 'BUS-05', assignedRoute: 'Route 5 – HSR Layout', experience: '7 years', status: 'Active', address: '56, 4th Cross, Basavanagudi, Bangalore', joinDate: '2018-09-05' },
  { id: '6', driverId: 'DRV-006', name: 'Ramesh Patil', phone: '9305067890', licenseNo: 'KA0120170067890', licenseExpiry: '2025-06-15', assignedBus: 'BUS-06', assignedRoute: 'Route 6 – JP Nagar', experience: '12 years', status: 'On Leave', address: '89, 2nd Stage, Vijayanagar, Bangalore', joinDate: '2015-11-12' },
  { id: '7', driverId: 'DRV-007', name: 'Deepak Rao', phone: '9196078901', licenseNo: 'KA0120220078901', licenseExpiry: '2028-03-22', assignedBus: 'BUS-07', assignedRoute: 'Route 7 – BTM Layout', experience: '3 years', status: 'Active', address: '34, 9th Cross, Yelahanka New Town, Bangalore', joinDate: '2022-04-01' },
  { id: '8', driverId: 'DRV-008', name: 'Sanjay Mehta', phone: '9087089012', licenseNo: 'KA0120150089012', licenseExpiry: '2025-08-10', assignedBus: 'BUS-08', assignedRoute: 'Route 8 – Electronic City', experience: '16 years', status: 'Active', address: '67, 6th Block, Koramangala, Bangalore', joinDate: '2013-02-28' },
]

const STATUS_STYLES: Record<DriverStatus, string> = {
  Active: 'bg-green-50 text-green-700',
  'On Leave': 'bg-yellow-50 text-yellow-700',
  Suspended: 'bg-red-50 text-red-700',
}

const BUSES = ['BUS-01', 'BUS-02', 'BUS-03', 'BUS-04', 'BUS-05', 'BUS-06', 'BUS-07', 'BUS-08']
const ROUTES = ['Route 1 – Whitefield', 'Route 2 – Koramangala', 'Route 3 – Indiranagar', 'Route 4 – Marathahalli', 'Route 5 – HSR Layout', 'Route 6 – JP Nagar', 'Route 7 – BTM Layout', 'Route 8 – Electronic City']

const EMPTY_FORM = { driverId: '', name: '', phone: '', licenseNo: '', licenseExpiry: '', assignedBus: '', assignedRoute: '', experience: '', status: 'Active' as DriverStatus, address: '', joinDate: '' }

function daysUntil(dateStr: string): number {
  return Math.round((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS)
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewDriver, setViewDriver] = useState<Driver | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'All' | DriverStatus>('All')

  const filtered = drivers.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.driverId.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNo.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || d.status === filterStatus
    return matchSearch && matchStatus
  })

  function handleAdd() {
    if (!form.name || !form.licenseNo) return
    setDrivers(prev => [{ id: String(Date.now()), ...form }, ...prev])
    setForm(EMPTY_FORM)
    setShowAddModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
          <p className="text-gray-500 text-sm mt-1">{drivers.length} drivers registered</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Plus className="w-4 h-4" /> Add Driver
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Drivers', value: drivers.length, icon: UserCheck, color: 'text-[#1e3a5f]', bg: 'bg-[#1e3a5f]/10' },
          { label: 'On Duty', value: drivers.filter(d => d.status === 'Active').length, icon: Shield, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'License Expiring Soon', value: drivers.filter(d => daysUntil(d.licenseExpiry) <= 60).length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
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
            placeholder="Search driver, ID, license…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f]"
          />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as 'All' | DriverStatus)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#1e3a5f] bg-white">
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Driver ID</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Name</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Phone</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">License No</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">License Expiry</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Assigned Bus</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Route</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Experience</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Status</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(driver => {
                const expDays = daysUntil(driver.licenseExpiry)
                const expiringSoon = expDays <= 60
                return (
                  <tr key={driver.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[#1e3a5f]">{driver.driverId}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-900">{driver.name}</td>
                    <td className="px-5 py-3.5 text-gray-600">
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{driver.phone}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 font-mono text-xs">{driver.licenseNo}</td>
                    <td className={`px-5 py-3.5 font-medium ${expiringSoon ? 'text-red-600' : 'text-gray-700'}`}>
                      <span className="flex items-center gap-1">
                        {expiringSoon && <AlertTriangle className="w-3.5 h-3.5" />}
                        {formatDate(driver.licenseExpiry)}
                        {expiringSoon && <span className="text-xs">({expDays}d)</span>}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{driver.assignedBus}</td>
                    <td className="px-5 py-3.5 text-gray-600 max-w-36 truncate">{driver.assignedRoute}</td>
                    <td className="px-5 py-3.5 text-gray-600">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{driver.experience}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[driver.status]}`}>
                        {driver.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setViewDriver(driver)}
                        className="flex items-center gap-1 text-xs text-[#1e3a5f] hover:underline font-medium">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">No drivers match the current filters.</div>
          )}
        </div>
      </div>

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Add New Driver</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Driver ID', key: 'driverId', placeholder: 'DRV-009' },
                { label: 'Full Name', key: 'name', placeholder: 'Driver full name' },
                { label: 'Phone Number', key: 'phone', placeholder: '98XXXXXXXX' },
                { label: 'License Number', key: 'licenseNo', placeholder: 'KA01XXXXXXXXXX' },
                { label: 'License Expiry', key: 'licenseExpiry', type: 'date', placeholder: '' },
                { label: 'Experience', key: 'experience', placeholder: '5 years' },
                { label: 'Date of Joining', key: 'joinDate', type: 'date', placeholder: '' },
                { label: 'Address', key: 'address', placeholder: 'Full address' },
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
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Assigned Bus</label>
                <select value={form.assignedBus} onChange={e => setForm(prev => ({ ...prev, assignedBus: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f] bg-white">
                  <option value="">Select bus</option>
                  {BUSES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
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
                <select value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value as DriverStatus }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f] bg-white">
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd}
                className="px-4 py-2 text-sm bg-[#1e3a5f] text-white rounded-xl hover:bg-[#163050] transition-colors">
                Add Driver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {viewDriver && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Driver Profile</h2>
              <button onClick={() => setViewDriver(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-[#1e3a5f]/10 rounded-2xl flex items-center justify-center">
                  <UserCheck className="w-7 h-7 text-[#1e3a5f]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{viewDriver.name}</h3>
                  <p className="text-sm text-gray-500">{viewDriver.driverId}</p>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_STYLES[viewDriver.status]}`}>
                    {viewDriver.status}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Phone', value: viewDriver.phone },
                  { label: 'License No', value: viewDriver.licenseNo },
                  { label: 'License Expiry', value: formatDate(viewDriver.licenseExpiry) },
                  { label: 'Assigned Bus', value: viewDriver.assignedBus },
                  { label: 'Assigned Route', value: viewDriver.assignedRoute },
                  { label: 'Experience', value: viewDriver.experience },
                  { label: 'Date of Joining', value: formatDate(viewDriver.joinDate) },
                  { label: 'Address', value: viewDriver.address },
                ].map(row => (
                  <div key={row.label} className="flex gap-3">
                    <span className="text-xs text-gray-400 w-32 flex-shrink-0 pt-0.5">{row.label}</span>
                    <span className="text-sm text-gray-800 font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
