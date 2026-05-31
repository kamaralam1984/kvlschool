'use client'

import { useState } from 'react'
import {
  Search, Filter, ChevronDown, X, ShoppingCart,
  Clock, TruckIcon, CheckCircle, XCircle, Package,
  MapPin, CreditCard, User, Phone
} from 'lucide-react'

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
type PaymentMode = 'Online' | 'COD'

interface OrderItem {
  name: string
  qty: number
  price: number
}

interface Order {
  id: string
  customer: string
  role: string
  phone: string
  address: string
  items: OrderItem[]
  total: number
  payment: PaymentMode
  date: string
  status: OrderStatus
  placedAt: string
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-600',
}

const STATUS_ICONS: Record<OrderStatus, React.ElementType> = {
  Pending: Clock,
  Processing: Package,
  Shipped: TruckIcon,
  Delivered: CheckCircle,
  Cancelled: XCircle,
}

const STATUSES: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

const initialOrders: Order[] = [
  { id: 'KVL-1042', customer: 'Priya Sharma', role: 'Parent', phone: '9876543210', address: '12, Rose Garden, Sector 14, Gurugram, HR 122001', items: [{ name: 'Class 8 Book Set (CBSE)', qty: 1, price: 640 }, { name: 'School Stationery Kit', qty: 2, price: 240 }], total: 1120, payment: 'Online', date: '31 May 2025, 09:12 AM', status: 'Pending', placedAt: '2025-05-31T09:12:00' },
  { id: 'KVL-1041', customer: 'Rajan Mehta', role: 'Parent', phone: '9871234560', address: '45, Green Vihar, Dwarka, New Delhi 110075', items: [{ name: 'School Uniform (Summer)', qty: 2, price: 430 }], total: 860, payment: 'COD', date: '31 May 2025, 08:34 AM', status: 'Processing', placedAt: '2025-05-31T08:34:00' },
  { id: 'KVL-1040', customer: 'Sneha Patel', role: 'Student', phone: '9988776655', address: '7, Laxmi Nagar, Noida, UP 201301', items: [{ name: 'School Stationery Kit', qty: 1, price: 240 }, { name: 'Geometry Box Set', qty: 1, price: 95 }], total: 335, payment: 'Online', date: '31 May 2025, 07:55 AM', status: 'Shipped', placedAt: '2025-05-31T07:55:00' },
  { id: 'KVL-1039', customer: 'Arjun Nair', role: 'Parent', phone: '8800112233', address: '23, Koramangala 5th Block, Bengaluru, KA 560095', items: [{ name: 'Class 10 Maths Formula Book', qty: 3, price: 120 }, { name: 'Class 12 Chemistry Notes', qty: 1, price: 180 }], total: 540, payment: 'Online', date: '30 May 2025, 06:20 PM', status: 'Delivered', placedAt: '2025-05-30T18:20:00' },
  { id: 'KVL-1038', customer: 'Kavya Reddy', role: 'Student', phone: '7799001122', address: '55, Film Nagar, Hyderabad, TS 500033', items: [{ name: 'School Kit — New Admission', qty: 1, price: 1200 }, { name: 'Geometry Box Set', qty: 2, price: 95 }], total: 1390, payment: 'Online', date: '30 May 2025, 03:15 PM', status: 'Delivered', placedAt: '2025-05-30T15:15:00' },
  { id: 'KVL-1037', customer: 'Mohit Agarwal', role: 'Parent', phone: '9090909090', address: '88, Civil Lines, Jaipur, RJ 302006', items: [{ name: 'Winter Uniform Blazer (L)', qty: 1, price: 980 }], total: 980, payment: 'COD', date: '30 May 2025, 11:00 AM', status: 'Processing', placedAt: '2025-05-30T11:00:00' },
  { id: 'KVL-1036', customer: 'Deepika Singh', role: 'Parent', phone: '6677889900', address: '3, Aliganj, Lucknow, UP 226024', items: [{ name: 'Digital Study Pack — Class 10', qty: 1, price: 499 }], total: 499, payment: 'Online', date: '29 May 2025, 08:45 PM', status: 'Delivered', placedAt: '2025-05-29T20:45:00' },
  { id: 'KVL-1035', customer: 'Vikram Bose', role: 'Parent', phone: '9123456780', address: '14, Salt Lake City, Kolkata, WB 700064', items: [{ name: 'Class 10 Book Set (CBSE)', qty: 1, price: 750 }], total: 750, payment: 'Online', date: '29 May 2025, 02:00 PM', status: 'Shipped', placedAt: '2025-05-29T14:00:00' },
  { id: 'KVL-1034', customer: 'Anjali Verma', role: 'Student', phone: '9988001122', address: '6, Shyam Nagar, Kanpur, UP 208013', items: [{ name: 'Class 8 Book Set (CBSE)', qty: 1, price: 640 }, { name: 'School Stationery Kit', qty: 1, price: 240 }], total: 880, payment: 'COD', date: '28 May 2025, 04:30 PM', status: 'Cancelled', placedAt: '2025-05-28T16:30:00' },
  { id: 'KVL-1033', customer: 'Suresh Kumar', role: 'Parent', phone: '8888777766', address: '21, T Nagar, Chennai, TN 600017', items: [{ name: 'PE Sports Kit', qty: 2, price: 360 }], total: 720, payment: 'Online', date: '28 May 2025, 10:10 AM', status: 'Cancelled', placedAt: '2025-05-28T10:10:00' },
]

