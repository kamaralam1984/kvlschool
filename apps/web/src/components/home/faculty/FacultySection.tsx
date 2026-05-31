'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, GraduationCap, Award } from 'lucide-react'

const faculty = [
  { name: 'Dr. Anita Sharma',    subject: 'Physics & Mathematics',  exp: '18 yrs', qual: 'Ph.D. IIT Delhi',    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80' },
  { name: 'Mr. Ramesh Kumar',    subject: 'English Literature',     exp: '22 yrs', qual: 'M.Phil. JNU',         photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80' },
  { name: 'Ms. Kavitha Nair',    subject: 'Biology & Chemistry',    exp: '14 yrs', qual: 'M.Sc. AIIMS',         photo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&q=80' },
  { name: 'Mr. Arun Mehta',      subject: 'History & Social Sc.',   exp: '19 yrs', qual: 'M.A. DU Gold Medal',  photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80' },
  { name: 'Dr. Priya Singh',     subject: 'Computer Science & AI',  exp: '10 yrs', qual: 'Ph.D. IIT Bombay',   photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&q=80' },
  { name: 'Mr. Vijay Kapoor',    subject: 'Mathematics & Stats',    exp: '16 yrs', qual: 'M.Tech. NIT',         photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80' },
]

export function FacultySection() {
  return (
    <section className="section bg-navy-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201,146,42,0.8) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />
      <div className="container-premium relative">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="section-label text-gold-400 before:bg-gold-400 mb-4">Our Faculty</span>
            <h2 className="heading-h2 text-white">
              Taught by the{' '}
              <span className="gradient-text-gold">Very Best</span>
            </h2>
          </div>
          <Link href="/about/faculty" className="btn-ghost text-ivory-300 hover:text-gold-400 text-sm hidden md:flex">
            Meet All Faculty <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {faculty.slice(0, 4).map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group text-center"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-premium">
                <Image
                  src={f.photo}
                  alt={f.name}
                  fill
                  quality={75}
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-ivory-200 text-xs">{f.qual}</p>
                </div>
              </div>
              <p className="font-display font-semibold text-white text-sm">{f.name}</p>
              <p className="text-gold-400 text-xs mt-0.5">{f.subject}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Award className="w-3 h-3 text-ivory-400" />
                <span className="text-ivory-400 text-xs">{f.exp}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-6 bg-navy-800/50 border border-navy-700 rounded-2xl px-8 py-4">
            {[['86+', 'Faculty Members'], ['72%', 'Post-Graduate'], ['28%', 'PhD Holders'], ['15+', 'Avg Experience']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="font-display text-2xl font-bold text-gold-400">{val}</p>
                <p className="text-ivory-400 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
