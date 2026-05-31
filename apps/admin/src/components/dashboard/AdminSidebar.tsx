'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, FileText,
  CreditCard, Bus, Home, Library, UserCog, BarChart3, Settings,
  ShoppingCart, PlayCircle, Brain, Bell, Shield, ChevronDown,
  ChevronRight, X, Zap, Award, Calendar, MessageSquare, FlaskConical
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMode } from '@/contexts/ModeContext'

interface NavItem {
  label:      string
  coachLabel?: string
  icon:       React.ElementType
  href?:      string
  badge?:     string
  badgeColor?: string
  children?:  { label: string; coachLabel?: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard',        icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Students',         icon: GraduationCap,   href: '/students',     badge: '4.2K', badgeColor: 'bg-blue-100 text-blue-700' },
  { label: 'Teachers & Staff', coachLabel: 'Faculty', icon: Users,           href: '/teachers' },
  { label: 'Parents',          coachLabel: 'Parents / Guardians', icon: Users, href: '/parents' },
  { label: 'Admissions',       coachLabel: 'Enrollments', icon: Award,       href: '/admissions', badge: 'New', badgeColor: 'bg-green-100 text-green-700',
    children: [
      { label: 'Applications', coachLabel: 'Inquiries',    href: '/admissions/applications' },
      { label: 'Enrollment',   coachLabel: 'Registration', href: '/admissions/enrollment' },
      { label: 'Documents',                                href: '/admissions/documents' },
      { label: 'Enquiries',    coachLabel: 'Follow-ups',   href: '/admissions/enquiries' },
    ]
  },
  { label: 'Academics',        coachLabel: 'Courses & Batches', icon: BookOpen,
    children: [
      { label: 'Classes & Sections', coachLabel: 'Batches',        href: '/academics/classes' },
      { label: 'Subjects',           coachLabel: 'Subjects',        href: '/academics/subjects' },
      { label: 'Timetable',          coachLabel: 'Schedule',        href: '/academics/timetable' },
      { label: 'Lesson Plans',       coachLabel: 'Study Plans',     href: '/academics/lessons' },
      { label: 'Academic Calendar',  coachLabel: 'Batch Calendar',  href: '/academics/calendar' },
      { label: 'Homework',           coachLabel: 'Assignments',     href: '/academics/homework' },
    ]
  },
  { label: 'Attendance',       icon: Calendar,        href: '/attendance' },
  { label: 'Examinations',     coachLabel: 'Tests & Exams', icon: FileText,
    children: [
      { label: 'Exam Schedule',  coachLabel: 'Test Schedule',  href: '/exams/schedule' },
      { label: 'Question Bank',                                href: '/exams/questions' },
      { label: 'Online Exams',   coachLabel: 'Online Tests',   href: '/exams/online' },
      { label: 'Offline Exams',  coachLabel: 'Offline Tests',  href: '/exams/offline' },
      { label: 'Results',                                      href: '/exams/results' },
      { label: 'Report Cards',   coachLabel: 'Performance',    href: '/exams/report-cards' },
      { label: 'Hall Tickets',   coachLabel: 'Admit Cards',    href: '/exams/hall-tickets' },
    ]
  },
  { label: 'Finance',          coachLabel: 'Fees & Finance', icon: CreditCard,
    children: [
      { label: 'Fee Structure',  coachLabel: 'Course Fees',    href: '/finance/fee-structure' },
      { label: 'Fee Collection',                               href: '/finance/collect' },
      { label: 'Invoices',                                     href: '/finance/invoices' },
      { label: 'Payments',                                     href: '/finance/payments' },
      { label: 'Scholarships',   coachLabel: 'Discounts',      href: '/finance/scholarships' },
      { label: 'Income',                                       href: '/finance/income' },
      { label: 'Expenses',                                     href: '/finance/expenses' },
      { label: 'Reports',                                      href: '/finance/reports' },
    ]
  },
  { label: 'LMS',              coachLabel: 'Study Material', icon: PlayCircle,
    children: [
      { label: 'Courses',        coachLabel: 'Video Lectures', href: '/lms/courses' },
      { label: 'Live Classes',                                 href: '/lms/live' },
      { label: 'Recordings',                                   href: '/lms/recordings' },
      { label: 'Assignments',    coachLabel: 'Practice Sets',  href: '/lms/assignments' },
      { label: 'Progress',                                     href: '/lms/progress' },
    ]
  },
  { label: 'E-Commerce',       coachLabel: 'Study Store', icon: ShoppingCart,
    children: [
      { label: 'Products',    coachLabel: 'Books & Material', href: '/store/products' },
      { label: 'Orders',                                       href: '/store/orders' },
      { label: 'Inventory',                                    href: '/store/inventory' },
      { label: 'Coupons',                                      href: '/store/coupons' },
    ]
  },
  { label: 'Library',          coachLabel: 'Resource Library', icon: Library, href: '/library' },
  { label: 'Transport',        icon: Bus,
    children: [
      { label: 'Routes',    href: '/transport/routes' },
      { label: 'Vehicles',  href: '/transport/vehicles' },
      { label: 'Drivers',   href: '/transport/drivers' },
      { label: 'Tracking',  href: '/transport/tracking' },
    ]
  },
  { label: 'Hostel',           icon: Home,            href: '/hostel' },
  { label: 'HR & Payroll',     icon: UserCog,
    children: [
      { label: 'Staff',        href: '/hr/staff' },
      { label: 'Payroll',      href: '/hr/payroll' },
      { label: 'Leave',        href: '/hr/leave' },
      { label: 'Performance',  href: '/hr/performance' },
      { label: 'Recruitment',  href: '/hr/recruitment' },
    ]
  },
  { label: 'Communications',   icon: MessageSquare,   href: '/communications' },
  { label: 'AI Center',        icon: Brain,           href: '/ai',            badge: 'AI', badgeColor: 'bg-purple-100 text-purple-700' },
  { label: 'Analytics',        icon: BarChart3,       href: '/analytics' },
  { label: 'Notifications',    icon: Bell,            href: '/notifications' },
  { label: 'Roles & Perms',    icon: Shield,          href: '/roles' },
  { label: 'Settings',         icon: Settings,        href: '/settings' },
]

