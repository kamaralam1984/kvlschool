'use client'

import { useState } from 'react'
import {
  Tag, Plus, Copy, Check, X, ToggleLeft, ToggleRight,
  ChevronDown, RefreshCw, Calendar, Percent, IndianRupee,
  Search, AlertCircle
} from 'lucide-react'

type CouponType = 'Flat' | 'Percent'
type CouponStatus = 'Active' | 'Expired' | 'Disabled'
type ApplicableTo = 'All' | 'Books' | 'Uniforms' | 'Stationery' | 'Digital' | 'School Kit'

interface Coupon {
  id: number
  code: string
  type: CouponType
  value: number
  minOrder: number
  maxDiscount: number | null
  usageLimit: number
  used: number
  startDate: string
  endDate: string
  status: CouponStatus
  applicableTo: ApplicableTo
  totalDiscount: number
}

const APPLICABLE: ApplicableTo[] = ['All', 'Books', 'Uniforms', 'Stationery', 'Digital', 'School Kit']

const initialCoupons: Coupon[] = [
  { id: 1, code: 'WELCOME25', type: 'Percent', value: 25, minOrder: 500, maxDiscount: 300, usageLimit: 200, used: 87, startDate: '2025-04-01', endDate: '2025-06-30', status: 'Active', applicableTo: 'All', totalDiscount: 14500 },
  { id: 2, code: 'BOOKS100', type: 'Flat', value: 100, minOrder: 600, maxDiscount: null, usageLimit: 100, used: 100, startDate: '2025-05-01', endDate: '2025-05-31', status: 'Expired', applicableTo: 'Books', totalDiscount: 10000 },
  { id: 3, code: 'UNIFORM10', type: 'Percent', value: 10, minOrder: 400, maxDiscount: 150, usageLimit: 150, used: 42, startDate: '2025-05-15', endDate: '2025-07-15', status: 'Active', applicableTo: 'Uniforms', totalDiscount: 4200 },
  { id: 4, code: 'BACKTOSCHOOL', type: 'Flat', value: 200, minOrder: 1000, maxDiscount: null, usageLimit: 300, used: 165, startDate: '2025-03-01', endDate: '2025-05-30', status: 'Expired', applicableTo: 'All', totalDiscount: 33000 },
  { id: 5, code: 'DIGITAL50', type: 'Flat', value: 50, minOrder: 299, maxDiscount: null, usageLimit: 500, used: 213, startDate: '2025-04-10', endDate: '2025-12-31', status: 'Active', applicableTo: 'Digital', totalDiscount: 10650 },
  { id: 6, code: 'STATIONARY15', type: 'Percent', value: 15, minOrder: 200, maxDiscount: 100, usageLimit: 80, used: 11, startDate: '2025-05-20', endDate: '2025-06-20', status: 'Disabled', applicableTo: 'Stationery', totalDiscount: 880 },
  { id: 7, code: 'KVLSPECIAL', type: 'Percent', value: 20, minOrder: 800, maxDiscount: 500, usageLimit: 50, used: 18, startDate: '2025-05-25', endDate: '2025-06-25', status: 'Active', applicableTo: 'All', totalDiscount: 5400 },
  { id: 8, code: 'NEWADMISSION', type: 'Flat', value: 150, minOrder: 1200, maxDiscount: null, usageLimit: 100, used: 34, startDate: '2025-04-01', endDate: '2025-08-31', status: 'Active', applicableTo: 'School Kit', totalDiscount: 5100 },
]

const STATUS_COLORS: Record<CouponStatus, string> = {
  Active: 'bg-green-100 text-green-700',
  Expired: 'bg-gray-100 text-gray-500',
  Disabled: 'bg-red-100 text-red-600',
}

