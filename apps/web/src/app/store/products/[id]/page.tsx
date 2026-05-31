import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Star, Check, Package, Truck } from 'lucide-react'

export const metadata: Metadata = { title: 'Product', description: 'KVL School Store product details.' }

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <>
      <Header />
      <main>
        <section className="section bg-ivory-100">
          <div className="container-premium">
            <Link href="/store" className="inline-flex items-center gap-2 text-navy-500 hover:text-navy-800 text-sm mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Store
            </Link>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="relative h-96 rounded-2xl overflow-hidden bg-white border border-ivory-200">
                <Image src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80" alt="Product" fill className="object-cover" sizes="600px" />
              </div>
              <div>
                <span className="badge-navy mb-3 inline-flex">Books</span>
                <h1 className="font-display text-3xl font-bold text-navy-900 mb-2">Class X Complete Study Pack</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex"><Star className="w-4 h-4 text-gold-400 fill-gold-400" /><Star className="w-4 h-4 text-gold-400 fill-gold-400" /><Star className="w-4 h-4 text-gold-400 fill-gold-400" /><Star className="w-4 h-4 text-gold-400 fill-gold-400" /><Star className="w-4 h-4 text-gold-400 fill-gold-400" /></div>
                  <span className="text-navy-600 text-sm">4.8 (124 reviews)</span>
                </div>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="font-display text-4xl font-bold text-navy-900">₹2,400</span>
                  <span className="text-navy-300 text-lg line-through">₹3,200</span>
                  <span className="text-green-600 font-semibold">25% off</span>
                </div>
                <div className="space-y-2 mb-8">
                  {['All NCERT textbooks for Class X', 'CBSE sample papers 2024-25', 'Practice question bank', 'Quick revision notes'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-navy-600 text-sm"><Check className="w-4 h-4 text-green-500" />{f}</div>
                  ))}
                </div>
                <div className="space-y-3">
                  <button className="w-full btn-primary justify-center py-4"><ShoppingCart className="w-5 h-5" />Add to Cart</button>
                  <button className="w-full btn-gold justify-center py-4">Buy Now</button>
                </div>
                <div className="flex gap-6 mt-6 pt-6 border-t border-ivory-200">
                  <div className="flex items-center gap-2 text-navy-500 text-xs"><Package className="w-4 h-4" />Free school delivery</div>
                  <div className="flex items-center gap-2 text-navy-500 text-xs"><Truck className="w-4 h-4" />Home delivery available</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
