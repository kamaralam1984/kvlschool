'use client'
import React, { useState } from 'react'
import { Bus, MapPin, RefreshCw, Users, Clock, AlertTriangle, CheckCircle2, Wifi } from 'lucide-react'

type BusTrackStatus = 'On Route' | 'At Stop' | 'Delayed' | 'Completed'

interface TrackedBus {
  id: string
  busNo: string
  route: string
  driver: string
  lastLocation: string
  lastUpdate: string
  studentsOnBoard: number
  eta: string
  status: BusTrackStatus
  progress: number // 0-100
  stops: string[]
  currentStopIndex: number
}

const TRACKED_BUSES: TrackedBus[] = [
  {
    id: '1', busNo: 'BUS-01', route: 'Route 1 – Whitefield', driver: 'Rajan Kumar',
    lastLocation: 'Near Marathahalli Bridge', lastUpdate: '2 min ago',
    studentsOnBoard: 48, eta: '07:35 AM', status: 'On Route', progress: 60,
    stops: ['School Gate', 'Marathahalli Bridge', 'Kundalahalli Gate', 'ITPL Main Gate', 'Whitefield Junction'],
    currentStopIndex: 1,
  },
  {
    id: '2', busNo: 'BUS-02', route: 'Route 2 – Koramangala', driver: 'Suresh Nair',
    lastLocation: 'Ejipura Signal', lastUpdate: '1 min ago',
    studentsOnBoard: 45, eta: '07:20 AM', status: 'At Stop', progress: 40,
    stops: ['School Gate', 'Ejipura Signal', 'Koramangala 4th Block', 'Koramangala 6th Block'],
    currentStopIndex: 1,
  },
  {
    id: '3', busNo: 'BUS-03', route: 'Route 3 – Indiranagar', driver: 'Mohan Das',
    lastLocation: 'CMH Road', lastUpdate: '3 min ago',
    studentsOnBoard: 38, eta: '07:25 AM', status: 'On Route', progress: 75,
    stops: ['School Gate', 'Domlur Flyover', 'CMH Road', 'Indiranagar 100ft Road'],
    currentStopIndex: 2,
  },
  {
    id: '4', busNo: 'BUS-04', route: 'Route 4 – Marathahalli', driver: 'Vijay Singh',
    lastLocation: 'Silk Board Junction', lastUpdate: '5 min ago',
    studentsOnBoard: 50, eta: '07:55 AM (Delayed)', status: 'Delayed', progress: 30,
    stops: ['School Gate', 'Silk Board Junction', 'Bellandur', 'Marathahalli Main'],
    currentStopIndex: 1,
  },
  {
    id: '5', busNo: 'BUS-05', route: 'Route 5 – HSR Layout', driver: 'Anil Sharma',
    lastLocation: 'HSR Layout Sector 7', lastUpdate: 'Just now',
    studentsOnBoard: 36, eta: 'Arrived', status: 'Completed', progress: 100,
    stops: ['School Gate', 'BTM 2nd Stage', 'HSR Layout Sector 2', 'HSR Layout Sector 7'],
    currentStopIndex: 3,
  },
  {
    id: '6', busNo: 'BUS-07', route: 'Route 7 – BTM Layout', driver: 'Deepak Rao',
    lastLocation: 'BTM 1st Stage', lastUpdate: '4 min ago',
    studentsOnBoard: 35, eta: '07:30 AM', status: 'On Route', progress: 50,
    stops: ['School Gate', 'BTM 1st Stage', 'BTM 2nd Stage', 'BTM Layout Main'],
    currentStopIndex: 1,
  },
]

const STATUS_STYLES: Record<BusTrackStatus, string> = {
  'On Route': 'bg-green-50 text-green-700',
  'At Stop': 'bg-blue-50 text-blue-700',
  'Delayed': 'bg-red-50 text-red-700',
  'Completed': 'bg-gray-100 text-gray-500',
}

const STATUS_DOT: Record<BusTrackStatus, string> = {
  'On Route': 'bg-green-500',
  'At Stop': 'bg-blue-500',
  'Delayed': 'bg-red-500',
  'Completed': 'bg-gray-400',
}

// Simple route visualization colors per bus
const BUS_COLORS = ['#1e3a5f', '#d4a017', '#16a34a', '#dc2626', '#7c3aed', '#0891b2']

