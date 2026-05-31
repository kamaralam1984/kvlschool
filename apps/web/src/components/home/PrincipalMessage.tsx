'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

export function PrincipalMessage() {
  return (
    <section className="section bg-navy-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-navy-700/50 rounded-full blur-3xl pointer-events-none" />

      <div className="container-premium">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-center">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 flex justify-center"
          >
            <div className="relative">
              {/* Glow rings */}
              <div className="absolute -inset-4 rounded-3xl bg-gold-500/5 pointer-events-none" />
              <div className="absolute -inset-6 rounded-3xl border border-gold-500/10 pointer-events-none" />

              <div className="relative w-72 h-96 lg:w-80 lg:h-[440px] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=640&q=85"
                  alt="Dr. Rajesh Kumar Verma — Principal, KVL International School"
                  fill
                  quality={85}
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 288px, 320px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
              </div>

              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-60 bg-gold-500 rounded-xl p-4 text-center shadow-premium">
                <p className="font-display font-bold text-navy-900 text-sm">Dr. Rajesh Kumar Verma</p>
                <p className="text-navy-800 text-xs font-medium mt-0.5">Principal & Academic Director</p>
              </div>
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <span className="section-label mb-6 before:bg-gold-400 text-gold-400">
              Message from the Principal
            </span>

            <Quote className="w-12 h-12 text-gold-500/30 mb-4" />

            <blockquote className="font-display text-2xl lg:text-3xl text-ivory-100 leading-relaxed font-light italic mb-8">
              &ldquo;At KVL International School, we believe education is not the filling of a pail, but the lighting of a fire. Every child who walks through our gates carries within them an extraordinary capacity for greatness — our job is simply to help them find it.&rdquo;
            </blockquote>

            <div className="border-t border-navy-700 pt-6">
              <p className="text-ivory-200 font-semibold">Dr. Rajesh Kumar Verma</p>
              <p className="text-gold-400 text-sm mt-1">M.Ed. Delhi University · Ph.D. Education Policy · 25+ Years in Education</p>

              <div className="mt-6 grid grid-cols-3 gap-6">
                {[
                  ['25+', 'Years Experience'],
                  ['12', 'National Awards'],
                  ['4,200+', 'Students Mentored'],
                ].map(([val, label]) => (
                  <div key={label}>
                    <p className="font-display text-2xl font-bold text-gold-400">{val}</p>
                    <p className="text-ivory-400 text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
