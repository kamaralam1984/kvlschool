'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Calendar, UserCheck, CreditCard, GraduationCap } from 'lucide-react'

const steps = [
  { icon: FileText,      step: '01', title: 'Submit Application',    desc: 'Fill the online form with student and parent details. Upload required documents.',                     deadline: 'Rolling applications' },
  { icon: Calendar,      step: '02', title: 'Entrance Assessment',   desc: 'Attend the written test (Classes VI–XII) or personal interaction (Nursery–Class V).',               deadline: 'By appointment' },
  { icon: UserCheck,     step: '03', title: 'Interview',             desc: 'Parent and student meet with the Principal or Vice Principal for a brief interaction.',              deadline: 'Within 5 working days' },
  { icon: CreditCard,    step: '04', title: 'Fee & Enrollment',      desc: 'Upon selection, complete enrollment by submitting documents and paying the registration fee.',      deadline: 'Within 48 hours of offer' },
  { icon: GraduationCap, step: '05', title: 'Welcome to KVL!',       desc: 'Attend the orientation program, collect your ID card, books, and uniform.',                        deadline: 'Start of session' },
]

export function AdmissionTimeline() {
  return (
    <div className="relative">
      {/* Connector line */}
      <div className="absolute left-1/2 top-12 bottom-12 w-px bg-gradient-to-b from-gold-300 via-gold-400 to-gold-300 hidden lg:block" />

      <div className="space-y-8">
        {steps.map((step, i) => {
          const Icon = step.icon
          const isEven = i % 2 === 0
          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: isEven ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-8 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
            >
              {/* Card */}
              <div className="flex-1">
                <div className="card-premium p-6 lg:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-navy-600" />
                    </div>
                    <div>
                      <p className="text-gold-500 text-xs font-bold tracking-widest uppercase mb-1">Step {step.step}</p>
                      <h3 className="font-display text-lg font-semibold text-navy-900 mb-2">{step.title}</h3>
                      <p className="text-navy-500 text-sm leading-relaxed">{step.desc}</p>
                      <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory-100 text-navy-500 text-xs font-medium">
                        <Calendar className="w-3 h-3" />
                        {step.deadline}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center dot */}
              <div className="hidden lg:flex flex-shrink-0 items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-gold-500 border-4 border-ivory-100 shadow-glow-gold flex items-center justify-center z-10">
                  <span className="text-navy-900 text-xs font-bold">{step.step}</span>
                </div>
              </div>

              <div className="flex-1 hidden lg:block" />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
