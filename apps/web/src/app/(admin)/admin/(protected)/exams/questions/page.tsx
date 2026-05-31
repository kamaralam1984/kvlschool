'use client'
import React, { useState, useMemo } from 'react'
import { Search, Plus, X, ChevronDown, HelpCircle, BookOpen, BarChart2, Layers } from 'lucide-react'

interface Question {
  id: string
  text: string
  subject: string
  class: string
  type: 'MCQ' | 'Short' | 'Long'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  marks: number
  addedBy: string
  date: string
  options?: string[]
  correctAnswer?: string
}

const MOCK: Question[] = [
  { id: '1', text: 'What is the powerhouse of the cell?', subject: 'Biology', class: '9', type: 'MCQ', difficulty: 'Easy', marks: 1, addedBy: 'Mrs. Sharma', date: '2025-05-10', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'], correctAnswer: 'Mitochondria' },
  { id: '2', text: "Explain Newton's second law of motion with a real-life example.", subject: 'Physics', class: '10', type: 'Short', difficulty: 'Medium', marks: 4, addedBy: 'Mr. Verma', date: '2025-05-12' },
  { id: '3', text: 'Solve: 3x² + 5x − 2 = 0 and find the roots.', subject: 'Mathematics', class: '10', type: 'Short', difficulty: 'Medium', marks: 3, addedBy: 'Mrs. Gupta', date: '2025-05-14' },
  { id: '4', text: 'Write a detailed essay on the causes and consequences of World War I.', subject: 'History', class: '11', type: 'Long', difficulty: 'Hard', marks: 10, addedBy: 'Mr. Khan', date: '2025-05-15' },
  { id: '5', text: 'Which gas is released by plants during photosynthesis?', subject: 'Biology', class: '8', type: 'MCQ', difficulty: 'Easy', marks: 1, addedBy: 'Mrs. Sharma', date: '2025-05-16', options: ['CO₂', 'N₂', 'O₂', 'H₂'], correctAnswer: 'O₂' },
  { id: '6', text: 'What is the chemical formula of water?', subject: 'Chemistry', class: '7', type: 'MCQ', difficulty: 'Easy', marks: 1, addedBy: 'Mr. Patel', date: '2025-05-17', options: ['H₂O', 'CO₂', 'NaCl', 'H₂SO₄'], correctAnswer: 'H₂O' },
  { id: '7', text: 'Describe the water cycle with a labelled diagram and explanation.', subject: 'Geography', class: '8', type: 'Long', difficulty: 'Medium', marks: 8, addedBy: 'Ms. Reddy', date: '2025-05-18' },
  { id: '8', text: 'What is the speed of light in a vacuum?', subject: 'Physics', class: '11', type: 'MCQ', difficulty: 'Easy', marks: 1, addedBy: 'Mr. Verma', date: '2025-05-19', options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], correctAnswer: '3×10⁸ m/s' },
  { id: '9', text: 'Explain the difference between mitosis and meiosis in detail.', subject: 'Biology', class: '12', type: 'Long', difficulty: 'Hard', marks: 10, addedBy: 'Mrs. Sharma', date: '2025-05-20' },
  { id: '10', text: 'Find the area of a circle with radius 7 cm. (Use π = 22/7)', subject: 'Mathematics', class: '8', type: 'Short', difficulty: 'Easy', marks: 2, addedBy: 'Mrs. Gupta', date: '2025-05-21' },
]

const SUBJECTS = ['All', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'History', 'Geography']
const CLASSES = ['All', '7', '8', '9', '10', '11', '12']
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']
const TYPES = ['All', 'MCQ', 'Short', 'Long']

const diffColor: Record<string, string> = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard: 'bg-red-100 text-red-700',
}
const typeColor: Record<string, string> = {
  MCQ: 'bg-blue-100 text-blue-700',
  Short: 'bg-purple-100 text-purple-700',
  Long: 'bg-orange-100 text-orange-700',
}

const subjectStats = [
  { subject: 'Mathematics', count: 68 },
  { subject: 'Physics', count: 52 },
  { subject: 'Biology', count: 61 },
  { subject: 'Chemistry', count: 45 },
  { subject: 'History', count: 32 },
  { subject: 'Geography', count: 26 },
]

