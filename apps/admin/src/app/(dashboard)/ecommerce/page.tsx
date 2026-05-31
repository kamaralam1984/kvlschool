'use client'

import React, { useState } from 'react'
import {
  ShoppingCart, Package, TrendingUp, Star, Plus, Download,
  Search, Eye, Edit, Trash2, CheckCircle, Clock, XCircle,
  ChevronLeft, ChevronRight, Tag
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PRODUCTS = [
  { id: 'PRD001', name: 'KVL School Uniform (Boys) - Full Set', category: 'Uniform', price: 1200, stock: 45, sold: 312, rating: 4.6, status: 'In Stock', image: '👕' },
  { id: 'PRD002', name: 'KVL School Uniform (Girls) - Full Set', category: 'Uniform', price: 1100, stock: 38, sold: 287, rating: 4.7, status: 'In Stock', image: '👗' },
  { id: 'PRD003', name: 'School Bag - Class VI-VIII', category: 'Stationery', price: 850, stock: 0, sold: 198, rating: 4.4, status: 'Out of Stock', image: '🎒' },
  { id: 'PRD004', name: 'Geometry Box Set', category: 'Stationery', price: 180, stock: 120, sold: 432, rating: 4.8, status: 'In Stock', image: '📐' },
  { id: 'PRD005', name: 'KVL School Tie', category: 'Uniform', price: 120, stock: 200, sold: 521, rating: 4.5, status: 'In Stock', image: '👔' },
  { id: 'PRD006', name: 'Science Lab Kit - Class IX', category: 'Lab', price: 650, stock: 12, sold: 87, rating: 4.9, status: 'Low Stock', image: '🔬' },
  { id: 'PRD007', name: 'Annual Planner & Diary 2026', category: 'Stationery', price: 95, stock: 180, sold: 380, rating: 4.3, status: 'In Stock', image: '📓' },
  { id: 'PRD008', name: 'Sports Kit - House Colour Set', category: 'Sports', price: 750, stock: 5, sold: 142, rating: 4.7, status: 'Low Stock', image: '🏅' },
]

const ORDERS = [
  { id: 'ORD001', student: 'Aisha Khan', class: 'X-A', items: ['Uniform (Boys)', 'School Tie'], total: 1320, date: '2026-05-30', status: 'Delivered' },
  { id: 'ORD002', student: 'Rohan Mehta', class: 'IX-B', items: ['Geometry Box', 'School Bag'], total: 1030, date: '2026-05-30', status: 'Processing' },
  { id: 'ORD003', student: 'Priya Sharma', class: 'XI-A', items: ['Uniform (Girls)'], total: 1100, date: '2026-05-29', status: 'Delivered' },
  { id: 'ORD004', student: 'Arjun Patel', class: 'VIII-C', items: ['Science Lab Kit'], total: 650, date: '2026-05-29', status: 'Pending' },
  { id: 'ORD005', student: 'Fatima Ansari', class: 'XII-B', items: ['Annual Planner'], total: 95, date: '2026-05-28', status: 'Delivered' },
  { id: 'ORD006', student: 'Kiran Yadav', class: 'X-C', items: ['Sports Kit', 'School Tie'], total: 870, date: '2026-05-28', status: 'Cancelled' },
]

const statusColor: Record<string, string> = {
  'In Stock': 'bg-green-100 text-green-700',
  'Low Stock': 'bg-yellow-100 text-yellow-700',
  'Out of Stock': 'bg-red-100 text-red-700',
}

const orderStatusColor: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
}

const catColors: Record<string, string> = {
  Uniform: 'bg-blue-100 text-blue-700',
  Stationery: 'bg-purple-100 text-purple-700',
  Lab: 'bg-green-100 text-green-700',
  Sports: 'bg-orange-100 text-orange-700',
}

export default function EcommercePage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'reports'>('products')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const filtered = PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Store</h1>
          <p className="text-sm text-gray-500 mt-0.5">Uniforms, stationery, lab kits and more</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: '42', icon: Package, color: 'bg-indigo-500', sub: 'in catalog' },
          { label: 'Orders This Month', value: '312', icon: ShoppingCart, color: 'bg-blue-500', sub: '+18% vs last month' },
          { label: 'Revenue', value: '₹3.8 L', icon: TrendingUp, color: 'bg-green-500', sub: 'this month' },
          { label: 'Low Stock Items', value: '5', icon: Package, color: 'bg-yellow-400', sub: 'need restock' },
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

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['products', 'orders', 'reports'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-1.5 text-sm rounded-md capitalize transition-all', activeTab === tab ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700')}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'products' && (
        <>
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none" />
            </div>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none">
              {['All', 'Uniform', 'Stationery', 'Lab', 'Sports'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 text-center text-4xl">
                  {p.image}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-gray-900 text-sm leading-snug flex-1">{p.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', catColors[p.category])}>{p.category}</span>
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColor[p.status])}>{p.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="font-bold text-gray-900 text-lg">₹{p.price}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{p.rating}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>Stock: <span className={cn('font-medium', p.stock === 0 ? 'text-red-500' : p.stock <= 10 ? 'text-yellow-500' : 'text-gray-700')}>{p.stock}</span></span>
                    <span>{p.sold} sold</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 text-xs py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Edit</button>
                    <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-400"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 border border-red-100 rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Order ID', 'Student', 'Items', 'Total', 'Date', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ORDERS.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{o.student}</p>
                      <p className="text-xs text-gray-400">{o.class}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{o.items.join(', ')}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">₹{o.total}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{o.date}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', orderStatusColor[o.status])}>{o.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-blue-600 hover:underline flex items-center gap-1"><Eye className="w-3 h-3" />View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between text-sm text-gray-500">
            <span>Showing {ORDERS.length} of 312 orders</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-gray-100"><ChevronLeft className="w-4 h-4" /></button>
              {[1, 2, 3].map(p => <button key={p} className={cn('w-8 h-8 rounded text-xs', p === 1 ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100')}>{p}</button>)}
              <button className="p-1 rounded hover:bg-gray-100"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Top Selling Products</h2>
            <div className="space-y-3">
              {PRODUCTS.sort((a, b) => b.sold - a.sold).slice(0, 5).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-lg w-6 text-center">{p.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">{p.name}</p>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(p.sold / 521) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{p.sold}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Revenue by Category</h2>
            <div className="space-y-3">
              {[
                { cat: 'Uniform', revenue: 198000, color: 'bg-blue-500' },
                { cat: 'Stationery', revenue: 86000, color: 'bg-purple-500' },
                { cat: 'Sports', revenue: 62000, color: 'bg-orange-400' },
                { cat: 'Lab', revenue: 48000, color: 'bg-green-500' },
              ].map(c => (
                <div key={c.cat} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-20">{c.cat}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className={cn('h-2 rounded-full', c.color)} style={{ width: `${(c.revenue / 198000) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">₹{(c.revenue / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
