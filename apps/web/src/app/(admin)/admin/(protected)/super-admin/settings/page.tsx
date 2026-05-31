'use client'

import { useState } from 'react'
import {
  Settings, Palette, Bell, Key, AlertTriangle, Shield, Database, Eye, EyeOff,
  Upload, ToggleLeft, ToggleRight, Save, RefreshCw, Download, Trash2,
  Globe, Mail, MessageSquare, Phone, Smartphone, Zap, CheckCircle2, Copy,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
interface ApiKey {
  id: string
  service: string
  label: string
  key: string
  status: 'active' | 'inactive' | 'error'
  icon: React.ReactNode
}

interface FeatureFlag {
  id: string
  label: string
  description: string
  enabled: boolean
  tag?: string
}

// ── Section Wrapper ────────────────────────────────────────────────────────
function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-base font-semibold text-[#1e3a5f]">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

// ── Toggle Row ─────────────────────────────────────────────────────────────
function ToggleRow({ label, description, enabled, tag, onChange }: { label: string; description: string; enabled: boolean; tag?: string; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800">{label}</span>
          {tag && <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${tag === 'Beta' ? 'bg-amber-50 text-[#d4a017]' : tag === 'New' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{tag}</span>}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      <button onClick={onChange} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex-shrink-0 ${enabled ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
        {enabled ? <><ToggleRight size={15} /> On</> : <><ToggleLeft size={15} /> Off</>}
      </button>
    </div>
  )
}

// ── Main Settings Page ─────────────────────────────────────────────────────
export default function GlobalSettingsPage() {
  const [platformName, setPlatformName] = useState('KVL Education OS')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState<string | null>(null)
  const [primaryColor, setPrimaryColor] = useState('#1e3a5f')
  const [accentColor, setAccentColor] = useState('#d4a017')
  const [selectedTheme, setSelectedTheme] = useState('professional')

  const [notifConfig, setNotifConfig] = useState({
    emailDigest: true, pushAlerts: true, smsAlerts: false,
    whatsappAlerts: true, feeReminders: true, attendanceAlerts: true,
  })

  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
    { id: 'ai_module', label: 'AI Module', description: 'Enable AI-powered features across all institutions', enabled: true, tag: 'Beta' },
    { id: 'analytics_v2', label: 'Analytics V2', description: 'Next-gen analytics dashboard with predictive insights', enabled: true, tag: 'New' },
    { id: 'parent_portal', label: 'Parent Portal', description: 'Mobile-first parent communication and progress portal', enabled: true },
    { id: 'live_classes', label: 'Live Classes', description: 'Integrated video conferencing for live online classes', enabled: false, tag: 'Beta' },
    { id: 'multi_currency', label: 'Multi-Currency', description: 'Accept payments in multiple currencies', enabled: false },
    { id: 'custom_reports', label: 'Custom Reports', description: 'Drag-and-drop custom report builder', enabled: true, tag: 'New' },
    { id: 'sso', label: 'Single Sign-On', description: 'SSO integration via Google Workspace and Microsoft 365', enabled: false },
    { id: 'audit_log', label: 'Full Audit Log', description: 'Detailed immutable audit trail for all actions', enabled: true },
  ])

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: 'razorpay', service: 'Razorpay', label: 'Payment Gateway', key: 'rzp_live_xxxxxxxxxxxxxxxxxxx', status: 'active', icon: <CreditCardIcon /> },
    { id: 'whatsapp', service: 'WhatsApp Business', label: 'WhatsApp API', key: 'EAAxxxxxxxxxxxxxxxxxxxxxxxxx', status: 'active', icon: <WhatsAppIcon /> },
    { id: 'sms', service: 'MSG91', label: 'SMS Gateway', key: 'xxxxxxxxxxxxxxxxxxxxxx', status: 'inactive', icon: <Phone size={16} /> },
    { id: 'email', service: 'SendGrid', label: 'Email Service', key: 'SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', status: 'active', icon: <Mail size={16} /> },
    { id: 'maps', service: 'Google Maps', label: 'Maps & Transport', key: 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', status: 'active', icon: <Globe size={16} /> },
  ])

  const toggleKey = (id: string) => setShowKeys(p => ({ ...p, [id]: !p[id] }))
  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }
  const toggleFlag = (id: string) => setFeatureFlags(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
  const toggleNotif = (key: keyof typeof notifConfig) => setNotifConfig(p => ({ ...p, [key]: !p[key] }))
  const maskKey = (key: string) => key.slice(0, 8) + '•'.repeat(Math.min(24, key.length - 8)) + key.slice(-4)

  const themes = [
    { id: 'professional', label: 'Professional', primary: '#1e3a5f', accent: '#d4a017' },
    { id: 'emerald', label: 'Emerald', primary: '#064e3b', accent: '#f59e0b' },
    { id: 'royal', label: 'Royal', primary: '#4c1d95', accent: '#fbbf24' },
    { id: 'crimson', label: 'Crimson', primary: '#7f1d1d', accent: '#fcd34d' },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Global Platform Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Configure platform-wide settings, integrations, and features</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1e3a5f] text-white text-sm font-semibold rounded-xl hover:bg-[#162d4a] transition-colors shadow-sm">
          <Save size={15} /> Save All Changes
        </button>
      </div>

      {/* Maintenance Mode Banner */}
      {maintenanceMode && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Maintenance Mode Active</p>
            <p className="text-xs text-amber-600">The platform is currently in maintenance mode. Users will see a maintenance page.</p>
          </div>
          <button onClick={() => setMaintenanceMode(false)} className="ml-auto px-3 py-1.5 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
            Disable
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branding */}
        <Section title="Platform Branding" description="Customize the look and feel of the platform">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Platform Name</label>
              <input type="text" value={platformName} onChange={e => setPlatformName(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Logo</label>
                <button className="w-full h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:border-[#1e3a5f]/40 transition-colors text-gray-400 hover:text-[#1e3a5f]">
                  <Upload size={18} />
                  <span className="text-xs font-medium">Upload Logo</span>
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Favicon</label>
                <button className="w-full h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:border-[#1e3a5f]/40 transition-colors text-gray-400 hover:text-[#1e3a5f]">
                  <Upload size={18} />
                  <span className="text-xs font-medium">Upload Favicon</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Theme Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {themes.map(theme => (
                  <button key={theme.id} onClick={() => { setSelectedTheme(theme.id); setPrimaryColor(theme.primary); setAccentColor(theme.accent) }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all text-left ${selectedTheme === theme.id ? 'border-[#1e3a5f]' : 'border-gray-100 hover:border-gray-200'}`}>
                    <div className="flex gap-1">
                      <div className="w-5 h-5 rounded-md" style={{ backgroundColor: theme.primary }} />
                      <div className="w-5 h-5 rounded-md" style={{ backgroundColor: theme.accent }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{theme.label}</span>
                    {selectedTheme === theme.id && <CheckCircle2 size={13} className="text-[#1e3a5f] ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Primary</label>
                <div className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-xl">
                  <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0" />
                  <span className="text-xs font-mono text-gray-600">{primaryColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Accent</label>
                <div className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-xl">
                  <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0" />
                  <span className="text-xs font-mono text-gray-600">{accentColor}</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Global Notifications" description="Configure notification delivery channels">
          <div>
            <ToggleRow label="Email Digest" description="Daily summary emails to admins" enabled={notifConfig.emailDigest} onChange={() => toggleNotif('emailDigest')} />
            <ToggleRow label="Push Notifications" description="Browser push alerts for critical events" enabled={notifConfig.pushAlerts} onChange={() => toggleNotif('pushAlerts')} />
            <ToggleRow label="SMS Alerts" description="Text message alerts via MSG91" enabled={notifConfig.smsAlerts} onChange={() => toggleNotif('smsAlerts')} />
            <ToggleRow label="WhatsApp Alerts" description="WhatsApp Business API notifications" enabled={notifConfig.whatsappAlerts} onChange={() => toggleNotif('whatsappAlerts')} />
            <ToggleRow label="Fee Reminders" description="Automated fee due reminders to parents" enabled={notifConfig.feeReminders} onChange={() => toggleNotif('feeReminders')} />
            <ToggleRow label="Attendance Alerts" description="Real-time attendance notifications" enabled={notifConfig.attendanceAlerts} onChange={() => toggleNotif('attendanceAlerts')} />
          </div>
        </Section>
      </div>

      {/* API Keys */}
      <Section title="API Keys & Integrations" description="Manage third-party service credentials">
        <div className="space-y-3">
          {apiKeys.map(api => (
            <div key={api.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                {api.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-[#1e3a5f]">{api.service}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${api.status === 'active' ? 'bg-emerald-50 text-emerald-700' : api.status === 'error' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                    {api.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-gray-500 truncate max-w-xs">
                    {showKeys[api.id] ? api.key : maskKey(api.key)}
                  </code>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleKey(api.id)} className="p-2 text-gray-400 hover:text-[#1e3a5f] hover:bg-white rounded-lg transition-all">
                  {showKeys[api.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => copyKey(api.id, api.key)} className={`p-2 rounded-lg transition-all ${copied === api.id ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:text-[#1e3a5f] hover:bg-white'}`}>
                  {copied === api.id ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          ))}
          <button className="flex items-center gap-2 px-4 py-3 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-colors w-full justify-center">
            + Add Integration
          </button>
        </div>
      </Section>

      {/* Feature Flags */}
      <Section title="Platform Feature Flags" description="Control which features are available across the entire platform">
        <div>
          {featureFlags.map(flag => (
            <ToggleRow key={flag.id} label={flag.label} description={flag.description} enabled={flag.enabled} tag={flag.tag} onChange={() => toggleFlag(flag.id)} />
          ))}
        </div>
      </Section>

      {/* Maintenance & Backup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Maintenance Mode" description="Take the platform offline for maintenance">
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${maintenanceMode ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Maintenance Mode</p>
                  <p className="text-xs text-gray-500 mt-0.5">All users except super-admins will be shown a maintenance page</p>
                </div>
                <button onClick={() => setMaintenanceMode(p => !p)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${maintenanceMode ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-[#1e3a5f] text-white hover:bg-[#162d4a]'}`}>
                  {maintenanceMode ? <><ToggleRight size={16} /> Enabled</> : <><ToggleLeft size={16} /> Disabled</>}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Maintenance Message</label>
              <textarea rows={3} placeholder="We are performing scheduled maintenance. We'll be back shortly."
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] resize-none" />
            </div>
          </div>
        </Section>

        <Section title="Backup & Restore" description="Manage platform data backups">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700">Last Backup</p>
                <p className="text-xs text-gray-400 mt-0.5">Today, 3:00 AM — Full database snapshot</p>
              </div>
              <CheckCircle2 size={16} className="text-emerald-500" />
            </div>
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700">Auto-Backup</p>
                <p className="text-xs text-gray-400 mt-0.5">Daily at 3:00 AM IST</p>
              </div>
              <span className="px-2 py-1 text-xs bg-emerald-50 text-emerald-700 rounded-lg font-medium">Enabled</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white text-xs font-semibold rounded-xl hover:bg-[#162d4a] transition-colors">
                <RefreshCw size={13} /> Create Backup
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                <Download size={13} /> Download
              </button>
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-50 transition-colors w-full">
              <Trash2 size={13} /> Restore from Backup
            </button>
          </div>
        </Section>
      </div>
    </div>
  )
}

// ── Inline SVG Icons ───────────────────────────────────────────────────────
function CreditCardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
