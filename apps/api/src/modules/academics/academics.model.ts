import mongoose, { Schema, Document, Model } from 'mongoose'

// ─── Subject ───────────────────────────────────────────────
export interface ISubject extends Document {
  name: string; code: string; type: 'core' | 'elective' | 'optional'
  classes: string[]; periodsPerWeek: number; hasLab: boolean
  maxMarks: number; passingMarks: number; isActive: boolean
}
const subjectSchema = new Schema<ISubject>({
  name: { type: String, required: true }, code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['core','elective','optional'], default: 'core' },
  classes: [String], periodsPerWeek: { type: Number, default: 5 },
  hasLab: { type: Boolean, default: false }, maxMarks: { type: Number, default: 100 },
  passingMarks: { type: Number, default: 33 }, isActive: { type: Boolean, default: true },
}, { timestamps: true })
export const Subject: Model<ISubject> = mongoose.models.Subject ?? mongoose.model<ISubject>('Subject', subjectSchema)

// ─── Class Section ──────────────────────────────────────────
export interface IClassSection extends Document {
  name: string; section: string; session: string
  classTeacherId?: mongoose.Types.ObjectId
  students: mongoose.Types.ObjectId[]; capacity: number; room?: string
  subjects: Array<{ subjectId: mongoose.Types.ObjectId; teacherId: mongoose.Types.ObjectId }>
  isActive: boolean
}
const classSectionSchema = new Schema<IClassSection>({
  name: { type: String, required: true }, section: { type: String, required: true },
  session: { type: String, required: true }, classTeacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
  students: [{ type: Schema.Types.ObjectId, ref: 'Student' }], capacity: { type: Number, default: 40 },
  room: String, subjects: [{ subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' }, teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' } }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true })
classSectionSchema.index({ name: 1, section: 1, session: 1 }, { unique: true })
export const ClassSection: Model<IClassSection> = mongoose.models.ClassSection ?? mongoose.model<IClassSection>('ClassSection', classSectionSchema)

// ─── Timetable ──────────────────────────────────────────────
export interface ITimetable extends Document {
  class: string; section: string; session: string; effectiveFrom: Date
  schedule: Array<{ day: string; periods: Array<{ periodNo: number; subjectId: mongoose.Types.ObjectId; teacherId: mongoose.Types.ObjectId; room?: string; startTime: string; endTime: string }> }>
  isActive: boolean
}
const timetableSchema = new Schema<ITimetable>({
  class: { type: String, required: true }, section: { type: String, required: true },
  session: { type: String, required: true }, effectiveFrom: { type: Date, required: true },
  schedule: [{ day: String, periods: [{ periodNo: Number, subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' }, teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' }, room: String, startTime: String, endTime: String }] }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true })
timetableSchema.index({ class: 1, section: 1, session: 1 })
export const Timetable: Model<ITimetable> = mongoose.models.Timetable ?? mongoose.model<ITimetable>('Timetable', timetableSchema)

// ─── Homework ────────────────────────────────────────────────
export interface IHomework extends Document {
  class: string; section: string; subject: string; teacherId: mongoose.Types.ObjectId
  title: string; description: string; dueDate: Date; maxMarks?: number
  attachments: string[]; submissions: Array<{ studentId: mongoose.Types.ObjectId; submittedAt: Date; fileUrl?: string; marks?: number; feedback?: string }>
  isActive: boolean; createdAt: Date
}
const homeworkSchema = new Schema<IHomework>({
  class: { type: String, required: true }, section: { type: String, required: true },
  subject: { type: String, required: true }, teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  title: { type: String, required: true }, description: { type: String, required: true },
  dueDate: { type: Date, required: true }, maxMarks: Number, attachments: [String],
  submissions: [{ studentId: { type: Schema.Types.ObjectId, ref: 'Student' }, submittedAt: Date, fileUrl: String, marks: Number, feedback: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true })
homeworkSchema.index({ class: 1, section: 1, dueDate: 1 })
export const Homework: Model<IHomework> = mongoose.models.Homework ?? mongoose.model<IHomework>('Homework', homeworkSchema)