function generateCode(): string {
  const prefixes = ['KVL', 'SCHOOL', 'OFFER', 'SAVE', 'DEAL']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${prefix}${suffix}`
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<CouponStatus | 'All'>('All')
  const [showModal, setShowModal] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const [form, setForm] = useState({
    code: '', type: 'Percent' as CouponType, value: '', minOrder: '',
    maxDiscount: '', usageLimit: '', startDate: '', endDate: '', applicableTo: 'All' as ApplicableTo,
  })

  const filtered = coupons.filter(c =>
    (statusFilter === 'All' || c.status === statusFilter) &&
    (c.code.toLowerCase().includes(search.toLowerCase()))
  )

  const active = coupons.filter(c => c.status === 'Active')
  const totalDiscount = coupons.reduce((s, c) => s + c.totalDiscount, 0)
  const mostUsed = [...coupons].sort((a, b) => b.used - a.used)[0]

  function copyCode(id: number, code: string) {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function toggleStatus(id: number) {
    setCoupons(prev => prev.map(c => c.id === id
      ? { ...c, status: c.status === 'Active' ? 'Disabled' : c.status === 'Disabled' ? 'Active' : c.status }
      : c
    ))
  }

  function handleCreate() {
    if (!form.code || !form.value) return
    const newC: Coupon = {
      id: Date.now(),
      code: form.code.toUpperCase().replace(/\s/g, ''),
      type: form.type,
      value: Number(form.value),
      minOrder: Number(form.minOrder) || 0,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
      usageLimit: Number(form.usageLimit) || 100,
      used: 0,
      startDate: form.startDate || new Date().toISOString().slice(0, 10),
      endDate: form.endDate || '2025-12-31',
      status: 'Active',
      applicableTo: form.applicableTo,
      totalDiscount: 0,
    }
    setCoupons(prev => [newC, ...prev])
    setShowModal(false)
    setForm({ code: '', type: 'Percent', value: '', minOrder: '', maxDiscount: '', usageLimit: '', startDate: '', endDate: '', applicableTo: 'All' })
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage discount coupons for the store</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#16304f] transition-colors">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
              <Tag size={16} className="text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Active Coupons</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{active.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">of {coupons.length} total</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <IndianRupee size={16} className="text-[#d4a017]" />
            </div>
            <span className="text-sm text-gray-500">Total Discount Given</span>
          </div>
          <p className="text-2xl font-bold text-[#1e3a5f]">₹{(totalDiscount / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-400 mt-0.5">Across all coupons</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <Percent size={16} className="text-[#1e3a5f]" />
            </div>
            <span className="text-sm text-gray-500">Most Used Coupon</span>
          </div>
          <p className="text-base font-bold text-gray-900 font-mono">{mostUsed?.code}</p>
          <p className="text-xs text-gray-400 mt-0.5">{mostUsed?.used} uses</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" placeholder="Search coupon code..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {(['All', 'Active', 'Expired', 'Disabled'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s as CouponStatus | 'All')} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${statusFilter === s ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Code</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Value</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Min Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Usage</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Applicable</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Expiry</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const usagePct = Math.round((c.used / c.usageLimit) * 100)
                const isExpired = c.status === 'Expired'
                return (
                  <tr key={c.id} className={`border-b border-gray-50 transition-colors ${isExpired ? 'opacity-60' : ''} hover:bg-gray-50`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#1e3a5f] text-sm tracking-wider">{c.code}</span>
                        <button onClick={() => copyCode(c.id, c.code)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-[#1e3a5f]">
                          {copiedId === c.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {c.type === 'Percent' ? <Percent size={12} className="text-purple-500" /> : <IndianRupee size={12} className="text-green-600" />}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.type === 'Percent' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{c.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {c.type === 'Percent' ? `${c.value}%` : `₹${c.value}`}
                      {c.maxDiscount && <span className="text-xs text-gray-400 ml-1">(max ₹{c.maxDiscount})</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">₹{c.minOrder}</td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>{c.used}/{c.usageLimit}</span>
                          <span>{usagePct}%</span>
                        </div>
                        <div className="w-20 bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-[#1e3a5f]" style={{ width: `${Math.min(usagePct, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{c.applicableTo}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar size={11} />
                        {formatDate(c.endDate)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {c.status !== 'Expired' && (
                        <button onClick={() => toggleStatus(c.id)} title={c.status === 'Active' ? 'Disable' : 'Enable'} className="text-[#1e3a5f] hover:opacity-70 transition-opacity">
                          {c.status === 'Active'
                            ? <ToggleRight size={24} className="text-[#d4a017]" />
                            : <ToggleLeft size={24} className="text-gray-300" />
                          }
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-gray-400 text-sm">No coupons match your filters.</div>
          )}
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <Modal title="Create New Coupon" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            {/* Code */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Coupon Code *</label>
              <div className="flex gap-2">
                <input className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. SAVE20" />
                <button onClick={() => setForm(f => ({ ...f, code: generateCode() }))} className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                  <RefreshCw size={12} /> Auto-generate
                </button>
              </div>
            </div>

            {/* Type + Value */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Type *</label>
                <div className="flex gap-2">
                  <button onClick={() => setForm(f => ({ ...f, type: 'Percent' }))} className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium border transition-colors ${form.type === 'Percent' ? 'bg-purple-50 border-purple-300 text-purple-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <Percent size={12} /> Percent
                  </button>
                  <button onClick={() => setForm(f => ({ ...f, type: 'Flat' }))} className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium border transition-colors ${form.type === 'Flat' ? 'bg-green-50 border-green-300 text-green-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <IndianRupee size={12} /> Flat
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{form.type === 'Percent' ? 'Discount %' : 'Flat Amount (₹)'} *</label>
                <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder={form.type === 'Percent' ? '20' : '100'} />
              </div>
            </div>

            {/* Min Order + Max Discount */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Min Order Amount (₹)</label>
                <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))} placeholder="500" />
              </div>
              {form.type === 'Percent' && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Max Discount (₹)</label>
                  <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" value={form.maxDiscount} onChange={e => setForm(f => ({ ...f, maxDiscount: e.target.value }))} placeholder="300" />
                </div>
              )}
            </div>

            {/* Usage Limit + Applicable */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Usage Limit</label>
                <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" value={form.usageLimit} onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))} placeholder="100" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Applicable To</label>
                <div className="relative">
                  <select className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 pr-8" value={form.applicableTo} onChange={e => setForm(f => ({ ...f, applicableTo: e.target.value as ApplicableTo }))}>
                    {APPLICABLE.map(a => <option key={a}>{a}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Start Date</label>
                <input type="date" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">End Date</label>
                <input type="date" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>

            {!form.code || !form.value ? (
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-xl">
                <AlertCircle size={13} /> Code and value are required to create a coupon.
              </div>
            ) : null}

            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={!form.code || !form.value} className="flex-1 bg-[#1e3a5f] text-white rounded-xl py-2 text-sm font-medium hover:bg-[#16304f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Create Coupon</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
