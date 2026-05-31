'use client'
import React, { useState } from 'react'
import { Home, Users, BedDouble, AlertCircle, Plus, X, ChevronDown, Filter, User, UtensilsCrossed } from 'lucide-react'

type RoomType = 'Single' | 'Double' | 'Triple'
type OccupancyStatus = 'Full' | 'Partial' | 'Vacant'

interface Room {
  id: string; roomNo: string; floor: number; type: RoomType
  capacity: number; occupied: number; boarders: string[]
}

interface Complaint {
  id: string; boarder: string; room: string; issue: string; date: string; status: 'Open' | 'Resolved'
}

const MOCK_ROOMS: Room[] = [
  { id:'1', roomNo:'101', floor:1, type:'Double', capacity:2, occupied:2, boarders:['Arjun Mehta','Rahul Sharma'] },
  { id:'2', roomNo:'102', floor:1, type:'Triple', capacity:3, occupied:3, boarders:['Sneha Patel','Pooja Verma','Ananya Singh'] },
  { id:'3', roomNo:'103', floor:1, type:'Single', capacity:1, occupied:1, boarders:['Dev Kumar'] },
  { id:'4', roomNo:'201', floor:2, type:'Double', capacity:2, occupied:1, boarders:['Rohan Das'] },
  { id:'5', roomNo:'202', floor:2, type:'Triple', capacity:3, occupied:0, boarders:[] },
  { id:'6', roomNo:'203', floor:2, type:'Double', capacity:2, occupied:2, boarders:['Priya Nair','Lakshmi Rao'] },
  { id:'7', roomNo:'301', floor:3, type:'Single', capacity:1, occupied:0, boarders:[] },
  { id:'8', roomNo:'302', floor:3, type:'Triple', capacity:3, occupied:2, boarders:['Vishal Gupta','Amit Joshi'] },
]

const MOCK_COMPLAINTS: Complaint[] = [
  { id:'1', boarder:'Arjun Mehta', room:'101', issue:'AC not working properly', date:'2025-01-20', status:'Open' },
  { id:'2', boarder:'Sneha Patel', room:'102', issue:'Leaking tap in bathroom', date:'2025-01-18', status:'Open' },
  { id:'3', boarder:'Rohan Das', room:'201', issue:'Window latch broken', date:'2025-01-15', status:'Resolved' },
  { id:'4', boarder:'Dev Kumar', room:'103', issue:'Light bulb fused', date:'2025-01-22', status:'Open' },
]

const MESS_SCHEDULE = [
  { meal:'Breakfast', time:'7:00 AM – 8:30 AM', menu:'Idli, Sambar, Chutney, Milk' },
  { meal:'Lunch', time:'12:30 PM – 2:00 PM', menu:'Rice, Dal, Sabzi, Roti, Salad, Curd' },
  { meal:'Snacks', time:'5:00 PM – 5:30 PM', menu:'Tea/Coffee, Biscuits, Fruits' },
  { meal:'Dinner', time:'7:30 PM – 9:00 PM', menu:'Chapati, Sabzi, Rice, Dal, Dessert' },
]

const typeColor: Record<RoomType, string> = {
  Single: 'bg-blue-50 text-blue-700',
  Double: 'bg-purple-50 text-purple-700',
  Triple: 'bg-orange-50 text-orange-700',
}

function occupancyStatus(room: Room): OccupancyStatus {
  if (room.occupied === 0) return 'Vacant'
  if (room.occupied === room.capacity) return 'Full'
  return 'Partial'
}

const occColor: Record<OccupancyStatus, string> = {
  Full: 'bg-green-50 text-green-700',
  Partial: 'bg-yellow-50 text-yellow-700',
  Vacant: 'bg-gray-100 text-gray-500',
}

const emptyForm = { studentName: '', roomNo: '' }

