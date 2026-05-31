'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight, Clock, MapPin } from 'lucide-react'

const events = [
  { date: '15 Jan', month: 'JAN', title: 'Annual Sports Day 2025', time: '8:00 AM – 5:00 PM', venue: 'Main Ground', category: 'Sports', color: 'border-l-blue-500' },
  { date: '26 Jan', month: 'JAN', title: 'Republic Day Parade & Cultural Show', time: '9:00 AM', venue: 'School Auditorium', category: 'National Event', color: 'border-l-orange-500' },
  { date: '10 Feb', month: 'FEB', title: 'Science & Innovation Expo', time: '10:00 AM – 4:00 PM', venue: 'Science Block', category: 'Academic', color: 'border-l-green-500' },
  { date: '14 Feb', month: 'FEB', title: 'Inter-School Debate Championship', time: '9:30 AM', venue: 'Seminar Hall', category: 'Competition', color: 'border-l-purple-500' },
  { date: '28 Feb', month: 'FEB', title: 'Annual Prize Distribution Ceremony', time: '5:00 PM', venue: 'Main Auditorium', category: 'Ceremony', color: 'border-l-gold-500' },
  { date: '15 Mar', month: 'MAR', title: 'Class XII Farewell 2025', time: '4:00 PM', venue: 'School Lawn', category: 'Cultural', color: 'border-l-pink-500' },
]

export function EventsSection() {
  return (
    <section className="section bg-ivory-100">
      <div className="container-premium">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="section-label mb-4">Upcoming Events</span>
            <h2 className="heading-h2">
              Life Beyond the{' '}
              <span className="gradient-text-gold">Classroom</span>
            </h2>
          </div>
          <Link href="/news" className="btn-ghost text-sm hidden md:flex">
            All Events <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`card-premium p-5 border-l-4 ${event.color}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 text-center flex-shrink-0">
                  <p className="font-display text-2xl font-bold text-navy-900">{event.date.split(' ')[0]}</p>
                  <p className="text-xs font-bold text-navy-400 tracking-widest uppercase">{event.month}</p>
                </div>
                <div className="flex-1">
                  <span className="badge-navy text-[10px] mb-2 inline-flex">{event.category}</span>
                  <h3 className="font-semibold text-navy-800 text-sm leading-snug mb-2">{event.title}</h3>
                  <div className="space-y-1">
                    <p className="flex items-center gap-1.5 text-navy-400 text-xs"><Clock className="w-3 h-3" />{event.time}</p>
                    <p className="flex items-center gap-1.5 text-navy-400 text-xs"><MapPin className="w-3 h-3" />{event.venue}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
