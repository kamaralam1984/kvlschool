'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Phone, Calendar, FileText } from 'lucide-react'

export function AdmissionsCTA() {
  return (
    <section className="section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80"
          alt="KVL School Campus"
          fill
          quality={75}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-navy-900/85" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="relative z-10 container-premium">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 text-gold-400 text-xs font-bold tracking-widest uppercase mb-6">
              <span className="w-8 h-px bg-gold-400" />
              Admissions Open for 2025–26
              <span className="w-8 h-px bg-gold-400" />
            </span>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Begin the Most{' '}
              <span className="gradient-text-gold">Important Journey</span>
              {' '}of Your Child&apos;s Life
            </h2>

            <p className="text-ivory-300 text-lg leading-relaxed mb-12 max-w-xl mx-auto">
              Limited seats available across all classes. Join thousands of families who
              have trusted KVL International School to shape the future of their children.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Link href="/admissions/apply" className="group btn-gold text-base px-10 py-4">
                Apply Now — Free Application
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/admissions/fees" className="group btn-outline border-white/40 text-white hover:bg-white/10 hover:border-white/60 text-base px-10 py-4">
                <FileText className="w-4 h-4 mr-2" />
                View Fee Structure
              </Link>
            </div>

            {/* Quick contact options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Phone, label: 'Call Admissions', desc: '+91 98765 43210', href: 'tel:+919876543210' },
                { icon: Calendar, label: 'Book a Visit', desc: 'Schedule campus tour', href: '/contact' },
                { icon: FileText, label: 'Download Prospectus', desc: 'School prospectus PDF', href: '/prospectus.pdf' },
              ].map(({ icon: Icon, label, desc, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/10 border border-white/15 hover:bg-white/15 hover:border-white/25 transition-all duration-300 text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{label}</p>
                    <p className="text-ivory-400 text-xs mt-0.5">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
