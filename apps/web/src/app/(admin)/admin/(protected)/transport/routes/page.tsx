'use client'
import React, { useState } from 'react'
import { Route, Plus, X, MapPin, Bus, UserCheck, Users, Clock, ChevronDown, ChevronUp } from 'lucide-react'

interface Stop {
  name: string
  morningTime: string
  eveningTime: string
}

interface BusRoute {
  id: string
  routeName: string
  routeNo: string
  startPoint: string
  endPoint: string
  stops: Stop[]
  assignedBus: string
  driver: string
  studentsCount: number
  morningDeparture: string
  eveningDeparture: string
}

const MOCK_ROUTES: BusRoute[] = [
  {
    id: '1', routeNo: 'R1', routeName: 'Whitefield Route', startPoint: 'School Gate', endPoint: 'Whitefield Main Junction',
    stops: [
      { name: 'School Gate', morningTime: '06:30 AM', eveningTime: '04:00 PM' },
      { name: 'Marathahalli Bridge', morningTime: '06:50 AM', eveningTime: '04:20 PM' },
      { name: 'Kundalahalli Gate', morningTime: '07:05 AM', eveningTime: '04:35 PM' },
      { name: 'ITPL Main Gate', morningTime: '07:20 AM', eveningTime: '04:50 PM' },
      { name: 'Whitefield Main Junction', morningTime: '07:35 AM', eveningTime: '05:05 PM' },
    ],
    assignedBus: 'BUS-01 (KA-01-AB-1234)', driver: 'Rajan Kumar', studentsCount: 48, morningDeparture: '06:30 AM', eveningDeparture: '04:00 PM',
  },
  {
    id: '2', routeNo: 'R2', routeName: 'Koramangala Route', startPoint: 'School Gate', endPoint: 'Koramangala 6th Block',
    stops: [
      { name: 'School Gate', morningTime: '06:40 AM', eveningTime: '04:00 PM' },
      { name: 'Ejipura Signal', morningTime: '06:55 AM', eveningTime: '04:15 PM' },
      { name: 'Koramangala 4th Block', morningTime: '07:10 AM', eveningTime: '04:30 PM' },
      { name: 'Koramangala 6th Block', morningTime: '07:20 AM', eveningTime: '04:40 PM' },
    ],
    assignedBus: 'BUS-02 (KA-01-AB-1235)', driver: 'Suresh Nair', studentsCount: 45, morningDeparture: '06:40 AM', eveningDeparture: '04:00 PM',
  },
  {
    id: '3', routeNo: 'R3', routeName: 'Indiranagar Route', startPoint: 'School Gate', endPoint: 'Indiranagar 100ft Road',
    stops: [
      { name: 'School Gate', morningTime: '06:45 AM', eveningTime: '04:00 PM' },
      { name: 'Domlur Flyover', morningTime: '07:00 AM', eveningTime: '04:15 PM' },
      { name: 'CMH Road', morningTime: '07:15 AM', eveningTime: '04:30 PM' },
      { name: 'Indiranagar 100ft Road', morningTime: '07:25 AM', eveningTime: '04:40 PM' },
    ],
    assignedBus: 'BUS-03 (KA-01-AB-1236)', driver: 'Mohan Das', studentsCount: 38, morningDeparture: '06:45 AM', eveningDeparture: '04:00 PM',
  },
  {
    id: '4', routeNo: 'R4', routeName: 'HSR Layout Route', startPoint: 'School Gate', endPoint: 'HSR Layout Sector 7',
    stops: [
      { name: 'School Gate', morningTime: '06:35 AM', eveningTime: '04:00 PM' },
      { name: 'BTM 2nd Stage', morningTime: '06:50 AM', eveningTime: '04:15 PM' },
      { name: 'HSR Layout Sector 2', morningTime: '07:05 AM', eveningTime: '04:30 PM' },
      { name: 'HSR Layout Sector 5', morningTime: '07:15 AM', eveningTime: '04:40 PM' },
      { name: 'HSR Layout Sector 7', morningTime: '07:25 AM', eveningTime: '04:50 PM' },
    ],
    assignedBus: 'BUS-05 (KA-01-AB-1238)', driver: 'Anil Sharma', studentsCount: 36, morningDeparture: '06:35 AM', eveningDeparture: '04:00 PM',
  },
  {
    id: '5', routeNo: 'R5', routeName: 'Electronic City Route', startPoint: 'School Gate', endPoint: 'Electronic City Phase 2',
    stops: [
      { name: 'School Gate', morningTime: '06:20 AM', eveningTime: '04:00 PM' },
      { name: 'Silk Board Junction', morningTime: '06:40 AM', eveningTime: '04:20 PM' },
      { name: 'Electronic City Phase 1', morningTime: '07:00 AM', eveningTime: '04:40 PM' },
      { name: 'Electronic City Phase 2', morningTime: '07:15 AM', eveningTime: '04:55 PM' },
    ],
    assignedBus: 'BUS-08 (KA-01-AB-1241)', driver: 'Sanjay Mehta', studentsCount: 49, morningDeparture: '06:20 AM', eveningDeparture: '04:00 PM',
  },
  {
    id: '6', routeNo: 'R6', routeName: 'Hebbal Route', startPoint: 'School Gate', endPoint: 'Hebbal Flyover',
    stops: [
      { name: 'School Gate', morningTime: '06:25 AM', eveningTime: '04:00 PM' },
      { name: 'Mekhri Circle', morningTime: '06:45 AM', eveningTime: '04:20 PM' },
      { name: 'Nagawara Junction', morningTime: '07:00 AM', eveningTime: '04:35 PM' },
      { name: 'Hebbal Flyover', morningTime: '07:20 AM', eveningTime: '04:55 PM' },
    ],
    assignedBus: 'BUS-10 (KA-01-AB-1243)', driver: 'Pradeep Kumar', studentsCount: 51, morningDeparture: '06:25 AM', eveningDeparture: '04:00 PM',
  },
]

