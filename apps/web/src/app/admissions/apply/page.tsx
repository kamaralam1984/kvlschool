import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AdmissionForm } from '@/components/admissions/AdmissionForm'
import { AdmissionTimeline } from '@/components/admissions/AdmissionTimeline'

export const metadata: Metadata = {
  title: 'Apply for Admissions 2025–26',
  description: 'Apply online for admission to KVL International School for the academic year 2025–26. CBSE affiliated school accepting applications for Nursery to Class XII.',
}

export default function AdmissionsApplyPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-navy-900 py-20">
          <div className="container-premium text-center">
            <span className="section-label justify-center text-gold-400 before:bg-gold-400 mb-6">
              Admissions 2025–26
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Begin Your Journey at KVL
            </h1>
            <p className="text-ivory-300 max-w-xl mx-auto leading-relaxed">
              We invite you to apply to KVL International School. Our admissions process is
              designed to be transparent, merit-based, and welcoming.
            </p>
            <div className="flex items-center justify-center gap-8 mt-10">
              {[
                { label: 'Nursery — Class V', note: 'Age-based selection' },
                { label: 'Class VI — X',      note: 'Entrance test + interview' },
                { label: 'Class XI — XII',    note: 'Based on Class X marks' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-gold-400 font-semibold text-sm">{item.label}</p>
                  <p className="text-ivory-400 text-xs mt-1">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section bg-ivory-100">
          <div className="container-premium">
            <div className="text-center mb-12">
              <span className="section-label justify-center mb-4">Process</span>
              <h2 className="heading-h2">Admission Process</h2>
            </div>
            <AdmissionTimeline />
          </div>
        </section>

        {/* Form */}
        <section className="section bg-white">
          <div className="container-premium max-w-3xl">
            <div className="text-center mb-12">
              <span className="section-label justify-center mb-4">Online Application</span>
              <h2 className="heading-h2">Fill the Application Form</h2>
              <p className="text-navy-500 mt-4">
                Please fill all required fields accurately. You will receive a confirmation
                email with your application number.
              </p>
            </div>
            <AdmissionForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
