'use client'
import React, { useState, useEffect } from 'react'
import { Send, Bell, Mail, MessageSquare, Users, Pin, Megaphone, X, CheckCircle2, AlertCircle, Info, ChevronDown, Wifi, WifiOff, TestTube } from 'lucide-react'

type Priority = 'Low' | 'Normal' | 'High' | 'Urgent'
type Channel = 'Notice Board' | 'SMS' | 'Email' | 'All'

interface Notice {
  id: string; title: string; body: string; audience: string;
  priority: Priority; channel: Channel; sentAt: string;
  readCount: number; totalCount: number; sentBy: string;
  deliveryResults?: { channel: string; sent: number; failed: number }[]
}

interface ChannelStatus {
  sms: boolean
  whatsapp: boolean
  email: boolean
}

const MOCK: Notice[] = [
  { id: '1', title: 'Annual Sports Day — Schedule Announced', body: 'Dear Parents and Students, Annual Sports Day will be held on February 15, 2025. All students are requested to register for events by February 10.', audience: 'All Classes', priority: 'High', channel: 'All', sentAt: '2025-01-28 10:30', readCount: 3841, totalCount: 4218, sentBy: 'Principal' },
  { id: '2', title: 'Fee Payment Reminder — January 2025', body: 'This is a reminder that the last date for January fee payment is January 31, 2025. Please pay via online portal or school cashier.', audience: 'All Classes', priority: 'Urgent', channel: 'SMS', sentAt: '2025-01-25 09:00', readCount: 4100, totalCount: 4218, sentBy: 'Accounts Dept.' },
  { id: '3', title: 'Parent-Teacher Meeting — Class 10', body: 'Parents of Class 10 students are invited for PTM on February 5, 2025 from 10:00 AM to 1:00 PM.', audience: 'Class 10', priority: 'Normal', channel: 'Email', sentAt: '2025-01-22 11:00', readCount: 142, totalCount: 158, sentBy: 'Class Teacher' },
  { id: '4', title: 'Holiday Notice — Basant Panchami', body: 'The school will remain closed on February 3, 2025 on account of Basant Panchami. School will reopen on February 4.', audience: 'All Classes', priority: 'Normal', channel: 'Notice Board', sentAt: '2025-01-20 14:00', readCount: 3200, totalCount: 4218, sentBy: 'Admin' },
]

const priorityStyle: Record<Priority, string> = {
  Low:    'bg-gray-100 text-gray-600',
  Normal: 'bg-blue-100 text-blue-700',
  High:   'bg-orange-100 text-orange-700',
  Urgent: 'bg-red-100 text-red-700',
}
const priorityIcon: Record<Priority, React.ReactNode> = {
  Low: <Info className="w-3.5 h-3.5" />,
  Normal: <Bell className="w-3.5 h-3.5" />,
  High: <AlertCircle className="w-3.5 h-3.5" />,
  Urgent: <AlertCircle className="w-3.5 h-3.5" />,
}
const channelIcon: Record<Channel | string, React.ReactNode> = {
  'Notice Board': <Pin className="w-3.5 h-3.5" />,
  'SMS': <MessageSquare className="w-3.5 h-3.5" />,
  'Email': <Mail className="w-3.5 h-3.5" />,
  'All': <Megaphone className="w-3.5 h-3.5" />,
}