const BUSES = ['BUS-01 (KA-01-AB-1234)', 'BUS-02 (KA-01-AB-1235)', 'BUS-03 (KA-01-AB-1236)', 'BUS-05 (KA-01-AB-1238)', 'BUS-07 (KA-01-AB-1240)', 'BUS-08 (KA-01-AB-1241)', 'BUS-10 (KA-01-AB-1243)']
const DRIVERS = ['Rajan Kumar', 'Suresh Nair', 'Mohan Das', 'Vijay Singh', 'Anil Sharma', 'Ramesh Patil', 'Deepak Rao', 'Sanjay Mehta']

const EMPTY_STOP: Stop = { name: '', morningTime: '', eveningTime: '' }

export default function RoutesPage() {
  const [routes, setRoutes] = useState<BusRoute[]>(MOCK_ROUTES)
  const [showModal, setShowModal] = useState(false)
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null)
  const [form, setForm] = useState({
    routeNo: '', routeName: '', startPoint: '', endPoint: '',
    assignedBus: '', driver: '', morningDeparture: '', eveningDeparture: '',
    studentsCount: '',
  })
  const [stops, setStops] = useState<Stop[]>([{ ...EMPTY_STOP }])

  function addStop() {
    setStops(prev => [...prev, { ...EMPTY_STOP }])
  }

  function removeStop(i: number) {
    setStops(prev => prev.filter((_, idx) => idx !== i))
  }

  function updateStop(i: number, field: keyof Stop, value: string) {
    setStops(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s))
  }

  function handleAdd() {
    if (!form.routeNo || !form.routeName || !form.startPoint) return
    const newRoute: BusRoute = {
      id: String(Date.now()),
      routeNo: form.routeNo,
      routeName: form.routeName,
      startPoint: form.startPoint,
      endPoint: form.endPoint,
      stops: stops.filter(s => s.name),
      assignedBus: form.assignedBus,
      driver: form.driver,
      studentsCount: Number(form.studentsCount) || 0,
      morningDeparture: form.morningDeparture,
      eveningDeparture: form.eveningDeparture,
    }
    setRoutes(prev => [newRoute, ...prev])
    setForm({ routeNo: '', routeName: '', startPoint: '', endPoint: '', assignedBus: '', driver: '', morningDeparture: '', eveningDeparture: '', studentsCount: '' })
    setStops([{ ...EMPTY_STOP }])
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Route Management</h1>
          <p className="text-gray-500 text-sm mt-1">{routes.length} active routes configured</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Plus className="w-4 h-4" /> Add Route
        </button>
      </div>

      {/* Route Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {routes.map(route => {
          const isExpanded = expandedRoute === route.id
          return (
            <div key={route.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full">{route.routeNo}</span>
                      <h3 className="text-sm font-semibold text-gray-900">{route.routeName}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-green-500" />
                      <span className="font-medium text-gray-700">{route.startPoint}</span>
                      <span>→</span>
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span className="font-medium text-gray-700">{route.endPoint}</span>
                    </div>
                  </div>
                  <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
                    {route.stops.length} stops
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mt-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Bus className="w-3.5 h-3.5 text-[#1e3a5f]" />
                    <span>{route.assignedBus}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <UserCheck className="w-3.5 h-3.5 text-[#1e3a5f]" />
                    <span>{route.driver}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-3.5 h-3.5 text-[#1e3a5f]" />
                    <span>{route.studentsCount} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-[#1e3a5f]" />
                    <span>Mor: {route.morningDeparture} · Eve: {route.eveningDeparture}</span>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedRoute(isExpanded ? null : route.id)}
                  className="mt-4 w-full flex items-center justify-center gap-1 text-xs text-[#1e3a5f] font-medium py-2 border border-[#1e3a5f]/20 rounded-xl hover:bg-[#1e3a5f]/5 transition-colors"
                >
                  {isExpanded ? 'Hide' : 'View'} Full Stop List
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Stops Detail */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50/40 px-5 py-4">
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Stop Schedule</p>
                  <div className="space-y-2">
                    {route.stops.map((stop, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full border-2 ${i === 0 ? 'bg-green-500 border-green-500' : i === route.stops.length - 1 ? 'bg-red-400 border-red-400' : 'bg-white border-[#1e3a5f]'}`} />
                          {i < route.stops.length - 1 && <div className="w-0.5 h-5 bg-gray-200 mt-0.5" />}
                        </div>
                        <div className="flex-1 flex items-center justify-between pb-2">
                          <span className="text-sm text-gray-800 font-medium">{stop.name}</span>
                          <div className="text-xs text-gray-500 flex gap-3">
                            <span className="text-green-700">↑ {stop.morningTime}</span>
                            <span className="text-blue-600">↓ {stop.eveningTime}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add Route Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Add New Route</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Route Number', key: 'routeNo', placeholder: 'R7' },
                  { label: 'Route Name', key: 'routeName', placeholder: 'Yelahanka Route' },
                  { label: 'Start Point', key: 'startPoint', placeholder: 'School Gate' },
                  { label: 'End Point', key: 'endPoint', placeholder: 'Final destination' },
                  { label: 'Morning Departure', key: 'morningDeparture', placeholder: '06:30 AM' },
                  { label: 'Evening Departure', key: 'eveningDeparture', placeholder: '04:00 PM' },
                  { label: 'Students Count', key: 'studentsCount', placeholder: '45', type: 'number' },
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
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Driver</label>
                  <select value={form.driver} onChange={e => setForm(prev => ({ ...prev, driver: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a5f] bg-white">
                    <option value="">Select driver</option>
                    {DRIVERS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Stops */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Stops</label>
                  <button onClick={addStop}
                    className="flex items-center gap-1 text-xs text-[#1e3a5f] font-medium px-3 py-1.5 border border-[#1e3a5f]/30 rounded-lg hover:bg-[#1e3a5f]/5">
                    <Plus className="w-3.5 h-3.5" /> Add Stop
                  </button>
                </div>
                <div className="space-y-3">
                  {stops.map((stop, i) => (
                    <div key={i} className="flex gap-2 items-center p-3 bg-gray-50 rounded-xl">
                      <span className="w-5 h-5 bg-[#1e3a5f] text-white rounded-full text-xs flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      <input
                        placeholder="Stop name"
                        value={stop.name}
                        onChange={e => updateStop(i, 'name', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1e3a5f] bg-white"
                      />
                      <input
                        placeholder="Morning"
                        value={stop.morningTime}
                        onChange={e => updateStop(i, 'morningTime', e.target.value)}
                        className="w-24 px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1e3a5f] bg-white"
                      />
                      <input
                        placeholder="Evening"
                        value={stop.eveningTime}
                        onChange={e => updateStop(i, 'eveningTime', e.target.value)}
                        className="w-24 px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1e3a5f] bg-white"
                      />
                      {stops.length > 1 && (
                        <button onClick={() => removeStop(i)} className="text-gray-400 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd}
                className="px-4 py-2 text-sm bg-[#1e3a5f] text-white rounded-xl hover:bg-[#163050] transition-colors">
                Add Route
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
