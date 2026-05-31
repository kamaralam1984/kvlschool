'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const photos = [
  {
    src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=85',
    caption: 'Our Library · 50,000 volumes',
    alt: 'KVL Library',
  },
  {
    src: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=85',
    caption: 'State-of-the-Art Science Labs',
    alt: 'KVL Science Laboratory',
  },
  {
    src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=85',
    caption: '25-Acre Sports Complex',
    alt: 'KVL Sports Ground',
  },
  {
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=85',
    caption: 'Collaborative Learning Spaces',
    alt: 'Students Collaborating',
  },
  {
    src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=85',
    caption: 'Smart Classrooms',
    alt: 'KVL Smart Classroom',
  },
  {
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=85',
    caption: 'Annual Cultural Festival',
    alt: 'KVL Cultural Event',
  },
  {
    src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=85',
    caption: 'Modern Residential Hostel',
    alt: 'KVL Residential Hostel',
  },
]

export function LifeAtKVL() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-65%'])

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0f1e]"
      style={{ minHeight: '300vh' }}
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        {/* Rotated vertical label */}
        <div
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2"
          style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}
        >
          <span
            className="text-xs font-semibold tracking-[0.25em] uppercase"
            style={{ color: '#C9A84C', fontFamily: 'var(--font-playfair), serif' }}
          >
            Life at KVL
          </span>
        </div>

        {/* Inner layout */}
        <div className="pl-14 pr-8 flex flex-col gap-8">
          {/* Section header */}
          <div className="max-w-xl">
            <p
              className="text-xs font-semibold tracking-[0.3em] uppercase mb-3"
              style={{ color: '#C9A84C' }}
            >
              Campus &amp; Life
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              Every corner of KVL<br />
              <span style={{ color: '#C9A84C' }}>tells a story.</span>
            </h2>
          </div>

          {/* Horizontal scrolling strip */}
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              style={{ x }}
            >
              {photos.map((photo, i) => (
                <PhotoCard key={i} photo={photo} index={i} />
              ))}
            </motion.div>
          </div>

          {/* Footer link */}
          <div className="pl-0">
            <Link
              href="/campus"
              className="inline-flex items-center gap-2 text-sm font-medium tracking-widest uppercase transition-all duration-300 group"
              style={{ color: '#C9A84C' }}
            >
              Explore Campus
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function PhotoCard({ photo, index }: { photo: (typeof photos)[0]; index: number }) {
  return (
    <div
      className="relative flex-shrink-0 overflow-hidden group cursor-pointer"
      style={{ width: '400px', height: '560px' }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="400px"
        loading={index < 2 ? 'eager' : 'lazy'}
      />

      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(10,15,30,0.75) 0%, transparent 55%)',
        }}
      />

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-6 transition-transform duration-500 ease-out group-hover:-translate-y-2">
        <p
          className="text-white text-sm leading-snug"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontStyle: 'italic',
          }}
        >
          {photo.caption}
        </p>
      </div>

      {/* Thin gold separator between photos */}
      {index < photos.length - 1 && (
        <div
          className="absolute top-0 right-0 w-px h-full opacity-20"
          style={{ backgroundColor: '#C9A84C' }}
        />
      )}
    </div>
  )
}
