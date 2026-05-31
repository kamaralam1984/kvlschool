'use client'
import React, { useState } from 'react'
import {
  Zap, Plus, Play, ToggleLeft, ToggleRight, ChevronDown, X, CheckCircle2,
  MessageSquare, Mail, Bell, Phone, FileText, RefreshCw, Award, BarChart2,
  Calendar, AlertCircle, Users, Trash2, GitBranch, Clock, Activity,
  ArrowDown, Filter, GraduationCap, ShoppingBag, Gift, Save
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type TriggerType =
  | 'Fee Due'
  | 'Student Absent'
  | 'New Admission'
  | 'Exam Completed'
  | 'Low Stock'
  | 'Birthday'
  | 'Custom Date'

type ActionType =
  | 'Send WhatsApp'
  | 'Send SMS'
  | 'Send Email'
  | 'Send Push Notification'
  | 'Create Task'
  | 'Update Status'
  | 'Generate Certificate'
  | 'Add to Report'

type ConditionOp = 'AND' | 'OR'

interface Condition {
  id: string
  field: string
  operator: string
  value: string
  logic: ConditionOp
}

interface Action {
  id: string
  type: ActionType
  recipient: string
  message: string
}

interface Workflow {
  id: string
  name: string
  trigger: TriggerType
  triggerDetail: string
  conditions: Condition[]
  actions: Action[]
  enabled: boolean
  runCount: number
  lastTriggered: string
  createdAt: string
  color: string
}

// ─── Mock Saved Workflows ────────────────────────────────────────────────────
const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: 'w1',
    name: 'Fee Reminder — 3 Days Before',
    trigger: 'Fee Due',
    triggerDetail: '3 days before due date',
    conditions: [{ id: 'c1', field: 'Amount', operator: '>', value: '₹5,000', logic: 'AND' }],
    actions: [
      { id: 'a1', type: 'Send WhatsApp', recipient: 'Parent', message: 'Dear {parent_name}, fee of ₹{amount} is due on {due_date}.' },
      { id: 'a2', type: 'Send SMS', recipient: 'Parent', message: 'Fee reminder: ₹{amount} due on {due_date}.' },
    ],
    enabled: true,
    runCount: 342,
    lastTriggered: '2025-05-31 09:15',
    createdAt: '2025-01-10',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    id: 'w2',
    name: 'Absent Alert to Parents',
    trigger: 'Student Absent',
    triggerDetail: 'Marked absent at roll call',
    conditions: [],
    actions: [
      { id: 'a3', type: 'Send Email', recipient: 'Parent', message: 'Your child {student_name} was absent today ({date}).' },
      { id: 'a4', type: 'Send SMS', recipient: 'Parent', message: '{student_name} marked absent. Please contact the school.' },
    ],
    enabled: true,
    runCount: 87,
    lastTriggered: '2025-05-31 08:45',
    createdAt: '2025-01-15',
    color: 'bg-red-50 text-red-600 border-red-100',
  },
  {
    id: 'w3',
    name: 'Welcome New Student',
    trigger: 'New Admission',
    triggerDetail: 'On enrollment confirmation',
    conditions: [],
    actions: [
      { id: 'a5', type: 'Send Email', recipient: 'Parent', message: 'Welcome to KVL International School, {student_name}!' },
      { id: 'a6', type: 'Send WhatsApp', recipient: 'Parent', message: 'Welcome to KVL! We are excited to have {student_name} join us.' },
    ],
    enabled: true,
    runCount: 56,
    lastTriggered: '2025-05-28 14:20',
    createdAt: '2025-01-08',
    color: 'bg-green-50 text-green-600 border-green-100',
  },
  {
    id: 'w4',
    name: 'Exam Result Notification',
    trigger: 'Exam Completed',
    triggerDetail: 'When results are published',
    conditions: [],
    actions: [
      { id: 'a7', type: 'Send SMS', recipient: 'Parent', message: '{student_name} scored {marks} in {exam_name}. View full report on portal.' },
    ],
    enabled: false,
    runCount: 1240,
    lastTriggered: '2025-04-15 17:00',
    createdAt: '2025-01-12',
    color: 'bg-purple-50 text-purple-600 border-purple-100',
  },
  {
    id: 'w5',
    name: 'Birthday Wishes',
    trigger: 'Birthday',
    triggerDetail: 'On student birthday at 8:00 AM',
    conditions: [],
    actions: [
      { id: 'a8', type: 'Send WhatsApp', recipient: 'Student', message: 'Happy Birthday {student_name}! 🎂 Wishing you a wonderful day from KVL Family!' },
    ],
    enabled: true,
    runCount: 122,
    lastTriggered: '2025-05-30 08:00',
    createdAt: '2025-01-20',
    color: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  },
  {
    id: 'w6',
    name: 'Low Stock Alert',
    trigger: 'Low Stock',
    triggerDetail: 'When stock falls below threshold',
    conditions: [{ id: 'c2', field: 'Stock Level', operator: '<', value: '10 units', logic: 'AND' }],
    actions: [
      { id: 'a9', type: 'Create Task', recipient: 'Store Manager', message: 'Reorder {item_name}. Current stock: {stock_count} units.' },
      { id: 'a10', type: 'Send Email', recipient: 'Admin', message: 'Low stock alert for {item_name}. Please reorder.' },
    ],
    enabled: true,
    runCount: 34,
    lastTriggered: '2025-05-29 11:30',
    createdAt: '2025-02-01',
    color: 'bg-orange-50 text-orange-600 border-orange-100',
  },
  {
    id: 'w7',
    name: 'Monthly Fee Defaulter Report',
    trigger: 'Custom Date',
    triggerDetail: '1st of every month at 9:00 AM',
    conditions: [{ id: 'c3', field: 'Days Overdue', operator: '>', value: '30 days', logic: 'AND' }],
    actions: [
      { id: 'a11', type: 'Add to Report', recipient: 'Finance Team', message: 'Auto-generate defaulter list for month {month}.' },
      { id: 'a12', type: 'Send Email', recipient: 'Principal', message: 'Monthly fee defaulter report is ready. {count} students pending.' },
    ],
    enabled: true,
    runCount: 5,
    lastTriggered: '2025-05-01 09:00',
    createdAt: '2025-01-05',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  },
  {
    id: 'w8',
    name: 'TC / Certificate Generator',
    trigger: 'New Admission',
    triggerDetail: 'Triggered manually or on withdrawal',
    conditions: [],
    actions: [
      { id: 'a13', type: 'Generate Certificate', recipient: 'Student', message: 'Generate Transfer Certificate for {student_name}, Class {class}.' },
    ],
    enabled: false,
    runCount: 18,
    lastTriggered: '2025-05-12 10:00',
    createdAt: '2025-03-01',
    color: 'bg-teal-50 text-teal-600 border-teal-100',
  },
]

