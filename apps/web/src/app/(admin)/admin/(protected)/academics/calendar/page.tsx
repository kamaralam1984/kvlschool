'use client'
import React, { useState, useMemo } from 'react'
import { Plus, X, Calendar, ChevronDown, Filter } from 'lucide-react'

type EventType = 'Holiday' | 'Exam' | 'Event' | 'PTM'

interface AcademicEvent {
  id: string
  title: string
  date: string
  endDate?: string
  type: EventType
  description?: string
}

const TYPE_COLORS: Record<EventType, string> = {
  Holiday: 'bg-red-100 text-red-700 border-red-200',
  Exam: 'bg-purple-100 text-purple-700 border-purple-200',
  Event: 'bg-blue-100 text-blue-700 border-blue-200',
  PTM: 'bg-orange-100 text-orange-700 border-orange-200',
}

const TYPE_DOT: Record<EventType, string> = {
  Holiday: 'bg-red-500',
  Exam: 'bg-purple-500',
  Event: 'bg-blue-500',
  PTM: 'bg-orange-500',
}

const MOCK: AcademicEvent[] = [
  { id: '1', title: 'School Reopens (New Session)', date: '2024-07-01', type: 'Event', description: 'New academic session begins for all classes.' },
  { id: '2', title: 'Independence Day', date: '2024-08-15', type: 'Holiday', description: 'National Holiday — Flag hoisting ceremony at 8:00 AM.' },
  { id: '3', title: 'Unit Test 1', date: '2024-08-19', endDate: '2024-08-23', type: 'Exam', description: 'Unit Test 1 for Classes 7–12.' },
  { id: '4', title: 'Teacher\'s Day', date: '2024-09-05', type: 'Event', description: 'Cultural program by students to celebrate teachers.' },
  { id: '5', title: 'PTM – Quarter 1', date: '2024-09-21', type: 'PTM', description: 'Parent-Teacher Meeting for all classes.' },
  { id: '6', title: 'Gandhi Jayanti', date: '2024-10-02', type: 'Holiday' },
  { id: '7', title: 'Half-Yearly Exams', date: '2024-10-07', endDate: '2024-10-18', type: 'Exam', description: 'Half-yearly examinations for Classes 7–12.' },
  { id: '8', title: 'Diwali Break', date: '2024-10-28', endDate: '2024-11-04', type: 'Holiday', description: 'Diwali vacation.' },
  { id: '9', title: 'Annual Sports Day', date: '2024-11-16', type: 'Event', description: 'Inter-house sports competition — parents invited.' },
  { id: '10', title: 'Unit Test 2', date: '2024-12-02', endDate: '2024-12-06', type: 'Exam' },
  { id: '11', title: 'Annual Function / Prize Distribution', date: '2024-12-21', type: 'Event', description: 'Cultural night and prize distribution ceremony.' },
  { id: '12', title: 'Winter Break', date: '2024-12-25', endDate: '2025-01-05', type: 'Holiday' },
  { id: '13', title: 'Republic Day', date: '2025-01-26', type: 'Holiday' },
  { id: '14', title: 'Pre-Board Exams (Class 10 & 12)', date: '2025-02-03', endDate: '2025-02-14', type: 'Exam', description: 'Pre-Board examinations for Board classes.' },
  { id: '15', title: 'PTM – Quarter 3', date: '2025-02-22', type: 'PTM', description: 'Parent-Teacher Meeting — result discussion.' },
  { id: '16', title: 'Holi Break', date: '2025-03-13', endDate: '2025-03-14', type: 'Holiday' },
  { id: '17', title: 'Annual Exams (Classes 7–9, 11)', date: '2025-03-17', endDate: '2025-03-29', type: 'Exam', description: 'Final annual examinations.' },
  { id: '18', title: 'CBSE Board Exams Begin (Class 10 & 12)', date: '2025-03-01', endDate: '2025-04-05', type: 'Exam', description: 'CBSE Board examinations.' },
  { id: '19', title: 'Result Declaration', date: '2025-04-15', type: 'Event', description: 'Annual exam results published.' },
  { id: '20', title: 'PTM – Annual Results', date: '2025-04-19', type: 'PTM', description: 'Final PTM of the session.' },
  { id: '21', title: 'Science & Art Exhibition', date: '2025-05-10', type: 'Event' },
  { id: '22', title: 'Summer Break Begins', date: '2025-05-16', endDate: '2025-06-30', type: 'Holiday', description: 'School closed for summer vacation.' },
]

