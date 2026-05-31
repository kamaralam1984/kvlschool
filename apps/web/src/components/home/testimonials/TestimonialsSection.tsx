'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    quote:
      "I've visited schools in London, Singapore, and Bangalore. KVL is the only school where I walked in and immediately felt — this is where my child belongs. The teachers don't just teach. They notice. They care. They remember.",
    name: 'Radha Krishnan',
    role: 'Parent of Aarav, Class 12 · 2024 Batch',
    photo: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=100&q=80',
  },
  {
    quote:
      "KVL didn't give me a degree. It gave me a way of thinking. Seven years at this school taught me that the most important education happens outside the syllabus — in debates, in failures, in the conversations with teachers who actually believed in us.",
    name: 'Arjun Mehta',
    role: 'KVL Alumni · IIT Delhi 2023',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  },
  {
    quote:
      "As a parent, my biggest fear was whether my daughter would be safe, happy, and challenged all at once. Three years later, she's the most confident, curious version of herself. That's KVL.",
    name: 'Meera Nair',
    role: 'Parent · Current Student',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
  },
]

const variants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
}

export function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > active ? 1 : -1)
      setActive(next)
    },
    [active],
  )

  const prev = useCallback(() => {
    goTo((active - 1 + testimonials.length) % testimonials.length)
  }, [active, goTo])

  const next = useCallback(() => {
    goTo((active + 1) % testimonials.length)
  }, [active, goTo])

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setActive((i) => (i + 1) % testimonials.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const t = testimonials[active]

  return (
    <section
      className="relative overflow-hidden bg-ivory-100"
      style={{ padding: '10rem 0' }}
    >
      {/* Subtle gold texture dots */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(180,144,73,0.07) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent" />

      <div className="container-premium">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="section-label mb-4">WHAT THEY SAY</span>
          <h2 className="heading-h2">
            Thirty Years of{' '}
            <span className="gradient-text-gold">Stories Like These</span>
          </h2>
        </div>

        {/* Quote area */}
        <div className="relative max-w-[760px] mx-auto">
          {/* Decorative large quotation mark */}
          <div
            aria-hidden
            className="absolute -top-8 -left-4 font-display leading-none select-none pointer-events-none"
            style={{
              fontSize: '8rem',
              color: 'rgba(180,144,73,0.10)',
              fontFamily: "'Playfair Display', Georgia, serif",
              lineHeight: 1,
            }}
          >
            &ldquo;
          </div>

          {/* Animated quote */}
          <div className="relative min-h-[240px] flex flex-col justify-center">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: d * 60 }),
                  center: { opacity: 1, x: 0 },
                  exit: (d: number) => ({ opacity: 0, x: d * -60 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <blockquote
                  className="font-display italic text-navy-800 leading-relaxed"
                  style={{
                    fontSize: '1.75rem',
                    lineHeight: 1.6,
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Gold rule */}
                <div
                  className="my-8 bg-gold-400"
                  style={{ width: '40px', height: '2px' }}
                />

                {/* Attribution */}
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gold-300">
                    <Image
                      src={t.photo}
                      alt={t.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900 text-base leading-tight">
                      {t.name}
                    </p>
                    <p className="text-navy-500 text-sm mt-0.5">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6 mt-12">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="group w-11 h-11 rounded-full border border-navy-200 flex items-center justify-center text-navy-500 hover:border-gold-400 hover:text-gold-500 transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === active ? '24px' : '8px',
                    height: '8px',
                    background: i === active ? '#B49049' : '#D4B896',
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="group w-11 h-11 rounded-full border border-navy-200 flex items-center justify-center text-navy-500 hover:border-gold-400 hover:text-gold-500 transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom gold rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent" />
    </section>
  )
}