// ─── Constants ────────────────────────────────────────────────────────────────
const TRIGGER_OPTIONS: { value: TriggerType; icon: React.ElementType; color: string; desc: string }[] = [
  { value: 'Fee Due', icon: AlertCircle, color: 'text-blue-500', desc: 'Triggers before/on fee due date' },
  { value: 'Student Absent', icon: Users, color: 'text-red-500', desc: 'Triggers when absence is marked' },
  { value: 'New Admission', icon: GraduationCap, color: 'text-green-500', desc: 'Triggers on student enrollment' },
  { value: 'Exam Completed', icon: FileText, color: 'text-purple-500', desc: 'Triggers when results are published' },
  { value: 'Low Stock', icon: ShoppingBag, color: 'text-orange-500', desc: 'Triggers when inventory is low' },
  { value: 'Birthday', icon: Gift, color: 'text-yellow-500', desc: 'Triggers on student birthday' },
  { value: 'Custom Date', icon: Calendar, color: 'text-indigo-500', desc: 'Triggers on a specific date/time' },
]

const ACTION_OPTIONS: { value: ActionType; icon: React.ElementType; color: string; bg: string }[] = [
  { value: 'Send WhatsApp', icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50' },
  { value: 'Send SMS', icon: Phone, color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: 'Send Email', icon: Mail, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { value: 'Send Push Notification', icon: Bell, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { value: 'Create Task', icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50' },
  { value: 'Update Status', icon: RefreshCw, color: 'text-purple-600', bg: 'bg-purple-50' },
  { value: 'Generate Certificate', icon: Award, color: 'text-orange-600', bg: 'bg-orange-50' },
  { value: 'Add to Report', icon: BarChart2, color: 'text-red-600', bg: 'bg-red-50' },
]

const CONDITION_FIELDS = ['Amount', 'Class', 'Days Overdue', 'Stock Level', 'Marks', 'Student Age', 'Grade']
const CONDITION_OPS = ['>', '<', '=', '>=', '<=', '!=', 'contains']
const RECIPIENTS = ['Parent', 'Student', 'Teacher', 'Admin', 'Principal', 'Finance Team', 'Store Manager', 'All Staff']

const TEMPLATES: { name: string; trigger: TriggerType; triggerDetail: string; actions: Omit<Action, 'id'>[]; conditions: Omit<Condition, 'id'>[] }[] = [
  { name: 'Fee Reminder', trigger: 'Fee Due', triggerDetail: '3 days before due date', conditions: [], actions: [{ type: 'Send WhatsApp', recipient: 'Parent', message: 'Dear {parent_name}, fee of ₹{amount} is due on {due_date}. Please pay to avoid late charges.' }, { type: 'Send SMS', recipient: 'Parent', message: 'Fee reminder: ₹{amount} due on {due_date} for {student_name}.' }] },
  { name: 'Absent Alert', trigger: 'Student Absent', triggerDetail: 'Immediately when marked absent', conditions: [], actions: [{ type: 'Send Email', recipient: 'Parent', message: 'Dear Parent, {student_name} was absent on {date}.' }, { type: 'Send SMS', recipient: 'Parent', message: '{student_name} marked absent today. Please inform school.' }] },
  { name: 'Welcome New Student', trigger: 'New Admission', triggerDetail: 'On admission confirmation', conditions: [], actions: [{ type: 'Send Email', recipient: 'Parent', message: 'Welcome to KVL International School! We are delighted to have {student_name} join Class {class}.' }, { type: 'Send WhatsApp', recipient: 'Parent', message: 'Welcome to the KVL family! {student_name} is enrolled in Class {class}. See you on {join_date}!' }] },
  { name: 'Exam Result', trigger: 'Exam Completed', triggerDetail: 'When results are published', conditions: [], actions: [{ type: 'Send SMS', recipient: 'Parent', message: '{student_name} scored {marks}/{total} in {exam_name}. View detailed report at kvl.in/results' }] },
  { name: 'Birthday Wish', trigger: 'Birthday', triggerDetail: 'On student birthday at 8:00 AM', conditions: [], actions: [{ type: 'Send WhatsApp', recipient: 'Student', message: 'Happy Birthday {student_name}! Wishing you joy, success, and laughter on your special day. With love, KVL Family!' }] },
]

// ─── Sub-components ──────────────────────────────────────────────────────────
function ActionIcon({ type }: { type: ActionType }) {
  const opt = ACTION_OPTIONS.find(a => a.value === type)
  if (!opt) return null
  const Icon = opt.icon
  return (
    <div className={`w-8 h-8 ${opt.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
      <Icon className={`w-4 h-4 ${opt.color}`} />
    </div>
  )
}

function TriggerIcon({ type, size = 'sm' }: { type: TriggerType; size?: 'sm' | 'md' }) {
  const opt = TRIGGER_OPTIONS.find(t => t.value === type)
  if (!opt) return null
  const Icon = opt.icon
  const sz = size === 'md' ? 'w-5 h-5' : 'w-4 h-4'
  return <Icon className={`${sz} ${opt.color}`} />
}

function SelectBox({ value, onChange, options, className = '' }: { value: string; onChange: (v: string) => void; options: string[]; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 bg-white">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  )
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-in slide-in-from-bottom-4">
      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
      {message}
    </div>
  )
}

// ─── Workflow Builder ─────────────────────────────────────────────────────────
interface BuilderState {
  name: string
  trigger: TriggerType
  triggerDetail: string
  conditions: Condition[]
  actions: Action[]
}

function WorkflowBuilder({
  initial,
  onSave,
  onCancel,
}: {
  initial?: BuilderState | null
  onSave: (w: BuilderState) => void
  onCancel: () => void
}) {
  const [state, setState] = useState<BuilderState>(
    initial ?? {
      name: '',
      trigger: 'Fee Due',
      triggerDetail: '3 days before due date',
      conditions: [],
      actions: [{ id: Date.now().toString(), type: 'Send WhatsApp', recipient: 'Parent', message: '' }],
    }
  )

  function set<K extends keyof BuilderState>(k: K, v: BuilderState[K]) {
    setState(s => ({ ...s, [k]: v }))
  }

  function addCondition() {
    set('conditions', [...state.conditions, { id: Date.now().toString(), field: 'Amount', operator: '>', value: '', logic: 'AND' }])
  }

  function updateCondition(id: string, key: keyof Condition, val: string) {
    set('conditions', state.conditions.map(c => c.id === id ? { ...c, [key]: val } : c))
  }

  function removeCondition(id: string) {
    set('conditions', state.conditions.filter(c => c.id !== id))
  }

  function addAction() {
    set('actions', [...state.actions, { id: Date.now().toString(), type: 'Send SMS', recipient: 'Parent', message: '' }])
  }

  function updateAction(id: string, key: keyof Action, val: string) {
    set('actions', state.actions.map(a => a.id === id ? { ...a, [key]: val } : a))
  }

  function removeAction(id: string) {
    set('actions', state.actions.filter(a => a.id !== id))
  }

  const triggerOpt = TRIGGER_OPTIONS.find(t => t.value === state.trigger)!
  const TriggerIconComp = triggerOpt.icon

  return (
    <div className="space-y-4">
      {/* Workflow Name */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Workflow Name</label>
        <input
          value={state.name}
          onChange={e => set('name', e.target.value)}
          placeholder="e.g. Fee Reminder — Monthly"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
        />
      </div>

      {/* TRIGGER Block */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 bg-[#1e3a5f] text-white">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm tracking-wide uppercase">Trigger</span>
          <span className="ml-auto text-xs text-white/70">When this happens…</span>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Trigger Event</label>
              <div className="relative">
                <select
                  value={state.trigger}
                  onChange={e => set('trigger', e.target.value as TriggerType)}
                  className="appearance-none w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 bg-white"
                >
                  {TRIGGER_OPTIONS.map(t => <option key={t.value}>{t.value}</option>)}
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <TriggerIconComp className={`w-4 h-4 ${triggerOpt.color}`} />
                </div>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 pl-1">{triggerOpt.desc}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Trigger Detail</label>
              <input
                value={state.triggerDetail}
                onChange={e => set('triggerDetail', e.target.value)}
                placeholder="e.g. 3 days before due date"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONDITION Block */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 bg-gray-700 text-white">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <Filter className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm tracking-wide uppercase">Condition</span>
          <span className="ml-auto text-xs text-white/70">Only if… (optional)</span>
        </div>
        <div className="p-5 space-y-3">
          {state.conditions.length === 0 && (
            <p className="text-xs text-gray-400 italic">No conditions — workflow runs on every trigger event.</p>
          )}
          {state.conditions.map((cond, idx) => (
            <div key={cond.id} className="flex items-center gap-2 flex-wrap">
              {idx > 0 && (
                <div className="w-full">
                  <div className="flex gap-1 w-fit">
                    {(['AND', 'OR'] as ConditionOp[]).map(op => (
                      <button key={op} onClick={() => updateCondition(cond.id, 'logic', op)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${cond.logic === op ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        {op}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <SelectBox value={cond.field} onChange={v => updateCondition(cond.id, 'field', v)} options={CONDITION_FIELDS} className="flex-1 min-w-28" />
              <SelectBox value={cond.operator} onChange={v => updateCondition(cond.id, 'operator', v)} options={CONDITION_OPS} className="w-24" />
              <input value={cond.value} onChange={e => updateCondition(cond.id, 'value', e.target.value)}
                placeholder="Value…"
                className="flex-1 min-w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
              <button onClick={() => removeCondition(cond.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={addCondition}
            className="flex items-center gap-1.5 text-xs text-[#1e3a5f] font-medium hover:text-[#163050] transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Condition
          </button>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 text-gray-300">
          <div className="w-px h-4 bg-gray-200" />
          <ArrowDown className="w-4 h-4" />
          <div className="w-px h-4 bg-gray-200" />
        </div>
      </div>

      {/* ACTION Blocks */}
      <div className="space-y-3">
        {state.actions.map((action, idx) => {
          const opt = ACTION_OPTIONS.find(a => a.value === action.type)!
          const ActionIconComp = opt.icon
          return (
            <div key={action.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <div className={`flex items-center gap-3 px-5 py-3 ${opt.bg}`}>
                <div className="w-7 h-7 bg-white/70 rounded-lg flex items-center justify-center">
                  <ActionIconComp className={`w-4 h-4 ${opt.color}`} />
                </div>
                <span className={`font-semibold text-sm ${opt.color}`}>Action {idx + 1}</span>
                <span className="ml-auto text-xs text-gray-500">Then do this…</span>
                {state.actions.length > 1 && (
                  <button onClick={() => removeAction(action.id)} className="p-1 rounded-lg hover:bg-white/60 text-gray-400 hover:text-red-500 transition-colors ml-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Action Type</label>
                    <div className="relative">
                      <select value={action.type} onChange={e => updateAction(action.id, 'type', e.target.value)}
                        className="appearance-none w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 bg-white">
                        {ACTION_OPTIONS.map(a => <option key={a.value}>{a.value}</option>)}
                      </select>
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <ActionIconComp className={`w-4 h-4 ${opt.color}`} />
                      </div>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Recipient</label>
                    <SelectBox value={action.recipient} onChange={v => updateAction(action.id, 'recipient', v)} options={RECIPIENTS} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Message Template
                    <span className="ml-2 text-gray-400 font-normal">Use {'{'} {'}'} for dynamic variables</span>
                  </label>
                  <textarea value={action.message} onChange={e => updateAction(action.id, 'message', e.target.value)}
                    placeholder="e.g. Dear {parent_name}, the fee of ₹{amount} is due on {due_date}."
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 resize-none" />
                  <p className="text-xs text-gray-400 mt-1">
                    Variables: {'{student_name}'} {'{parent_name}'} {'{amount}'} {'{due_date}'} {'{date}'} {'{class}'} {'{marks}'}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
        <button onClick={addAction}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-500 hover:border-[#1e3a5f]/40 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/5 transition-all font-medium">
          <Plus className="w-4 h-4" /> Add Another Action
        </button>
      </div>

      {/* Save / Cancel */}
      <div className="flex gap-3">
        <button onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium">
          Cancel
        </button>
        <button onClick={() => onSave(state)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#d4a017] text-white rounded-xl text-sm font-semibold hover:bg-[#b8891a] transition-colors">
          <Save className="w-4 h-4" /> Save Workflow
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS)
  const [selected, setSelected] = useState<string | null>('w1')
  const [building, setBuilding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [testRunning, setTestRunning] = useState<string | null>(null)

  const activeCount = workflows.filter(w => w.enabled).length
  const triggeredToday = 23
  const sentThisMonth = 1847

  function toggleWorkflow(id: string) {
    setWorkflows(wws => wws.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w))
  }

  function deleteWorkflow(id: string) {
    setWorkflows(wws => wws.filter(w => w.id !== id))
    if (selected === id) setSelected(null)
  }

  function handleSave(state: BuilderState) {
    if (editingId) {
      setWorkflows(wws => wws.map(w => w.id === editingId ? { ...w, ...state } : w))
      setEditingId(null)
    } else {
      const nw: Workflow = {
        id: `w${Date.now()}`,
        ...state,
        enabled: true,
        runCount: 0,
        lastTriggered: 'Never',
        createdAt: new Date().toISOString().slice(0, 10),
        color: 'bg-blue-50 text-blue-600 border-blue-100',
      }
      setWorkflows(wws => [nw, ...wws])
      setSelected(nw.id)
    }
    setBuilding(false)
    setToast('Workflow saved successfully!')
  }

  function handleTestRun(wfId: string) {
    setTestRunning(wfId)
    setTimeout(() => {
      setTestRunning(null)
      setToast('Test run completed! Mock messages sent successfully.')
    }, 1800)
  }

  function applyTemplate(tpl: typeof TEMPLATES[number]) {
    setBuilding(true)
    setEditingId(null)
    // We'll pass as initial to the builder via a ref trick — just set building
    setSelected(null)
  }

  const selectedWF = workflows.find(w => w.id === selected)
  const editingWF = editingId ? workflows.find(w => w.id === editingId) : null
  const builderInitial: BuilderState | null = editingWF
    ? { name: editingWF.name, trigger: editingWF.trigger, triggerDetail: editingWF.triggerDetail, conditions: editingWF.conditions, actions: editingWF.actions }
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automation Engine</h1>
          <p className="text-gray-500 text-sm mt-1">Visual IF-THEN workflows — automate messaging, tasks, and alerts</p>
        </div>
        <button
          onClick={() => { setBuilding(true); setEditingId(null); setSelected(null) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Plus className="w-4 h-4" /> New Workflow
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Workflows', value: activeCount, icon: Zap, color: 'text-[#1e3a5f]', bg: 'bg-[#1e3a5f]/10' },
          { label: 'Triggered Today', value: triggeredToday, icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Messages Sent (Month)', value: sentThisMonth.toLocaleString('en-IN'), icon: MessageSquare, color: 'text-[#d4a017]', bg: 'bg-[#d4a017]/10' },
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

      {/* Pre-built Templates */}
      {!building && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="w-4 h-4 text-[#d4a017]" />
            <h3 className="font-semibold text-gray-800 text-sm">Quick Start Templates</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {TEMPLATES.map(tpl => {
              const trigOpt = TRIGGER_OPTIONS.find(t => t.value === tpl.trigger)!
              const TIcon = trigOpt.icon
              return (
                <button key={tpl.name} onClick={() => { setBuilding(true); setEditingId(null) }}
                  className="flex flex-col items-start gap-2 p-3.5 border border-gray-100 rounded-xl hover:border-[#1e3a5f]/30 hover:bg-[#1e3a5f]/5 transition-all text-left group">
                  <div className="w-8 h-8 bg-gray-100 group-hover:bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center transition-colors">
                    <TIcon className={`w-4 h-4 ${trigOpt.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 group-hover:text-[#1e3a5f] transition-colors">{tpl.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-tight">{tpl.actions.length} action{tpl.actions.length > 1 ? 's' : ''}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Workflow List */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">Saved Workflows ({workflows.length})</h3>
          {workflows.map(wf => (
            <div
              key={wf.id}
              onClick={() => { setSelected(wf.id); setBuilding(false); setEditingId(null) }}
              className={`bg-white border rounded-xl p-4 cursor-pointer transition-all ${
                selected === wf.id && !building
                  ? 'border-[#1e3a5f]/40 shadow-sm ring-1 ring-[#1e3a5f]/10'
                  : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
              } ${!wf.enabled ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <TriggerIcon type={wf.trigger} />
                  <p className="font-semibold text-gray-800 text-sm truncate">{wf.name}</p>
                </div>
                {/* Toggle */}
                <button
                  onClick={e => { e.stopPropagation(); toggleWorkflow(wf.id) }}
                  className="flex-shrink-0 p-0.5 rounded-lg hover:bg-gray-100 transition-colors"
                  title={wf.enabled ? 'Disable' : 'Enable'}>
                  {wf.enabled
                    ? <ToggleRight className="w-6 h-6 text-green-500" />
                    : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Activity className="w-3 h-3" />{wf.runCount} runs</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />
                  {wf.lastTriggered === 'Never' ? 'Never' : wf.lastTriggered.split(' ')[0]}
                </span>
              </div>
              <div className="mt-2 flex gap-1 flex-wrap">
                {wf.actions.slice(0, 3).map(a => (
                  <ActionIcon key={a.id} type={a.type} />
                ))}
                {wf.actions.length > 3 && (
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500 font-medium">
                    +{wf.actions.length - 3}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Builder or Detail */}
        <div className="lg:col-span-8">
          {building ? (
            <WorkflowBuilder
              initial={builderInitial}
              onSave={handleSave}
              onCancel={() => { setBuilding(false); setEditingId(null) }}
            />
          ) : selectedWF ? (
            /* Workflow Detail View */
            <div className="space-y-4">
              {/* Detail Header */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${selectedWF.color.split(' ')[0]} flex items-center justify-center flex-shrink-0`}>
                      <TriggerIcon type={selectedWF.trigger} size="md" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{selectedWF.name}</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Created {selectedWF.createdAt} · {selectedWF.runCount} total runs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingId(selectedWF.id); setBuilding(true) }}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                      Edit
                    </button>
                    <button
                      onClick={() => handleTestRun(selectedWF.id)}
                      disabled={testRunning === selectedWF.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d4a017]/10 text-[#d4a017] rounded-lg text-xs font-semibold hover:bg-[#d4a017]/20 transition-colors disabled:opacity-60">
                      {testRunning === selectedWF.id
                        ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Running…</>
                        : <><Play className="w-3.5 h-3.5" /> Test Run</>}
                    </button>
                    <button
                      onClick={() => deleteWorkflow(selectedWF.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    {selectedWF.enabled
                      ? <><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Active</>
                      : <><span className="w-2 h-2 bg-gray-300 rounded-full" /> Disabled</>}
                  </span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Last triggered: {selectedWF.lastTriggered}</span>
                </div>
              </div>

              {/* Trigger */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 bg-[#1e3a5f] text-white">
                  <Zap className="w-4 h-4" />
                  <span className="font-semibold text-sm uppercase tracking-wide">Trigger</span>
                </div>
                <div className="p-5 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${selectedWF.color.split(' ')[0]} flex items-center justify-center flex-shrink-0`}>
                    <TriggerIcon type={selectedWF.trigger} size="md" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{selectedWF.trigger}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{selectedWF.triggerDetail}</p>
                  </div>
                </div>
              </div>

              {/* Conditions */}
              {selectedWF.conditions.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-3 bg-gray-700 text-white">
                    <Filter className="w-4 h-4" />
                    <span className="font-semibold text-sm uppercase tracking-wide">Conditions</span>
                  </div>
                  <div className="p-5 space-y-2">
                    {selectedWF.conditions.map((c, i) => (
                      <div key={c.id} className="flex items-center gap-2">
                        {i > 0 && <span className="text-xs font-bold text-gray-400 w-8">{c.logic}</span>}
                        <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium">
                          {c.field} {c.operator} {c.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Arrow */}
              <div className="flex justify-center py-1">
                <ArrowDown className="w-5 h-5 text-gray-300" />
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {selectedWF.actions.map((action, idx) => {
                  const opt = ACTION_OPTIONS.find(a => a.value === action.type)!
                  const AIcon = opt.icon
                  return (
                    <div key={action.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                      <div className={`flex items-center gap-3 px-5 py-3 ${opt.bg}`}>
                        <AIcon className={`w-4 h-4 ${opt.color}`} />
                        <span className={`font-semibold text-sm ${opt.color}`}>Action {idx + 1}: {action.type}</span>
                        <span className="ml-auto text-xs text-gray-400">To: {action.recipient}</span>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-gray-600 leading-relaxed italic">&ldquo;{action.message}&rdquo;</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-[#1e3a5f]/10 rounded-2xl flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-[#1e3a5f]" />
              </div>
              <p className="text-gray-700 font-semibold mb-1">Select a workflow to view</p>
              <p className="text-gray-400 text-sm">or create a new one to get started</p>
              <button onClick={() => setBuilding(true)}
                className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
                <Plus className="w-4 h-4" /> Create Workflow
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
