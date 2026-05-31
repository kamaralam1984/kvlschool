import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

export const metadata: Metadata = { title: 'News & Events', description: 'Latest news, announcements, and upcoming events at KVL International School.' }

const news = [
  { slug: 'kvl-national-science-award', category: 'Achievement', title: 'KVL Students Win National Science Olympiad — 3 Gold Medals', date: '28 Dec 2024', readTime: '3 min', image: 'https://images.unsplash.com/photo-1532094349884-543290680dce?w=800&q=80', excerpt: 'Three of our Class X students clinched gold medals at the prestigious National Science Olympiad held in Bengaluru, competing against 2,400+ students from across India.' },
  { slug: 'new-robotics-lab', category: 'Infrastructure', title: 'State-of-the-Art Robotics & AI Lab Inaugurated', date: '20 Dec 2024', readTime: '2 min', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80', excerpt: 'The new ₹50 lakh Robotics & AI Lab was inaugurated by the Principal, equipped with 30 robotics kits, AI workstations, and a dedicated innovation space.' },
  { slug: 'board-results-2024', category: 'Results', title: 'Class XII Board Results — 100% Pass, 42 Students Score 95%+', date: '15 Dec 2024', readTime: '4 min', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', excerpt: 'KVL International School achieved 100% results in CBSE Class XII boards. Our school topper Aanya Sharma scored an exceptional 99.2% overall.' },
  { slug: 'sports-day-2024', category: 'Events', title: 'Annual Sports Day 2024 — A Celebration of Athletic Excellence', date: '10 Dec 2024', readTime: '3 min', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80', excerpt: 'The 30th Annual Sports Day was a spectacular showcase of talent, with 800+ students competing across 40+ events over two exciting days.' },
  { slug: 'scholarship-programme', category: 'Announcement', title: 'KVL Merit Scholarship Programme 2025 — Applications Open', date: '5 Dec 2024', readTime: '2 min', image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80', excerpt: 'We are pleased to announce the KVL Merit Scholarship Programme 2025, offering full and partial fee waivers to deserving students based on academic excellence.' },
  { slug: 'science-expo', category: 'Events', title: 'Inter-School Science & Innovation Expo — KVL Wins Overall Trophy', date: '1 Dec 2024', readTime: '3 min', image: 'https://images.unsplash.com/photo-1609654122932-f5b11751c2fa?w=800&q=80', excerpt: 'KVL International School won the Overall Trophy at the Inter-School Science & Innovation Expo, with 12 projects selected for the national level.' },
]

const upcomingEvents = [
  { date: '15 Jan', title: 'Annual Sports Day', time: '8:00 AM', venue: 'Main Ground' },
  { date: '26 Jan', title: 'Republic Day Parade', time: '9:00 AM', venue: 'School Auditorium' },
  { date: '10 Feb', title: 'Science & Innovation Expo', time: '10:00 AM', venue: 'Science Block' },
  { date: '28 Feb', title: 'Prize Distribution Ceremony', time: '5:00 PM', venue: 'Main Auditorium' },
]

export default function NewsPage() {
  const [featured, ...rest] = news
  return (
    <>
      <Header />
      <main>
        <section className="bg-navy-900 py-20">
          <div className="container-premium text-center">
            <span className="section-label justify-center text-gold-400 before:bg-gold-400 mb-4">Stay Informed</span>
            <h1 className="font-display text-5xl font-bold text-white mb-4">News & Events</h1>
            <p className="text-ivory-300 max-w-xl mx-auto">The latest stories, achievements, and announcements from our school community.</p>
          </div>
        </section>

        <section className="section bg-ivory-100">
          <div className="container-premium">
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Main news */}
              <div className="lg:col-span-2 space-y-8">
                {/* Featured */}
                <Link href={`/news/${featured.slug}`} className="group block card-premium overflow-hidden">
                  <div className="relative h-64 overflow-hidden">
                    <Image src={featured.image} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="700px" />
                    <div className="absolute top-4 left-4"><span className="badge-gold">{featured.category}</span></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-navy-400 text-xs mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{featured.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime} read</span>
                    </div>
                    <h2 className="font-display text-xl font-semibold text-navy-900 mb-2 group-hover:text-navy-700">{featured.title}</h2>
                    <p className="text-navy-500 text-sm leading-relaxed">{featured.excerpt}</p>
                  </div>
                </Link>

                {/* Rest */}
                {rest.map((item) => (
                  <Link key={item.slug} href={`/news/${item.slug}`} className="group flex gap-5 card-premium p-5">
                    <div className="relative w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform" sizes="128px" />
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-3 mb-1">
                        <span className="badge-navy text-[10px]">{item.category}</span>
                        <span className="text-navy-400 text-xs">{item.date}</span>
                      </div>
                      <h3 className="font-semibold text-navy-800 text-sm leading-snug mb-1 group-hover:text-navy-600 line-clamp-2">{item.title}</h3>
                      <p className="text-navy-400 text-xs line-clamp-2">{item.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="card-premium p-6">
                  <h3 className="font-semibold text-navy-900 mb-5">Upcoming Events</h3>
                  <div className="space-y-4">
                    {upcomingEvents.map((e) => (
                      <div key={e.title} className="flex gap-4 pb-4 border-b border-ivory-200 last:border-0 last:pb-0">
                        <div className="text-center flex-shrink-0 w-10">
                          <p className="font-display font-bold text-navy-900 text-lg leading-none">{e.date.split(' ')[0]}</p>
                          <p className="text-[10px] font-bold text-navy-400 uppercase">{e.date.split(' ')[1]}</p>
                        </div>
                        <div>
                          <p className="font-medium text-navy-800 text-sm">{e.title}</p>
                          <p className="text-navy-400 text-xs mt-0.5">{e.time} · {e.venue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-premium p-6">
                  <h3 className="font-semibold text-navy-900 mb-4">Browse by Category</h3>
                  <div className="space-y-2">
                    {['Achievement', 'Events', 'Academic', 'Results', 'Announcement', 'Infrastructure'].map((cat) => (
                      <button key={cat} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-ivory-100 text-navy-600 text-sm transition-colors">
                        <span>{cat}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
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
