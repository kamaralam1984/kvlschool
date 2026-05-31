'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const alumni = [
  { name: 'Dr. Aarav Singh', batch: 'Class of 2010', role: 'AIIMS Resident Doctor', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', quote: 'KVL\'s rigorous science curriculum gave me the foundation for medicine.' },
  { name: 'Priya Menon', batch: 'Class of 2014', role: 'IIT Bombay, Software Engineer at Google', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', quote: 'The problem-solving approach taught here translates to everything I do.' },
  { name: 'Vikram Rao', batch: 'Class of 2008', role: 'Entrepreneur, Forbes 30 Under 30', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', quote: 'Leadership and resilience — I learned both on KVL\'s sports grounds.' },
]

export function AlumniSection() {
  return (
    <section className="section bg-ivory-100">
      <div className="container-premium">
        <div className="text-center mb-12">
          <span className="section-label justify-center mb-4">Alumni</span>
          <h2 className="heading-h2">
            Our Legacy Lives in{' '}
            <span className="gradient-text-gold">Their Success</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {alumni.map((a, i) => (
            <motion.div key={a.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              className="card-premium p-6 text-center"
            >
              <div className="relative w-20 h-20 mx-auto mb-4">
                <Image src={a.photo} alt={a.name} fill className="object-cover rounded-full ring-2 ring-gold-200" sizes="80px" />
              </div>
              <h3 className="font-display text-base font-semibold text-navy-900">{a.name}</h3>
              <p className="text-gold-500 text-xs font-medium mt-0.5">{a.batch}</p>
              <p className="text-navy-500 text-xs mt-1 mb-4">{a.role}</p>
              <p className="text-navy-600 text-sm italic leading-relaxed">&ldquo;{a.quote}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
