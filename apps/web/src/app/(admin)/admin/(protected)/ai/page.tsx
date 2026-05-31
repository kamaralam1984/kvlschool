'use client'
import React, { useState, useRef, useEffect } from 'react'
import {
  Send, Bot, User, Sparkles, Clock, Plus, MessageSquare, ChevronRight,
  Info, Mic, Paperclip, BookOpen, BarChart2, Mail, GraduationCap, Award,
  ChevronDown, X, Zap, Brain, FileText, TrendingUp, Settings, Search,
  CheckCircle, AlertCircle, Star, Hash
} from 'lucide-react'
import { aiApi } from '@/lib/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
  isTyping?: boolean
  isReal?: boolean
}

interface Conversation {
  id: string
  title: string
  date: string
  preview: string
}

const PROMPT_CATEGORIES = [
  {
    icon: BookOpen,
    label: 'Academic',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    prompts: [
      'Generate 20 MCQ questions for Class 10 Mathematics Chapter: Quadratic Equations',
      'Create a lesson plan for 45 minutes on Photosynthesis for Class 9',
      'Write 10 short answer questions for Class 8 History: The French Revolution',
      'Create a rubric for evaluating Class 12 English essay assignments',
    ],
  },
  {
    icon: BarChart2,
    label: 'Reports',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    prompts: [
      "Analyze this month's attendance data and identify patterns",
      'Generate fee collection forecast for February 2025',
      'Create a term-end performance summary for Grade 10A',
      'Identify students at risk based on attendance below 75%',
    ],
  },
  {
    icon: Mail,
    label: 'Communications',
    color: 'text-green-600',
    bg: 'bg-green-50',
    prompts: [
      'Write a formal circular about Annual Sports Day',
      'Draft a parent newsletter for January 2025',
      'Compose a fee reminder notice for March 2025',
      'Write an invitation letter for Parent-Teacher Meeting',
    ],
  },
  {
    icon: GraduationCap,
    label: 'Admissions',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    prompts: [
      'Generate follow-up message for pending admission enquiries',
      'Create admission interview questions for Class 11 Science',
      'Draft admission offer letter for the 2025-26 academic year',
      'Write FAQs for the new admission process',
    ],
  },
  {
    icon: Award,
    label: 'Certificates',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    prompts: [
      'Generate merit certificate text for rank 1 student',
      'Create participation certificate for Sports Day',
      'Write appreciation certificate for Science Exhibition winner',
      'Draft certificate of completion for Summer Coding Camp',
    ],
  },
]

