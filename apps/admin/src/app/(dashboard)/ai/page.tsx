'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Brain, Send, Sparkles, BarChart3, FileText, Users,
  GraduationCap, MessageSquare, Lightbulb, ChevronRight, RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Message = { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  { icon: BarChart3, text: 'Show me attendance trends for this month', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { icon: GraduationCap, text: 'Which students are at risk of failing?', color: 'bg-red-50 text-red-700 border-red-200' },
  { icon: FileText, text: 'Generate a summary of last exam results', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { icon: Users, text: 'List teachers with most leaves this month', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { icon: MessageSquare, text: 'Draft a parent notice about the PTM', color: 'bg-green-50 text-green-700 border-green-200' },
  { icon: Lightbulb, text: 'Suggest ways to improve attendance rate', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
]

const AI_FEATURES = [
  { title: 'Smart Reports', desc: 'Auto-generate performance and attendance reports', icon: BarChart3, color: 'bg-blue-500' },
  { title: 'Risk Detection', desc: 'Identify at-risk students early with ML models', icon: GraduationCap, color: 'bg-red-500' },
  { title: 'Notice Drafting', desc: 'AI-generated notices and communications', icon: FileText, color: 'bg-purple-500' },
  { title: 'Fee Prediction', desc: 'Predict defaulters and optimize collection', icon: BarChart3, color: 'bg-green-500' },
]

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content: `Hello! I'm the KVL School AI Assistant, powered by GPT-4o. I can help you with:

• **Analytics & Reports** — attendance, fees, exam results
• **Student Insights** — identify at-risk students, track progress
• **Communication** — draft notices, messages, and announcements
• **Administrative Tasks** — timetable optimization, resource allocation

What would you like to explore today?`,
  },
]

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    await new Promise(r => setTimeout(r, 1200))

    const responses: Record<string, string> = {
      'attendance': `**Attendance Summary — May 2026**\n\n• Overall rate: **93.8%** (↑ from 93.4% last month)\n• Best class: XII-A at **96.2%**\n• Needs attention: IX-B at **90.5%** (below 91% threshold)\n\n**Recommendation:** Send automated reminders to parents of students in IX-B with attendance below 85%.`,
      'fail': `**At-Risk Students — Academic Alert**\n\nI've identified **23 students** at risk of failing based on:\n• Attendance < 75%\n• Score < 40% in last 2 tests\n• Incomplete homework > 60%\n\nTop 3 critical cases:\n1. **Arjun Patel** (VIII-C) — 68% attendance, 38% avg score\n2. **Vikram Yadav** (IX-B) — 72% attendance, 41% avg score\n3. **Meena Joshi** (VII-A) — 70% attendance, 35% avg score\n\nShall I generate report cards or notify their parents?`,
      'exam': `**Last Exam Results Summary**\n\n• Total students: 4,218 | Appeared: 4,102 | Passed: 3,972\n• **Pass rate: 96.8%** (up 1.2% vs previous)\n• Overall average: **79.4%**\n\nTop performers:\n• XII-A class average: 86%\n• Subject topper (Mathematics): Fatima Ansari — 99%\n\nAreas of concern:\n• Mathematics fail rate: 4.2% (highest)\n• 47 students scored below 35% in Physics`,
      'ptm': `**Draft Notice — Parent-Teacher Meeting**\n\n---\nDear Parents,\n\nWe are pleased to invite you to the **Parent-Teacher Meeting (PTM)** for the academic year 2025-26.\n\n📅 **Date:** Saturday, June 12, 2026\n⏰ **Time:** 9:00 AM – 1:00 PM\n📍 **Venue:** School Auditorium & Respective Classrooms\n\nThis meeting provides an opportunity to:\n• Discuss your child's academic progress\n• Meet with subject teachers\n• Address any concerns or queries\n\nKindly ensure attendance. Please carry your child's report card.\n\nWarm regards,\n**KVL International School**\n---\n\nShall I send this to all parents via SMS and app notification?`,
    }

    let reply = `Thank you for your query: "${text}"\n\nI'm analyzing the school data to provide you with accurate insights. This is a demo interface — in production, I'll connect to live school data through the KVL API to give you real-time analytics, predictions, and recommendations.`

    const lowerText = text.toLowerCase()
    if (lowerText.includes('attend')) reply = responses['attendance']
    else if (lowerText.includes('risk') || lowerText.includes('fail')) reply = responses['fail']
    else if (lowerText.includes('exam') || lowerText.includes('result')) reply = responses['exam']
    else if (lowerText.includes('ptm') || lowerText.includes('parent') || lowerText.includes('notice')) reply = responses['ptm']

    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            AI Assistant
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Powered by GPT-4o — school intelligence at your fingertips</p>
        </div>
        <button onClick={() => setMessages(INITIAL_MESSAGES)} className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
          <RefreshCw className="w-4 h-4" /> New Chat
        </button>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {AI_FEATURES.map(f => (
          <div key={f.title} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', f.color)}>
              <f.icon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{f.title}</p>
              <p className="text-xs text-gray-400">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 flex flex-col" style={{ height: '500px' }}>
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">KVL AI Assistant</p>
              <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />Online</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn('max-w-[85%] rounded-2xl px-4 py-3 text-sm', m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800')}>
                  <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                placeholder="Ask anything about the school..."
                className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-800 text-sm">Quick Suggestions</h2>
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s.text)}
              className={cn('w-full text-left p-3 rounded-xl border text-sm flex items-center gap-3 hover:shadow-sm transition-shadow', s.color)}
            >
              <s.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{s.text}</span>
              <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-60" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