export default function HostelPage() {
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS)
  const [floorFilter, setFloorFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [occFilter, setOccFilter] = useState('All')
  const [showAssign, setShowAssign] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })
  const [viewRoom, setViewRoom] = useState<Room | null>(null)

  const floors = ['All', '1', '2', '3']
  const types: Array<'All' | RoomType> = ['All', 'Single', 'Double', 'Triple']
  const occStatuses: Array<'All' | OccupancyStatus> = ['All', 'Full', 'Partial', 'Vacant']

  const filtered = rooms.filter(r =>
    (floorFilter === 'All' || r.floor === Number(floorFilter)) &&
    (typeFilter === 'All' || r.type === typeFilter) &&
    (occFilter === 'All' || occupancyStatus(r) === occFilter)
  )

  const totalBoarders = rooms.reduce((s, r) => s + r.occupied, 0)
  const totalCapacity = rooms.reduce((s, r) => s + r.capacity, 0)
  const occupied = rooms.filter(r => r.occupied > 0).length
  const vacant = rooms.filter(r => r.occupied === 0).length

  function handleAssign() {
    setRooms(prev => prev.map(r => {
      if (r.roomNo === form.roomNo && r.occupied < r.capacity) {
        return { ...r, occupied: r.occupied + 1, boarders: [...r.boarders, form.studentName] }
      }
      return r
    }))
    setShowAssign(false)
    setForm({ ...emptyForm })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hostel Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage rooms, boarders, and facilities</p>
        </div>
        <button onClick={() => setShowAssign(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Plus className="w-4 h-4" /> Assign Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Total Rooms', value:'120', sub:'All floors', icon: Home, color:'bg-blue-50 text-blue-600' },
          { label:'Occupied', value:String(occupied), sub:`${totalBoarders} boarders`, icon: BedDouble, color:'bg-green-50 text-green-600' },
          { label:'Vacant', value:String(vacant + 112), sub:'Available rooms', icon: Home, color:'bg-yellow-50 text-yellow-600' },
          { label:'Total Boarders', value:'196', sub:`of ${totalCapacity + 316} capacity`, icon: Users, color:'bg-purple-50 text-purple-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Warden & Mess */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Warden Info */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-[#1e3a5f]" /> Warden Information
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1e3a5f]/10 flex items-center justify-center">
              <User className="w-6 h-6 text-[#1e3a5f]" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Mr. Subramaniam K.</p>
              <p className="text-sm text-gray-500">Chief Warden</p>
            </div>
          </div>
          <div className="space-y-2">
            {[['Phone','9876501234'],['Email','warden@kvlschool.edu'],['Office','Room 001, Ground Floor'],['Duty Hours','6:00 AM – 10:00 PM']].map(([k, v]) => (
              <div key={k} className="flex gap-2 text-sm">
                <span className="text-gray-400 w-24 flex-shrink-0">{k}:</span>
                <span className="text-gray-700 font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mess Schedule */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-[#1e3a5f]" /> Mess Schedule — Today
          </h3>
          <div className="space-y-3">
            {MESS_SCHEDULE.map(m => (
              <div key={m.meal} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-[#d4a017] mt-1.5 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{m.meal}</p>
                    <span className="text-xs text-gray-400">{m.time}</span>
                  </div>
                  <p className="text-xs text-gray-500">{m.menu}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-gray-400" />
        {[
          { label:'Floor', val: floorFilter, set: setFloorFilter, opts: floors },
          { label:'Type', val: typeFilter, set: setTypeFilter, opts: types },
          { label:'Occupancy', val: occFilter, set: setOccFilter, opts: occStatuses },
        ].map(f => (
          <div key={f.label} className="relative">
            <select value={f.val} onChange={e => f.set(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#1e3a5f]/40 bg-white cursor-pointer">
              {f.opts.map(o => <option key={String(o)}>{o === 'All' ? `${f.label}: All` : (f.label === 'Floor' && o !== 'All' ? `Floor ${o}` : o)}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        ))}
        <p className="ml-auto text-sm text-gray-500">{filtered.length} rooms</p>
      </div>

      {/* Room Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Room No','Floor','Type','Capacity','Occupied','Boarders','Status','Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-bold text-gray-900">{r.roomNo}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">Floor {r.floor}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColor[r.type]}`}>{r.type}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">{r.capacity}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{r.occupied}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 max-w-[200px]">
                    {r.boarders.length > 0 ? (
                      <p className="truncate">{r.boarders.join(', ')}</p>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${occColor[occupancyStatus(r)]}`}>{occupancyStatus(r)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => setViewRoom(r)} className="px-2 py-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors text-xs">View</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400">No rooms match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" /> Recent Complaints
        </h3>
        <div className="space-y-2">
          {MOCK_COMPLAINTS.map(c => (
            <div key={c.id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.status === 'Open' ? 'bg-red-500' : 'bg-green-500'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{c.boarder} <span className="text-gray-400 font-normal">· Room {c.room}</span></p>
                <p className="text-xs text-gray-500">{c.issue}</p>
              </div>
              <span className="text-xs text-gray-400">{c.date}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'Open' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{c.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* View Room Modal */}
      {viewRoom && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Room {viewRoom.roomNo} Details</h2>
              <button onClick={() => setViewRoom(null)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[['Floor', `Floor ${viewRoom.floor}`],['Type', viewRoom.type],['Status', occupancyStatus(viewRoom)]].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">{k}</p>
                    <p className="text-sm font-bold text-gray-900">{v}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-500">Occupancy</span>
                  <span className="font-bold text-gray-900">{viewRoom.occupied} / {viewRoom.capacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#1e3a5f] h-2 rounded-full" style={{ width: `${(viewRoom.occupied / viewRoom.capacity) * 100}%` }} />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Boarders</p>
                {viewRoom.boarders.length > 0 ? (
                  <div className="space-y-2">
                    {viewRoom.boarders.map((b, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 text-[#1e3a5f]" />
                        </div>
                        <p className="text-sm text-gray-800">{b}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-400">No boarders assigned</p>}
              </div>
            </div>
            <div className="flex justify-end p-6 border-t border-gray-100">
              <button onClick={() => setViewRoom(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Student Modal */}
      {showAssign && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Assign Student to Room</h2>
              <button onClick={() => setShowAssign(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Student Name</label>
                <input value={form.studentName} onChange={e => setForm(p => ({ ...p, studentName: e.target.value }))}
                  placeholder="Enter student full name"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Select Room</label>
                <div className="relative">
                  <select value={form.roomNo} onChange={e => setForm(p => ({ ...p, roomNo: e.target.value }))}
                    className="w-full appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 bg-white">
                    <option value="">Select a room…</option>
                    {rooms.filter(r => r.occupied < r.capacity).map(r => (
                      <option key={r.id} value={r.roomNo}>Room {r.roomNo} — Floor {r.floor} ({r.type}) [{r.occupied}/{r.capacity}]</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowAssign(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleAssign} disabled={!form.studentName || !form.roomNo}
                className="px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Assign Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
