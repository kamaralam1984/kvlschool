'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { ChevronDown, Menu, X, Phone, Mail, MapPin, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'About', href: '/about', children: [
    { label: 'Our Vision & Mission', href: '/about/vision' },
    { label: 'School History', href: '/about/history' },
    { label: 'Leadership Team', href: '/about/leadership' },
    { label: 'Faculty Directory', href: '/about/faculty' },
    { label: 'Accreditation', href: '/about/accreditation' },
    { label: 'Infrastructure', href: '/about/infrastructure' },
  ]},
  { label: 'Academics', href: '/academics', children: [
    { label: 'Curriculum', href: '/academics/curriculum' },
    { label: 'Departments', href: '/academics/departments' },
    { label: 'Academic Calendar', href: '/academics/calendar' },
    { label: 'Learning Resources', href: '/academics/resources' },
  ]},
  { label: 'Admissions', href: '/admissions', children: [
    { label: 'Apply Online', href: '/admissions/apply' },
    { label: 'Admission Process', href: '/admissions/process' },
    { label: 'Fee Structure', href: '/admissions/fees' },
    { label: 'Scholarships', href: '/admissions/scholarships' },
  ]},
  { label: 'Campus Life', href: '/campus', children: [
    { label: 'Facilities', href: '/facilities' },
    { label: 'Sports & Athletics', href: '/campus/sports' },
    { label: 'Arts & Culture', href: '/campus/arts' },
    { label: 'Clubs & Societies', href: '/campus/clubs' },
  ]},
  { label: 'Gallery', href: '/gallery' },
  { label: 'News & Events', href: '/news' },
  { label: 'Contact', href: '/contact' },
]

interface DropdownProps {
  items: { label: string; href: string }[]
  isOpen: boolean
}

function Dropdown({ items, isOpen }: DropdownProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-white rounded-2xl shadow-premium border border-ivory-200 overflow-hidden z-50"
        >
          <div className="p-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-2.5 text-sm text-navy-700 hover:bg-ivory-100 hover:text-navy-900 rounded-xl transition-colors duration-150 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const { scrollY } = useScroll()
  const lastScrollY = useRef(0)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20)
    if (latest > lastScrollY.current + 60 && latest > 200) setHidden(true)
    else if (latest < lastScrollY.current - 10) setHidden(false)
    lastScrollY.current = latest
  })

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* Top info bar */}
      <div className="hidden lg:block bg-navy-900 text-ivory-200 text-xs">
        <div className="container-premium flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-gold-400" /> +91 98765 43210</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-gold-400" /> admissions@kvlschool.edu.in</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-gold-400" /> 123 Education Avenue, New Delhi — 110001</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admissions/apply" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">Apply for Admissions 2025–26</Link>
            <span className="text-navy-600">|</span>
            <Link href="/login" className="hover:text-ivory-100 transition-colors">Portal Login</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <motion.header
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-ivory-200'
            : 'bg-white'
        )}
      >
        <div className="container-premium flex items-center justify-between h-[88px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-14 h-14 relative">
              <SchoolCrestSVG />
            </div>
            <div className="hidden sm:block">
              <p className="font-display font-bold text-navy-900 text-lg leading-tight tracking-tight">KVL International</p>
              <p className="text-xs text-navy-500 font-medium tracking-widest uppercase">School of Excellence</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 text-sm font-medium text-navy-700 hover:text-navy-900 rounded-lg transition-all duration-200 hover:bg-ivory-100',
                    activeDropdown === link.label && 'text-navy-900 bg-ivory-100'
                  )}
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', activeDropdown === link.label && 'rotate-180')} />
                  )}
                </Link>
                {link.children && (
                  <Dropdown items={link.children} isOpen={activeDropdown === link.label} />
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 text-navy-600 hover:text-navy-900 hover:bg-ivory-100 rounded-lg transition-all duration-200 hidden sm:flex"
              aria-label="Search"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
            <Link
              href="/admissions/apply"
              className="hidden md:flex btn-gold text-xs px-5 py-2.5"
            >
              Admissions Open
            </Link>
            <Link
              href="/login"
              className="hidden lg:flex btn-outline text-xs px-5 py-2.5"
            >
              Portal Login
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 text-navy-700 hover:bg-ivory-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-80 bg-white z-50 flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-ivory-200">
                <SchoolCrestSVG width={40} />
                <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-ivory-100 rounded-lg">
                  <X className="w-5 h-5 text-navy-700" />
                </button>
              </div>
              <nav className="p-4 flex-1">
                {navLinks.map((link) => (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-4 py-3 text-navy-800 font-semibold hover:bg-ivory-100 rounded-xl transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="ml-4 mb-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center px-4 py-2 text-navy-600 text-sm hover:text-navy-900 hover:bg-ivory-50 rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              <div className="p-6 border-t border-ivory-200 space-y-3">
                <Link href="/admissions/apply" onClick={() => setMobileOpen(false)} className="btn-gold w-full justify-center text-sm">
                  Apply for Admissions
                </Link>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-outline w-full justify-center text-sm">
                  Portal Login
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function SchoolCrestSVG({ width = 56 }: { width?: number }) {
  const h = (width / 56) * 56
  return (
    <svg width={width} height={h} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield base */}
      <path d="M28 4L6 12V28C6 40.5 16 50.5 28 54C40 50.5 50 40.5 50 28V12L28 4Z" fill="#0f1f33"/>
      <path d="M28 8L10 15V28C10 38.5 18.2 47 28 50.5C37.8 47 46 38.5 46 28V15L28 8Z" fill="#162d4a"/>
      {/* Gold inner border */}
      <path d="M28 11L13 17V28C13 37 20.5 44.5 28 47.5C35.5 44.5 43 37 43 28V17L28 11Z" stroke="#c9922a" strokeWidth="1.5" fill="none"/>
      {/* Torch/Flame */}
      <path d="M28 18C28 18 24 22 24 26C24 29 25.5 30.5 27 31L28 28L29 31C30.5 30.5 32 29 32 26C32 22 28 18 28 18Z" fill="#c9922a"/>
      <rect x="27" y="31" width="2" height="5" rx="1" fill="#c9922a"/>
      {/* Book lines */}
      <rect x="20" y="34" width="7" height="1.5" rx="0.75" fill="#e0aa45"/>
      <rect x="20" y="37" width="5" height="1.5" rx="0.75" fill="#e0aa45"/>
      <rect x="29" y="34" width="7" height="1.5" rx="0.75" fill="#e0aa45"/>
      <rect x="31" y="37" width="5" height="1.5" rx="0.75" fill="#e0aa45"/>
      {/* Stars */}
      <path d="M18 22L18.5 20.5L19 22L20.5 22.5L19 23L18.5 24.5L18 23L16.5 22.5L18 22Z" fill="#c9922a"/>
      <path d="M38 22L38.5 20.5L39 22L40.5 22.5L39 23L38.5 24.5L38 23L36.5 22.5L38 22Z" fill="#c9922a"/>
    </svg>
  )
}
