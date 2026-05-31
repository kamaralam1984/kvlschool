import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = { title: 'Contact Us', description: 'Get in touch with KVL International School.' }

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-navy-900 py-20">
          <div className="container-premium text-center">
            <span className="section-label justify-center text-gold-400 before:bg-gold-400 mb-4">Get In Touch</span>
            <h1 className="font-display text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-ivory-300 max-w-xl mx-auto">We&apos;re here to answer your questions. Reach out to us anytime.</p>
          </div>
        </section>

        <section className="section bg-ivory-100">
          <div className="container-premium">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <div className="space-y-6">
                <h2 className="heading-h3">School Information</h2>
                {[
                  { icon: MapPin, label: 'Address', value: '123 Education Avenue, Sector 15, New Delhi — 110001' },
                  { icon: Phone,  label: 'Phone',   value: '+91 98765 43210 | +91 11 4567 8900' },
                  { icon: Mail,   label: 'Email',   value: 'info@kvlschool.edu.in | admissions@kvlschool.edu.in' },
                  { icon: Clock,  label: 'Hours',   value: 'Mon–Sat: 8:00 AM – 4:00 PM | Office: 9:00 AM – 5:00 PM' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="card-premium p-5 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-navy-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy-800 text-sm">{label}</p>
                      <p className="text-navy-500 text-sm mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
                {/* Department Contacts */}
                <div className="card-premium p-6">
                  <h3 className="font-semibold text-navy-900 mb-4">Department Contacts</h3>
                  <div className="space-y-3">
                    {[
                      ['Admissions Office', 'admissions@kvlschool.edu.in', '+91 98765 43210'],
                      ['Principal Office', 'principal@kvlschool.edu.in', '+91 11 4567 8901'],
                      ['Finance / Fees', 'accounts@kvlschool.edu.in', '+91 11 4567 8902'],
                      ['Transport', 'transport@kvlschool.edu.in', '+91 11 4567 8903'],
                    ].map(([dept, email, phone]) => (
                      <div key={dept} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-ivory-200 last:border-0">
                        <p className="font-medium text-navy-700 text-sm">{dept}</p>
                        <div className="text-xs text-navy-400 mt-0.5 sm:mt-0 sm:text-right">
                          <p>{email}</p><p>{phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="card-premium p-8">
                <h2 className="heading-h3 mb-6">Send us a Message</h2>
                <form className="space-y-4" action="/api/v1/admissions/enquiries" method="POST">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-navy-700">Your Name *</label>
                      <input placeholder="Full name" className="input-premium" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-navy-700">Phone *</label>
                      <input placeholder="10-digit mobile" className="input-premium" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-navy-700">Email Address *</label>
                    <input type="email" placeholder="your@email.com" className="input-premium" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-navy-700">Subject</label>
                    <select className="input-premium">
                      <option value="">Select subject</option>
                      <option>Admission Enquiry</option>
                      <option>Fee Related</option>
                      <option>Academic Query</option>
                      <option>Transport / Hostel</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-navy-700">Message *</label>
                    <textarea rows={5} placeholder="Write your message here..." className="input-premium resize-none" required />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center">Send Message</button>
                </form>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-12 h-72 bg-navy-100 rounded-2xl flex items-center justify-center border border-ivory-200">
              <div className="text-center">
                <MapPin className="w-10 h-10 text-navy-400 mx-auto mb-2" />
                <p className="text-navy-500 font-medium">123 Education Avenue, New Delhi — 110001</p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-gold-500 text-sm hover:underline mt-1 block">Open in Google Maps →</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