const emptyForm = {
  text: '', subject: 'Mathematics', class: '10',
  type: 'MCQ' as Question['type'], difficulty: 'Easy' as Question['difficulty'],
  marks: 1, addedBy: '', options: ['', '', '', ''], correctAnswer: '',
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(MOCK)
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [classFilter, setClassFilter] = useState('All')
  const [diffFilter, setDiffFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [modal, setModal] = useState<'add' | 'view' | null>(null)
  const [selected, setSelected] = useState<Question | null>(null)
  const [form, setForm] = useState({ ...emptyForm, options: ['', '', '', ''] })

  const filtered = useMemo(() => questions.filter(q => {
    const matchSearch = q.text.toLowerCase().includes(search.toLowerCase()) ||
      q.subject.toLowerCase().includes(search.toLowerCase())
    const matchSubject = subjectFilter === 'All' || q.subject === subjectFilter
    const matchClass = classFilter === 'All' || q.class === classFilter
    const matchDiff = diffFilter === 'All' || q.difficulty === diffFilter
    const matchType = typeFilter === 'All' || q.type === typeFilter
    return matchSearch && matchSubject && matchClass && matchDiff && matchType
  }), [questions, search, subjectFilter, classFilter, diffFilter, typeFilter])

  function openAdd() { setForm({ ...emptyForm, options: ['', '', '', ''] }); setModal('add') }
  function openView(q: Question) { setSelected(q); setModal('view') }
  function closeModal() { setModal(null); setSelected(null) }

  function handleSave() {
    const newQ: Question = {
      id: String(Date.now()), text: form.text, subject: form.subject, class: form.class,
      type: form.type, difficulty: form.difficulty, marks: form.marks, addedBy: form.addedBy,
      date: new Date().toISOString().slice(0, 10),
      ...(form.type === 'MCQ' ? { options: [...form.options], correctAnswer: form.correctAnswer } : {}),
    }
    setQuestions(prev => [newQ, ...prev])
    closeModal()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
          <p className="text-gray-500 text-sm mt-1">284 total questions · {filtered.length} shown</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Plus className="w-4 h-4" /> Add Question
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Questions', value: '284', icon: HelpCircle, color: 'text-[#1e3a5f]', bg: 'bg-[#1e3a5f]/10' },
          { label: 'MCQ', value: '142', icon: BarChart2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Short Answer', value: '89', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Long Answer', value: '53', icon: Layers, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Subject breakdown */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Questions by Subject</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {subjectStats.map(s => (
            <div key={s.subject} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-700">{s.subject}</span>
              <span className="text-sm font-bold text-[#1e3a5f]">{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by keyword or subject…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
          </div>
          {[
            { label: 'Subject', val: subjectFilter, set: setSubjectFilter, opts: SUBJECTS },
            { label: 'Class', val: classFilter, set: setClassFilter, opts: CLASSES },
            { label: 'Difficulty', val: diffFilter, set: setDiffFilter, opts: DIFFICULTIES },
            { label: 'Type', val: typeFilter, set: setTypeFilter, opts: TYPES },
          ].map(f => (
            <div key={f.label} className="relative">
              <select value={f.val} onChange={e => f.set(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#1e3a5f]/40 bg-white cursor-pointer">
                {f.opts.map(o => <option key={o} value={o}>{f.label}: {o}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Question', 'Subject', 'Class', 'Type', 'Difficulty', 'Marks', 'Added By', 'Date', ''].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(q => (
                <tr key={q.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 max-w-[280px]">
                    <p className="text-sm text-gray-900 truncate" title={q.text}>{q.text}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{q.subject}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">Class {q.class}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColor[q.type]}`}>{q.type}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${diffColor[q.difficulty]}`}>{q.difficulty}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-700">{q.marks}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{q.addedBy}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">{q.date}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => openView(q)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-sm text-gray-400">No questions match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Question Modal */}
      {modal === 'add' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add New Question</h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Question Text</label>
                <textarea value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Subject', key: 'subject', opts: SUBJECTS.slice(1) },
                  { label: 'Class', key: 'class', opts: CLASSES.slice(1) },
                  { label: 'Type', key: 'type', opts: ['MCQ', 'Short', 'Long'] },
                  { label: 'Difficulty', key: 'difficulty', opts: ['Easy', 'Medium', 'Hard'] },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                    <select value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 bg-white">
                      {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Marks</label>
                  <input type="number" min={1} value={form.marks}
                    onChange={e => setForm(p => ({ ...p, marks: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Added By</label>
                  <input type="text" value={form.addedBy}
                    onChange={e => setForm(p => ({ ...p, addedBy: e.target.value }))}
                    placeholder="Teacher name"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                </div>
              </div>
              {form.type === 'MCQ' && (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Answer Options</p>
                  {form.options.map((opt, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="text-xs font-bold text-gray-400 w-5 flex-shrink-0">{String.fromCharCode(65 + i)}.</span>
                      <input value={opt} onChange={e => {
                        const opts = [...form.options]; opts[i] = e.target.value
                        setForm(p => ({ ...p, options: opts }))
                      }} placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Correct Answer</label>
                    <select value={form.correctAnswer} onChange={e => setForm(p => ({ ...p, correctAnswer: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 bg-white">
                      <option value="">Select correct option</option>
                      {form.options.map((opt, i) => opt ? <option key={i} value={opt}>{String.fromCharCode(65 + i)}. {opt}</option> : null)}
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#163050] transition-colors">Add Question</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Question Details</h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-900 font-medium leading-relaxed">{selected.text}</p>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColor[selected.type]}`}>{selected.type}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${diffColor[selected.difficulty]}`}>{selected.difficulty}</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{selected.subject}</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Class {selected.class}</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#1e3a5f]/10 text-[#1e3a5f]">{selected.marks} Marks</span>
              </div>
              {selected.type === 'MCQ' && selected.options && (
                <div className="space-y-2">
                  {selected.options.map((opt, i) => (
                    <div key={i} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm ${opt === selected.correctAnswer ? 'bg-green-50 border border-green-200 text-green-700 font-medium' : 'bg-gray-50 text-gray-700'}`}>
                      <span className="font-bold">{String.fromCharCode(65 + i)}.</span> {opt}
                      {opt === selected.correctAnswer && <span className="ml-auto text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">Correct</span>}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                <span>Added by {selected.addedBy}</span>
                <span>{selected.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
