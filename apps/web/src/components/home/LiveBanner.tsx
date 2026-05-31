'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const liveBannerItems = [
  { type: 'live' as const, badge: '● LIVE NOW', title: 'Annual Science Exhibition 2024', viewers: '1.2K watching', href: '/live/science-expo', color: 'from-red-600 to-red-500' },
  { type: 'upcoming' as const, badge: 'UPCOMING TODAY', title: 'Inter-School Debate Championship', viewers: 'Starts at 2:00 PM', href: '/events/debate', color: 'from-navy-700 to-navy-600' },
  { type: 'live' as const, badge: '● LIVE NOW', title: 'Class XII Board Exam Results Discussion', viewers: '890 watching', href: '/live/results', color: 'from-green-600 to-green-500' },
]

export function LiveBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % liveBannerItems.length), 4000)
    return () => clearInterval(timer)
  }, [])

  const item = liveBannerItems[current]

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-gradient-to-r ${item.color} py-4`}
        >
          <div className="container-premium flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Badge */}
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-full px-3 py-1">
                {item.type === 'live' && (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
                <span className="text-white text-xs font-bold tracking-wider">{item.badge}</span>
              </div>

              {/* Title */}
              <p className="text-white font-semibold text-sm hidden sm:block">{item.title}</p>

              {/* Viewers */}
              <div className="flex items-center gap-1.5 text-white/70 text-xs hidden md:flex">
                <Users className="w-3.5 h-3.5" />
                {item.viewers}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile title */}
              <p className="text-white text-xs font-medium sm:hidden truncate max-w-40">{item.title}</p>

              <Link
                href={item.href}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
              >
                {item.type === 'live' ? 'Watch Live' : 'Set Reminder'}
                <ArrowRight className="w-3 h-3" />
              </Link>

              {/* Pagination */}
              <div className="flex gap-1.5">
                {liveBannerItems.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-4' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
