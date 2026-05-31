'use client'

import React, { useState } from 'react'
import { BookOpen, Search, Clock, CheckCircle, AlertCircle, Star, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

const MY_BOOKS = [
  { title:'The Alchemist', author:'Paulo Coelho', issueDate:'2026-05-20', dueDate:'2026-06-03', status:'On Time', daysLeft:3 },
  { title:'Python Programming', author:'Mark Lutz', issueDate:'2026-05-15', dueDate:'2026-05-29', status:'Overdue', daysLeft:-2 },
]

const HISTORY = [
  { title:'Wings of Fire', author:'A.P.J. Abdul Kalam', returnDate:'2026-05-10', fine:0 },
  { title:'A Brief History of Time', author:'Stephen Hawking', returnDate:'2026-04-18', fine:0 },
  { title:'Atomic Habits', author:'James Clear', returnDate:'2026-03-25', fine:10 },
]

const CATALOG = [
  { title:'Mathematics for Class XII', author:'R.D. Sharma', category:'Textbook', available:3, rating:4.8 },
  { title:'The Kite Runner', author:'Khaled Hosseini', category:'Fiction', available:2, rating:4.9 },
  { title:'Sapiens', author:'Yuval Noah Harari', category:'Non-fiction', available:1, rating:4.7 },
  { title:'NCERT Physics Part II', author:'NCERT', category:'Textbook', available:5, rating:4.6 },
  { title:'Rich Dad Poor Dad', author:'Robert Kiyosaki', category:'Finance', available:0, rating:4.5 },
  { title:'Organic Chemistry', author:'O.P. Tandon', category:'Reference', available:2, rating:4.7 },
]

export default function LibraryPage() {
  const [tab,    setTab]    = useState<'issued'|'catalog'|'history'>('issued')
  const [search, setSearch] = useState('')

  const filteredCatalog = CATALOG.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Library</h1>
        <p className="text-sm text-gray-500 mt-0.5">Issued books, catalog and reading history</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Issued', value:MY_BOOKS.length, color:'text-blue-600' },
          { label:'Overdue', value:MY_BOOKS.filter(b=>b.status==='Overdue').length, color:'text-red-500' },
          { label:'Books Read', value:HISTORY.length, color:'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['issued','catalog','history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-1.5 text-sm rounded-md capitalize transition-all',
              tab===t?'bg-white shadow text-gray-900 font-medium':'text-gray-500 hover:text-gray-700')}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'issued' && (
        <div className="space-y-3">
          {MY_BOOKS.map((b,i) => (
            <div key={i} className={cn('bg-white rounded-xl border p-5', b.status==='Overdue'?'border-red-200 bg-red-50/30':'border-gray-100')}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{b.title}</h3>
                  <p className="text-sm text-gray-500">{b.author}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    <span>Issued: {b.issueDate}</span>
                    <span className={cn('font-medium', b.daysLeft<0?'text-red-500':b.daysLeft<=3?'text-orange-500':'text-gray-600')}>
                      Due: {b.dueDate} ({b.daysLeft<0?`${Math.abs(b.daysLeft)}d overdue`:b.daysLeft===0?'Due today':`${b.daysLeft}d left`})
                    </span>
                  </div>
                </div>
                <span className={cn('px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1',
                  b.status==='Overdue'?'bg-red-100 text-red-700':'bg-green-100 text-green-700')}>
                  {b.status==='Overdue'?<AlertCircle className="w-3 h-3"/>:<CheckCircle className="w-3 h-3"/>}
                  {b.status}
                </span>
              </div>
              {b.status==='Overdue' && (
                <p className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  Fine may apply. Please return this book immediately to avoid additional charges.
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'catalog' && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search books…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((b,i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                <div className="w-full h-28 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                  <BookOpen className="w-10 h-10 text-white opacity-80"/>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{b.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{b.author} · {b.category}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/>{b.rating}
                  </span>
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium',
                    b.available>0?'bg-green-100 text-green-700':'bg-red-100 text-red-700')}>
                    {b.available>0?`${b.available} available`:'Not available'}
                  </span>
                </div>
                <button disabled={b.available===0}
                  className="mt-3 w-full py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  Request Issue
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'history' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Book','Author','Returned On','Fine'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {HISTORY.map((b,i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{b.title}</td>
                  <td className="px-4 py-3 text-gray-500">{b.author}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{b.returnDate}</td>
                  <td className="px-4 py-3">
                    {b.fine>0
                      ? <span className="text-red-500 font-medium">₹{b.fine}</span>
                      : <span className="text-green-500 flex items-center gap-1"><CheckCircle className="w-3 h-3"/>No fine</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
