'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ArrowRight } from 'lucide-react'

const images = [
  { src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', category: 'Campus',   span: 'col-span-2 row-span-2', alt: 'School campus' },
  { src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80', category: 'Academic', span: '',                    alt: 'Classroom' },
  { src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80', category: 'Sports',   span: '',                    alt: 'Sports' },
  { src: 'https://images.unsplash.com/photo-1532094349884-543290680dce?w=600&q=80', category: 'Science',  span: '',                    alt: 'Science lab' },
  { src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80', category: 'Events',   span: 'col-span-2',          alt: 'Annual day' },
  { src: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80', category: 'Library',  span: '',                    alt: 'Library' },
]

export function GallerySection() {
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <section className="section bg-navy-950">
      <div className="container-premium">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="section-label text-gold-400 before:bg-gold-400 mb-4">Gallery</span>
            <h2 className="heading-h2 text-white">
              A Glimpse of{' '}
              <span className="gradient-text-gold">KVL Life</span>
            </h2>
          </div>
          <Link href="/gallery" className="btn-ghost text-ivory-300 hover:text-gold-400 text-sm hidden md:flex">
            View Full Gallery <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 grid-rows-3 gap-3 h-[500px]">
          {images.map((img, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setLightbox(img.src)}
              className={`group relative overflow-hidden rounded-xl ${img.span}`}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="400px" />
              <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/40 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="badge-gold text-[10px]">{img.category}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-4 right-4 text-white hover:text-gold-400 p-2">
              <X className="w-8 h-8" />
            </button>
            <div className="relative max-w-4xl max-h-[85vh] w-full h-full">
              <Image src={lightbox} alt="Gallery" fill className="object-contain" sizes="100vw" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
