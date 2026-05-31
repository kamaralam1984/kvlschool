'use client'
import React, { useState } from 'react'
import {
  BookOpen, Search, Filter, Plus, Download, Eye, RotateCcw, CheckCircle2,
  AlertCircle, X, FileText, Video, Headphones, BookMarked, Users, Library,
  Upload, ChevronDown, Calendar, Clock, IndianRupee, Tag, Hash
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
type Tab = 'physical' | 'digital' | 'issued'
type DigitalCategory = 'All' | 'Study Material' | 'Previous Papers' | 'Journals' | 'Audiobooks'
type DigitalType = 'PDF' | 'Video' | 'Paper' | 'Audio'

interface Book {
  id: string
  title: string
  author: string
  subject: string
  class: string
  isbn: string
  total: number
  available: number
  issued: number
}

interface DigitalResource {
  id: string
  title: string
  type: DigitalType
  subject: string
  class: string
  size: string
  category: Omit<DigitalCategory, 'All'>
  uploadedAt: string
}

interface IssuedBook {
  id: string
  studentName: string
  studentClass: string
  bookTitle: string
  issueDate: string
  dueDate: string
  returned: boolean
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const BOOKS: Book[] = [
  { id: '1', title: 'Mathematics for Class 10', author: 'R.D. Sharma', subject: 'Mathematics', class: '10', isbn: '978-8121903332', total: 48, available: 32, issued: 16 },
  { id: '2', title: 'Physics Part I & II', author: 'NCERT', subject: 'Physics', class: '12', isbn: '978-8174506153', total: 36, available: 20, issued: 16 },
  { id: '3', title: 'English Literature', author: 'Wren & Martin', subject: 'English', class: '9', isbn: '978-8121900027', total: 60, available: 45, issued: 15 },
  { id: '4', title: 'Chemistry NCERT', author: 'NCERT', subject: 'Chemistry', class: '11', isbn: '978-8174506467', total: 30, available: 18, issued: 12 },
  { id: '5', title: 'Biology for Class 12', author: 'Trueman', subject: 'Biology', class: '12', isbn: '978-8187223535', total: 25, available: 14, issued: 11 },
  { id: '6', title: 'Social Science', author: 'NCERT', subject: 'Social Science', class: '8', isbn: '978-8174507099', total: 55, available: 38, issued: 17 },
  { id: '7', title: 'Computer Applications', author: 'Sumita Arora', subject: 'Computer', class: '10', isbn: '978-8177391558', total: 20, available: 8, issued: 12 },
  { id: '8', title: 'Hindi Vyakaran', author: 'Kamta Prasad', subject: 'Hindi', class: '7', isbn: '978-8170284376', total: 40, available: 29, issued: 11 },
]

const DIGITAL_RESOURCES: DigitalResource[] = [
  { id: 'd1', title: 'CBSE Class 10 Maths Sample Papers 2024', type: 'PDF', subject: 'Mathematics', class: '10', size: '4.2 MB', category: 'Previous Papers', uploadedAt: '2025-01-15' },
  { id: 'd2', title: 'Organic Chemistry Video Lecture Series', type: 'Video', subject: 'Chemistry', class: '11', size: '2.4 GB', category: 'Study Material', uploadedAt: '2025-01-20' },
  { id: 'd3', title: 'Physics Numericals Solved — Class 12', type: 'PDF', subject: 'Physics', class: '12', size: '8.7 MB', category: 'Study Material', uploadedAt: '2025-01-22' },
  { id: 'd4', title: 'Indian History Journal Vol. 12', type: 'Paper', subject: 'Social Science', class: '9', size: '1.1 MB', category: 'Journals', uploadedAt: '2025-01-10' },
  { id: 'd5', title: 'English Grammar Audio Course', type: 'Audio', subject: 'English', class: '8', size: '340 MB', category: 'Audiobooks', uploadedAt: '2025-01-18' },
  { id: 'd6', title: 'Biology Diagrams & Notes', type: 'PDF', subject: 'Biology', class: '12', size: '12.3 MB', category: 'Study Material', uploadedAt: '2025-01-25' },
  { id: 'd7', title: 'Previous Year Board Papers — All Subjects', type: 'PDF', subject: 'All', class: '12', size: '22.1 MB', category: 'Previous Papers', uploadedAt: '2025-01-28' },
  { id: 'd8', title: 'Science & Tech Research Journal 2024', type: 'Paper', subject: 'Science', class: '11', size: '2.8 MB', category: 'Journals', uploadedAt: '2025-01-05' },
]

const today = new Date('2025-05-31')

const ISSUED: IssuedBook[] = [
  { id: 'i1', studentName: 'Aarav Sharma', studentClass: 'Class 10-A', bookTitle: 'Mathematics for Class 10', issueDate: '2025-05-10', dueDate: '2025-05-24', returned: false },
  { id: 'i2', studentName: 'Priya Mehta', studentClass: 'Class 12-B', bookTitle: 'Physics Part I & II', issueDate: '2025-05-15', dueDate: '2025-05-29', returned: false },
  { id: 'i3', studentName: 'Rohan Gupta', studentClass: 'Class 9-C', bookTitle: 'English Literature', issueDate: '2025-05-20', dueDate: '2025-06-03', returned: false },
  { id: 'i4', studentName: 'Sneha Patel', studentClass: 'Class 11-A', bookTitle: 'Chemistry NCERT', issueDate: '2025-05-01', dueDate: '2025-05-15', returned: false },
  { id: 'i5', studentName: 'Karan Singh', studentClass: 'Class 8-B', bookTitle: 'Social Science', issueDate: '2025-05-18', dueDate: '2025-06-01', returned: false },
  { id: 'i6', studentName: 'Meera Joshi', studentClass: 'Class 12-A', bookTitle: 'Biology for Class 12', issueDate: '2025-05-08', dueDate: '2025-05-22', returned: false },
  { id: 'i7', studentName: 'Dev Tiwari', studentClass: 'Class 10-C', bookTitle: 'Computer Applications', issueDate: '2025-05-25', dueDate: '2025-06-08', returned: false },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
function daysOverdue(dueDate: string): number {
  const due = new Date(dueDate)
  const diff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

function fine(dueDate: string): number {
  return daysOverdue(dueDate) * 2
}

const typeIcon: Record<DigitalType, React.ReactNode> = {
  PDF: <FileText className="w-5 h-5 text-red-500" />,
  Video: <Video className="w-5 h-5 text-blue-500" />,
  Paper: <BookMarked className="w-5 h-5 text-purple-500" />,
  Audio: <Headphones className="w-5 h-5 text-green-500" />,
}

const typeBg: Record<DigitalType, string> = {
  PDF: 'bg-red-50',
  Video: 'bg-blue-50',
  Paper: 'bg-purple-50',
  Audio: 'bg-green-50',
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function ModalOverlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

function IssueBookModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const [student, setStudent] = useState('')
  const [cls, setCls] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [done, setDone] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!student || !dueDate) return
    setDone(true)
    setTimeout(onClose, 1200)
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Issue Book</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        {done ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <p className="text-green-700 font-semibold">Book Issued Successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-[#1e3a5f]/5 rounded-xl">
              <p className="text-xs text-gray-500">Book</p>
              <p className="font-semibold text-gray-800 text-sm">{book.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">by {book.author} · {book.available} copies available</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Student Name</label>
              <input value={student} onChange={e => setStudent(e.target.value)} required
                placeholder="e.g. Aarav Sharma"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Class & Section</label>
              <input value={cls} onChange={e => setCls(e.target.value)}
                placeholder="e.g. Class 10-A"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30" />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit"
                className="flex-1 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">Issue Book</button>
            </div>
          </form>
        )}
      </div>
    </ModalOverlay>
  )
}

function ReturnBookModal({ item, onClose, onReturn }: { item: IssuedBook; onClose: () => void; onReturn: (id: string) => void }) {
  const overdue = daysOverdue(item.dueDate)
  const fineAmt = fine(item.dueDate)
  const [done, setDone] = useState(false)

  function handleReturn() {
    setDone(true)
    onReturn(item.id)
    setTimeout(onClose, 1200)
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Mark as Returned</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        {done ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <p className="text-green-700 font-semibold">Book Returned Successfully!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl space-y-1">
              <p className="text-sm font-semibold text-gray-800">{item.studentName} <span className="text-xs text-gray-400 font-normal">· {item.studentClass}</span></p>
              <p className="text-xs text-gray-500">{item.bookTitle}</p>
              <div className="flex gap-4 mt-1">
                <span className="text-xs text-gray-500">Issued: <strong>{item.issueDate}</strong></span>
                <span className="text-xs text-gray-500">Due: <strong>{item.dueDate}</strong></span>
              </div>
            </div>
            {overdue > 0 ? (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-700">{overdue} day{overdue > 1 ? 's' : ''} overdue</p>
                  <p className="text-xs text-red-600">Fine: ₹{fineAmt} (₹2/day × {overdue} days)</p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <p className="text-sm text-green-700 font-medium">Returned on time — No fine</p>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleReturn}
                className="flex-1 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">Confirm Return</button>
            </div>
          </div>
        )}
      </div>
    </ModalOverlay>
  )
}

function AddBookModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ title: '', author: '', subject: '', class: '', isbn: '', copies: '' })
  const [done, setDone] = useState(false)

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setDone(true)
    setTimeout(onClose, 1200)
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Add New Book</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        {done ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <p className="text-green-700 font-semibold">Book Added to Catalog!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { key: 'title', label: 'Book Title', placeholder: 'e.g. Mathematics for Class 10' },
              { key: 'author', label: 'Author', placeholder: 'e.g. R.D. Sharma' },
              { key: 'isbn', label: 'ISBN', placeholder: 'e.g. 978-8121903332' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                <input value={form[f.key as keyof typeof form]} onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder} required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30" />
              </div>
            ))}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
                <input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Maths"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Class</label>
                <input value={form.class} onChange={e => set('class', e.target.value)} placeholder="10"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Copies</label>
                <input type="number" value={form.copies} onChange={e => set('copies', e.target.value)} placeholder="20" min="1"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit"
                className="flex-1 py-2.5 bg-[#d4a017] text-white rounded-xl text-sm font-medium hover:bg-[#b8891a] transition-colors">Add Book</button>
            </div>
          </form>
        )}
      </div>
    </ModalOverlay>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LibraryPage() {
  const [tab, setTab] = useState<Tab>('physical')
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [classFilter, setClassFilter] = useState('All')
  const [digitalCategory, setDigitalCategory] = useState<DigitalCategory>('All')
  const [issueModal, setIssueModal] = useState<Book | null>(null)
  const [returnModal, setReturnModal] = useState<IssuedBook | null>(null)
  const [addModal, setAddModal] = useState(false)
  const [issuedList, setIssuedList] = useState<IssuedBook[]>(ISSUED)

  const subjects = ['All', ...Array.from(new Set(BOOKS.map(b => b.subject)))]
  const classes = ['All', ...Array.from(new Set(BOOKS.map(b => b.class))).sort()]

  const filteredBooks = BOOKS.filter(b => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) || b.isbn.includes(search)
    const matchSubject = subjectFilter === 'All' || b.subject === subjectFilter
    const matchClass = classFilter === 'All' || b.class === classFilter
    return matchSearch && matchSubject && matchClass
  })

  const filteredDigital = DIGITAL_RESOURCES.filter(r =>
    digitalCategory === 'All' || r.category === digitalCategory
  )

  const filteredIssued = issuedList.filter(i => !i.returned)

  function handleReturn(id: string) {
    setIssuedList(list => list.map(i => i.id === id ? { ...i, returned: true } : i))
  }

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'physical', label: 'Physical Library', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'digital', label: 'Digital Resources', icon: <Download className="w-4 h-4" /> },
    { key: 'issued', label: 'Issued Books', icon: <BookMarked className="w-4 h-4" /> },
  ]

  const DIGITAL_CATS: DigitalCategory[] = ['All', 'Study Material', 'Previous Papers', 'Journals', 'Audiobooks']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Library</h1>
          <p className="text-gray-500 text-sm mt-1">Manage books, digital resources, and lending records</p>
        </div>
        <button onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Plus className="w-4 h-4" /> Add Book
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Books', value: '2,840', icon: BookOpen, color: 'text-[#1e3a5f]', bg: 'bg-[#1e3a5f]/10' },
          { label: 'Digital Resources', value: '420', icon: Download, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Members', value: '4,218', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Books Issued', value: '186', icon: BookMarked, color: 'text-[#d4a017]', bg: 'bg-[#d4a017]/10' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Physical Library Tab ── */}
      {tab === 'physical' && (
        <div className="bg-white border border-gray-100 rounded-2xl">
          {/* Filters */}
          <div className="p-5 border-b border-gray-100 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by title, author, ISBN…"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
            </div>
            <div className="relative">
              <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 bg-white">
                {subjects.map(s => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={classFilter} onChange={e => setClassFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 bg-white">
                {classes.map(c => <option key={c}>{c === 'All' ? 'All Classes' : `Class ${c}`}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {['Title', 'Author', 'Subject', 'Class', 'ISBN', 'Total', 'Available', 'Issued', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBooks.map(book => (
                  <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-[#1e3a5f]" />
                        </div>
                        <span className="font-medium text-gray-800 whitespace-nowrap max-w-[180px] truncate">{book.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{book.author}</td>
                    <td className="px-4 py-3"><span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{book.subject}</span></td>
                    <td className="px-4 py-3 text-gray-600">Class {book.class}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{book.isbn}</td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-700">{book.total}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-semibold ${book.available === 0 ? 'text-red-500' : 'text-green-600'}`}>{book.available}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-[#d4a017] font-semibold">{book.issued}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setIssueModal(book)} disabled={book.available === 0}
                        className="px-3 py-1.5 bg-[#1e3a5f] text-white rounded-lg text-xs font-medium hover:bg-[#163050] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        Issue
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBooks.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">No books match your search.</div>
            )}
          </div>
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filteredBooks.length} of {BOOKS.length} books
          </div>
        </div>
      )}

      {/* ── Digital Resources Tab ── */}
      {tab === 'digital' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {DIGITAL_CATS.map(cat => (
              <button key={cat} onClick={() => setDigitalCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  digitalCategory === cat
                    ? 'bg-[#1e3a5f] text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1e3a5f]/40'
                }`}>
                {cat}
              </button>
            ))}
          </div>
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDigital.map(r => (
              <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow group">
                <div className={`w-11 h-11 ${typeBg[r.type]} rounded-xl flex items-center justify-center mb-3`}>
                  {typeIcon[r.type]}
                </div>
                <p className="font-semibold text-gray-800 text-sm leading-snug mb-1 line-clamp-2">{r.title}</p>
                <div className="flex items-center gap-2 mt-2 mb-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{r.subject}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Class {r.class}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{r.category}</span>
                  <span>{r.size}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#1e3a5f]/5 text-[#1e3a5f] rounded-lg text-xs font-medium hover:bg-[#1e3a5f]/10 transition-colors">
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#d4a017]/10 text-[#d4a017] rounded-lg text-xs font-medium hover:bg-[#d4a017]/20 transition-colors">
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filteredDigital.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl py-12 text-center text-gray-400 text-sm">
              No resources in this category.
            </div>
          )}
        </div>
      )}

      {/* ── Issued Books Tab ── */}
      {tab === 'issued' && (
        <div className="bg-white border border-gray-100 rounded-2xl">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Currently Issued Books</h3>
              <p className="text-xs text-gray-400 mt-0.5">Fine: ₹2 per day after due date</p>
            </div>
            <span className="bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1 rounded-full">
              {filteredIssued.filter(i => daysOverdue(i.dueDate) > 0).length} Overdue
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {['Student', 'Book', 'Issue Date', 'Due Date', 'Fine', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredIssued.map(item => {
                  const overdue = daysOverdue(item.dueDate)
                  const fineAmt = fine(item.dueDate)
                  const isOverdue = overdue > 0
                  return (
                    <tr key={item.id} className={`transition-colors ${isOverdue ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-gray-50'}`}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{item.studentName}</p>
                        <p className="text-xs text-gray-400">{item.studentClass}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700 max-w-[200px]">
                        <span className="line-clamp-1">{item.bookTitle}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {item.issueDate}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.dueDate}</span>
                          {isOverdue && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">+{overdue}d</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {fineAmt > 0 ? (
                          <div className="flex items-center gap-1 text-red-600 font-semibold">
                            <IndianRupee className="w-3.5 h-3.5" />{fineAmt}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isOverdue ? (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                            <AlertCircle className="w-3 h-3" /> Overdue
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> On Time
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setReturnModal(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] text-white rounded-lg text-xs font-medium hover:bg-[#163050] transition-colors">
                          <RotateCcw className="w-3.5 h-3.5" /> Return
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filteredIssued.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">No books currently issued.</div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {issueModal && <IssueBookModal book={issueModal} onClose={() => setIssueModal(null)} />}
      {returnModal && <ReturnBookModal item={returnModal} onClose={() => setReturnModal(null)} onReturn={handleReturn} />}
      {addModal && <AddBookModal onClose={() => setAddModal(false)} />}
    </div>
  )
}
