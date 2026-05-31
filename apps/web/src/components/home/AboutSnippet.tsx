'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Globe, BookOpen, Heart } from 'lucide-react'

const values = [
  { icon: BookOpen, label: 'Academic Excellence',  desc: 'Rigorous CBSE curriculum with IB-inspired pedagogy and a 98% board result track record.' },
  { icon: Globe,    label: 'Global Perspective',   desc: 'International exchange programs, MUNs, and a diverse community of 28 nationalities.' },
  { icon: Shield,   label: 'Character Building',   desc: 'Daily ethics and leadership sessions, community service, and mentorship from day one.' },
  { icon: Heart,    label: 'Holistic Development', desc: 'Sports, arts, music, drama, coding — 60+ co-curricular activities to discover every talent.' },
]

export function AboutSnippet() {
  return (
    <section className="section bg-ivory-100 relative overflow-hidden">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-label mb-4">Our Story</span>

            <h2 className="heading-h2 mb-6">
              Thirty Years of{' '}
              <span className="gradient-text-gold">Shaping India's Finest</span>
            </h2>

            <p className="text-navy-500 leading-relaxed mb-6">
              Founded in 1994 by visionary educators, KVL International School has grown from a small
              community institution into one of India&apos;s most respected CBSE schools. Our campus in
              New Delhi spreads across 12 acres, housing world-class facilities designed to inspire
              curiosity and nurture talent.
            </p>
            <p className="text-navy-500 leading-relaxed mb-10">
              We believe that every child comes to us with limitless potential. Our role is not to
              mold them into a uniform shape, but to help them discover the shape they were always
              meant to become.
            </p>

            {/* Values grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {values.map((v) => {
                const Icon = v.icon
                return (
                  <div key={v.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-navy-600" />
                    </div>
                    <div>
                      <p className="text-navy-800 text-sm font-semibold">{v.label}</p>
                      <p className="text-navy-400 text-xs mt-0.5 leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <Link href="/about" className="group btn-primary">
              Discover Our Story
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right — image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-premium aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=85"
                alt="KVL International School students in library"
                fill
                quality={85}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent" />
            </div>

            {/* Floating stats */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-premium">
              <p className="font-display text-3xl font-bold text-navy-900">30+</p>
              <p className="text-navy-500 text-sm">Years of Excellence</p>
            </div>
            <div className="absolute -top-6 -right-6 bg-gold-500 rounded-2xl p-5 shadow-glow-gold">
              <p className="font-display text-3xl font-bold text-navy-900">98%</p>
              <p className="text-navy-800 text-sm font-medium">University Acceptance</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
