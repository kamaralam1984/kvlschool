'use client'

import { useState } from 'react'
import {
  Search, Plus, Grid, List, Filter, ChevronDown,
  BookOpen, Shirt, Package, Pen, Monitor, Layers,
  Edit2, Trash2, X, Upload, ToggleLeft, ToggleRight,
  SortAsc, Eye
} from 'lucide-react'

type Status = 'Active' | 'Draft' | 'Out of Stock'
type Category = 'Books' | 'Notes' | 'Uniform' | 'School Kit' | 'Stationery' | 'Digital'

interface Product {
  id: number
  name: string
  category: Category
  price: number
  mrp: number
  stock: number
  status: Status
  sku: string
  description: string
  isDigital: boolean
  gradient: string
  sales: number
}

const CATEGORIES: Category[] = ['Books', 'Notes', 'Uniform', 'School Kit', 'Stationery', 'Digital']

const categoryIcons: Record<Category, React.ElementType> = {
  Books: BookOpen,
  Notes: Pen,
  Uniform: Shirt,
  'School Kit': Package,
  Stationery: Layers,
  Digital: Monitor,
}

const categoryGradients: Record<Category, string> = {
  Books: 'from-blue-400 to-blue-600',
  Notes: 'from-purple-400 to-purple-600',
  Uniform: 'from-amber-400 to-amber-600',
  'School Kit': 'from-green-400 to-green-600',
  Stationery: 'from-pink-400 to-pink-600',
  Digital: 'from-cyan-400 to-cyan-600',
}

const statusColors: Record<Status, string> = {
  Active: 'bg-green-100 text-green-700',
  Draft: 'bg-gray-100 text-gray-600',
  'Out of Stock': 'bg-red-100 text-red-600',
}

const initialProducts: Product[] = [
  { id: 1, name: 'Class 10 Book Set (CBSE)', category: 'Books', price: 750, mrp: 900, stock: 48, status: 'Active', sku: 'BK-10-CBSE', description: 'Complete set of NCERT textbooks for Class 10.', isDigital: false, gradient: 'from-blue-400 to-blue-600', sales: 142 },
  { id: 2, name: 'Class 8 Book Set (CBSE)', category: 'Books', price: 640, mrp: 780, stock: 35, status: 'Active', sku: 'BK-08-CBSE', description: 'Complete set of NCERT textbooks for Class 8.', isDigital: false, gradient: 'from-blue-400 to-blue-600', sales: 89 },
  { id: 3, name: 'Class 6 Science Textbook', category: 'Books', price: 140, mrp: 175, stock: 4, status: 'Active', sku: 'BK-SC-06', description: 'NCERT Science textbook for Class 6.', isDigital: false, gradient: 'from-blue-400 to-blue-600', sales: 34 },
  { id: 4, name: 'Class 12 Chemistry Notes', category: 'Notes', price: 180, mrp: 220, stock: 60, status: 'Active', sku: 'NT-CH-12', description: 'Handwritten notes with diagrams for Class 12 Chemistry.', isDigital: false, gradient: 'from-purple-400 to-purple-600', sales: 67 },
  { id: 5, name: 'Class 10 Maths Formula Book', category: 'Notes', price: 120, mrp: 150, stock: 80, status: 'Active', sku: 'NT-MA-10', description: 'Comprehensive formula booklet for board prep.', isDigital: false, gradient: 'from-purple-400 to-purple-600', sales: 54 },
  { id: 6, name: 'School Uniform (Summer)', category: 'Uniform', price: 430, mrp: 500, stock: 55, status: 'Active', sku: 'UN-SU-01', description: 'White shirt + navy trousers/skirt, all sizes.', isDigital: false, gradient: 'from-amber-400 to-amber-600', sales: 98 },
  { id: 7, name: 'Winter Uniform Blazer (L)', category: 'Uniform', price: 980, mrp: 1200, stock: 2, status: 'Active', sku: 'UN-BL-L', description: 'Navy blue school blazer, size Large.', isDigital: false, gradient: 'from-amber-400 to-amber-600', sales: 22 },
  { id: 8, name: 'PE Sports Kit', category: 'Uniform', price: 360, mrp: 420, stock: 0, status: 'Out of Stock', sku: 'UN-PE-01', description: 'Track pants + T-shirt for Physical Education.', isDigital: false, gradient: 'from-amber-400 to-amber-600', sales: 41 },
  { id: 9, name: 'School Stationery Kit', category: 'Stationery', price: 240, mrp: 300, stock: 6, status: 'Active', sku: 'ST-KIT-01', description: 'Pencils, pens, eraser, ruler, sharpener.', isDigital: false, gradient: 'from-pink-400 to-pink-600', sales: 76 },
  { id: 10, name: 'Geometry Box Set', category: 'Stationery', price: 95, mrp: 120, stock: 6, status: 'Active', sku: 'ST-GEO-01', description: 'Compass, divider, set squares, protractor.', isDigital: false, gradient: 'from-pink-400 to-pink-600', sales: 48 },
  { id: 11, name: 'School Kit — New Admission', category: 'School Kit', price: 1200, mrp: 1500, stock: 20, status: 'Active', sku: 'SK-NEW-01', description: 'Complete welcome kit for new students.', isDigital: false, gradient: 'from-green-400 to-green-600', sales: 31 },
  { id: 12, name: 'Digital Study Pack — Class 10', category: 'Digital', price: 499, mrp: 799, stock: 999, status: 'Active', sku: 'DG-10-01', description: 'Video lectures + PDF notes for all subjects.', isDigital: true, gradient: 'from-cyan-400 to-cyan-600', sales: 113 },
  { id: 13, name: 'Mock Test Series — JEE Foundation', category: 'Digital', price: 299, mrp: 499, stock: 999, status: 'Draft', sku: 'DG-JEE-01', description: 'Online mock tests with analytics.', isDigital: true, gradient: 'from-cyan-400 to-cyan-600', sales: 0 },
]

