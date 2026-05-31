'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { School, BookOpen } from 'lucide-react'
import { useMode } from '@/contexts/ModeContext'

export function ModeToggle() {
  const { mode, toggleMode, isCoaching } = useMode()

  return (
    <button
      onClick={toggleMode}
      title={`Switch to ${isCoaching ? 'School' : 'Coaching'} Mode`}
      className={`
        relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold
        transition-all duration-300 select-none border
        ${isCoaching
          ? 'bg-violet-600 text-white border-violet-500 hover:bg-violet-700'
          : 'bg-yellow-500 text-gray-900 border-yellow-400 hover:bg-yellow-400'
        }
      `}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={mode}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-1.5"
        >
          {isCoaching ? (
            <><BookOpen className="w-3.5 h-3.5" /> Coaching Mode</>
          ) : (
            <><School className="w-3.5 h-3.5" /> School Mode</>
          )}
        </motion.span>
      </AnimatePresence>

      <span className={`
        w-1.5 h-1.5 rounded-full animate-pulse
        ${isCoaching ? 'bg-violet-300' : 'bg-yellow-800'}
      `} />
    </button>
  )
}