const MONTHS = ['July 2024','August 2024','September 2024','October 2024','November 2024','December 2024','January 2025','February 2025','March 2025','April 2025','May 2025','June 2025']
const MONTH_KEYS = ['2024-07','2024-08','2024-09','2024-10','2024-11','2024-12','2025-01','2025-02','2025-03','2025-04','2025-05','2025-06']

const emptyForm: Omit<AcademicEvent, 'id'> = { title: '', date: '', type: 'Event', description: '' }

export default function CalendarPage() {
  const [events, setEvents] = useState<AcademicEvent[]>(MOCK)
  const [typeFilter, setTypeFilter] = useState<'All' | EventType>('All')
  const [modal, setModal] = useState<'add' | null>(null)
  const [form, setForm] = useState<Omit<AcademicEvent, 'id'>>(emptyForm)

  const filtered = useMemo(() => events.filter(e =>
    typeFilter === 'All' || e.type === typeFilter
  ), [events, typeFilter])

  const byMonth = useMemo(() => {
    return MONTH_KEYS.map((key, i) => ({
      label: MONTHS[i],
      events: filtered.filter(e => e.date.startsWith(key)).sort((a, b) => a.date.localeCompare(b.date)),
    })).filter(m => m.events.length > 0)
  }, [filtered])

  function handleSave() {
    setEvents(prev => [...prev, { ...form, id: String(Date.now()) }])
    setModal(null)
    setForm(emptyForm)
  }

  function handleDelete(id: string) {
    if (confirm('Remove this event?')) setEvents(prev => prev.filter(e => e.id !== id))
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const counts = { Holiday: 0, Exam: 0, Event: 0, PTM: 0 }
  events.forEach(e => counts[e.type]++)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Calendar</h1>
          <p className="text-gray-500 text-sm mt-1">Academic year July 2024 – June 2025</p>
        </div>
        <button onClick={() => setModal('add')} className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#162d4a] transition-colors">
          <Plus size={16} /> Add Event
        </button>
      </div>

      {/* Summary Badges */}
      <div className="flex flex-wrap gap-3">
        {((['All', 'Holiday', 'Exam', 'Event', 'PTM']) as const).map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t as typeof typeFilter)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${typeFilter === t ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
          >
            {t !== 'All' && <span className={`w-2 h-2 rounded-full ${TYPE_DOT[t as EventType]}`} />}
            {t}
            {t !== 'All' && <span className="text-xs opacity-70">({counts[t as EventType]})</span>}
            {t === 'All' && <span className="text-xs opacity-70">({events.length})</span>}
          </button>
        ))}
      </div>

      {/* Month Groups */}
      <div className="space-y-6">
        {byMonth.map(month => (
          <div key={month.label} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <Calendar size={15} className="text-[#1e3a5f]" />
              <h3 className="text-sm font-semibold text-[#1e3a5f]">{month.label}</h3>
              <span className="text-xs text-gray-400 ml-auto">{month.events.length} event{month.events.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="divide-y divide-gray-50">
              {month.events.map(ev => (
                <div key={ev.id} className="px-5 py-3.5 flex items-start gap-4 group hover:bg-gray-50 transition-colors">
                  <div className="text-center w-12 flex-shrink-0">
                    <div className="text-lg font-bold text-gray-800 leading-none">{new Date(ev.date).getDate()}</div>
                    <div className="text-xs text-gray-400">{new Date(ev.date).toLocaleDateString('en-IN', { weekday: 'short' })}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 text-sm">{ev.title}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${TYPE_COLORS[ev.type]}`}>{ev.type}</span>
                    </div>
                    {ev.endDate && ev.endDate !== ev.date && (
                      <p className="text-xs text-gray-400 mt-0.5">Until {formatDate(ev.endDate)}</p>
                    )}
                    {ev.description && <p className="text-xs text-gray-500 mt-0.5">{ev.description}</p>}
                  </div>
                  <button onClick={() => handleDelete(ev.id)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-all flex-shrink-0">
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {byMonth.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 text-sm">No events match the current filter.</div>
        )}
      </div>

      {/* Add Event Modal */}
      {modal === 'add' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Add Event</h2>
              <button onClick={() => setModal(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={16} /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Event Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" placeholder="e.g. Annual Sports Day" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Start Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">End Date (optional)</label>
                  <input type="date" value={form.endDate || ''} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Event Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as EventType }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white">
                  {(['Holiday','Exam','Event','PTM'] as const).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Description (optional)</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none" placeholder="Additional details..." />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-[#1e3a5f] text-white rounded-xl hover:bg-[#162d4a]">Add Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
