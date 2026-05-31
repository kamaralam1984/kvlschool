'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowRight, Play, ChevronDown, Award, Users, BookOpen } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=85',
    tag: 'Welcome to KVL International School',
    headline: 'Where Every Child',
    headlineAccent: 'Discovers Their Greatness',
    subtext: 'A premier CBSE institution shaping future leaders through academic excellence, character development, and innovation since 1994.',
  },
  {
    image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1920&q=85',
    tag: 'Academic Excellence · Est. 1994',
    headline: 'Building Tomorrow\'s',
    headlineAccent: 'Leaders Today',
    subtext: 'With 86 dedicated faculty members, world-class facilities, and a 98% university acceptance rate, we prepare students for global success.',
  },
  {
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&q=85',
    tag: 'Admissions Open 2025–26',
    headline: 'Your Child\'s Brightest',
    headlineAccent: 'Chapter Starts Here',
    subtext: 'Limited seats available for 2025–26. Join 4,200+ students who call KVL their second home. Applications now open.',
  },
]

const highlights = [
  { icon: Award,    label: 'Ranked #1',       value: 'Top 10 CBSE Schools', color: 'text-gold-400' },
  { icon: Users,    label: 'Students',         value: '4,200+ Enrolled',     color: 'text-blue-300' },
  { icon: BookOpen, label: 'Acceptance Rate',  value: '98% Universities',    color: 'text-green-300' },
]

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const containerRef = useRef<HTMLElement>(null)
  const headlineRef  = useRef<HTMLHeadingElement>(null)
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const rawY  = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const springY = useSpring(rawY, { stiffness: 60, damping: 20 })
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % heroSlides.length)
      }, 6000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, activeSlide])

  useGSAP(() => {
    if (!headlineRef.current) return
    const split = new SplitText(headlineRef.current, { type: 'words,chars' })
    gsap.from(split.chars, {
      opacity: 0,
      y: 60,
      rotateX: -45,
      stagger: 0.02,
      duration: 1,
      ease: 'power4.out',
      delay: 0.3,
    })
    return () => split.revert()
  }, [activeSlide])

  const slide = heroSlides[activeSlide]

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen max-h-[1000px] overflow-hidden flex items-center"
    >
      {/* Background images with crossfade */}
      <div className="absolute inset-0">
        {heroSlides.map((s, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === activeSlide ? 1 : 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <motion.div
              style={{ y: springY }}
              className="absolute inset-0 scale-110 will-change-transform"
            >
              <Image
                src={s.image}
                alt={s.tag}
                fill
                priority={i === 0}
                quality={85}
                className="object-cover object-center"
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        ))}

        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/70 to-navy-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-navy-900/20" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 w-full">
        <div className="container-premium grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="py-32 lg:py-40">
            {/* Tag line */}
            <motion.div
              key={`tag-${activeSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="w-10 h-px bg-gold-400" />
              <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">
                {slide.tag}
              </span>
            </motion.div>

            {/* Headline */}
            <h1
              ref={headlineRef}
              className="font-display text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight mb-2"
            >
              {slide.headline}
              <br />
              <span className="gradient-text-gold">{slide.headlineAccent}</span>
            </h1>

            {/* Subtext */}
            <motion.p
              key={`sub-${activeSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-6 text-ivory-300 text-lg leading-relaxed max-w-xl"
            >
              {slide.subtext}
            </motion.p>

            {/* CTAs */}
            <motion.div
              key={`cta-${activeSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/admissions/apply"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gold-500 text-navy-900 font-bold text-sm tracking-wide rounded-xl hover:bg-gold-400 hover:shadow-glow-gold transition-all duration-300 hover:-translate-y-0.5"
              >
                Apply for Admissions
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => setIsPlaying(false)}
                className="group inline-flex items-center gap-3 px-6 py-4 border border-white/30 text-white font-medium text-sm rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-gold-500/30 transition-colors">
                  <Play className="w-3.5 h-3.5 ml-0.5" fill="white" />
                </span>
                Watch Campus Tour
              </button>
            </motion.div>

            {/* Slide indicators */}
            <div className="flex items-center gap-3 mt-12">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveSlide(i); setIsPlaying(false) }}
                  className={`h-0.5 rounded-full transition-all duration-500 ${
                    i === activeSlide ? 'w-10 bg-gold-400' : 'w-4 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
              <span className="text-white/40 text-xs ml-2 font-mono">
                {String(activeSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Right — highlight cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:flex flex-col gap-4"
          >
            {highlights.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass-card bg-white/10 border-white/20 backdrop-blur-xl rounded-2xl p-5 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                  <h.icon className={`w-6 h-6 ${h.color}`} />
                </div>
                <div>
                  <p className="text-white/60 text-xs font-medium uppercase tracking-wider">{h.label}</p>
                  <p className="text-white font-bold text-xl font-display">{h.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Accreditation badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="glass-card bg-white/10 border-white/20 rounded-2xl p-5"
            >
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">Affiliated & Accredited By</p>
              <div className="flex items-center gap-4">
                {['CBSE', 'ISO 9001', 'NAAC A+'].map((badge) => (
                  <div key={badge} className="px-3 py-1.5 rounded-lg bg-white/15 border border-white/20">
                    <span className="text-white text-xs font-bold tracking-wide">{badge}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>

      {/* Bottom gradient blend */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ivory-100 to-transparent pointer-events-none" />
    </section>
  )
}
