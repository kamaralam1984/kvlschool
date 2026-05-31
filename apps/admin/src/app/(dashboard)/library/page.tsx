'use client'

import React, { useState } from 'react'
import {
  BookOpen, Search, Plus, Download, Eye, Edit, Trash2,
  User, Calendar, Clock, AlertCircle, CheckCircle, RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'

const BOOKS = [
  { id: 'BK001', title: 'Mathematics for Class X', author: 'R.D. Sharma', isbn: '978-81-219-2023-2', category: 'Textbook', copies: 25, available: 18, issued: 7, location: 'A-01' },
  { id: 'BK002', title: 'The Alchemist', author: 'Paulo Coelho', isbn: '978-0-06-231500-7', category: 'Fiction', copies: 8, available: 5, issued: 3, location: 'B-12' },
  { id: 'BK003', title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '978-0-553-38016-3', category: 'Science', copies: 6, available: 4, issued: 2, location: 'C-04' },
  { id: 'BK004', title: 'NCERT Physics Part I', author: 'NCERT', isbn: '978-81-7450-723-7', category: 'Textbook', copies: 30, available: 12, issued: 18, location: 'A-03' },
  { id: 'BK005', title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', isbn: '978-81-7371-146-6', category: 'Biography', copies: 10, available: 7, issued: 3, location: 'D-08' },
  { id: 'BK006', title: 'Python Programming', author: 'Mark Lutz', isbn: '978-1-449-35573-9', category: 'Technology', copies: 5, available: 2, issued: 3, location: 'E-02' },
]

const ISSUED_BOOKS = [
  { student: 'Aisha Khan', class: 'X-A', book: 'The Alchemist', issueDate: '2026-05-20', dueDate: '2026-06-03', status: 'On Time', daysLeft: 3 },
  { student: 'Rohan Mehta', class: 'IX-B', book: 'Python Programming', issueDate: '2026-05-15', dueDate: '2026-05-29', status: 'Overdue', daysLeft: -2 },
  { student: 'Priya Sharma', class: 'XI-A', book: 'Wings of Fire', issueDate: '2026-05-22', dueDate: '2026-06-05', status: 'On Time', daysLeft: 5 },
  { student: 'Arjun Patel', class: 'VIII-C', book: 'A Brief History of Time', issueDate: '2026-05-18', dueDate: '2026-06-01', status: 'Due Today', daysLeft: 0 },
  { student: 'Fatima Ansari', class: 'XII-B', book: 'NCERT Physics Part I', issueDate: '2026-05-10', dueDate: '2026-05-24', status: 'Overdue', daysLeft: -7 },
]

const catColors: Record<string, string> = {
  Textbook: 'bg-blue-100 text-blue-700',
  Fiction: 'bg-purple-100 text-purple-700',
  Science: 'bg-green-100 text-green-700',
  Biography: 'bg-orange-100 text-orange-700',
  Technology: 'bg-indigo-100 text-indigo-700',
}

const statusColor: Record<string, string> = {
  'On Time': 'bg-green-100 text-green-700',
  'Due Today': 'bg-yellow-100 text-yellow-700',
  'Overdue': 'bg-red-100 text-red-700',
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'issued' | 'returns'>('catalog')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = BOOKS.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || b.category === category
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Library</h1>
          <p className="text-sm text-gray-500 mt-0.5">Book catalog, issues and returns management</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700">
            <Plus className="w-4 h-4" /> Add Book
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Books', value: '3,842', icon: BookOpen, color: 'bg-amber-500', sub: 'in catalog' },
          { label: 'Available', value: '2,918', icon: CheckCircle, color: 'bg-green-500', sub: '75.9% available' },
          { label: 'Issued', value: '924', icon: User, color: 'bg-blue-500', sub: 'currently borrowed' },
          { label: 'Overdue', value: '47', icon: AlertCircle, color: 'bg-red-400', sub: 'need reminder' },
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

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['catalog', 'issued', 'returns'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-1.5 text-sm rounded-md capitalize transition-all', activeTab === tab ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700')}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'catalog' && (
        <>
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or author..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none">
              {['All', 'Textbook', 'Fiction', 'Science', 'Biography', 'Technology'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Book', 'Author', 'ISBN', 'Category', 'Copies', 'Available', 'Location', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 max-w-[180px] truncate">{b.title}</p>
                        <p className="text-xs text-gray-400">{b.id}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{b.author}</td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{b.isbn}</td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', catColors[b.category])}>{b.category}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{b.copies}</td>
                      <td className="px-4 py-3">
                        <span className={cn('font-semibold', b.available === 0 ? 'text-red-500' : b.available <= 3 ? 'text-yellow-500' : 'text-green-600')}>{b.available}</span>
                        <span className="text-gray-400 text-xs"> / {b.copies}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{b.location}</td>
                      <td className="px-4 py-3 flex gap-1">
                        <button className="p-1 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                        <button className="p-1 hover:bg-yellow-50 rounded text-gray-400 hover:text-yellow-600"><Edit className="w-4 h-4" /></button>
                        <button className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'issued' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Currently Issued Books</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700">
              <Plus className="w-3.5 h-3.5" /> Issue Book
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Student', 'Book', 'Issue Date', 'Due Date', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ISSUED_BOOKS.map((b, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{b.student}</p>
                      <p className="text-xs text-gray-400">{b.class}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-[160px] truncate">{b.book}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{b.issueDate}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{b.dueDate}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', statusColor[b.status])}>{b.status}</span>
                      {b.daysLeft < 0 && <span className="ml-1 text-xs text-red-500">{Math.abs(b.daysLeft)}d overdue</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                        <RefreshCw className="w-3 h-3" /> Return
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'returns' && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700">Return Processing</h3>
          <p className="text-sm text-gray-400 mt-1">Scan or search for a book to process return</p>
          <div className="mt-4 max-w-sm mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="Search student or book..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
          </div>
        </div>
      )}
    </div>
  )
}
