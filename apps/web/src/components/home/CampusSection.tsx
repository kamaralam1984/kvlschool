'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FlaskConical, Library, Dumbbell, Laptop, Utensils, Building2, ChevronRight } from 'lucide-react'

const facilities = [
  {
    id: 'labs',
    icon: FlaskConical,
    title: 'Science Laboratories',
    desc: 'State-of-the-art Physics, Chemistry, and Biology labs equipped with the latest instruments. Students conduct real experiments from Class 6 onwards.',
    stats: [['12', 'Labs'], ['500+', 'Instruments'], ['Gr. 6–12', 'Access']],
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=85',
  },
  {
    id: 'library',
    icon: Library,
    title: 'Central Library',
    desc: 'A 10,000 sq.ft. knowledge hub with 50,000+ volumes, digital databases, reading lounges, and dedicated research zones for every age group.',
    stats: [['50K+', 'Books'], ['24/7', 'Digital Access'], ['5', 'Zones']],
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=85',
  },
  {
    id: 'sports',
    icon: Dumbbell,
    title: 'Sports Complex',
    desc: 'A dedicated 25-acre sports facility with international-standard cricket ground, football field, basketball courts, swimming pool, and indoor gymnasium.',
    stats: [['25 Acres', 'Complex'], ['12+', 'Sports'], ['Olympic Pool', 'Swimming']],
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=85',
  },
  {
    id: 'tech',
    icon: Laptop,
    title: 'Technology Center',
    desc: 'Four computer labs with 200+ high-performance workstations, dedicated AI & Robotics lab, 3D printing facility, and fiber-optic campus-wide connectivity.',
    stats: [['200+', 'Workstations'], ['1 Gbps', 'Internet'], ['AI Lab', 'Robotics']],
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d7?w=800&q=85',
  },
  {
    id: 'dining',
    icon: Utensils,
    title: 'Nutrition Center',
    desc: 'A FSSAI-certified 1,200-seat cafeteria serving hygienic, nutritionally balanced meals. Dedicated vegetarian section, allergy-aware menus, and daily fruit bars.',
    stats: [['1,200', 'Seats'], ['FSSAI', 'Certified'], ['4 Menus', 'Daily']],
    image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&q=85',
  },
  {
    id: 'hostel',
    icon: Building2,
    title: 'Residential Hostel',
    desc: 'Separate, fully supervised hostels for boys and girls with 24/7 security, CCTV monitoring, medical support, and home-like comfort for 400 boarders.',
    stats: [['400', 'Boarders'], ['24/7', 'Security'], ['Medical', 'On Campus']],
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=85',
  },
]

export function CampusSection() {
  const [active, setActive] = useState(facilities[0])

  return (
    <section className="section bg-ivory-200 relative overflow-hidden">
      <div className="container-premium">
        <div className="text-center mb-12">
          <span className="section-label justify-center mb-4">Campus Life</span>
          <h2 className="heading-h2">
            World-Class Facilities,{' '}
            <span className="gradient-text-gold">Designed to Inspire</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Tabs */}
          <div className="lg:col-span-2 space-y-2">
            {facilities.map((f) => {
              const Icon = f.icon
              const isActive = active.id === f.id
              return (
                <button
                  key={f.id}
                  onClick={() => setActive(f)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 ${
                    isActive
                      ? 'bg-navy-900 text-white shadow-premium'
                      : 'bg-white/60 text-navy-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? 'bg-gold-500/20' : 'bg-navy-50'}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-gold-400' : 'text-navy-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{f.title}</p>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-gold-400 flex-shrink-0" />}
                </button>
              )
            })}
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="h-full flex flex-col"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-video mb-6 shadow-premium">
                  <Image
                    src={active.image}
                    alt={active.title}
                    fill
                    quality={85}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex gap-6">
                    {active.stats.map(([val, label]) => (
                      <div key={label} className="text-center">
                        <p className="font-display text-2xl font-bold text-white">{val}</p>
                        <p className="text-ivory-300 text-xs">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md flex-1">
                  <h3 className="heading-h3 mb-3">{active.title}</h3>
                  <p className="text-navy-500 leading-relaxed">{active.desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