export default function TrackingPage() {
  const [buses] = useState<TrackedBus[]>(TRACKED_BUSES)
  const [selectedBus, setSelectedBus] = useState<TrackedBus | null>(buses[0])
  const [lastRefresh, setLastRefresh] = useState('09:15 AM')

  function handleRefresh() {
    const now = new Date()
    setLastRefresh(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
  }

  const onRoute = buses.filter(b => b.status === 'On Route').length
  const delayed = buses.filter(b => b.status === 'Delayed').length
  const completed = buses.filter(b => b.status === 'Completed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Bus Tracking</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time fleet monitoring · Last refreshed: {lastRefresh}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-100 rounded-xl text-xs text-yellow-700 font-medium">
            <Wifi className="w-3.5 h-3.5" /> GPS Simulation Mode
          </div>
          <button onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Buses', value: buses.length, icon: Bus, color: 'text-[#1e3a5f]', bg: 'bg-[#1e3a5f]/10' },
          { label: 'On Route', value: onRoute, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Delayed', value: delayed, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Completed', value: completed, icon: Clock, color: 'text-gray-500', bg: 'bg-gray-100' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bus List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Fleet Status</h3>
          {buses.map((bus, idx) => (
            <button
              key={bus.id}
              onClick={() => setSelectedBus(bus)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                selectedBus?.id === bus.id
                  ? 'border-[#1e3a5f]/40 bg-[#1e3a5f]/5'
                  : 'border-gray-100 bg-white hover:bg-gray-50/60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: BUS_COLORS[idx % BUS_COLORS.length] + '20' }}>
                    <Bus className="w-3.5 h-3.5" style={{ color: BUS_COLORS[idx % BUS_COLORS.length] }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{bus.busNo}</p>
                    <p className="text-xs text-gray-400">{bus.driver}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[bus.status]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[bus.status]}`} />
                  {bus.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {bus.lastLocation} · {bus.lastUpdate}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {bus.studentsOnBoard} students</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ETA: {bus.eta}</span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${bus.progress}%`, backgroundColor: BUS_COLORS[idx % BUS_COLORS.length] }}
                />
              </div>
              <p className="text-right text-xs text-gray-400 mt-1">{bus.progress}% of route</p>
            </button>
          ))}
        </div>

        {/* Map + Detail Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Map Placeholder */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="relative h-80 bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center">
              {/* Grid lines to simulate map */}
              <div className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              {/* Route visualization */}
              {selectedBus && (
                <div className="relative z-10 w-full px-12 py-6">
                  <div className="relative flex items-center justify-between">
                    {/* Route line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded -translate-y-1/2" />
                    <div
                      className="absolute top-1/2 left-0 h-1 rounded -translate-y-1/2 transition-all"
                      style={{ width: `${selectedBus.progress}%`, backgroundColor: '#1e3a5f' }}
                    />
                    {/* Stop dots */}
                    {selectedBus.stops.map((stop, i) => {
                      const isPast = i < selectedBus.currentStopIndex
                      const isCurrent = i === selectedBus.currentStopIndex
                      return (
                        <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                            isPast ? 'bg-[#1e3a5f] border-[#1e3a5f]' :
                            isCurrent ? 'bg-white border-[#1e3a5f] shadow-lg shadow-[#1e3a5f]/30 scale-125' :
                            'bg-white border-gray-300'
                          }`} />
                          <span className={`text-xs font-medium whitespace-nowrap max-w-16 text-center leading-tight ${
                            isCurrent ? 'text-[#1e3a5f] font-bold' : 'text-gray-500'
                          }`}>{stop}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Animated bus icon */}
                  <div
                    className="absolute top-1/2 -translate-y-8 -translate-x-1/2 transition-all"
                    style={{ left: `${selectedBus.progress}%` }}
                  >
                    <div className="w-8 h-8 bg-[#1e3a5f] rounded-full flex items-center justify-center shadow-lg">
                      <Bus className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              )}

              {/* GPS Notice */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <p className="text-xs text-gray-400 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200">
                  Connect GPS hardware for real-time tracking
                </p>
              </div>
            </div>
          </div>

          {/* Selected Bus Detail */}
          {selectedBus && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{selectedBus.busNo} · {selectedBus.route}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Driver: {selectedBus.driver}</p>
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${STATUS_STYLES[selectedBus.status]}`}>
                  <span className={`w-2 h-2 rounded-full ${STATUS_DOT[selectedBus.status]}`} />
                  {selectedBus.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-lg font-bold text-gray-900">{selectedBus.studentsOnBoard}</p>
                  <p className="text-xs text-gray-500">Students on board</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-lg font-bold text-gray-900">{selectedBus.eta}</p>
                  <p className="text-xs text-gray-500">ETA</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-lg font-bold text-gray-900">{selectedBus.progress}%</p>
                  <p className="text-xs text-gray-500">Route complete</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1e3a5f]" />
                  Last known location: <span className="font-medium text-gray-700 ml-1">{selectedBus.lastLocation}</span>
                  <span className="ml-1">· {selectedBus.lastUpdate}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