const MOCK_RESPONSES: Record<string, string> = {
  'Generate 20 MCQ questions for Class 10 Mathematics Chapter: Quadratic Equations': `## 📚 20 MCQ Questions — Class 10 Mathematics
### Chapter: Quadratic Equations

---

**Q1.** Which of the following is a quadratic equation?
- (A) x³ + 2x + 1 = 0
- **(B) 2x² – 3x + 1 = 0** ✓
- (C) x + 5 = 0
- (D) 1/x + 2 = 0

**Q2.** The roots of the equation x² – 5x + 6 = 0 are:
- (A) 2, 4
- (B) 1, 6
- **(C) 2, 3** ✓
- (D) –2, –3

**Q3.** The discriminant of 2x² – 4x + 3 = 0 is:
- (A) 8
- **(B) –8** ✓
- (C) 40
- (D) –40

**Q4.** If the discriminant > 0, the roots are:
- (A) Equal and real
- (B) No real roots
- **(C) Distinct and real** ✓
- (D) Imaginary

**Q5.** The sum of roots of x² – 7x + 10 = 0 is:
- (A) 10
- (B) –7
- **(C) 7** ✓
- (D) –10

**Q6.** Product of roots of 3x² + 5x – 2 = 0 is:
- **(A) –2/3** ✓
- (B) 2/3
- (C) 5/3
- (D) –5/3

**Q7.** Which method cannot always be used to solve a quadratic equation?
- **(A) Factorisation** ✓
- (B) Quadratic Formula
- (C) Completing the square
- (D) None of the above

**Q8.** If one root of x² – 5x + k = 0 is 2, find k:
- (A) 3
- (B) 5
- **(C) 6** ✓
- (D) 10

**Q9.** The nature of roots of x² + x + 1 = 0 is:
- (A) Real and distinct
- (B) Real and equal
- **(C) No real roots** ✓
- (D) Rational

**Q10.** Roots of 4x² – 4x + 1 = 0 are:
- (A) 1/4, 3/4
- (B) –1/2, –1/2
- **(C) 1/2, 1/2** ✓
- (D) 2, 2

**Q11 – Q20** follow the same pattern covering: completing the square, word problems (age, area, speed), formation of equations, and real-life application.

---
*Answer Key: B, C, B, C, C, A, A, C, C, C*

✅ **20 questions generated** | Difficulty: Mixed (Easy × 8, Medium × 8, Hard × 4) | Bloom's Taxonomy: Levels 1–4`,

  'Create a lesson plan for 45 minutes on Photosynthesis for Class 9': `## 📋 Lesson Plan — Class 9 Science
### Topic: Photosynthesis | Duration: 45 Minutes

---

| Field | Details |
|-------|---------|
| Subject | Science (Biology) |
| Class | 9 | Duration | 45 mins |
| Chapter | Life Processes |
| Learning Level | Conceptual + Application |

---

### 🎯 Learning Objectives
By the end of this lesson, students will be able to:
1. Define photosynthesis and write the balanced chemical equation
2. Identify the raw materials and products of photosynthesis
3. Explain the role of chlorophyll, sunlight, CO₂, and water
4. Distinguish between light-dependent and light-independent reactions

---

### ⏱️ Time Breakdown

| Phase | Activity | Time |
|-------|----------|------|
| **Hook** | Show a leaf under microscope (or image); ask "How do plants make food?" | 5 min |
| **Direct Instruction** | Explain photosynthesis equation, chloroplast structure | 10 min |
| **Guided Practice** | Label diagram: chloroplast, thylakoid, stroma | 8 min |
| **Video Clip** | 2-min animation of light reaction | 7 min |
| **Group Activity** | Compare C3 vs C4 plants (cards sorting activity) | 8 min |
| **Assessment** | 3 MCQs + 1 short answer on exit slip | 5 min |
| **Wrap-up** | Recap key terms, assign pg 94-96 reading | 2 min |

---

### 📝 Key Vocabulary
\`Chlorophyll\` · \`Stomata\` · \`Calvin Cycle\` · \`ATP\` · \`NADPH\` · \`Glucose\`

### 📌 Homework
Draw and label a chloroplast, write the photosynthesis equation with reactants and products explained.

✅ **Lesson Plan Ready** | Aligned to NCERT Class 9 Chapter 6`,

  'Write a formal circular about Annual Sports Day': `## 📄 Official Circular — KVL International School

---

**KVL INTERNATIONAL SCHOOL**
Circular No.: KVL/2025/CIR-017
Date: 31st May 2025

**ANNUAL SPORTS DAY — 2025**

Dear Parents / Guardians,

We are pleased to announce that **KVL International School's Annual Sports Day** will be held on:

📅 **Date:** Saturday, 14th June 2025
🕙 **Time:** 9:00 AM – 1:00 PM
📍 **Venue:** School Sports Ground, Main Campus

**Events Include:**
- Track & Field Events (100m, 200m, 400m, Relay)
- Team Sports: Football, Basketball, Kho-Kho, Kabaddi
- Fun Events: Sack Race, Tug of War, Three-Legged Race
- Prize Distribution for Academic Excellence (Top 3 per class)

**Instructions for Students:**
1. Report by 8:30 AM in school sports uniform
2. Bring water bottle and apply sunscreen
3. House captains to carry their house flags
4. Parents are warmly invited to witness and cheer

**Chief Guest:** Shri. Rajan Mehra, District Sports Officer

Students participating in events will receive their event schedule by 7th June 2025.

Kindly sign and return the tear-off slip below by **5th June 2025**.

For queries, contact the Sports Department at sports@kvlinternational.edu

**Mrs. Kavitha Lakshmi**
Principal, KVL International School

---
*"Excellence in Mind, Spirit, and Body"*`,

  'Generate follow-up message for pending admission enquiries': `## 📬 Follow-up Message — Pending Admission Enquiries

---

**Template A — WhatsApp / SMS (Short)**

> Dear [Parent Name],
>
> Greetings from **KVL International School**! 🎓
>
> We noticed your enquiry for admission to Class [X] for the 2025-26 session is still pending. We'd love to welcome [Child's Name] to the KVL family!
>
> 📋 Seats are filling fast — only **[N] seats** remaining in Class [X].
>
> Complete your application: kvlinternational.edu/admissions
> Or call us: +91-XXXXXXXXXX (Mon–Sat, 9AM–4PM)
>
> Warm regards,
> Admissions Team, KVL International School

---

**Template B — Email (Detailed)**

Subject: Your Child's Admission Enquiry — Action Required | KVL International School

Dear Mr./Mrs. [Last Name],

Thank you for showing interest in KVL International School for your child's education. We received your enquiry on [Date] for admission to **Class [X]** for the academic year **2025–26**.

We wanted to personally follow up as we have a few seats remaining and would not want you to miss the opportunity.

**Why Families Choose KVL:**
✅ CBSE Affiliated | Experienced faculty with 15+ years avg.
✅ Smart classrooms | AI-powered learning tools
✅ 97% board exam pass rate (2024)
✅ Sports, arts, and STEM clubs

**Next Steps:**
1. Submit online application form (15 minutes)
2. Upload documents (birth certificate, marksheet, ID)
3. Schedule interaction session with our counsellor

📅 Walk-in counselling every **Saturday, 10AM–1PM**

We look forward to hearing from you.

Warm regards,
**Ms. Pooja Nair**
Head of Admissions | KVL International School`,

  'Generate merit certificate text for rank 1 student': `## 🏆 Merit Certificate — Rank 1

---

**CERTIFICATE OF MERIT**

*This is to certify that*

# **[STUDENT NAME]**

*of Class* **[CLASS] – [SECTION]**

*has achieved*

## **RANK 1**

*in the* **Annual Examination 2024–25**
*with an outstanding score of* **[XX]%**

---

*In recognition of exceptional academic achievement, dedication to learning,
and commitment to excellence, this certificate is awarded with pride.*

**Issued by:**
KVL International School | Academic Year 2024–25

___________________________ ___________________________
**Mrs. Kavitha Lakshmi** **Mr. Arjun Menon**
Principal Academic Coordinator

📅 Date: 31st May 2025 🏫 Place: KVL International School, Main Campus

---
*"Excellence is not a destination but a continuous journey."*

---
**[VARIANT — Concise Format]**

> KVL International School proudly presents the **Merit Award** to **[Student Name]** for securing **First Rank** in Class [X] with [XX]% marks in the Annual Examination 2024-25. This achievement reflects their exemplary hard work, discipline, and passion for learning.`,
}

