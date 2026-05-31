'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type AppMode = 'school' | 'coaching'

interface ModeLabels {
  appName: string
  students: string
  student: string
  teachers: string
  teacher: string
  classes: string
  class: string
  admissions: string
  attendance: string
  academics: string
  library: string
  hostel: string
  transport: string
  exams: string
  finance: string
  feeType: string
  dashboard: string
  institution: string
}

const SCHOOL_LABELS: ModeLabels = {
  appName:     'KVL International School',
  students:    'Students',
  student:     'Student',
  teachers:    'Teachers',
  teacher:     'Teacher',
  classes:     'Classes',
  class:       'Class',
  admissions:  'Admissions',
  attendance:  'Attendance',
  academics:   'Academics',
  library:     'Library',
  hostel:      'Hostel',
  transport:   'Transport',
  exams:       'Exams & Results',
  finance:     'Finance',
  feeType:     'Term Fee',
  dashboard:   'Dashboard',
  institution: 'School',
}

const COACHING_LABELS: ModeLabels = {
  appName:     'KVL Coaching Institute',
  students:    'Students',
  student:     'Student',
  teachers:    'Faculty',
  teacher:     'Faculty',
  classes:     'Batches',
  class:       'Batch',
  admissions:  'Enrollments',
  attendance:  'Attendance',
  academics:   'Courses',
  library:     'Study Material',
  hostel:      'Hostel',
  transport:   'Transport',
  exams:       'Tests & Results',
  finance:     'Fees & Finance',
  feeType:     'Course Fee',
  dashboard:   'Dashboard',
  institution: 'Institute',
}

interface ModeCtx {
  mode: AppMode
  labels: ModeLabels
  toggleMode: () => void
  isCoaching: boolean
}

const ModeContext = createContext<ModeCtx | null>(null)

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<AppMode>('school')

  useEffect(() => {
    const saved = localStorage.getItem('kvl-mode') as AppMode
    if (saved === 'coaching' || saved === 'school') setMode(saved)
  }, [])

  function toggleMode() {
    const next: AppMode = mode === 'school' ? 'coaching' : 'school'
    setMode(next)
    localStorage.setItem('kvl-mode', next)
  }

  return (
    <ModeContext.Provider value={{
      mode,
      labels: mode === 'coaching' ? COACHING_LABELS : SCHOOL_LABELS,
      toggleMode,
      isCoaching: mode === 'coaching',
    }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useMode must be used within ModeProvider')
  return ctx
}