const SORT_OPTIONS = ['Name (A-Z)', 'Price: Low to High', 'Price: High to Low', 'Stock: Low to High']

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All')
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const [form, setForm] = useState({
    name: '', category: 'Books' as Category, price: '', mrp: '', stock: '', description: '', isDigital: false,
  })

  const filtered = products
    .filter(p => (categoryFilter === 'All' || p.category === categoryFilter) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price
      if (sortBy === 'Price: High to Low') return b.price - a.price
      if (sortBy === 'Stock: Low to High') return a.stock - b.stock
      return a.name.localeCompare(b.name)
    })

  function openAdd() {
    setForm({ name: '', category: 'Books', price: '', mrp: '', stock: '', description: '', isDigital: false })
    setShowAddModal(true)
  }

  function openEdit(p: Product) {
    setForm({ name: p.name, category: p.category, price: String(p.price), mrp: String(p.mrp), stock: String(p.stock), description: p.description, isDigital: p.isDigital })
    setEditProduct(p)
  }

  function handleSave() {
    if (!form.name || !form.price) return
    if (editProduct) {
      setProducts(prev => prev.map(p => p.id === editProduct.id ? {
        ...p, name: form.name, category: form.category, price: Number(form.price),
        mrp: Number(form.mrp), stock: Number(form.stock), description: form.description,
        isDigital: form.isDigital, gradient: categoryGradients[form.category],
        status: Number(form.stock) === 0 ? 'Out of Stock' : p.status,
      } : p))
      setEditProduct(null)
    } else {
      const newP: Product = {
        id: Date.now(), name: form.name, category: form.category,
        price: Number(form.price), mrp: Number(form.mrp), stock: Number(form.stock),
        description: form.description, isDigital: form.isDigital,
        gradient: categoryGradients[form.category],
        sku: `${form.category.slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-4)}`,
        status: Number(form.stock) === 0 ? 'Out of Stock' : 'Active', sales: 0,
      }
      setProducts(prev => [newP, ...prev])
      setShowAddModal(false)
    }
  }

  function handleDelete(id: number) {
    setProducts(prev => prev.filter(p => p.id !== id))
    setDeleteId(null)
  }

  const FormFields = (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Product Name *</label>
        <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Class 9 Science Textbook" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Category *</label>
          <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Stock</label>
          <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Price (₹) *</label>
          <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="499" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">MRP (₹)</label>
          <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" value={form.mrp} onChange={e => setForm(f => ({ ...f, mrp: e.target.value }))} placeholder="599" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
        <textarea className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 resize-none" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short product description..." />
      </div>
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#1e3a5f]/30 transition-colors">
        <Upload size={20} className="mx-auto text-gray-300 mb-1" />
        <p className="text-xs text-gray-400">Click to upload product image</p>
        <p className="text-xs text-gray-300">PNG, JPG up to 2MB</p>
      </div>
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
        <div>
          <p className="text-sm font-medium text-gray-700">Digital Product</p>
          <p className="text-xs text-gray-400">No physical shipping required</p>
        </div>
        <button onClick={() => setForm(f => ({ ...f, isDigital: !f.isDigital }))} className="text-[#1e3a5f]">
          {form.isDigital ? <ToggleRight size={28} className="text-[#d4a017]" /> : <ToggleLeft size={28} className="text-gray-300" />}
        </button>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={() => { setShowAddModal(false); setEditProduct(null) }} className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
        <button onClick={handleSave} className="flex-1 bg-[#1e3a5f] text-white rounded-xl py-2 text-sm font-medium hover:bg-[#16304f] transition-colors">
          {editProduct ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products across {CATEGORIES.length} categories</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#16304f] transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" placeholder="Search by name or SKU..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['All', ...CATEGORIES] as const).map(c => (
            <button key={c} onClick={() => setCategoryFilter(c as Category | 'All')} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${categoryFilter === c ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{c}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <select className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none text-gray-600" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="flex border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-[#1e3a5f] text-white' : 'text-gray-400 hover:bg-gray-50'}`}><Grid size={16} /></button>
            <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-[#1e3a5f] text-white' : 'text-gray-400 hover:bg-gray-50'}`}><List size={16} /></button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => {
            const Icon = categoryIcons[p.category]
            return (
              <div key={p.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <div className={`h-32 bg-gradient-to-br ${p.gradient} flex items-center justify-center relative`}>
                  <Icon size={40} className="text-white opacity-80" />
                  {p.isDigital && <span className="absolute top-2 right-2 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">Digital</span>}
                  <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[p.status]}`}>{p.status}</span>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-900 text-sm truncate">{p.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.category} · {p.sku}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-base font-bold text-[#1e3a5f]">₹{p.price}</span>
                    {p.mrp > p.price && <span className="text-xs text-gray-400 line-through">₹{p.mrp}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs font-medium ${p.stock <= 5 ? 'text-red-500' : 'text-gray-500'}`}>
                      {p.isDigital ? 'Digital — Unlimited' : `${p.stock} in stock`}
                    </span>
                    <span className="text-xs text-gray-400">{p.sales} sold</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 text-xs text-[#1e3a5f] border border-[#1e3a5f]/20 rounded-xl py-1.5 hover:bg-[#1e3a5f]/5 transition-colors">
                      <Edit2 size={12} /> Edit
                    </button>
                    <button onClick={() => setDeleteId(p.id)} className="flex-1 flex items-center justify-center gap-1 text-xs text-red-500 border border-red-200 rounded-xl py-1.5 hover:bg-red-50 transition-colors">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const Icon = categoryIcons[p.category]
                return (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center shrink-0`}>
                          <Icon size={14} className="text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.category}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-[#1e3a5f]">₹{p.price}</span>
                      {p.mrp > p.price && <span className="text-xs text-gray-400 line-through ml-1">₹{p.mrp}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${p.stock <= 5 ? 'text-red-500' : 'text-gray-700'}`}>
                        {p.isDigital ? '∞' : p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-[#1e3a5f]/10 text-[#1e3a5f] transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-gray-400 text-sm">No products match your filters.</div>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <Modal title="Add New Product" onClose={() => setShowAddModal(false)}>
          {FormFields}
        </Modal>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <Modal title={`Edit — ${editProduct.name}`} onClose={() => setEditProduct(null)}>
          {FormFields}
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone. The product will be permanently removed from the catalog.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 text-white rounded-xl py-2 text-sm font-medium hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
