'use client'

import { useState } from 'react'
import {
  AlertTriangle, Search, Filter, Download, Plus,
  Minus, RefreshCw, X, ChevronDown, Package,
  TrendingDown, CheckCircle, XCircle
} from 'lucide-react'

type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock'

interface InventoryItem {
  id: number
  name: string
  sku: string
  category: string
  stock: number
  threshold: number
  unitPrice: number
}

const initialInventory: InventoryItem[] = [
  { id: 1, name: 'Class 10 Book Set (CBSE)', sku: 'BK-10-CBSE', category: 'Books', stock: 48, threshold: 20, unitPrice: 750 },
  { id: 2, name: 'Class 8 Book Set (CBSE)', sku: 'BK-08-CBSE', category: 'Books', stock: 35, threshold: 15, unitPrice: 640 },
  { id: 3, name: 'Class 6 Science Textbook', sku: 'BK-SC-06', category: 'Books', stock: 4, threshold: 10, unitPrice: 140 },
  { id: 4, name: 'Class 5 Hindi Textbook', sku: 'BK-HI-05', category: 'Books', stock: 0, threshold: 10, unitPrice: 95 },
  { id: 5, name: 'Class 12 Chemistry Notes', sku: 'NT-CH-12', category: 'Notes', stock: 60, threshold: 20, unitPrice: 180 },
  { id: 6, name: 'Class 10 Maths Formula Book', sku: 'NT-MA-10', category: 'Notes', stock: 80, threshold: 25, unitPrice: 120 },
  { id: 7, name: 'School Uniform (Summer) — S', sku: 'UN-SU-S', category: 'Uniform', stock: 22, threshold: 15, unitPrice: 430 },
  { id: 8, name: 'School Uniform (Summer) — M', sku: 'UN-SU-M', category: 'Uniform', stock: 18, threshold: 15, unitPrice: 430 },
  { id: 9, name: 'School Uniform (Summer) — L', sku: 'UN-SU-L', category: 'Uniform', stock: 12, threshold: 15, unitPrice: 430 },
  { id: 10, name: 'Winter Uniform Blazer (L)', sku: 'UN-BL-L', category: 'Uniform', stock: 2, threshold: 8, unitPrice: 980 },
  { id: 11, name: 'School Stationery Kit', sku: 'ST-KIT-01', category: 'Stationery', stock: 6, threshold: 15, unitPrice: 240 },
  { id: 12, name: 'Geometry Box Set', sku: 'ST-GEO-01', category: 'Stationery', stock: 6, threshold: 15, unitPrice: 95 },
  { id: 13, name: 'A4 Ruled Notebooks (Pack 5)', sku: 'ST-NB-A4', category: 'Stationery', stock: 45, threshold: 20, unitPrice: 120 },
  { id: 14, name: 'School Kit — New Admission', sku: 'SK-NEW-01', category: 'School Kit', stock: 20, threshold: 10, unitPrice: 1200 },
  { id: 15, name: 'PE Sports Kit', sku: 'UN-PE-01', category: 'Uniform', stock: 0, threshold: 12, unitPrice: 360 },
]

const REASONS = ['Restock / Purchase', 'Return from Student', 'Damage / Write-off', 'Adjustment / Audit', 'Transfer']

function getStatus(item: InventoryItem): StockStatus {
  if (item.stock === 0) return 'Out of Stock'
  if (item.stock < item.threshold) return 'Low Stock'
  return 'In Stock'
}

const STATUS_STYLES: Record<StockStatus, string> = {
  'In Stock': 'bg-green-100 text-green-700',
  'Low Stock': 'bg-amber-100 text-amber-700',
  'Out of Stock': 'bg-red-100 text-red-600',
}

