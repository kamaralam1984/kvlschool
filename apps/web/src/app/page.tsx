import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/shared/CustomCursor'
import { SmoothScroll } from '@/components/shared/SmoothScroll'
import { HeroSection } from '@/components/home/hero/HeroSection'
import { StatsSection } from '@/components/home/statistics/StatsSection'
import { AboutSnippet } from '@/components/home/AboutSnippet'
import { PrincipalMessage } from '@/components/home/PrincipalMessage'
import { AcademicsSection } from '@/components/home/AcademicsSection'
import { FacultySection } from '@/components/home/faculty/FacultySection'
import { CampusSection } from '@/components/home/CampusSection'
import { TestimonialsSection } from '@/components/home/testimonials/TestimonialsSection'
import { EventsSection } from '@/components/home/events/EventsSection'
import { NewsSection } from '@/components/home/news/NewsSection'
import { GallerySection } from '@/components/home/gallery/GallerySection'
import { AwardsSection } from '@/components/home/AwardsSection'
import { AlumniSection } from '@/components/home/AlumniSection'
import { LiveBanner } from '@/components/home/LiveBanner'
import { AdmissionsCTA } from '@/components/home/cta/AdmissionsCTA'
import { BookStoreHighlights } from '@/components/home/BookStoreHighlights'
export default function HomePage() {
  return (
    <>
      <CustomCursor />
      <SmoothScroll>
        <Header />
        <main>
          <HeroSection />
          <StatsSection />
          <AboutSnippet />
          <PrincipalMessage />
          <AcademicsSection />
          <FacultySection />
          <CampusSection />
          <LiveBanner />
          <TestimonialsSection />
          <EventsSection />
          <GallerySection />
          <AwardsSection />
          <AlumniSection />
          <Suspense fallback={null}>
            <NewsSection />
          </Suspense>
          <BookStoreHighlights />
          <AdmissionsCTA />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  )
}
