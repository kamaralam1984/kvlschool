'use client'

import React, { useState } from 'react'
import {
  Zap, Play, Pause, Plus, Settings, Clock, Bell,
  Mail, Phone, CheckCircle, AlertCircle, Edit, Trash2, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const WORKFLOWS = [
  {
    id: 'WF001', name: 'Fee Reminder - 3 Days Before Due', trigger: 'Fee due in 3 days', actions: ['Send SMS to parent', 'Send Email to parent'],
    status: 'Active', runs: 142, lastRun: '2026-05-30', category: 'Finance',
  },
  {
    id: 'WF002', name: 'Absent Student Alert', trigger: 'Student marked absent', actions: ['Send SMS to parent within 5 min'],
    status: 'Active', runs: 3840, lastRun: '2026-05-31', category: 'Attendance',
  },
  {
    id: 'WF003', name: 'New Admission Welcome', trigger: 'Student admitted', actions: ['Send welcome email', 'Create student ID', 'Add to WhatsApp group'],
    status: 'Active', runs: 43, lastRun: '2026-05-25', category: 'Admissions',
  },
  {
    id: 'WF004', name: 'Low Attendance Warning', trigger: 'Attendance drops below 75%', actions: ['Alert class teacher', 'Email parent', 'Flag on dashboard'],
    status: 'Active', runs: 18, lastRun: '2026-05-28', category: 'Attendance',
  },
  {
    id: 'WF005', name: 'Exam Result Published', trigger: 'Results published by teacher', actions: ['Notify students via app', 'Email parents report card'],
    status: 'Inactive', runs: 12, lastRun: '2026-05-10', category: 'Exams',
  },
  {
    id: 'WF006', name: 'Library Book Overdue', trigger: 'Book overdue by 1 day', actions: ['Send reminder to student', 'Fine calculation', 'Notify librarian'],
    status: 'Active', runs: 47, lastRun: '2026-05-29', category: 'Library',
  },
]

const TEMPLATES = [
  { name: 'Fee Collection Campaign', desc: 'Multi-step reminder sequence for fee collection', icon: '💰', category: 'Finance' },
  { name: 'PTM Invite & Reminder', desc: 'Automated invite + 3 reminders before PTM', icon: '👨‍👩‍👧', category: 'Events' },
  { name: 'Exam Prep Alert', desc: 'Study tips and schedule 7 days before exam', icon: '📝', category: 'Exams' },
  { name: 'Holiday Notification', desc: 'Instant multi-channel holiday announcement', icon: '🎉', category: 'Admin' },
  { name: 'New Teacher Onboarding', desc: 'Auto-setup credentials, send welcome kit', icon: '👩‍🏫', category: 'HR' },
  { name: 'Monthly Report Dispatch', desc: 'Auto-generate and email monthly reports', icon: '📊', category: 'Analytics' },
]

const categoryColor: Record<string, string> = {
  Finance: 'bg-green-100 text-green-700',
  Attendance: 'bg-blue-100 text-blue-700',
  Admissions: 'bg-purple-100 text-purple-700',
  Exams: 'bg-orange-100 text-orange-700',
  Library: 'bg-amber-100 text-amber-700',
  HR: 'bg-indigo-100 text-indigo-700',
  Events: 'bg-pink-100 text-pink-700',
  Admin: 'bg-gray-100 text-gray-600',
  Analytics: 'bg-teal-100 text-teal-700',
}

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState(WORKFLOWS)
  const [activeTab, setActiveTab] = useState<'workflows' | 'templates' | 'logs'>('workflows')

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: w.status === 'Active' ? 'Inactive' : 'Active' } : w))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Automation
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Automated workflows, triggers and actions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
          <Plus className="w-4 h-4" /> Create Workflow
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Workflows', value: workflows.filter(w => w.status === 'Active').length, icon: Zap, color: 'bg-yellow-400', sub: 'running automatically' },
          { label: 'Total Runs (This Month)', value: '4,102', icon: Play, color: 'bg-green-500', sub: 'actions executed' },
          { label: 'SMS Sent', value: '1,840', icon: Phone, color: 'bg-blue-500', sub: 'this month' },
          { label: 'Emails Sent', value: '2,262', icon: Mail, color: 'bg-purple-500', sub: 'this month' },
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

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['workflows', 'templates', 'logs'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-1.5 text-sm rounded-md capitalize transition-all', activeTab === tab ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700')}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'workflows' && (
        <div className="space-y-3">
          {workflows.map(w => (
            <div key={w.id} className={cn('bg-white rounded-xl border p-5 transition-all', w.status === 'Active' ? 'border-gray-100' : 'border-gray-100 opacity-70')}>
              <div className="flex items-start gap-4">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', w.status === 'Active' ? 'bg-yellow-400' : 'bg-gray-200')}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{w.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', categoryColor[w.category])}>{w.category}</span>
                        <span className="text-xs text-gray-400">ID: {w.id}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleWorkflow(w.id)}
                        className={cn('relative w-11 h-6 rounded-full transition-colors', w.status === 'Active' ? 'bg-yellow-400' : 'bg-gray-300')}
                      >
                        <span className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', w.status === 'Active' ? 'translate-x-5' : 'translate-x-0.5')} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Trigger: {w.trigger}</span>
                    <span className="flex items-center gap-1"><Play className="w-3 h-3" />{w.runs} runs total</span>
                    <span>Last run: {w.lastRun}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {w.actions.map((a, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs flex items-center gap-1">
                        <ChevronRight className="w-3 h-3" />{a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-1">
                  <button className="p-1.5 hover:bg-yellow-50 rounded text-gray-400 hover:text-yellow-600"><Edit className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map(t => (
            <div key={t.name} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{t.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">{t.name}</h3>
                  <span className={cn('inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium', categoryColor[t.category])}>{t.category}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">{t.desc}</p>
              <button className="mt-4 w-full py-1.5 text-xs border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors">
                Use Template
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Recent Automation Logs</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { time: '10:42 AM', workflow: 'Absent Student Alert', action: 'SMS sent to Aisha Khan\'s parent', status: 'Success' },
              { time: '10:38 AM', workflow: 'Absent Student Alert', action: 'SMS sent to Rohan Mehta\'s parent', status: 'Success' },
              { time: '09:15 AM', workflow: 'Fee Reminder - 3 Days Before Due', action: 'Email + SMS sent to 14 parents', status: 'Success' },
              { time: 'Yesterday', workflow: 'Library Book Overdue', action: 'Reminder sent to Rohan Mehta', status: 'Success' },
              { time: 'Yesterday', workflow: 'Low Attendance Warning', action: 'Alert sent to class teacher for IX-B', status: 'Failed' },
            ].map((log, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-4 hover:bg-gray-50 text-sm">
                <div className={cn('w-2 h-2 rounded-full flex-shrink-0', log.status === 'Success' ? 'bg-green-400' : 'bg-red-400')} />
                <span className="text-gray-400 text-xs w-20 flex-shrink-0">{log.time}</span>
                <span className="text-gray-500 text-xs w-48 flex-shrink-0 truncate">{log.workflow}</span>
                <span className="text-gray-700 flex-1 text-xs">{log.action}</span>
                <span className={cn('text-xs font-medium flex-shrink-0', log.status === 'Success' ? 'text-green-600' : 'text-red-500')}>{log.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
