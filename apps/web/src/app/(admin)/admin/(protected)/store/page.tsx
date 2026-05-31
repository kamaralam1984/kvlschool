'use client'

import { useState } from 'react'
import {
  ShoppingBag, ShoppingCart, TrendingUp, Clock,
  Package, Tag, AlertTriangle, ArrowRight, BarChart2,
  BookOpen, Shirt, Layers, Pen
} from 'lucide-react'
import Link from 'next/link'

const stats = [
  { label: 'Total Products', value: '84', icon: ShoppingBag, color: 'bg-blue-50 text-[#1e3a5f]', change: '+6 this month' },
  { label: 'Orders Today', value: '12', icon: ShoppingCart, color: 'bg-amber-50 text-[#d4a017]', change: '3 pending pickup' },
  { label: 'Revenue This Month', value: '₹1.84L', icon: TrendingUp, color: 'bg-green-50 text-green-700', change: '+18% vs last month' },
  { label: 'Pending Orders', value: '8', icon: Clock, color: 'bg-red-50 text-red-600', change: '2 urgent' },
]

const recentOrders = [
  { id: 'KVL-1042', customer: 'Priya Sharma (Parent)', items: 'Class 8 Book Set × 1', total: '₹1,240', status: 'Pending', statusColor: 'bg-amber-100 text-amber-700', time: '10 min ago' },
  { id: 'KVL-1041', customer: 'Rajan Mehta (Parent)', items: 'School Uniform (M) × 2', total: '₹860', status: 'Processing', statusColor: 'bg-blue-100 text-blue-700', time: '34 min ago' },
  { id: 'KVL-1040', customer: 'Sneha Patel (Student)', items: 'Stationery Kit × 1', total: '₹320', status: 'Shipped', statusColor: 'bg-purple-100 text-purple-700', time: '1 hr ago' },
  { id: 'KVL-1039', customer: 'Arjun Nair (Parent)', items: 'Class 10 Notes × 3', total: '₹540', status: 'Delivered', statusColor: 'bg-green-100 text-green-700', time: '3 hr ago' },
  { id: 'KVL-1038', customer: 'Kavya Reddy (Student)', items: 'School Kit × 1, Pen Set × 2', total: '₹680', status: 'Delivered', statusColor: 'bg-green-100 text-green-700', time: '5 hr ago' },
]

const topProducts = [
  { name: 'Class 10 Book Set (CBSE)', category: 'Books', sales: 142, revenue: '₹1,06,500', icon: BookOpen, gradient: 'from-blue-400 to-blue-600' },
  { name: 'School Uniform (Summer)', category: 'Uniform', sales: 98, revenue: '₹58,800', icon: Shirt, gradient: 'from-amber-400 to-amber-600' },
  { name: 'School Stationery Kit', category: 'Stationery', sales: 76, revenue: '₹18,240', icon: Pen, gradient: 'from-green-400 to-green-600' },
]

const quickLinks = [
  { label: 'Products', href: '/admin/store/products', icon: Package, desc: '84 products listed' },
  { label: 'Orders', href: '/admin/store/orders', icon: ShoppingCart, desc: '8 pending' },
  { label: 'Inventory', href: '/admin/store/inventory', icon: Layers, desc: '3 low stock' },
  { label: 'Coupons', href: '/admin/store/coupons', icon: Tag, desc: '5 active' },
]

const lowStockProducts = [
  { name: 'Class 6 Science Textbook', stock: 4, threshold: 10, sku: 'BK-SC-06' },
  { name: 'Winter Uniform Blazer (L)', stock: 2, threshold: 8, sku: 'UN-BL-L' },
  { name: 'Geometry Box Set', stock: 6, threshold: 15, sku: 'ST-GEO-01' },
]

const revenueData = [
  { month: 'Jan', value: 92000, max: 200000 },
  { month: 'Feb', value: 78000, max: 200000 },
  { month: 'Mar', value: 145000, max: 200000 },
  { month: 'Apr', value: 110000, max: 200000 },
  { month: 'May', value: 184000, max: 200000 },
  { month: 'Jun', value: 63000, max: 200000 },
]

export default function StorePage() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Overview</h1>
          <p className="text-gray-500 text-sm mt-1">KVL International School — E-Commerce Dashboard</p>
        </div>
        <Link href="/admin/store/orders" className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#16304f] transition-colors">
          <ShoppingCart size={16} />
          View All Orders
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{s.label}</span>
              <div className={`p-2 rounded-xl ${s.color}`}>
                <s.icon size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-red-600" />
          <span className="font-semibold text-red-700 text-sm">Low Stock Alert — 3 products below reorder threshold</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {lowStockProducts.map((p) => (
            <div key={p.sku} className="bg-white border border-red-200 rounded-xl px-3 py-2 flex items-center gap-3">
              <div>
                <p className="text-sm font-medium text-gray-800">{p.name}</p>
                <p className="text-xs text-gray-400">SKU: {p.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-red-600">{p.stock} left</p>
                <p className="text-xs text-gray-400">min {p.threshold}</p>
              </div>
            </div>
          ))}
          <Link href="/admin/store/inventory" className="flex items-center gap-1 text-xs text-red-600 font-medium hover:underline ml-auto self-center">
            Manage Inventory <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">Revenue — 2025</h2>
              <p className="text-xs text-gray-400 mt-0.5">Monthly store revenue (INR)</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <BarChart2 size={14} />
              Last 6 months
            </div>
          </div>
          <div className="flex items-end gap-3 h-40">
            {revenueData.map((d, i) => {
              const pct = (d.value / d.max) * 100
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group" onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                  {hoveredBar === i && (
                    <span className="text-xs font-semibold text-[#1e3a5f] whitespace-nowrap">
                      ₹{(d.value / 1000).toFixed(0)}K
                    </span>
                  )}
                  <div className="w-full flex items-end justify-center" style={{ height: '120px' }}>
                    <div
                      className="w-full rounded-t-lg transition-all duration-200"
                      style={{
                        height: `${pct}%`,
                        background: hoveredBar === i ? '#d4a017' : '#1e3a5f',
                        opacity: hoveredBar !== null && hoveredBar !== i ? 0.4 : 1,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{d.month}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/admin/store/orders" className="text-xs text-[#1e3a5f] font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3 flex-1">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-start justify-between gap-2 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-[#1e3a5f]">{o.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.statusColor}`}>{o.status}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 truncate">{o.customer}</p>
                  <p className="text-xs text-gray-400 truncate">{o.items}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-900">{o.total}</p>
                  <p className="text-xs text-gray-400">{o.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Products */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Top Selling Products</h2>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-lg font-bold text-gray-300 w-6">#{i + 1}</span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center shrink-0`}>
                  <p.icon size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#1e3a5f]">{p.sales} sold</p>
                  <p className="text-xs text-gray-400">{p.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="space-y-2">
            {quickLinks.map((l) => (
              <Link key={l.label} href={l.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-[#1e3a5f]/5 flex items-center justify-center group-hover:bg-[#1e3a5f]/10 transition-colors">
                  <l.icon size={18} className="text-[#1e3a5f]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{l.label}</p>
                  <p className="text-xs text-gray-400">{l.desc}</p>
                </div>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-[#1e3a5f] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
