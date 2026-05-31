'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, CheckCircle, Upload, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const schema = z.object({
  // Student info
  studentName:    z.string().min(2, 'Full name required'),
  dateOfBirth:    z.string().min(1, 'Date of birth required'),
  gender:         z.enum(['male', 'female', 'other']),
  applyingForClass: z.string().min(1, 'Select a class'),
  previousSchool: z.string().optional(),
  previousBoard:  z.string().optional(),
  previousMarks:  z.string().optional(),

  // Father info
  fatherName:     z.string().min(2, 'Father\'s name required'),
  fatherPhone:    z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit mobile required'),
  fatherEmail:    z.string().email().optional().or(z.literal('')),
  fatherOccupation: z.string().min(1, 'Occupation required'),

  // Mother info
  motherName:     z.string().min(2, 'Mother\'s name required'),
  motherPhone:    z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit mobile required'),

  // Address
  addressLine1:   z.string().min(5, 'Address required'),
  city:           z.string().min(2, 'City required'),
  state:          z.string().min(2, 'State required'),
  pincode:        z.string().regex(/^\d{6}$/, 'Valid 6-digit pincode required'),

  // How did you hear
  heardAbout:     z.string().optional(),
  declaration:    z.boolean().refine((v) => v === true, 'Please accept the declaration'),
})

type FormData = z.infer<typeof schema>

const steps = [
  { id: 1, title: 'Student Details', fields: ['studentName', 'dateOfBirth', 'gender', 'applyingForClass'] },
  { id: 2, title: 'Parent Details', fields: ['fatherName', 'fatherPhone', 'motherName', 'motherPhone'] },
  { id: 3, title: 'Address & Documents', fields: ['addressLine1', 'city', 'state', 'pincode'] },
  { id: 4, title: 'Declaration', fields: ['declaration'] },
]

const classes = ['Nursery', 'LKG', 'UKG', 'Class I', 'Class II', 'Class III', 'Class IV', 'Class V',
  'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI', 'Class XII']

