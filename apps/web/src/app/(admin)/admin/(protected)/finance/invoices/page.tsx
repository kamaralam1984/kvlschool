'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, Download, Send, Eye, X, Trash2, FileText, ChevronDown } from 'lucide-react'

type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue'

interface LineItem {
  feeType: string
  amount: number
}

interface Invoice {
  id: string
  invoiceNo: string
  studentName: string
  class: string
  items: LineItem[]
  amount: number
  issueDate: string
  dueDate: string
  status: InvoiceStatus
}

const STATUS_CONFIG: Record<InvoiceStatus, { color: string; bg: string }> = {
  Draft:   { color: 'text-gray-600',  bg: 'bg-gray-100' },
  Sent:    { color: 'text-blue-700',  bg: 'bg-blue-50' },
  Paid:    { color: 'text-green-700', bg: 'bg-green-50' },
  Overdue: { color: 'text-red-700',   bg: 'bg-red-50' },
}

const MOCK: Invoice[] = [
  { id: '1', invoiceNo: 'INV-2025-001', studentName: 'Aarav Sharma',    class: '10-A', items: [{ feeType: 'Tuition Fee', amount: 18000 }, { feeType: 'Lab Fee', amount: 2000 }],                    amount: 20000, issueDate: '2025-05-01', dueDate: '2025-05-15', status: 'Paid' },
  { id: '2', invoiceNo: 'INV-2025-002', studentName: 'Priya Nair',       class: '8-B',  items: [{ feeType: 'Tuition Fee', amount: 16000 }, { feeType: 'Transport', amount: 3500 }],                  amount: 19500, issueDate: '2025-05-02', dueDate: '2025-05-16', status: 'Overdue' },
  { id: '3', invoiceNo: 'INV-2025-003', studentName: 'Rohan Mehta',      class: '12-C', items: [{ feeType: 'Tuition Fee', amount: 20000 }, { feeType: 'Exam Fee', amount: 1500 }],                   amount: 21500, issueDate: '2025-05-03', dueDate: '2025-05-17', status: 'Sent' },
  { id: '4', invoiceNo: 'INV-2025-004', studentName: 'Sneha Patel',      class: '6-A',  items: [{ feeType: 'Tuition Fee', amount: 14000 }, { feeType: 'Activity Fee', amount: 1000 }],               amount: 15000, issueDate: '2025-05-04', dueDate: '2025-05-18', status: 'Draft' },
  { id: '5', invoiceNo: 'INV-2025-005', studentName: 'Kiran Reddy',      class: '9-B',  items: [{ feeType: 'Tuition Fee', amount: 17000 }, { feeType: 'Hostel Fee', amount: 8000 }],                 amount: 25000, issueDate: '2025-05-05', dueDate: '2025-05-19', status: 'Paid' },
  { id: '6', invoiceNo: 'INV-2025-006', studentName: 'Ananya Singh',     class: '11-A', items: [{ feeType: 'Tuition Fee', amount: 19000 }, { feeType: 'Library Fee', amount: 500 }],                 amount: 19500, issueDate: '2025-05-06', dueDate: '2025-05-20', status: 'Sent' },
  { id: '7', invoiceNo: 'INV-2025-007', studentName: 'Dev Krishnan',     class: '7-C',  items: [{ feeType: 'Tuition Fee', amount: 15000 }, { feeType: 'Transport', amount: 3500 }, { feeType: 'Meal Plan', amount: 2500 }], amount: 21000, issueDate: '2025-05-07', dueDate: '2025-05-21', status: 'Overdue' },
  { id: '8', invoiceNo: 'INV-2025-008', studentName: 'Meera Joshi',      class: '5-B',  items: [{ feeType: 'Tuition Fee', amount: 13000 }, { feeType: 'Activity Fee', amount: 1000 }],               amount: 14000, issueDate: '2025-05-08', dueDate: '2025-05-22', status: 'Draft' },
]

const STUDENTS = ['Aarav Sharma', 'Priya Nair', 'Rohan Mehta', 'Sneha Patel', 'Kiran Reddy', 'Ananya Singh', 'Dev Krishnan', 'Meera Joshi']
const FEE_TYPES = ['Tuition Fee', 'Transport', 'Hostel Fee', 'Lab Fee', 'Exam Fee', 'Activity Fee', 'Library Fee', 'Meal Plan']

