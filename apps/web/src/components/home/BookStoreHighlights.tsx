'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Star, ArrowRight, Tag } from 'lucide-react'

const products = [
  { id: '1', name: 'Class X Complete Study Pack', category: 'Books', price: 2400, mrp: 3200, image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80', rating: 4.8, reviews: 124, badge: 'Best Seller' },
  { id: '2', name: 'KVL School Uniform Set (Boy)', category: 'Uniform', price: 1800, mrp: 2200, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80', rating: 4.6, reviews: 89, badge: null },
  { id: '3', name: 'Science Lab Kit — Grade 8–10', category: 'Science', price: 1200, mrp: 1500, image: 'https://images.unsplash.com/photo-1532094349884-543290680dce?w=400&q=80', rating: 4.9, reviews: 67, badge: 'New Arrival' },
  { id: '4', name: 'Class XII Board Exam Prep Pack', category: 'Books', price: 3100, mrp: 4500, image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80', rating: 4.7, reviews: 203, badge: 'Top Rated' },
]

export function BookStoreHighlights() {
  return (
    <section className="section bg-white">
      <div className="container-premium">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="section-label mb-4">School Store</span>
            <h2 className="heading-h2">
              Official Books, Uniforms{' '}
              <span className="gradient-text-gold">&amp; More</span>
            </h2>
            <p className="text-navy-500 text-sm mt-2">Official KVL merchandise and academic resources — order online, delivered to your door.</p>
          </div>
          <Link href="/store" className="btn-ghost text-sm hidden md:flex">
            Visit Store <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/store/products/${p.id}`} className="group block card-premium overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="300px" />
                  {p.badge && (
                    <span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded-full bg-gold-500 text-navy-900">{p.badge}</span>
                  )}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                      <ShoppingCart className="w-3.5 h-3.5 text-navy-700" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-navy-400 text-xs font-medium uppercase tracking-wide mb-1">{p.category}</p>
                  <h3 className="text-navy-800 font-semibold text-sm leading-tight mb-2 group-hover:text-navy-900">{p.name}</h3>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                    <span className="text-xs text-navy-600 font-medium">{p.rating}</span>
                    <span className="text-xs text-navy-400">({p.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy-900 text-base">₹{p.price.toLocaleString('en-IN')}</span>
                    <span className="text-navy-300 text-xs line-through">₹{p.mrp.toLocaleString('en-IN')}</span>
                    <span className="text-green-600 text-xs font-semibold">
                      {Math.round((1 - p.price / p.mrp) * 100)}% off
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/store" className="btn-primary text-sm">
            Visit the Store <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