export function AdmissionForm() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [applicationNo, setApplicationNo] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting }, trigger, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  })

  async function nextStep() {
    const currentStepFields = steps[step - 1].fields as (keyof FormData)[]
    const valid = await trigger(currentStepFields)
    if (valid) setStep((s) => Math.min(s + 1, steps.length))
  }

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch('/api/v1/admissions/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)
      setApplicationNo(json.data?.applicationNo ?? `KVL-2025-${Date.now().toString().slice(-6)}`)
      setSubmitted(true)
    } catch (err) {
      toast.error('Submission failed. Please try again.')
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-8 bg-white border border-ivory-200 rounded-3xl"
      >
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="font-display text-3xl font-bold text-navy-900 mb-3">Application Submitted!</h3>
        <p className="text-navy-500 mb-6 max-w-md mx-auto">
          Thank you for applying to KVL International School. We have received your application
          and will be in touch within 3–5 working days.
        </p>
        <div className="inline-block bg-navy-50 rounded-2xl px-8 py-5">
          <p className="text-navy-400 text-xs uppercase tracking-widest mb-1">Application Number</p>
          <p className="font-display text-3xl font-bold text-navy-900">{applicationNo}</p>
          <p className="text-navy-400 text-xs mt-1">Save this for future reference</p>
        </div>
        <p className="text-navy-400 text-sm mt-6">
          A confirmation email has been sent to the email address provided.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="bg-white border border-ivory-200 rounded-3xl overflow-hidden shadow-sm">
      {/* Progress steps */}
      <div className="flex border-b border-ivory-200">
        {steps.map((s) => (
          <div
            key={s.id}
            className={cn(
              'flex-1 py-4 px-3 text-center text-xs font-semibold transition-colors duration-200',
              step === s.id && 'bg-navy-900 text-white',
              step > s.id  && 'bg-navy-50 text-navy-600',
              step < s.id  && 'text-navy-300'
            )}
          >
            <span className={cn(
              'w-5 h-5 rounded-full inline-flex items-center justify-center text-xs mr-2',
              step === s.id && 'bg-gold-400 text-navy-900',
              step > s.id  && 'bg-green-500 text-white',
              step < s.id  && 'bg-navy-100 text-navy-400'
            )}>
              {step > s.id ? '✓' : s.id}
            </span>
            <span className="hidden sm:inline">{s.title}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && (
              <div className="space-y-5">
                <h3 className="font-display text-xl font-semibold text-navy-900 mb-6">Student Information</h3>
                <FormField label="Student's Full Name *" error={errors.studentName?.message}>
                  <input {...register('studentName')} placeholder="As per birth certificate" className="input-premium" />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Date of Birth *" error={errors.dateOfBirth?.message}>
                    <input type="date" {...register('dateOfBirth')} className="input-premium" />
                  </FormField>
                  <FormField label="Gender *" error={errors.gender?.message}>
                    <select {...register('gender')} className="input-premium">
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </FormField>
                </div>
                <FormField label="Applying for Class *" error={errors.applyingForClass?.message}>
                  <select {...register('applyingForClass')} className="input-premium">
                    <option value="">Select class</option>
                    {classes.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Previous School (if any)" error={errors.previousSchool?.message}>
                  <input {...register('previousSchool')} placeholder="Name of last school attended" className="input-premium" />
                </FormField>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h3 className="font-display text-xl font-semibold text-navy-900 mb-6">Parent & Guardian Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Father's Full Name *" error={errors.fatherName?.message}>
                    <input {...register('fatherName')} placeholder="Father's name" className="input-premium" />
                  </FormField>
                  <FormField label="Father's Mobile *" error={errors.fatherPhone?.message}>
                    <input {...register('fatherPhone')} placeholder="10-digit mobile" className="input-premium" />
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Father's Email" error={errors.fatherEmail?.message}>
                    <input {...register('fatherEmail')} type="email" placeholder="father@email.com" className="input-premium" />
                  </FormField>
                  <FormField label="Father's Occupation *" error={errors.fatherOccupation?.message}>
                    <input {...register('fatherOccupation')} placeholder="Occupation" className="input-premium" />
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Mother's Full Name *" error={errors.motherName?.message}>
                    <input {...register('motherName')} placeholder="Mother's name" className="input-premium" />
                  </FormField>
                  <FormField label="Mother's Mobile *" error={errors.motherPhone?.message}>
                    <input {...register('motherPhone')} placeholder="10-digit mobile" className="input-premium" />
                  </FormField>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h3 className="font-display text-xl font-semibold text-navy-900 mb-6">Address & Documents</h3>
                <FormField label="Address Line 1 *" error={errors.addressLine1?.message}>
                  <input {...register('addressLine1')} placeholder="House No., Street, Area" className="input-premium" />
                </FormField>
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="City *" error={errors.city?.message}>
                    <input {...register('city')} placeholder="City" className="input-premium" />
                  </FormField>
                  <FormField label="State *" error={errors.state?.message}>
                    <input {...register('state')} placeholder="State" className="input-premium" />
                  </FormField>
                  <FormField label="Pincode *" error={errors.pincode?.message}>
                    <input {...register('pincode')} placeholder="110001" className="input-premium" />
                  </FormField>
                </div>
                {/* Document upload notice */}
                <div className="bg-gold-50 border border-gold-200 rounded-xl p-4">
                  <p className="text-navy-700 text-sm font-semibold mb-2">Documents Required (at interview)</p>
                  <ul className="text-navy-500 text-xs space-y-1">
                    {['Birth Certificate (original + photocopy)', 'Last class report card / marksheet', 'Aadhar card of student & parents', '4 recent passport size photographs', 'Transfer Certificate (if applicable)'].map((doc) => (
                      <li key={doc} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
                <FormField label="How did you hear about us?" error={undefined}>
                  <select {...register('heardAbout')} className="input-premium">
                    <option value="">Select source</option>
                    <option value="friend">Friend / Family Referral</option>
                    <option value="google">Google Search</option>
                    <option value="social">Social Media</option>
                    <option value="newspaper">Newspaper / Magazine</option>
                    <option value="outdoor">Outdoor Advertisement</option>
                    <option value="other">Other</option>
                  </select>
                </FormField>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h3 className="font-display text-xl font-semibold text-navy-900 mb-6">Declaration</h3>
                <div className="bg-ivory-100 rounded-xl p-6 text-sm text-navy-600 leading-relaxed space-y-3">
                  <p>I/We hereby declare that:</p>
                  <ol className="list-decimal ml-4 space-y-2">
                    <li>All information provided in this application is true and correct to the best of my/our knowledge.</li>
                    <li>I/We understand that any false information may result in cancellation of admission.</li>
                    <li>I/We agree to abide by the rules and regulations of KVL International School.</li>
                    <li>I/We understand that admission is subject to availability and the school's admission criteria.</li>
                    <li>I/We consent to the school using the information provided for admission-related communication.</li>
                  </ol>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('declaration')}
                    className="mt-1 w-4 h-4 rounded border-navy-300 text-navy-700 focus:ring-gold-400"
                  />
                  <span className="text-sm text-navy-700">
                    I/We agree to the above declaration and confirm that all information provided is accurate.{' '}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.declaration && (
                  <p className="text-red-500 text-xs">{errors.declaration.message}</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-ivory-200">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(s - 1, 1))}
            className={cn('btn-outline text-sm px-6 py-3', step === 1 && 'invisible')}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>

          {step < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-primary text-sm px-8 py-3"
            >
              Next Step
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold text-sm px-8 py-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting...</>
              ) : (
                <>Submit Application <CheckCircle className="w-4 h-4 ml-2" /></>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-navy-700">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}
