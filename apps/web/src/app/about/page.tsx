import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Award, Users, BookOpen, Heart, Globe, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about KVL International School — our history, vision, mission, leadership, and 30+ years of academic excellence.',
}

const milestones = [
  { year: '1994', event: 'KVL International School founded by Shri K.V. Lal with 240 students' },
  { year: '2001', event: 'New campus inaugurated — 12-acre state-of-the-art facility' },
  { year: '2005', event: 'CBSE senior secondary affiliation received' },
  { year: '2010', event: 'Central Library with 25,000+ books established' },
  { year: '2015', event: 'ISO 9001:2015 certification achieved' },
  { year: '2018', event: 'Robotics & AI Lab inaugurated' },
  { year: '2020', event: 'Digital transformation — Smart Classrooms in every room' },
  { year: '2023', event: 'NAAC A+ accreditation | Ranked #1 in Delhi NCR' },
]

const values = [
  { icon: BookOpen, title: 'Academic Excellence',   desc: 'Rigorous, research-backed curriculum that challenges and nurtures every learner.' },
  { icon: Heart,    title: 'Compassion',             desc: 'A culture of empathy, inclusion, and care for every member of our community.' },
  { icon: Shield,   title: 'Integrity',              desc: 'Honesty and ethical conduct in every interaction, decision, and achievement.' },
  { icon: Globe,    title: 'Global Citizenship',     desc: 'Preparing students to lead and contribute in an interconnected world.' },
  { icon: Users,    title: 'Collaborative Spirit',   desc: 'Teamwork, peer learning, and community service as core pillars of growth.' },
  { icon: Award,    title: 'Pursuit of Excellence',  desc: 'Inspiring every student to discover and surpass the boundaries of their potential.' },
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-navy-900 py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80" alt="" fill className="object-cover" sizes="100vw" />
          </div>
          <div className="absolute inset-0 bg-navy-900/80" />
          <div className="container-premium relative text-center">
            <span className="section-label justify-center text-gold-400 before:bg-gold-400 mb-6">Est. 1994</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">About KVL International School</h1>
            <p className="text-ivory-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Three decades of shaping minds, building character, and inspiring a generation of leaders, thinkers, and changemakers.
            </p>
          </div>
        </section>

        {/* Quick links */}
        <section className="bg-white border-b border-ivory-200">
          <div className="container-premium py-5 flex flex-wrap gap-3">
            {[
              { label: 'Vision & Mission', href: '/about/vision' },
              { label: 'School History',   href: '/about/history' },
              { label: 'Leadership',       href: '/about/leadership' },
              { label: 'Faculty',          href: '/about/faculty' },
              { label: 'Accreditation',    href: '/about/accreditation' },
              { label: 'Infrastructure',   href: '/about/infrastructure' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="px-4 py-2 rounded-full border border-ivory-200 text-navy-600 text-sm hover:bg-navy-900 hover:text-white hover:border-navy-900 transition-all duration-200">{l.label}</Link>
            ))}
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="section bg-ivory-100">
          <div className="container-premium grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label mb-6">Our Purpose</span>
              <h2 className="heading-h2 mb-8">Vision & Mission</h2>
              <div className="space-y-6">
                <div className="card-premium p-6 border-l-4 border-l-gold-500">
                  <h3 className="font-display text-xl font-semibold text-navy-900 mb-3">Our Vision</h3>
                  <p className="text-navy-500 leading-relaxed">To be a globally recognised institution that nurtures compassionate, creative, and courageous individuals who lead with purpose and serve with integrity.</p>
                </div>
                <div className="card-premium p-6 border-l-4 border-l-navy-600">
                  <h3 className="font-display text-xl font-semibold text-navy-900 mb-3">Our Mission</h3>
                  <p className="text-navy-500 leading-relaxed">To provide a holistic, learner-centred education through rigorous academics, character development, and innovative pedagogy — empowering every student to discover their highest potential.</p>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-3xl overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80" alt="Students" fill className="object-cover" sizes="600px" />
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="section bg-white">
          <div className="container-premium">
            <div className="text-center mb-12">
              <span className="section-label justify-center mb-4">What We Stand For</span>
              <h2 className="heading-h2">Our Core Values</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {values.map((v) => {
                const Icon = v.icon
                return (
                  <div key={v.title} className="card-premium p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-navy-600" />
                    </div>
                    <h3 className="font-semibold text-navy-900 mb-2">{v.title}</h3>
                    <p className="text-navy-400 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* History Timeline */}
        <section className="section bg-navy-900">
          <div className="container-premium">
            <div className="text-center mb-12">
              <span className="section-label justify-center text-gold-400 before:bg-gold-400 mb-4">Our Journey</span>
              <h2 className="heading-h2 text-white">30 Years of Excellence</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {milestones.map((m) => (
                <div key={m.year} className="bg-navy-800 border border-navy-700 rounded-2xl p-5">
                  <p className="font-display text-2xl font-bold text-gold-400 mb-2">{m.year}</p>
                  <p className="text-ivory-300 text-sm leading-relaxed">{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section bg-ivory-100">
          <div className="container-premium text-center">
            <h2 className="heading-h2 mb-4">Be Part of Our Story</h2>
            <p className="text-navy-500 mb-8 max-w-lg mx-auto">Join a community that has been shaping futures for over three decades.</p>
            <div className="flex justify-center gap-4">
              <Link href="/admissions/apply" className="btn-primary">Apply for Admissions <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/contact" className="btn-outline">Contact Us</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