const AUDIENCES = ['All Classes', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Staff Only', 'Parents Only']
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

export default function CommunicationsPage() {
  const [notices, setNotices] = useState<Notice[]>(MOCK)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({
    title: '', body: '', audience: 'All Classes', priority: 'Normal' as Priority, channel: 'All' as Channel,
  })
  const [tab, setTab] = useState<'sent' | 'compose'>('sent')

  // Channel config status
  const [channelStatus, setChannelStatus] = useState<ChannelStatus | null>(null)
  const [statusLoading, setStatusLoading] = useState(true)

  // Test message state
  const [testPhone, setTestPhone] = useState('')
  const [testResult, setTestResult] = useState<{ type: 'sms' | 'whatsapp'; success: boolean; message: string } | null>(null)
  const [testSending, setTestSending] = useState<'sms' | 'whatsapp' | null>(null)
  const [showTestPanel, setShowTestPanel] = useState(false)

  // Send result feedback
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    fetch(`${API}/notifications/status`)
      .then(r => r.json())
      .then(d => { if (d.success) setChannelStatus(d.data) })
      .catch(() => setChannelStatus({ sms: false, whatsapp: false, email: false }))
      .finally(() => setStatusLoading(false))
  }, [])

  async function handleSend() {
    if (!form.title || !form.body) return
    setSending(true)
    setSendResult(null)
    try {
      const res = await fetch(`${API}/notifications/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` },
        body: JSON.stringify({ ...form, recipients: { phones: [], emails: [] } }),
      })
      const data = await res.json()
      if (data.success) {
        const notice: Notice = {
          id: data.data?.id ?? String(Date.now()),
          ...form,
          sentAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          readCount: 0, totalCount: form.audience === 'All Classes' ? 4218 : 142,
          sentBy: 'Admin',
          deliveryResults: data.data?.deliveryResults,
        }
        setNotices(prev => [notice, ...prev])
        setForm({ title: '', body: '', audience: 'All Classes', priority: 'Normal', channel: 'All' })
        setSendResult({ success: true, message: 'Notice sent successfully!' })
        setTimeout(() => { setTab('sent'); setSendResult(null) }, 1500)
      } else {
        setSendResult({ success: false, message: data.message ?? 'Failed to send notice.' })
      }
    } catch {
      // Fallback: add locally if API not reachable
      const notice: Notice = {
        id: String(Date.now()), ...form,
        sentAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        readCount: 0, totalCount: form.audience === 'All Classes' ? 4218 : 142,
        sentBy: 'Admin',
      }
      setNotices(prev => [notice, ...prev])
      setForm({ title: '', body: '', audience: 'All Classes', priority: 'Normal', channel: 'All' })
      setSendResult({ success: true, message: 'Notice saved (offline mode).' })
      setTimeout(() => { setTab('sent'); setSendResult(null) }, 1500)
    } finally {
      setSending(false)
    }
  }

  async function handleTest(type: 'sms' | 'whatsapp') {
    if (!testPhone) return
    setTestSending(type)
    setTestResult(null)
    try {
      const endpoint = type === 'sms' ? 'test-sms' : 'test-whatsapp'
      const res = await fetch(`${API}/notifications/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` },
        body: JSON.stringify({ to: testPhone }),
      })
      const data = await res.json()
      setTestResult({ type, success: data.success, message: data.success ? `Test ${type.toUpperCase()} sent! SID: ${data.data?.sid ?? 'N/A'}` : data.data?.error ?? 'Failed to send.' })
    } catch {
      setTestResult({ type, success: false, message: 'Could not reach API server.' })
    } finally {
      setTestSending(null)
    }
  }

  const StatusDot = ({ active, label }: { active: boolean; label: string }) => (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
      {active ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
      {label}
    </span>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="text-gray-500 text-sm mt-1">Send notices, SMS, and emails to students, parents, and staff</p>
        </div>
        <button onClick={() => setTab('compose')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] transition-colors">
          <Send className="w-4 h-4" /> New Notice
        </button>
      </div>

      {/* Configuration Status Banner */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Channel Status</span>
            {statusLoading ? (
              <span className="text-xs text-gray-400 animate-pulse">Checking…</span>
            ) : channelStatus ? (
              <>
                <StatusDot active={channelStatus.sms} label="SMS" />
                <StatusDot active={channelStatus.whatsapp} label="WhatsApp" />
                <StatusDot active={channelStatus.email} label="Email" />
              </>
            ) : (
              <span className="text-xs text-gray-400">Status unavailable</span>
            )}
          </div>
          <button
            onClick={() => setShowTestPanel(p => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <TestTube className="w-3.5 h-3.5" />
            {showTestPanel ? 'Hide Test Panel' : 'Test Messages'}
          </button>
        </div>

        {/* Test Panel */}
        {showTestPanel && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <p className="text-xs text-gray-500 font-medium">Send a test message to verify your Twilio configuration:</p>
            <div className="flex gap-2 flex-wrap items-center">
              <input
                value={testPhone}
                onChange={e => setTestPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 w-48"
              />
              <button
                onClick={() => handleTest('sms')}
                disabled={!testPhone || testSending !== null}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-medium hover:bg-green-700 disabled:opacity-50 transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
                {testSending === 'sms' ? 'Sending…' : 'Test SMS'}
              </button>
              <button
                onClick={() => handleTest('whatsapp')}
                disabled={!testPhone || testSending !== null}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] text-white rounded-xl text-xs font-medium hover:bg-[#1ebe5d] disabled:opacity-50 transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
                {testSending === 'whatsapp' ? 'Sending…' : 'Test WhatsApp'}
              </button>
            </div>
            {testResult && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs ${testResult.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                {testResult.success ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                <span>[{testResult.type.toUpperCase()}] {testResult.message}</span>
              </div>
            )}
            {!channelStatus?.sms && !statusLoading && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                Twilio not configured. Add <code className="font-mono">TWILIO_ACCOUNT_SID</code> and <code className="font-mono">TWILIO_AUTH_TOKEN</code> to <code className="font-mono">apps/api/.env</code>.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Sent This Month', value: notices.length, icon: Send, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Avg Read Rate', value: `${Math.round((notices.reduce((s, n) => s + (n.readCount / n.totalCount), 0) / notices.length) * 100)}%`, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Urgent Notices', value: notices.filter(n => n.priority === 'Urgent').length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center`}>
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
        {[{ key: 'sent', label: 'Sent Notices' }, { key: 'compose', label: 'Compose' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'sent' && (
        <div className="space-y-3">
          {notices.map(n => {
            const readPct = Math.round((n.readCount / n.totalCount) * 100)
            return (
              <div key={n.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="font-semibold text-gray-900 text-sm">{n.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyle[n.priority]}`}>
                        {priorityIcon[n.priority]}{n.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{n.body}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">{channelIcon[n.channel]}{n.channel}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{n.audience}</span>
                  <span>{n.sentAt}</span>
                  <span>by {n.sentBy}</span>
                  {n.deliveryResults && n.deliveryResults.length > 0 && (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="w-3 h-3" />
                      {n.deliveryResults.map(d => `${d.channel}: ${d.sent} sent`).join(' · ')}
                    </span>
                  )}
                  <div className="ml-auto flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${readPct}%` }} />
                    </div>
                    <span className="text-gray-600 font-medium">{readPct}% read ({n.readCount.toLocaleString()})</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'compose' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-800">Compose New Notice</h3>

          {/* Send result feedback */}
          {sendResult && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm border ${sendResult.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
              {sendResult.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {sendResult.message}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Subject / Title *</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Annual Sports Day — Schedule Announced"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 focus:ring-1 focus:ring-[#1e3a5f]/10" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Message *</label>
            <textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
              rows={5} placeholder="Type your notice / announcement here…"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 focus:ring-1 focus:ring-[#1e3a5f]/10 resize-none" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Send To', key: 'audience', opts: AUDIENCES },
              { label: 'Priority', key: 'priority', opts: ['Low', 'Normal', 'High', 'Urgent'] },
              { label: 'Channel', key: 'channel', opts: ['Notice Board', 'SMS', 'Email', 'All'] },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.label}</label>
                <div className="relative">
                  <select value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full appearance-none pl-3 pr-8 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f]/40 bg-white">
                    {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          {/* Channel info with live status */}
          <div className={`flex items-start gap-3 p-3.5 rounded-xl text-xs border ${
            form.channel === 'All' ? 'bg-blue-50 border-blue-200 text-blue-700' :
            form.channel === 'SMS' ? 'bg-green-50 border-green-200 text-green-700' :
            'bg-gray-50 border-gray-200 text-gray-600'
          }`}>
            {channelIcon[form.channel]}
            <span>
              {form.channel === 'All' && `Will be sent via Notice Board, SMS${channelStatus?.sms ? '' : ' (not configured)'}, and Email${channelStatus?.email ? '' : ' (not configured)'} to all selected recipients.`}
              {form.channel === 'SMS' && (channelStatus?.sms ? 'SMS will be sent to registered parent mobile numbers. Charges may apply.' : 'SMS not configured — add Twilio credentials to .env to enable.')}
              {form.channel === 'Email' && (channelStatus?.email ? 'Email will be sent to registered parent email addresses.' : 'Email not configured — add SMTP credentials to .env to enable.')}
              {form.channel === 'Notice Board' && 'Notice will appear in the school notice board and parent/student portal.'}
            </span>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setTab('sent')} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
            <button onClick={handleSend} disabled={!form.title || !form.body || sending}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#163050] disabled:opacity-50 transition-colors">
              <Send className="w-4 h-4" />
              {sending ? 'Sending…' : `Send to ${form.audience}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
