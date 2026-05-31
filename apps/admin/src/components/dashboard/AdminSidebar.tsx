'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, FileText,
  CreditCard, Bus, Home, Library, UserCog, BarChart3, Settings,
  ShoppingCart, PlayCircle, Brain, Bell, Shield, ChevronDown,
  ChevronRight, X, Zap, Award, Calendar, MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label:     string
  icon:      React.ElementType
  href?:     string
  badge?:    string
  badgeColor?: string
  children?: { label: string; href: string; icon?: React.ElementType }[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard',        icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Students',         icon: GraduationCap,   href: '/students', badge: '4.2K', badgeColor: 'bg-blue-100 text-blue-700' },
  { label: 'Teachers & Staff', icon: Users,           href: '/teachers' },
  { label: 'Parents',          icon: Users,           href: '/parents' },
  { label: 'Admissions',       icon: Award,           href: '/admissions', badge: 'New', badgeColor: 'bg-green-100 text-green-700',
    children: [
      { label: 'Applications', href: '/admissions/applications' },
      { label: 'Enrollment',   href: '/admissions/enrollment' },
      { label: 'Documents',    href: '/admissions/documents' },
      { label: 'Enquiries',    href: '/admissions/enquiries' },
    ]
  },
  { label: 'Academics',        icon: BookOpen,
    children: [
      { label: 'Classes & Sections', href: '/academics/classes' },
      { label: 'Subjects',           href: '/academics/subjects' },
      { label: 'Timetable',          href: '/academics/timetable' },
      { label: 'Lesson Plans',        href: '/academics/lessons' },
      { label: 'Academic Calendar',  href: '/academics/calendar' },
      { label: 'Homework',           href: '/academics/homework' },
    ]
  },
  { label: 'Attendance',       icon: Calendar,        href: '/attendance' },
  { label: 'Examinations',     icon: FileText,
    children: [
      { label: 'Exam Schedule',  href: '/exams/schedule' },
      { label: 'Question Bank',  href: '/exams/questions' },
      { label: 'Online Exams',   href: '/exams/online' },
      { label: 'Offline Exams',  href: '/exams/offline' },
      { label: 'Results',        href: '/exams/results' },
      { label: 'Report Cards',   href: '/exams/report-cards' },
      { label: 'Hall Tickets',   href: '/exams/hall-tickets' },
    ]
  },
  { label: 'Finance',          icon: CreditCard,
    children: [
      { label: 'Fee Structure',  href: '/finance/fee-structure' },
      { label: 'Fee Collection', href: '/finance/collect' },
      { label: 'Invoices',       href: '/finance/invoices' },
      { label: 'Payments',       href: '/finance/payments' },
      { label: 'Scholarships',   href: '/finance/scholarships' },
      { label: 'Income',         href: '/finance/income' },
      { label: 'Expenses',       href: '/finance/expenses' },
      { label: 'Reports',        href: '/finance/reports' },
    ]
  },
  { label: 'LMS',              icon: PlayCircle,
    children: [
      { label: 'Courses',       href: '/lms/courses' },
      { label: 'Live Classes',  href: '/lms/live' },
      { label: 'Recordings',    href: '/lms/recordings' },
      { label: 'Assignments',   href: '/lms/assignments' },
      { label: 'Progress',      href: '/lms/progress' },
    ]
  },
  { label: 'E-Commerce',       icon: ShoppingCart,
    children: [
      { label: 'Products',     href: '/store/products' },
      { label: 'Orders',       href: '/store/orders' },
      { label: 'Inventory',    href: '/store/inventory' },
      { label: 'Coupons',      href: '/store/coupons' },
    ]
  },
  { label: 'Library',          icon: Library,         href: '/library' },
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
  { label: 'AI Center',        icon: Brain,           href: '/ai', badge: 'AI', badgeColor: 'bg-purple-100 text-purple-700' },
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
  const [open, setOpen] = useState(false)
  const Icon = item.icon
  const isActive = item.href
    ? pathname === item.href || pathname.startsWith(item.href + '/')
    : item.children?.some((c) => pathname.startsWith(c.href))

  if (item.children && !collapsed) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
            isActive ? 'bg-navy-50 text-navy-800' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )}
        >
          <Icon className="w-4.5 h-4.5 flex-shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
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
              <div className="ml-7 mt-1 space-y-0.5 border-l border-gray-100 pl-3">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      'block px-3 py-2 text-sm rounded-lg transition-colors',
                      pathname === child.href
                        ? 'bg-navy-600 text-white font-medium'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    {child.label}
                  </Link>
                ))}
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
        title={collapsed ? item.label : undefined}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
          collapsed && 'justify-center',
          isActive
            ? 'bg-navy-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        )}
      >
        <Icon className="w-4.5 h-4.5 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1">{item.label}</span>
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
  const sidebarContent = (
    <div className={cn(
      'flex flex-col h-full bg-white border-r border-gray-100 transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className={cn('flex items-center h-16 border-b border-gray-100 px-4 flex-shrink-0', collapsed && 'justify-center px-2')}>
        <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-gold-400" />
        </div>
        {!collapsed && (
          <div className="ml-3">
            <p className="font-bold text-navy-900 text-sm leading-none">KVL School</p>
            <p className="text-gray-400 text-xs mt-0.5">Admin Panel</p>
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
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
        >
          <ChevronRight className={cn('w-4 h-4 transition-transform duration-300', !collapsed && 'rotate-180')} />
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
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
