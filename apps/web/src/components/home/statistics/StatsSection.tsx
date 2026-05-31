'use client'

import React from 'react'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { motion } from 'framer-motion'
import { Trophy, Users, GraduationCap, Star, BookOpen, Globe, Award, Zap } from 'lucide-react'

const stats = [
  { icon: GraduationCap, value: 30,  suffix: '+', label: 'Years of Excellence',     description: 'Established 1994, serving generations' },
  { icon: Users,         value: 4200, suffix: '+', label: 'Students Enrolled',       description: 'From nursery to Class XII' },
  { icon: Trophy,        value: 98,   suffix: '%', label: 'Board Exam Results',       description: 'Consistent academic excellence' },
  { icon: Star,          value: 200,  suffix: '+', label: 'National Awards',          description: 'In academics, sports & arts' },
  { icon: Globe,         value: 1500, suffix: '+', label: 'Alumni Worldwide',         description: 'Leaders across every field' },
  { icon: BookOpen,      value: 85,   suffix: '+', label: 'Expert Faculty',           description: 'PhD & post-graduate educators' },
  { icon: Award,         value: 15,   suffix: '+', label: 'Courses & Programs',       description: 'Diverse academic streams' },
  { icon: Zap,           value: 100,  suffix: '%', label: 'Digital Infrastructure',   description: 'Smart classrooms & labs' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden:   { opacity: 0, y: 40, scale: 0.96 },
  visible:  { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export function StatsSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section className="section bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230a1628' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="container-premium">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label justify-center mb-4">Our Numbers</span>
            <h2 className="heading-h2 text-balance">
              Three Decades of{' '}
              <span className="gradient-text-gold">Measurable Excellence</span>
            </h2>
            <p className="mt-4 text-navy-500 max-w-xl mx-auto text-pretty leading-relaxed">
              Every number here represents a real story — a student who discovered their passion, a
              parent whose trust we earned, a teacher who made a lasting difference.
            </p>
          </motion.div>
        </div>

        {/* Stats grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="group relative"
            >
              <div className="card-premium p-6 lg:p-8 h-full flex flex-col gap-3 text-center items-center">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-navy-50 flex items-center justify-center group-hover:bg-gold-50 transition-colors duration-300 mb-1">
                  <stat.icon className="w-6 h-6 text-navy-600 group-hover:text-gold-500 transition-colors duration-300" />
                </div>

                {/* Number */}
                <div className="stat-number">
                  {inView ? (
                    <CountUp
                      end={stat.value}
                      duration={2.5}
                      suffix={stat.suffix}
                      delay={i * 0.08}
                      useEasing
                      enableScrollSpy={false}
                    />
                  ) : (
                    <span>0{stat.suffix}</span>
                  )}
                </div>

                {/* Label */}
                <p className="font-semibold text-navy-800 text-sm leading-tight">{stat.label}</p>
                <p className="text-navy-400 text-xs leading-relaxed">{stat.description}</p>

                {/* Gold underline on hover */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold-400 group-hover:w-full transition-all duration-500 rounded-full" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
        >
          <div>
            <p className="text-ivory-100 font-semibold text-lg font-display">
              Ranked among India&apos;s Top 10 Schools for 5 Consecutive Years
            </p>
            <p className="text-ivory-300 text-sm mt-1">
              Education World | Times School Survey | India Today Rankings
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {['2020', '2021', '2022', '2023', '2024'].map((year) => (
              <div key={year} className="text-center">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center mb-1">
                  <Trophy className="w-4 h-4 text-gold-400" />
                </div>
                <span className="text-ivory-400 text-xs">{year}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