const PAST_CONVERSATIONS: Conversation[] = [
  { id: '1', title: 'Class 10 Math MCQ Set', date: 'Today', preview: 'Generated 20 MCQs for Quadratic Equations...' },
  { id: '2', title: 'Sports Day Circular', date: 'Today', preview: 'Drafted formal circular for Annual Sports Day...' },
  { id: '3', title: 'Fee Collection Report', date: 'Yesterday', preview: 'Analyzed Q3 fee collection trends...' },
  { id: '4', title: 'Parent Newsletter Jan', date: 'Yesterday', preview: 'Monthly newsletter for January 2025...' },
  { id: '5', title: 'Admission Follow-up', date: 'Mon, 28 Jan', preview: 'WhatsApp and email templates...' },
  { id: '6', title: 'Lesson Plan - Biology', date: 'Mon, 28 Jan', preview: '45-min lesson plan for Photosynthesis...' },
  { id: '7', title: 'Report Card Comments', date: 'Sat, 25 Jan', preview: 'Generated 30 personalized comments...' },
]

const AI_CAPABILITIES = [
  { icon: FileText, label: 'Generate Lesson Plans' },
  { icon: Hash, label: 'Create Exam Questions' },
  { icon: TrendingUp, label: 'Analyze Student Data' },
  { icon: Mail, label: 'Draft Communications' },
  { icon: Award, label: 'Write Certificates' },
  { icon: BarChart2, label: 'Financial Forecasts' },
  { icon: GraduationCap, label: 'Admission Workflows' },
  { icon: Star, label: 'Report Card Comments' },
]

