'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Atom, Calculator, Palette, Globe, Music, Code, BookOpen, Trophy } from 'lucide-react'

const departments = [
  { icon: Atom,       name: 'Sciences',         desc: 'Physics, Chemistry, Biology, Computer Science', color: 'bg-blue-50 text-blue-600',   href: '/academics/departments/science' },
  { icon: Calculator, name: 'Mathematics',       desc: 'Standard, Applied & Advanced Mathematics',     color: 'bg-green-50 text-green-600',  href: '/academics/departments/maths' },
  { icon: BookOpen,   name: 'Humanities',        desc: 'History, Geography, Political Science, Economics', color: 'bg-amber-50 text-amber-600', href: '/academics/departments/humanities' },
  { icon: Globe,      name: 'Languages',         desc: 'English, Hindi, Sanskrit, French, German',    color: 'bg-purple-50 text-purple-600', href: '/academics/departments/languages' },
  { icon: Palette,    name: 'Visual Arts',       desc: 'Fine Arts, Painting, Sculpture, Digital Art', color: 'bg-pink-50 text-pink-600',    href: '/academics/departments/arts' },
  { icon: Music,      name: 'Performing Arts',   desc: 'Music, Dance, Drama & Theatre',               color: 'bg-indigo-50 text-indigo-600', href: '/academics/departments/performing' },
  { icon: Code,       name: 'Technology',        desc: 'AI, Robotics, Web Development, Data Science', color: 'bg-cyan-50 text-cyan-600',    href: '/academics/departments/technology' },
  { icon: Trophy,     name: 'Physical Education', desc: 'Sports, Athletics, Yoga & Wellness',         color: 'bg-orange-50 text-orange-600', href: '/academics/departments/pe' },
]

export function AcademicsSection() {
  return (
    <section className="section bg-ivory-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent" />
      <div className="container-premium">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="section-label mb-4">Academics</span>
            <h2 className="heading-h2">
              A World of{' '}
              <span className="gradient-text-gold">Learning Awaits</span>
            </h2>
          </div>
          <Link href="/academics" className="btn-ghost text-sm">
            Full Curriculum <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept, i) => {
            const Icon = dept.icon
            return (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={dept.href}
                  className="group card-premium p-6 h-full flex flex-col gap-3"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dept.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-navy-900 text-base group-hover:text-navy-700">{dept.name}</h3>
                  <p className="text-navy-400 text-xs leading-relaxed flex-1">{dept.desc}</p>
                  <span className="text-gold-500 text-xs font-medium group-hover:text-gold-400 flex items-center gap-1 transition-colors">
                    Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Stream highlights */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Science Stream', 'Commerce Stream', 'Humanities Stream'].map((stream, i) => (
            <motion.div
              key={stream}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="relative overflow-hidden rounded-2xl bg-navy-900 p-6"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <p className="text-gold-400 text-xs font-bold tracking-widest uppercase mb-2">Class XI & XII</p>
              <h3 className="font-display text-xl font-semibold text-white mb-3">{stream}</h3>
              <p className="text-ivory-400 text-sm leading-relaxed mb-4">
                {i === 0 && 'Physics, Chemistry, Mathematics / Biology + Computer Science'}
                {i === 1 && 'Accountancy, Business Studies, Economics + Mathematics / Informatics'}
                {i === 2 && 'History, Geography, Political Science, Sociology + Economics'}
              </p>
              <Link href={`/academics/${stream.toLowerCase().split(' ')[0]}`} className="text-gold-400 text-xs font-semibold hover:text-gold-300 transition-colors flex items-center gap-1">
                Learn More <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
