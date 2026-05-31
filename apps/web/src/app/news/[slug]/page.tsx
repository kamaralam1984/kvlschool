import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react'

export const metadata: Metadata = { title: 'News Article', description: 'KVL International School news article.' }

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <>
      <Header />
      <main>
        <section className="section bg-ivory-100">
          <div className="container-premium max-w-4xl">
            <Link href="/news" className="inline-flex items-center gap-2 text-navy-500 hover:text-navy-800 text-sm mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to News
            </Link>

            <div className="mb-4">
              <span className="badge-gold">Achievement</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-6">
              KVL Students Win National Science Olympiad — 3 Gold Medals
            </h1>
            <div className="flex items-center gap-6 text-navy-400 text-sm mb-8 pb-8 border-b border-ivory-200">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />28 December 2024</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />3 min read</span>
              <button className="flex items-center gap-1.5 hover:text-navy-700 transition-colors ml-auto">
                <Share2 className="w-4 h-4" />Share
              </button>
            </div>

            <div className="relative h-80 rounded-2xl overflow-hidden mb-10">
              <Image
                src="https://images.unsplash.com/photo-1532094349884-543290680dce?w=1200&q=85"
                alt="Science Olympiad"
                fill className="object-cover"
                sizes="800px"
              />
            </div>

            <div className="prose prose-lg max-w-none text-navy-600 leading-relaxed space-y-5">
              <p>
                KVL International School is proud to announce that three of our Class X students have won gold medals
                at the prestigious National Science Olympiad 2024, held in Bengaluru. Competing against 2,400+ students
                from 380 schools across India, our students demonstrated exceptional scientific knowledge and problem-solving skills.
              </p>
              <p>
                The winners — Aarav Sharma (Physics), Priya Menon (Chemistry), and Rohan Gupta (Biology) — underwent
                six months of rigorous preparation under the guidance of our dedicated science faculty. Their achievement
                is a testament to KVL&apos;s commitment to academic excellence and scientific inquiry.
              </p>
              <p>
                Principal Dr. Rajesh Kumar Verma congratulated the students: &ldquo;This is a proud moment for our entire
                school family. These young scientists have demonstrated that with dedication, curiosity, and the right
                guidance, our students can compete and excel at the highest national level.&rdquo;
              </p>
              <p>
                All three students have been selected to represent India at the International Science Olympiad to be held
                in Singapore in March 2025. The school wishes them the very best in their upcoming international journey.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-ivory-200">
              <Link href="/news" className="btn-primary">
                <ArrowLeft className="w-4 h-4" /> More News
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