function getTimeline(status: OrderStatus, placedAt: string): { label: string; done: boolean; time?: string }[] {
  const base = new Date(placedAt)
  const fmt = (d: Date) => d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  const add = (h: number) => new Date(base.getTime() + h * 3600000)
  const steps: { label: string; doneStatuses: OrderStatus[]; time?: string }[] = [
    { label: 'Order Placed', doneStatuses: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], time: fmt(base) },
    { label: 'Order Confirmed', doneStatuses: ['Processing', 'Shipped', 'Delivered'], time: fmt(add(1)) },
    { label: 'Shipped', doneStatuses: ['Shipped', 'Delivered'], time: fmt(add(24)) },
    { label: 'Delivered', doneStatuses: ['Delivered'], time: fmt(add(72)) },
  ]
  return steps.map(s => ({ label: s.label, done: s.doneStatuses.includes(status), time: s.done ? s.time : undefined }))
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filtered = orders.filter(o =>
    (statusFilter === 'All' || o.status === statusFilter) &&
    (o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()))
  )

  const todayOrders = orders.filter(o => o.date.includes('31 May'))
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0)
  const pending = orders.filter(o => o.status === 'Pending' || o.status === 'Processing')

  function updateStatus(id: string, status: OrderStatus) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    if (selectedOrder?.id === id) setSelectedOrder(prev => prev ? { ...prev, status } : null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and fulfil all store orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="text-sm text-gray-500 mb-1">Orders Today</p>
          <p className="text-2xl font-bold text-gray-900">{todayOrders.length}</p>
          <p className="text-xs text-gray-400 mt-1">31 May 2025</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="text-sm text-gray-500 mb-1">Today's Revenue</p>
          <p className="text-2xl font-bold text-[#1e3a5f]">₹{todayRevenue.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400 mt-1">Across {todayOrders.length} orders</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="text-sm text-gray-500 mb-1">Pending Fulfilment</p>
          <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
          <p className="text-xs text-gray-400 mt-1">Need action</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" placeholder="Search by Order ID or customer..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['All', ...STATUSES] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s as OrderStatus | 'All')} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${statusFilter === s ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const Icon = STATUS_ICONS[o.status]
                return (
                  <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedOrder(o)} className="font-mono font-semibold text-[#1e3a5f] hover:underline text-xs">{o.id}</button>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{o.customer}</p>
                      <p className="text-xs text-gray-400">{o.role}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700 text-xs">{o.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">₹{o.total.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${o.payment === 'Online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{o.payment}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{o.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Icon size={13} className={o.status === 'Delivered' ? 'text-green-600' : o.status === 'Cancelled' ? 'text-red-500' : 'text-[#1e3a5f]'} />
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative group">
                        <select
                          value={o.status}
                          onChange={e => updateStatus(o.id, e.target.value as OrderStatus)}
                          className="appearance-none border border-gray-200 rounded-xl px-2 py-1 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 cursor-pointer pr-6"
                        >
                          {STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-gray-400 text-sm">No orders match your filters.</div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal title={`Order ${selectedOrder.id}`} onClose={() => setSelectedOrder(null)}>
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User size={14} className="text-[#1e3a5f]" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</span>
                </div>
                <p className="font-semibold text-gray-900">{selectedOrder.customer}</p>
                <p className="text-xs text-gray-500">{selectedOrder.role}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Phone size={14} className="text-[#1e3a5f]" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</span>
                </div>
                <p className="font-semibold text-gray-900">{selectedOrder.phone}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-[#1e3a5f]" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Delivery Address</span>
              </div>
              <p className="text-sm text-gray-700">{selectedOrder.address}</p>
            </div>

            {/* Items */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Order Items</h4>
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2 text-xs text-gray-500">Product</th>
                      <th className="text-center px-4 py-2 text-xs text-gray-500">Qty</th>
                      <th className="text-right px-4 py-2 text-xs text-gray-500">Price</th>
                      <th className="text-right px-4 py-2 text-xs text-gray-500">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, i) => (
                      <tr key={i} className="border-t border-gray-50">
                        <td className="px-4 py-2 text-gray-800">{item.name}</td>
                        <td className="px-4 py-2 text-center text-gray-600">{item.qty}</td>
                        <td className="px-4 py-2 text-right text-gray-600">₹{item.price}</td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-900">₹{item.price * item.qty}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-gray-200 bg-gray-50">
                      <td colSpan={3} className="px-4 py-2 text-right font-semibold text-gray-700">Grand Total</td>
                      <td className="px-4 py-2 text-right font-bold text-[#1e3a5f]">₹{selectedOrder.total.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <CreditCard size={16} className="text-[#1e3a5f]" />
              <div>
                <p className="text-xs text-gray-500">Payment Mode</p>
                <p className="font-semibold text-gray-900">{selectedOrder.payment}</p>
              </div>
              <span className={`ml-auto text-xs px-3 py-1 rounded-full font-medium ${selectedOrder.payment === 'Online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {selectedOrder.payment === 'Online' ? 'Paid' : 'Cash on Delivery'}
              </span>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm">Order Timeline</h4>
              <div className="space-y-0">
                {getTimeline(selectedOrder.status, selectedOrder.placedAt).map((step, i, arr) => (
                  <div key={step.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step.done ? 'bg-[#1e3a5f] border-[#1e3a5f]' : 'bg-white border-gray-200'}`}>
                        {step.done
                          ? <CheckCircle size={14} className="text-white" />
                          : <div className="w-2 h-2 rounded-full bg-gray-300" />
                        }
                      </div>
                      {i < arr.length - 1 && <div className={`w-0.5 h-8 ${step.done ? 'bg-[#1e3a5f]' : 'bg-gray-200'}`} />}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-medium ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                      {step.time && <p className="text-xs text-gray-400">{step.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Update Status */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <span className="text-sm font-medium text-gray-700">Update Status:</span>
              <div className="relative">
                <select
                  value={selectedOrder.status}
                  onChange={e => updateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                  className="appearance-none border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 pr-8"
                >
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
