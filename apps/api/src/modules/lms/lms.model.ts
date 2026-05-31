import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICourse extends Document {
  title:       string; description: string; subject: string
  class:       string; section?: string; teacherId: mongoose.Types.ObjectId
  thumbnail?:  string; status: 'draft' | 'published' | 'archived'
  lessons:     Array<{ title: string; type: 'video' | 'pdf' | 'quiz' | 'assignment' | 'link'; url?: string; duration?: number; order: number; isPreview: boolean }>
  enrolledStudents: mongoose.Types.ObjectId[]
  totalDuration: number; totalLessons: number
  rating:      number; ratingCount: number
  academicYear: string; isActive: boolean; createdAt: Date; updatedAt: Date
}

const courseSchema = new Schema<ICourse>({
  title:       { type: String, required: true }, description: String, subject: String,
  class:       { type: String, required: true }, section: String,
  teacherId:   { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  thumbnail:   String,
  status:      { type: String, enum: ['draft','published','archived'], default: 'draft' },
  lessons:     [{ title: String, type: { type: String, enum: ['video','pdf','quiz','assignment','link'] }, url: String, duration: Number, order: Number, isPreview: { type: Boolean, default: false } }],
  enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  totalDuration: { type: Number, default: 0 }, totalLessons: { type: Number, default: 0 },
  rating: { type: Number, default: 0 }, ratingCount: { type: Number, default: 0 },
  academicYear: String, isActive: { type: Boolean, default: true },
}, { timestamps: true })

courseSchema.index({ class: 1, subject: 1, status: 1 })
courseSchema.index({ teacherId: 1 })

export const Course: Model<ICourse> = mongoose.models.Course ?? mongoose.model<ICourse>('Course', courseSchema)

export interface ILiveClass extends Document {
  title:      string; courseId?: mongoose.Types.ObjectId; teacherId: mongoose.Types.ObjectId
  class:      string; section?: string; subject: string
  scheduledAt: Date; duration: number
  meetingUrl?: string; meetingId?: string; meetingPassword?: string
  platform:   'zoom' | 'google-meet' | 'jitsi' | 'custom'
  status:     'scheduled' | 'live' | 'ended' | 'cancelled'
  recordingUrl?: string; attendees: Array<{ studentId: mongoose.Types.ObjectId; joinedAt: Date; leftAt?: Date }>
  notes?:     string; createdAt: Date; updatedAt: Date
}

const liveClassSchema = new Schema<ILiveClass>({
  title:      { type: String, required: true }, courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  teacherId:  { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  class:      { type: String, required: true }, section: String, subject: String,
  scheduledAt:{ type: Date, required: true }, duration: { type: Number, default: 45 },
  meetingUrl: String, meetingId: String, meetingPassword: String,
  platform:   { type: String, enum: ['zoom','google-meet','jitsi','custom'], default: 'jitsi' },
  status:     { type: String, enum: ['scheduled','live','ended','cancelled'], default: 'scheduled' },
  recordingUrl: String, attendees: [{ studentId: { type: Schema.Types.ObjectId, ref: 'Student' }, joinedAt: Date, leftAt: Date }],
  notes: String,
}, { timestamps: true })

liveClassSchema.index({ scheduledAt: 1, status: 1 })
liveClassSchema.index({ class: 1, teacherId: 1 })

export const LiveClass: Model<ILiveClass> = mongoose.models.LiveClass ?? mongoose.model<ILiveClass>('LiveClass', liveClassSchema)
