import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GallerySection } from '@/components/home/gallery/GallerySection'
import Image from 'next/image'

export const metadata: Metadata = { title: 'Gallery', description: 'Photos and videos from KVL International School — campus, events, academics, and sports.' }

const categories = ['All', 'Campus', 'Academic', 'Sports', 'Events', 'Cultural', 'Science']

const allImages = [
  { src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80', cat: 'Campus', title: 'School Main Building' },
  { src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80', cat: 'Academic', title: 'Smart Classrooms' },
  { src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80', cat: 'Sports', title: 'Sports Day 2024' },
  { src: 'https://images.unsplash.com/photo-1532094349884-543290680dce?w=600&q=80', cat: 'Science', title: 'Science Laboratory' },
  { src: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80', cat: 'Campus', title: 'Central Library' },
  { src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80', cat: 'Events', title: 'Annual Day 2024' },
  { src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80', cat: 'Academic', title: 'Graduation Ceremony' },
  { src: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80', cat: 'Sports', title: 'Basketball Court' },
  { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80', cat: 'Campus', title: 'School Grounds' },
  { src: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80', cat: 'Science', title: 'Robotics Lab' },
  { src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80', cat: 'Campus', title: 'Medical Center' },
  { src: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80', cat: 'Campus', title: 'School Transport' },
]

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-navy-900 py-20">
          <div className="container-premium text-center">
            <span className="section-label justify-center text-gold-400 before:bg-gold-400 mb-4">Visual Stories</span>
            <h1 className="font-display text-5xl font-bold text-white mb-4">Photo Gallery</h1>
            <p className="text-ivory-300 max-w-xl mx-auto">Moments that define the KVL experience — in classrooms, on the field, and beyond.</p>
          </div>
        </section>

        <section className="section bg-ivory-100">
          <div className="container-premium">
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {categories.map((cat, i) => (
                <button key={cat} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${i === 0 ? 'bg-navy-900 text-white' : 'bg-white border border-ivory-200 text-navy-600 hover:bg-navy-900 hover:text-white hover:border-navy-900'}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allImages.map((img, i) => (
                <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer">
                  <Image src={img.src} alt={img.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="350px" />
                  <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/50 transition-colors duration-300 flex flex-col justify-end p-4">
                    <p className="text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">{img.title}</p>
                    <span className="badge-gold text-[10px] opacity-0 group-hover:opacity-100 transition-opacity mt-1 self-start">{img.cat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