interface Props {
  collapsed: boolean
  mobileOpen: boolean
  onMobileClose: () => void
  onToggleCollapse: () => void
}

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname()
  const { isCoaching } = useMode()
  const [open, setOpen] = useState(false)
  const Icon = item.icon
  const displayLabel = isCoaching && item.coachLabel ? item.coachLabel : item.label
  const isActive = item.href
    ? pathname === item.href || pathname.startsWith(item.href + '/')
    : item.children?.some((c) => pathname.startsWith(c.href))

  const activeClass = isCoaching
    ? 'bg-violet-600 text-white shadow-sm'
    : 'bg-navy-600 text-white shadow-sm'

  const hoverClass = isCoaching
    ? 'text-violet-100 hover:bg-violet-800 hover:text-white'
    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'

  const parentActiveClass = isCoaching
    ? 'bg-violet-800/60 text-violet-100'
    : 'bg-navy-50 text-navy-800'

  const childActiveClass = isCoaching
    ? 'bg-violet-600 text-white font-medium'
    : 'bg-navy-600 text-white font-medium'

  const childHoverClass = isCoaching
    ? 'text-violet-300 hover:text-white hover:bg-violet-700'
    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'

  const borderClass = isCoaching ? 'border-violet-700' : 'border-gray-100'

  if (item.children && !collapsed) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
            isActive ? parentActiveClass : hoverClass
          )}
        >
          <Icon className="w-4.5 h-4.5 flex-shrink-0" />
          <span className="flex-1 text-left">{displayLabel}</span>
          {item.badge && (
            <span className={cn('px-1.5 py-0.5 text-[10px] font-bold rounded-full', item.badgeColor)}>
              {item.badge}
            </span>
          )}
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', open && 'rotate-180')} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={cn('ml-7 mt-1 space-y-0.5 border-l pl-3', borderClass)}>
                {item.children.map((child) => {
                  const childLabel = isCoaching && child.coachLabel ? child.coachLabel : child.label
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        'block px-3 py-2 text-sm rounded-lg transition-colors',
                        pathname === child.href ? childActiveClass : childHoverClass
                      )}
                    >
                      {childLabel}
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  if (item.href) {
    return (
      <Link
        href={item.href}
        title={collapsed ? displayLabel : undefined}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
          collapsed && 'justify-center',
          isActive ? activeClass : hoverClass
        )}
      >
        <Icon className="w-4.5 h-4.5 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1">{displayLabel}</span>
            {item.badge && (
              <span className={cn('px-1.5 py-0.5 text-[10px] font-bold rounded-full', item.badgeColor)}>
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    )
  }

  return null
}

export function AdminSidebar({ collapsed, mobileOpen, onMobileClose, onToggleCollapse }: Props) {
  const { isCoaching } = useMode()

  const sidebarBg = isCoaching
    ? 'bg-violet-950 border-violet-800'
    : 'bg-white border-gray-100'

  const logoBg = isCoaching ? 'bg-orange-500' : 'bg-navy-700'
  const logoText = isCoaching ? 'KVL Coaching' : 'KVL School'
  const logoSub = isCoaching ? 'Institute Panel' : 'Admin Panel'
  const logoTextColor = isCoaching ? 'text-orange-100' : 'text-navy-900'
  const logoSubColor = isCoaching ? 'text-violet-400' : 'text-gray-400'
  const collapseBtn = isCoaching
    ? 'text-violet-400 hover:bg-violet-800 hover:text-violet-200 border-violet-800'
    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600 border-gray-100'

  const sidebarContent = (
    <div className={cn(
      'flex flex-col h-full border-r transition-all duration-300',
      sidebarBg,
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 border-b px-4 flex-shrink-0',
        isCoaching ? 'border-violet-800' : 'border-gray-100',
        collapsed && 'justify-center px-2'
      )}>
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', logoBg)}>
          {isCoaching
            ? <FlaskConical className="w-4 h-4 text-white" />
            : <Zap className="w-4 h-4 text-yellow-400" />
          }
        </div>
        {!collapsed && (
          <div className="ml-3">
            <p className={cn('font-bold text-sm leading-none', logoTextColor)}>{logoText}</p>
            <p className={cn('text-xs mt-0.5', logoSubColor)}>{logoSub}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 scrollbar-hide">
        {navItems.map((item) => (
          <NavLink key={item.label} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className={cn('p-3 border-t', isCoaching ? 'border-violet-800' : 'border-gray-100')}>
        <button
          onClick={onToggleCollapse}
          className={cn('w-full flex items-center justify-center p-2 rounded-lg transition-colors', collapseBtn)}
        >
          <ChevronRight className={cn('w-4 h-4 transition-transform duration-300', !collapsed && 'rotate-180')} />
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full z-50 lg:hidden"
            >
              <div className="relative">
                {sidebarContent}
                <button
                  onClick={onMobileClose}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
