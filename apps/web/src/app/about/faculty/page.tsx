import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Faculty Directory', description: 'KVL School faculty and teaching staff' }

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-navy-900 py-20">
          <div className="container-premium text-center">
            <span className="section-label justify-center text-gold-400 before:bg-gold-400 mb-4">KVL International School</span>
            <h1 className="font-display text-5xl font-bold text-white mb-4">Faculty Directory</h1>
            <p className="text-ivory-300 max-w-xl mx-auto">Our team of highly qualified, experienced, and passionate educators.</p>
          </div>
        </section>
        <section className="section bg-ivory-100">
          <div className="container-premium max-w-3xl text-center">
            <div className="card-premium p-12">
              <p className="text-navy-500 mb-6">This page is being updated with full content. Please check back soon or contact us for more information.</p>
              <div className="flex justify-center gap-4">
                <Link href="/contact" className="btn-primary">Contact Us <ArrowRight className="w-4 h-4" /></Link>
                <Link href="/" className="btn-outline">Go to Homepage</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