function formatContent(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i} className="text-base font-bold text-[#1e3a5f] mt-3 mb-1">{line.slice(3)}</h2>
    if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-semibold text-gray-700 mt-2 mb-1">{line.slice(4)}</h3>
    if (line.startsWith('# ')) return <h1 key={i} className="text-lg font-bold text-[#1e3a5f] text-center my-2">{line.slice(2)}</h1>
    if (line.startsWith('---')) return <hr key={i} className="border-gray-200 my-2" />
    if (line.startsWith('| ')) {
      const cells = line.split('|').filter(c => c.trim())
      const isHeader = lines[i + 1]?.startsWith('|--') || lines[i - 1]?.startsWith('| Field')
      return (
        <div key={i} className={`flex text-xs ${isHeader ? 'font-semibold bg-gray-100' : 'border-b border-gray-100'}`}>
          {cells.map((c, j) => <span key={j} className="px-2 py-1 flex-1">{c.trim()}</span>)}
        </div>
      )
    }
    if (line.startsWith('|--')) return null
    if (line.startsWith('- **(') || line.startsWith('- (')) {
      const isBold = line.includes('**')
      return <li key={i} className={`text-xs ml-4 py-0.5 list-none ${isBold ? 'text-[#1e3a5f] font-semibold' : 'text-gray-600'}`}>{line.replace(/\*\*/g, '').replace(/^- /, '').replace(' ✓', ' ✓')}</li>
    }
    if (line.startsWith('- ') || line.startsWith('✅ ') || line.startsWith('📅 ') || line.startsWith('🕙 ') || line.startsWith('📍 ') || line.startsWith('📋 ') || line.startsWith('📌 ') || line.startsWith('📝 ') || line.startsWith('📬 ')) {
      return <li key={i} className="text-xs ml-2 py-0.5 list-none text-gray-700">{line.replace(/^- /, '')}</li>
    }
    if (/^\d+\./.test(line)) return <li key={i} className="text-xs ml-4 py-0.5 list-decimal text-gray-700">{line.replace(/^\d+\.\s/, '')}</li>
    if (line.startsWith('**Q')) return <p key={i} className="text-xs font-semibold text-gray-800 mt-2">{line.replace(/\*\*/g, '')}</p>
    if (line.startsWith('*') && line.endsWith('*')) return <p key={i} className="text-xs italic text-gray-500 text-center my-1">{line.replace(/\*/g, '')}</p>
    if (line.startsWith('`') && line.endsWith('`')) return <code key={i} className="text-xs bg-gray-100 px-1 rounded text-[#1e3a5f]">{line.replace(/`/g, '')}</code>
    if (line.trim() === '') return <div key={i} className="h-1" />
    return <p key={i} className="text-xs text-gray-700 leading-relaxed">{line.replace(/\*\*/g, '')}</p>
  })
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `## Welcome to KVL AI Education Brain

Hello! I'm your intelligent school management assistant, trained specifically for KVL International School.

**I can help you with:**
- Generate exam questions, lesson plans, and rubrics
- Analyze attendance and performance data
- Draft circulars, newsletters, and parent communications
- Create certificate text and admission messages
- Forecast fee collection and identify at-risk students

Select a prompt from the library on the right, or type your question below to get started.`,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [showPromptPanel, setShowPromptPanel] = useState(true)
  const [openCategory, setOpenCategory] = useState<number | null>(0)
  const [charCount, setCharCount] = useState(0)
  const [contextOpen, setContextOpen] = useState(false)
  const [apiConfigured, setApiConfigured] = useState<boolean | null>(null) // null = unknown
  const [aiModel, setAiModel] = useState<string>('GPT-4o-mini')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const MAX_CHARS = 2000

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, time: now() }
    const typingMsg: Message = { id: 'typing', role: 'assistant', content: '', time: now(), isTyping: true }
    setMessages(prev => [...prev, userMsg, typingMsg])
    setInput('')
    setCharCount(0)
    setLoading(true)

    // Try real API first
    try {
      const result = await aiApi.chat(text)
      const reply = result?.data?.reply
      const model = (result as any)?.data?.model

      if (model) setAiModel(model)
      setApiConfigured(true)

      setMessages(prev => [
        ...prev.filter(m => m.id !== 'typing'),
        { id: Date.now().toString(), role: 'assistant', content: reply || 'No response received.', time: now(), isReal: true },
      ])
      setLoading(false)
      return
    } catch (err: any) {
      const isNotConfigured =
        err?.message?.toLowerCase().includes('openai_api_key') ||
        err?.message?.toLowerCase().includes('api key') ||
        err?.status === 500

      if (isNotConfigured) {
        setApiConfigured(false)
      }
      // Fall through to mock responses
    }

    // Fallback: mock responses with simulated delay
    await new Promise(r => setTimeout(r, 1200))

    const responseText = MOCK_RESPONSES[text.trim()] ||
      `I've received your query: **"${text}"**\n\nI'm analyzing the context for **KVL International School** (4,218 students, Jan 2025).\n\nHere's what I found:\n\n- This falls under the **${text.toLowerCase().includes('attend') ? 'Analytics & Reports' : text.toLowerCase().includes('fee') ? 'Finance' : text.toLowerCase().includes('admit') ? 'Admissions' : 'Academic'}** category\n- I can generate a detailed response with structured data, tables, and actionable insights\n- Would you like me to include a downloadable format?\n\nFor best results, try one of the prompt library suggestions on the right panel, or refine your question with specific class, subject, or date details.\n\n> **Note:** This is a demo response. Add OPENAI_API_KEY to apps/api/.env and restart the server to get real AI responses.`

    setMessages(prev => [
      ...prev.filter(m => m.id !== 'typing'),
      { id: Date.now().toString(), role: 'assistant', content: responseText, time: now() },
    ])
    setLoading(false)
  }

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
    setCharCount(prompt.length)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">

      {/* LEFT SIDEBAR */}
      <aside className="w-72 flex-shrink-0 bg-[#1e3a5f] flex flex-col">
        {/* Branding */}
        <div className="px-5 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-10 h-10 rounded-xl bg-[#d4a017] flex items-center justify-center flex-shrink-0">
              <Brain size={20} className="text-white" />
              <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 ${apiConfigured === false ? 'bg-red-400' : 'bg-green-400'} rounded-full border-2 border-[#1e3a5f] ${apiConfigured !== false ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm leading-tight">KVL AI</h1>
              <p className="text-white/50 text-xs">Education Brain v2.0</p>
            </div>
          </div>
          <button
            onClick={() => { setMessages([{ id: 'welcome', role: 'assistant', content: 'New conversation started. How can I help you today?', time: now() }]); setActiveConvId(null) }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#d4a017] hover:bg-[#c49010] text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus size={15} />
            New Chat
          </button>
        </div>

        {/* Model Selector */}
        <div className="px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl">
            <Zap size={13} className="text-[#d4a017]" />
            <span className="text-white/80 text-xs flex-1">{aiModel}</span>
            {apiConfigured === false
              ? <AlertCircle size={13} className="text-red-400" />
              : <CheckCircle size={13} className="text-green-400" />
            }
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          <p className="text-white/40 text-xs px-2 mb-2 uppercase tracking-wider font-medium">Recent</p>
          {PAST_CONVERSATIONS.filter(c => c.date === 'Today').map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-colors ${activeConvId === conv.id ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <div className="flex items-start gap-2">
                <MessageSquare size={13} className="text-white/50 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-white text-xs font-medium truncate">{conv.title}</p>
                  <p className="text-white/40 text-xs truncate">{conv.preview}</p>
                </div>
              </div>
            </button>
          ))}

          <p className="text-white/40 text-xs px-2 mb-2 mt-4 uppercase tracking-wider font-medium">Yesterday</p>
          {PAST_CONVERSATIONS.filter(c => c.date === 'Yesterday').map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-colors ${activeConvId === conv.id ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <div className="flex items-start gap-2">
                <MessageSquare size={13} className="text-white/50 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-white text-xs font-medium truncate">{conv.title}</p>
                  <p className="text-white/40 text-xs truncate">{conv.preview}</p>
                </div>
              </div>
            </button>
          ))}

          <p className="text-white/40 text-xs px-2 mb-2 mt-4 uppercase tracking-wider font-medium">Earlier</p>
          {PAST_CONVERSATIONS.filter(c => c.date !== 'Today' && c.date !== 'Yesterday').map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-colors ${activeConvId === conv.id ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <div className="flex items-start gap-2">
                <MessageSquare size={13} className="text-white/50 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-white text-xs font-medium truncate">{conv.title}</p>
                  <p className="text-white/40 text-xs truncate">{conv.preview}</p>
                </div>
              </div>
            </button>
          ))}

          {/* AI Capabilities */}
          <div className="mt-5 px-2">
            <p className="text-white/40 text-xs mb-2 uppercase tracking-wider font-medium">AI Capabilities</p>
            <div className="space-y-1">
              {AI_CAPABILITIES.map(cap => (
                <div key={cap.label} className="flex items-center gap-2 px-2 py-1.5">
                  <cap.icon size={12} className="text-[#d4a017]" />
                  <span className="text-white/60 text-xs">{cap.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings link */}
        <div className="px-5 py-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Settings size={12} />
            <span>AI Settings & Preferences</span>
          </div>
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Setup Banner — shown when API key is not configured */}
        {apiConfigured === false && (
          <div className="bg-amber-500 px-6 py-2.5 flex items-center gap-3 flex-shrink-0">
            <AlertCircle size={15} className="text-white flex-shrink-0" />
            <p className="text-white text-xs font-medium flex-1">
              AI Not Configured — To enable real AI responses: Add your <code className="bg-amber-600 px-1 rounded">OPENAI_API_KEY</code> to <code className="bg-amber-600 px-1 rounded">apps/api/.env</code> and restart the server. Demo responses are shown below.
            </p>
          </div>
        )}

        {/* Chat Header / Context selector */}
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setContextOpen(o => !o)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-medium">School Context:</span>
              <span className="text-gray-500">KVL International School | 4,218 students | Jan 2025</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            {contextOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 w-80 p-3">
                {['KVL International School | 4,218 students | Jan 2025', 'KVL Primary Campus | 1,840 students | Jan 2025', 'All Campuses Combined | 6,058 students | Jan 2025'].map(ctx => (
                  <button key={ctx} onClick={() => setContextOpen(false)} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg">{ctx}</button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Model indicator */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl">
              <Zap size={12} className="text-[#d4a017]" />
              <span className="font-medium">{aiModel}</span>
              {apiConfigured === true && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
              {apiConfigured === false && <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />}
            </div>
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
              <Search size={13} />
              Search chats
            </button>
            <button
              onClick={() => setShowPromptPanel(p => !p)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition-colors ${showPromptPanel ? 'bg-[#1e3a5f] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Sparkles size={13} />
              Prompt Library
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-[#1e3a5f] flex items-center justify-center flex-shrink-0 mt-1">
                  <Brain size={15} className="text-white" />
                </div>
              )}
              <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                {msg.isTyping ? (
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1 items-center h-5">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                ) : msg.role === 'assistant' ? (
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                    <div className="space-y-0.5">{formatContent(msg.content)}</div>
                    <p className="text-gray-300 text-xs mt-3 flex items-center gap-1">
                      <Clock size={10} /> {msg.time} · {msg.isReal ? <span className="text-green-400">Live AI ({aiModel})</span> : 'KVL AI Demo'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#1e3a5f] rounded-2xl rounded-tr-sm px-4 py-3">
                    <p className="text-white text-sm leading-relaxed">{msg.content}</p>
                    <p className="text-white/40 text-xs mt-2 flex items-center justify-end gap-1">
                      <Clock size={10} /> {msg.time}
                    </p>
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={15} className="text-gray-600" />
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Disclaimer */}
        <div className="px-6 py-2 bg-amber-50 border-t border-amber-100 flex items-center gap-2 flex-shrink-0">
          <AlertCircle size={12} className="text-amber-600 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            {apiConfigured === true
              ? `Connected to real AI (${aiModel}) — Educational responses only. Review before official use.`
              : 'Powered by KVL AI — Educational responses only. AI suggestions should be reviewed before official use.'}
          </p>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-100 px-6 py-4 flex-shrink-0">
          <div className="flex gap-3 items-end">
            <button className="p-2.5 text-gray-400 hover:text-[#1e3a5f] hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0">
              <Paperclip size={18} />
            </button>
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => { setInput(e.target.value); setCharCount(e.target.value.length) }}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
                placeholder="Ask KVL AI anything about your school... (Shift+Enter for new line)"
                maxLength={MAX_CHARS}
                rows={2}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]/40 resize-none leading-relaxed"
              />
              <span className={`absolute bottom-2 right-3 text-xs ${charCount > MAX_CHARS * 0.9 ? 'text-red-400' : 'text-gray-300'}`}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>
            <button className="p-2.5 text-gray-400 hover:text-[#1e3a5f] hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0">
              <Mic size={18} />
            </button>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="p-2.5 bg-[#1e3a5f] text-white rounded-xl hover:bg-[#16304f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PROMPT LIBRARY PANEL */}
      {showPromptPanel && (
        <aside className="w-72 flex-shrink-0 bg-white border-l border-gray-100 flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-[#d4a017]" />
              <h2 className="text-sm font-bold text-gray-800">Prompt Library</h2>
            </div>
            <button onClick={() => setShowPromptPanel(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-3">
            {PROMPT_CATEGORIES.map((cat, idx) => (
              <div key={cat.label} className="mb-1">
                <button
                  onClick={() => setOpenCategory(openCategory === idx ? null : idx)}
                  className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-7 h-7 ${cat.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <cat.icon size={14} className={cat.color} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 flex-1 text-left">{cat.label}</span>
                  <ChevronRight size={14} className={`text-gray-400 transition-transform ${openCategory === idx ? 'rotate-90' : ''}`} />
                </button>
                {openCategory === idx && (
                  <div className="px-5 pb-2 space-y-1">
                    {cat.prompts.map(prompt => (
                      <button
                        key={prompt}
                        onClick={() => handlePromptClick(prompt)}
                        className="w-full text-left text-xs text-gray-600 px-3 py-2 bg-gray-50 hover:bg-[#1e3a5f]/5 hover:text-[#1e3a5f] rounded-xl transition-colors leading-relaxed border border-transparent hover:border-[#1e3a5f]/10"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="px-5 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              Click any prompt to auto-fill the input, then hit Send to generate a response.
            </p>
          </div>
        </aside>
      )}
    </div>
  )
}
