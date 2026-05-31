'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, Medal, Award } from 'lucide-react'

const awards = [
  { icon: Trophy, year: '2024', title: 'Best School in Delhi NCR', org: 'Education World', color: 'text-gold-500', bg: 'bg-gold-50' },
  { icon: Star,   year: '2023', title: 'Top 10 CBSE Schools India', org: 'India Today School Rankings', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Medal,  year: '2023', title: 'Excellence in Sports Education', org: 'National Sports Authority', color: 'text-green-500', bg: 'bg-green-50' },
  { icon: Award,  year: '2022', title: 'Green School Award — Platinum', org: 'Ministry of Environment', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: Trophy, year: '2022', title: 'Innovation in Education Award', org: 'CBSE National Awards', color: 'text-purple-500', bg: 'bg-purple-50' },
  { icon: Star,   year: '2021', title: 'ISO 9001:2015 Certified', org: 'Bureau Veritas', color: 'text-indigo-500', bg: 'bg-indigo-50' },
]

export function AwardsSection() {
  return (
    <section className="section bg-white">
      <div className="container-premium">
        <div className="text-center mb-12">
          <span className="section-label justify-center mb-4">Recognition</span>
          <h2 className="heading-h2">Awards &{' '}
            <span className="gradient-text-gold">Achievements</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {awards.map((award, i) => {
            const Icon = award.icon
            return (
              <motion.div key={award.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="card-premium p-5 flex items-start gap-4"
              >
                <div className={`w-12 h-12 rounded-xl ${award.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${award.color}`} />
                </div>
                <div>
                  <p className="text-navy-400 text-xs font-bold tracking-wider">{award.year}</p>
                  <h3 className="font-semibold text-navy-800 text-sm leading-snug mt-0.5">{award.title}</h3>
                  <p className="text-navy-400 text-xs mt-1">{award.org}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
