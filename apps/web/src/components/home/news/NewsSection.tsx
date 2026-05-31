'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'

const news = [
  { slug: 'kvl-national-science-award', category: 'Achievement', title: 'KVL Students Win National Science Olympiad — 3 Gold Medals', date: '28 Dec 2024', excerpt: 'Three of our Class X students clinched gold medals at the prestigious National Science Olympiad held in Bengaluru.', image: 'https://images.unsplash.com/photo-1532094349884-543290680dce?w=600&q=80', featured: true },
  { slug: 'new-robotics-lab', category: 'Infrastructure', title: 'State-of-the-Art Robotics & AI Lab Inaugurated', date: '20 Dec 2024', excerpt: 'The new ₹50 lakh Robotics & AI Lab was inaugurated, equipped with 30 robotics kits and AI workstations.', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80', featured: false },
  { slug: 'board-results-2024', category: 'Results', title: 'Class XII Board Results — 100% Pass, 42 Students Score 95%+', date: '15 Dec 2024', excerpt: 'KVL achieved 100% results in CBSE Class XII boards with our topper scoring 99.2% overall.', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80', featured: false },
]

export function NewsSection() {
  const [featured, ...rest] = news
  return (
    <section className="section bg-white">
      <div className="container-premium">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="section-label mb-4">News & Updates</span>
            <h2 className="heading-h2">
              Stories from{' '}
              <span className="gradient-text-gold">Our Community</span>
            </h2>
          </div>
          <Link href="/news" className="btn-ghost text-sm hidden md:flex">
            All News <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Link href={`/news/${featured.slug}`} className="group block card-premium overflow-hidden h-full">
              <div className="relative h-72 overflow-hidden">
                <Image src={featured.image} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="badge-gold">{featured.category}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-navy-400 text-xs mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  {featured.date}
                </div>
                <h3 className="font-display text-xl font-semibold text-navy-900 leading-tight mb-3 group-hover:text-navy-700">{featured.title}</h3>
                <p className="text-navy-500 text-sm leading-relaxed">{featured.excerpt}</p>
              </div>
            </Link>
          </motion.div>

          {/* Rest */}
          <div className="space-y-5">
            {rest.map((item, i) => (
              <motion.div key={item.slug} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={`/news/${item.slug}`} className="group flex gap-4 card-premium p-4">
                  <div className="relative w-28 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="112px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge-navy text-[10px]">{item.category}</span>
                      <span className="text-navy-400 text-xs">{item.date}</span>
                    </div>
                    <h3 className="font-semibold text-navy-800 text-sm leading-snug mb-1 group-hover:text-navy-600 line-clamp-2">{item.title}</h3>
                    <p className="text-navy-400 text-xs line-clamp-2">{item.excerpt}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
