import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star, Search, SlidersHorizontal } from 'lucide-react'

export const metadata: Metadata = { title: 'School Store', description: 'Official KVL School Store — books, uniforms, stationery, and digital resources.' }

const categories = ['All', 'Books', 'Uniforms', 'Stationery', 'Science Kit', 'Sports', 'Digital']
const products = [
  { id: '1', name: 'Class X Complete Study Pack', category: 'Books', price: 2400, mrp: 3200, rating: 4.8, reviews: 124, badge: 'Best Seller', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80' },
  { id: '2', name: 'KVL School Uniform Set (Boy)', category: 'Uniforms', price: 1800, mrp: 2200, rating: 4.6, reviews: 89, badge: null, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80' },
  { id: '3', name: 'Science Lab Kit — Grade 8–10', category: 'Science Kit', price: 1200, mrp: 1500, rating: 4.9, reviews: 67, badge: 'New', image: 'https://images.unsplash.com/photo-1532094349884-543290680dce?w=400&q=80' },
  { id: '4', name: 'Class XII Board Exam Prep Pack', category: 'Books', price: 3100, mrp: 4500, rating: 4.7, reviews: 203, badge: 'Top Rated', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80' },
  { id: '5', name: 'KVL School Uniform Set (Girl)', category: 'Uniforms', price: 1600, mrp: 2000, rating: 4.5, reviews: 78, badge: null, image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80' },
  { id: '6', name: 'Stationery Kit — Premium Set', category: 'Stationery', price: 650, mrp: 850, rating: 4.4, reviews: 156, badge: null, image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80' },
  { id: '7', name: 'Class IX Mathematics — Full Set', category: 'Books', price: 1800, mrp: 2400, rating: 4.6, reviews: 92, badge: null, image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80' },
  { id: '8', name: 'Sports Kit — Basketball', category: 'Sports', price: 2200, mrp: 2800, rating: 4.7, reviews: 45, badge: null, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80' },
]

export default function StorePage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-navy-900 py-16">
          <div className="container-premium text-center">
            <span className="section-label justify-center text-gold-400 before:bg-gold-400 mb-4">Official KVL Store</span>
            <h1 className="font-display text-5xl font-bold text-white mb-4">School Store</h1>
            <p className="text-ivory-300 max-w-lg mx-auto">Books, uniforms, stationery, and digital resources — all official KVL materials in one place.</p>
          </div>
        </section>

        <section className="section bg-ivory-100">
          <div className="container-premium">
            {/* Search & filter bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1 flex items-center gap-2 bg-white border border-ivory-200 rounded-xl px-4 py-3">
                <Search className="w-4 h-4 text-navy-400 flex-shrink-0" />
                <input placeholder="Search products…" className="bg-transparent text-sm text-navy-600 placeholder-navy-400 outline-none w-full" />
              </div>
              <button className="flex items-center gap-2 px-5 py-3 bg-white border border-ivory-200 rounded-xl text-navy-600 text-sm hover:border-navy-300 transition-colors">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat, i) => (
                <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${i === 0 ? 'bg-navy-900 text-white' : 'bg-white border border-ivory-200 text-navy-600 hover:bg-navy-900 hover:text-white hover:border-navy-900'}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((p) => (
                <Link key={p.id} href={`/store/products/${p.id}`} className="group card-premium overflow-hidden">
                  <div className="relative h-48 overflow-hidden bg-gray-50">
                    <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="300px" />
                    {p.badge && <span className="absolute top-3 left-3 px-2 py-0.5 text-xs font-bold rounded-full bg-gold-500 text-navy-900">{p.badge}</span>}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
                        <ShoppingCart className="w-3.5 h-3.5 text-navy-700" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-navy-400 text-xs font-medium uppercase tracking-wide mb-1">{p.category}</p>
                    <h3 className="text-navy-800 font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-navy-600">{p.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                      <span className="text-xs text-navy-600 font-medium">{p.rating}</span>
                      <span className="text-xs text-navy-400">({p.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy-900">₹{p.price.toLocaleString('en-IN')}</span>
                      <span className="text-navy-300 text-xs line-through">₹{p.mrp.toLocaleString('en-IN')}</span>
                      <span className="text-green-600 text-xs font-semibold">{Math.round((1 - p.price / p.mrp) * 100)}% off</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