const emptyForm = { studentName: '', class: '', dueDate: '', items: [{ feeType: 'Tuition Fee', amount: 0 }] as LineItem[] }

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modal, setModal] = useState<'create' | 'view' | 'preview' | null>(null)
  const [selected, setSelected] = useState<Invoice | null>(null)
  const [form, setForm] = useState(emptyForm)

  const filtered = useMemo(() => invoices.filter(inv => {
    const matchSearch = inv.studentName.toLowerCase().includes(search.toLowerCase()) || inv.invoiceNo.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || inv.status === statusFilter
    return matchSearch && matchStatus
  }), [invoices, search, statusFilter])

  function openCreate() { setForm(emptyForm); setModal('create') }
  function openView(inv: Invoice) { setSelected(inv); setModal('view') }
  function openPreview(inv: Invoice) { setSelected(inv); setModal('preview') }
  function closeModal() { setModal(null); setSelected(null) }

  function addLineItem() { setForm(f => ({ ...f, items: [...f.items, { feeType: 'Tuition Fee', amount: 0 }] })) }
  function removeLineItem(i: number) { setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) })) }
  function updateLineItem(i: number, field: keyof LineItem, value: string | number) {
    setForm(f => ({ ...f, items: f.items.map((item, idx) => idx === i ? { ...item, [field]: value } : item) }))
  }

  function handleCreate(status: InvoiceStatus) {
    const total = form.items.reduce((s, it) => s + Number(it.amount), 0)
    const newInv: Invoice = {
      id: String(Date.now()),
      invoiceNo: `INV-2025-00${invoices.length + 1}`,
      studentName: form.studentName,
      class: form.class,
      items: form.items,
      amount: total,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: form.dueDate,
      status,
    }
    setInvoices(prev => [newInv, ...prev])
    closeModal()
  }

  function handleDelete(id: string) {
    if (confirm('Delete this invoice?')) setInvoices(prev => prev.filter(i => i.id !== id))
  }

  function markSent(id: string) {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'Sent' as InvoiceStatus } : i))
  }

  const totalAmount = invoices.reduce((s, i) => s + i.amount, 0)
  const paidAmount  = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0)
  const overdueCount = invoices.filter(i => i.status === 'Overdue').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 text-sm mt-1">Create, send and track student fee invoices.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#162d4a] transition-colors">
          <Plus className="w-4 h-4" /> Create Invoice
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Invoiced', value: `₹${(totalAmount / 1000).toFixed(1)}K`, sub: `${invoices.length} invoices`, color: 'text-[#1e3a5f]' },
          { label: 'Collected',      value: `₹${(paidAmount / 1000).toFixed(1)}K`,  sub: `${invoices.filter(i => i.status === 'Paid').length} paid`,    color: 'text-green-600' },
          { label: 'Pending',        value: `${invoices.filter(i => i.status === 'Sent').length}`,  sub: 'awaiting payment', color: 'text-blue-600' },
          { label: 'Overdue',        value: `${overdueCount}`,                        sub: 'need follow-up',   color: 'text-red-600' },
        ].map(card => (
          <div key={card.label} className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48 border border-gray-200 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..." className="flex-1 text-sm outline-none" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
          <option value="All">All Status</option>
          {(['Draft', 'Sent', 'Paid', 'Overdue'] as InvoiceStatus[]).map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Invoice No', 'Student', 'Class', 'Items', 'Amount', 'Issue Date', 'Due Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(inv => {
                const cfg = STATUS_CONFIG[inv.status]
                return (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[#1e3a5f] font-semibold">{inv.invoiceNo}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{inv.studentName}</td>
                    <td className="px-4 py-3 text-gray-500">{inv.class}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {inv.items.map((item, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item.feeType}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">₹{inv.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{inv.issueDate}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{inv.dueDate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>{inv.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openView(inv)} title="View" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><Eye className="w-3.5 h-3.5 text-gray-500" /></button>
                        <button onClick={() => openPreview(inv)} title="Preview" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><FileText className="w-3.5 h-3.5 text-gray-500" /></button>
                        {inv.status === 'Draft' && (
                          <button onClick={() => markSent(inv.id)} title="Send" className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"><Send className="w-3.5 h-3.5 text-blue-500" /></button>
                        )}
                        <button onClick={() => {}} title="Download PDF" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><Download className="w-3.5 h-3.5 text-gray-500" /></button>
                        <button onClick={() => handleDelete(inv.id)} title="Delete" className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {modal === 'create' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Create Invoice</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Student Name</label>
                <select value={form.studentName} onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
                  <option value="">Select student...</option>
                  {STUDENTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Class</label>
                <input value={form.class} onChange={e => setForm(f => ({ ...f, class: e.target.value }))} placeholder="e.g. 10-A" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Line Items</label>
                  <button onClick={addLineItem} className="text-xs text-[#1e3a5f] hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Add Item</button>
                </div>
                <div className="space-y-2">
                  {form.items.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <select value={item.feeType} onChange={e => updateLineItem(i, 'feeType', e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
                        {FEE_TYPES.map(ft => <option key={ft}>{ft}</option>)}
                      </select>
                      <input type="number" value={item.amount || ''} onChange={e => updateLineItem(i, 'amount', Number(e.target.value))} placeholder="Amount" className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
                      {form.items.length > 1 && (
                        <button onClick={() => removeLineItem(i)} className="p-1.5 hover:bg-red-50 rounded-lg"><X className="w-3.5 h-3.5 text-red-400" /></button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-right text-sm font-semibold text-gray-700">
                  Total: ₹{form.items.reduce((s, it) => s + Number(it.amount), 0).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => handleCreate('Draft')} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Save Draft</button>
              <button onClick={() => handleCreate('Sent')} className="flex-1 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#162d4a] transition-colors flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Send to Parent</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{selected.invoiceNo}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Student</span><span className="font-medium">{selected.studentName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Class</span><span className="font-medium">{selected.class}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Issue Date</span><span className="font-medium">{selected.issueDate}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Due Date</span><span className="font-medium">{selected.dueDate}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Status</span><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_CONFIG[selected.status].bg} ${STATUS_CONFIG[selected.status].color}`}>{selected.status}</span></div>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Line Items</p>
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1"><span className="text-gray-600">{item.feeType}</span><span className="font-medium">₹{item.amount.toLocaleString()}</span></div>
                ))}
                <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-2 mt-2"><span>Total</span><span>₹{selected.amount.toLocaleString()}</span></div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => {}} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2"><Download className="w-4 h-4" /> PDF</button>
              {selected.status === 'Draft' && <button onClick={() => { markSent(selected.id); closeModal() }} className="flex-1 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Send</button>}
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {modal === 'preview' && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Invoice Preview</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6">
              <div className="border border-gray-200 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xl font-bold text-[#1e3a5f]">KVL International School</p>
                    <p className="text-xs text-gray-500 mt-0.5">123 Education Lane, Bengaluru — 560001</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-700">{selected.invoiceNo}</p>
                    <p className="text-xs text-gray-500">Issued: {selected.issueDate}</p>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-gray-700">Bill To:</p>
                  <p className="text-sm text-gray-900">{selected.studentName} — Class {selected.class}</p>
                </div>
                <table className="w-full text-sm border-t border-gray-100">
                  <thead><tr className="border-b border-gray-100"><th className="text-left py-2 text-gray-500 font-medium">Description</th><th className="text-right py-2 text-gray-500 font-medium">Amount</th></tr></thead>
                  <tbody>
                    {selected.items.map((item, i) => (
                      <tr key={i} className="border-b border-gray-50"><td className="py-2 text-gray-700">{item.feeType}</td><td className="py-2 text-right font-medium">₹{item.amount.toLocaleString()}</td></tr>
                    ))}
                  </tbody>
                  <tfoot><tr><td className="py-2 font-bold">Total</td><td className="py-2 text-right font-bold text-[#1e3a5f]">₹{selected.amount.toLocaleString()}</td></tr></tfoot>
                </table>
                <div className="bg-[#d4a017]/10 rounded-xl p-3 text-xs text-gray-600">
                  <span className="font-semibold">Due Date:</span> {selected.dueDate} — Please pay via online portal or at school office.
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={closeModal} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">Close</button>
              <button onClick={() => {}} className="flex-1 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