const STATUS_ICON: Record<StockStatus, React.ElementType> = {
  'In Stock': CheckCircle,
  'Low Stock': AlertTriangle,
  'Out of Stock': XCircle,
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StockStatus | 'All'>('All')
  const [updateItem, setUpdateItem] = useState<InventoryItem | null>(null)
  const [updateMode, setUpdateMode] = useState<'add' | 'remove'>('add')
  const [updateQty, setUpdateQty] = useState('')
  const [updateReason, setUpdateReason] = useState(REASONS[0])

  const filtered = inventory.filter(item => {
    const status = getStatus(item)
    return (statusFilter === 'All' || status === statusFilter) &&
      (item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase()))
  })

  const lowStock = inventory.filter(i => getStatus(i) === 'Low Stock')
  const outOfStock = inventory.filter(i => getStatus(i) === 'Out of Stock')
  const totalValue = inventory.reduce((s, i) => s + i.stock * i.unitPrice, 0)

  function handleUpdate() {
    if (!updateItem || !updateQty) return
    const qty = Number(updateQty)
    setInventory(prev => prev.map(i => i.id === updateItem.id ? {
      ...i, stock: updateMode === 'add' ? i.stock + qty : Math.max(0, i.stock - qty)
    } : i))
    setUpdateItem(null)
    setUpdateQty('')
  }

  function exportCSV() {
    const rows = [
      ['Product', 'SKU', 'Category', 'Stock', 'Threshold', 'Status', 'Unit Price', 'Stock Value'],
      ...inventory.map(i => [i.name, i.sku, i.category, i.stock, i.threshold, getStatus(i), i.unitPrice, i.stock * i.unitPrice])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'kvl-inventory.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500 text-sm mt-1">Track stock levels, reorder points, and stock value</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="text-xs text-gray-400 mb-1">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-xs text-amber-600 mb-1">Low Stock</p>
          <p className="text-2xl font-bold text-amber-700">{lowStock.length}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <p className="text-xs text-red-500 mb-1">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{outOfStock.length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="text-xs text-gray-400 mb-1">Total Stock Value</p>
          <p className="text-2xl font-bold text-[#1e3a5f]">₹{(totalValue / 1000).toFixed(1)}K</p>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-amber-600" />
            <span className="font-semibold text-amber-700 text-sm">Reorder Required — {lowStock.length + outOfStock.length} products need attention</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...outOfStock, ...lowStock].map(item => (
              <div key={item.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border ${item.stock === 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-amber-200 text-amber-700'}`}>
                <span>{item.name}</span>
                <span className="font-bold">{item.stock === 0 ? 'OUT' : `${item.stock} left`}</span>
                <button onClick={() => { setUpdateItem(item); setUpdateMode('add'); setUpdateQty('') }} className="ml-1 underline">Restock</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" placeholder="Search product or SKU..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {(['All', 'In Stock', 'Low Stock', 'Out of Stock'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s as StockStatus | 'All')} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${statusFilter === s ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">SKU</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Threshold</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock Value</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const status = getStatus(item)
                const Icon = STATUS_ICON[status]
                const isLow = status === 'Low Stock'
                const isOut = status === 'Out of Stock'
                return (
                  <tr key={item.id} className={`border-b border-gray-50 transition-colors ${isOut ? 'bg-red-50/40 hover:bg-red-50/60' : isLow ? 'bg-amber-50/40 hover:bg-amber-50/60' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-gray-400 shrink-0" />
                        <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{item.sku}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold text-base ${isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-gray-900'}`}>{item.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-500">{item.threshold}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Icon size={13} className={isOut ? 'text-red-500' : isLow ? 'text-amber-600' : 'text-green-600'} />
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[status]}`}>{status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-700">₹{(item.stock * item.unitPrice).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => { setUpdateItem(item); setUpdateMode('add'); setUpdateQty('') }} className="flex items-center gap-1 text-xs text-[#1e3a5f] border border-[#1e3a5f]/20 rounded-xl px-2 py-1.5 hover:bg-[#1e3a5f]/5 transition-colors font-medium">
                        <RefreshCw size={11} /> Update
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-gray-400 text-sm">No items match your filters.</div>
          )}
        </div>
      </div>

      {/* Stock Update Modal */}
      {updateItem && (
        <Modal title={`Update Stock — ${updateItem.name}`} onClose={() => setUpdateItem(null)}>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Current Stock</p>
                <p className="text-2xl font-bold text-gray-900">{updateItem.stock}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">SKU</p>
                <p className="font-mono text-sm text-gray-700">{updateItem.sku}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setUpdateMode('add')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-colors ${updateMode === 'add' ? 'bg-green-50 border-green-300 text-green-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                <Plus size={14} /> Add Stock
              </button>
              <button onClick={() => setUpdateMode('remove')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-colors ${updateMode === 'remove' ? 'bg-red-50 border-red-300 text-red-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                <Minus size={14} /> Remove Stock
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity *</label>
              <input type="number" min="1" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" value={updateQty} onChange={e => setUpdateQty(e.target.value)} placeholder="Enter quantity..." />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Reason</label>
              <div className="relative">
                <select className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 pr-8" value={updateReason} onChange={e => setUpdateReason(e.target.value)}>
                  {REASONS.map(r => <option key={r}>{r}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {updateQty && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
                New stock will be: <strong>{updateMode === 'add' ? updateItem.stock + Number(updateQty) : Math.max(0, updateItem.stock - Number(updateQty))}</strong> units
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button onClick={() => setUpdateItem(null)} className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleUpdate} disabled={!updateQty} className="flex-1 bg-[#1e3a5f] text-white rounded-xl py-2 text-sm font-medium hover:bg-[#16304f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Confirm Update</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
