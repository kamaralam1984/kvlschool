'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin,
  ArrowRight, BookOpen, Users, Award
} from 'lucide-react'

const footerLinks = {
  'Quick Links': [
    { label: 'About Us', href: '/about' },
    { label: 'Academic Programs', href: '/academics' },
    { label: 'Admissions 2025–26', href: '/admissions' },
    { label: 'Fee Structure', href: '/admissions/fees' },
    { label: 'Scholarships', href: '/admissions/scholarships' },
    { label: 'Faculty Directory', href: '/about/faculty' },
  ],
  'Facilities': [
    { label: 'Science Laboratories', href: '/facilities/labs' },
    { label: 'Central Library', href: '/facilities/library' },
    { label: 'Sports Complex', href: '/facilities/sports' },
    { label: 'Hostel', href: '/facilities/hostel' },
    { label: 'Transport', href: '/facilities/transport' },
    { label: 'Medical Center', href: '/facilities/medical' },
  ],
  'Student Zone': [
    { label: 'Student Portal', href: '/login?role=student' },
    { label: 'Parent Portal', href: '/login?role=parent' },
    { label: 'Online Exams', href: '/exams' },
    { label: 'Book Store', href: '/store' },
    { label: 'LMS Platform', href: '/lms' },
    { label: 'Live Classes', href: '/live' },
  ],
  'Information': [
    { label: 'News & Events', href: '/news' },
    { label: 'Photo Gallery', href: '/gallery' },
    { label: 'Academic Calendar', href: '/academics/calendar' },
    { label: 'Alumni Network', href: '/alumni' },
    { label: 'Career with Us', href: '/careers' },
    { label: 'Contact Us', href: '/contact' },
  ],
}

const socialLinks = [
  { icon: Facebook,  href: 'https://facebook.com', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Youtube,   href: 'https://youtube.com', label: 'YouTube' },
  { icon: Twitter,   href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin,  href: 'https://linkedin.com', label: 'LinkedIn' },
]

const accreditations = ['CBSE Affiliated', 'ISO 9001:2015', 'NAAC A+', 'Green School Award']

export function Footer() {
  return (
    <footer className="bg-navy-950 text-ivory-200 relative overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />

      {/* Newsletter bar */}
      <div className="bg-navy-900 border-b border-navy-800">
        <div className="container-premium py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-semibold text-white">
                Stay Connected with KVL
              </h3>
              <p className="text-ivory-400 text-sm mt-1">
                Get admissions updates, event news, and academic insights delivered to your inbox.
              </p>
            </div>
            <form className="flex gap-3 w-full lg:w-auto lg:min-w-[420px]" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-5 py-3.5 bg-navy-800 border border-navy-700 rounded-xl text-ivory-100 placeholder-navy-500 focus:outline-none focus:border-gold-500 transition-colors text-sm"
              />
              <button
                type="submit"
                className="flex-shrink-0 px-6 py-3.5 bg-gold-500 text-navy-900 font-semibold text-sm rounded-xl hover:bg-gold-400 transition-colors flex items-center gap-2"
              >
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-premium py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-10">
          {/* School info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-base">KVL International</p>
                <p className="text-ivory-400 text-xs font-medium tracking-widest uppercase">School of Excellence</p>
              </div>
            </Link>

            <p className="text-ivory-400 text-sm leading-relaxed mb-6">
              Shaping minds, building character, and inspiring excellence since 1994.
              CBSE affiliated premier institution nurturing tomorrow&apos;s global leaders.
            </p>

            {/* Contact */}
            <div className="space-y-3">
              {[
                { icon: MapPin, text: '123 Education Avenue, New Delhi — 110001' },
                { icon: Phone, text: '+91 98765 43210 / +91 11 4567 8900' },
                { icon: Mail,  text: 'info@kvlschool.edu.in' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                  <span className="text-ivory-400 text-sm">{text}</span>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 mt-8">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-navy-800 text-ivory-400 hover:bg-gold-500 hover:text-navy-900 flex items-center justify-center transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1">
              <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest">{category}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-ivory-400 text-sm hover:text-gold-400 transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-0 h-px bg-gold-400 group-hover:w-3 transition-all duration-200" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Accreditations */}
        <div className="mt-16 pt-10 border-t border-navy-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {accreditations.map((badge) => (
                <span
                  key={badge}
                  className="px-4 py-1.5 rounded-full border border-navy-700 text-ivory-400 text-xs font-medium"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-ivory-500 text-xs">
              <span>&copy; 2024 KVL International School. All Rights Reserved.</span>
              <Link href="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gold-400 transition-colors">Terms of Use</Link>
              <Link href="/sitemap.xml" className="hover:text-gold-400 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
