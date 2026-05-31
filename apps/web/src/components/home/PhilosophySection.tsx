'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const PHILOSOPHY_IMAGE =
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=85'

const quoteLines = [
  'We do not educate children.',
  'We raise human beings.',
]

const bodyText =
  'KVL was built on a single conviction: that the purpose of school is not to prepare children for exams, but to prepare them for life. Thirty years later, this belief guides every decision we make.'

function RevealLine({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Parallax: image moves slightly slower than scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col lg:flex-row overflow-hidden"
      aria-label="Our Philosophy"
    >
      {/* ── LEFT: Text Panel ── */}
      <div className="relative z-10 flex flex-col justify-center lg:w-1/2 bg-[#060d1a] px-8 sm:px-14 lg:px-20 xl:px-28 py-24 lg:py-32">

        {/* Thin gold rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-12 h-px bg-[#c9922a] origin-left mb-10"
        />

        {/* Large serif quote */}
        <blockquote className="font-display">
          {quoteLines.map((line, i) => (
            <RevealLine key={i} delay={0.1 + i * 0.15}>
              <p
                className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight text-white"
              >
                {line}
              </p>
            </RevealLine>
          ))}
        </blockquote>

        {/* Gold attribution */}
        <RevealLine delay={0.45}>
          <p
            className="mt-6 text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase"
            style={{ color: '#c9922a' }}
          >
            — Our founding philosophy, 1994
          </p>
        </RevealLine>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
          className="w-16 h-px bg-white/10 origin-left my-8"
        />

        {/* Body paragraph */}
        <RevealLine delay={0.6}>
          <p className="text-base sm:text-lg leading-relaxed font-sans max-w-md"
            style={{ color: '#e8e0d0', fontFamily: 'Inter, sans-serif' }}
          >
            {bodyText}
          </p>
        </RevealLine>

        {/* Navigation links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-12 flex flex-col sm:flex-row gap-6 sm:gap-10"
        >
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-white/70 hover:text-white transition-colors duration-300"
          >
            Our Story
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
          <Link
            href="/about/leadership"
            className="group inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-white/70 hover:text-white transition-colors duration-300"
          >
            Meet Our Leadership
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>

      {/* ── RIGHT: Full-bleed image ── */}
      <div className="relative lg:w-1/2 h-[40vh] lg:h-auto overflow-hidden order-first lg:order-last">
        {/* Blend gradient on left edge — merges with dark panel */}
        <div className="absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-[#060d1a] to-transparent" />

        {/* Parallax image wrapper */}
        <motion.div
          ref={imageRef}
          style={{ y: imageY }}
          className="absolute inset-0 scale-110 will-change-transform"
        >
          <Image
            src={PHILOSOPHY_IMAGE}
            alt="Students studying in a warm library at KVL International School"
            fill
            quality={85}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Subtle warm tone overlay for editorial mood */}
          <div className="absolute inset-0 bg-navy-950/20 mix-blend-multiply" />
        </motion.div>
      </div>
    </section>
  )
}
