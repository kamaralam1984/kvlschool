import mongoose, { Schema, Document, Model } from 'mongoose'

// ─── Question Bank ─────────────────────────────────────────
export interface IQuestion extends Document {
  subject:     string
  class:       string
  topic:       string
  type:        'mcq' | 'subjective' | 'true_false' | 'fill_blank' | 'match'
  difficulty:  'easy' | 'medium' | 'hard'
  question:    string
  options?:    string[]
  answer:      string | string[]
  explanation?: string
  marks:       number
  tags:        string[]
  isActive:    boolean
  createdBy:   mongoose.Types.ObjectId
  createdAt:   Date
}

const questionSchema = new Schema<IQuestion>({
  subject:    { type: String, required: true },
  class:      { type: String, required: true },
  topic:      { type: String, required: true },
  type:       { type: String, enum: ['mcq', 'subjective', 'true_false', 'fill_blank', 'match'], required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  question:   { type: String, required: true },
  options:    [String],
  answer:     Schema.Types.Mixed,
  explanation:{ type: String },
  marks:      { type: Number, required: true, default: 1 },
  tags:       [String],
  isActive:   { type: Boolean, default: true },
  createdBy:  { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

// ─── Exam ──────────────────────────────────────────────────
export interface IExam extends Document {
  title:         string
  code:          string
  type:          'unit_test' | 'mid_term' | 'final' | 'mock' | 'olympiad' | 'scholarship' | 'competitive'
  mode:          'online' | 'offline' | 'hybrid'
  class:         string
  section:       string | 'all'
  subject:       string
  session:       string
  questions:     mongoose.Types.ObjectId[]
  totalMarks:    number
  passingMarks:  number
  duration:      number
  scheduledAt:   Date
  endAt:         Date
  instructions:  string[]
  settings: {
    shuffleQuestions:   boolean
    shuffleOptions:     boolean
    showResult:         'immediate' | 'after_review' | 'manual'
    allowBackNavigation:boolean
    proctoring:         boolean
    fullscreen:         boolean
    preventCopy:        boolean
    negativeMarking:    boolean
    negativeMarkValue:  number
    maxAttempts:        number
    questionsPerPage:   number
  }
  isPublished:   boolean
  isActive:      boolean
  createdBy:     mongoose.Types.ObjectId
  createdAt:     Date
}

const examSchema = new Schema<IExam>({
  title:        { type: String, required: true },
  code:         { type: String, unique: true },
  type:         { type: String, enum: ['unit_test','mid_term','final','mock','olympiad','scholarship','competitive'], required: true },
  mode:         { type: String, enum: ['online','offline','hybrid'], required: true },
  class:        { type: String, required: true },
  section:      { type: String, default: 'all' },
  subject:      { type: String, required: true },
  session:      { type: String, required: true },
  questions:    [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  totalMarks:   { type: Number, required: true },
  passingMarks: { type: Number, required: true },
  duration:     { type: Number, required: true },
  scheduledAt:  { type: Date, required: true },
  endAt:        { type: Date, required: true },
  instructions: [String],
  settings: {
    shuffleQuestions:    { type: Boolean, default: true },
    shuffleOptions:      { type: Boolean, default: true },
    showResult:          { type: String, enum: ['immediate','after_review','manual'], default: 'after_review' },
    allowBackNavigation: { type: Boolean, default: true },
    proctoring:          { type: Boolean, default: false },
    fullscreen:          { type: Boolean, default: true },
    preventCopy:         { type: Boolean, default: true },
    negativeMarking:     { type: Boolean, default: false },
    negativeMarkValue:   { type: Number, default: 0 },
    maxAttempts:         { type: Number, default: 1 },
    questionsPerPage:    { type: Number, default: 1 },
  },
  isPublished: { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true },
  createdBy:   { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

// ─── Exam Attempt ──────────────────────────────────────────
export interface IExamAttempt extends Document {
  examId:       mongoose.Types.ObjectId
  studentId:    mongoose.Types.ObjectId
  startedAt:    Date
  submittedAt?: Date
  timeSpent?:   number
  answers:      Array<{ questionId: string; answer: string | string[]; marksAwarded?: number; isCorrect?: boolean }>
  totalMarks?:  number
  percentage?:  number
  rank?:        number
  status:       'in_progress' | 'submitted' | 'evaluated' | 'cancelled'
  violationsLog: Array<{ event: string; timestamp: Date; details?: string }>
  ipAddress?:   string
}

const examAttemptSchema = new Schema<IExamAttempt>({
  examId:      { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  studentId:   { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  startedAt:   { type: Date, required: true },
  submittedAt: { type: Date },
  timeSpent:   { type: Number },
  answers:     [{ questionId: String, answer: Schema.Types.Mixed, marksAwarded: Number, isCorrect: Boolean }],
  totalMarks:  { type: Number },
  percentage:  { type: Number },
  rank:        { type: Number },
  status:      { type: String, enum: ['in_progress','submitted','evaluated','cancelled'], default: 'in_progress' },
  violationsLog: [{ event: String, timestamp: Date, details: String }],
  ipAddress:   { type: String },
}, { timestamps: true })

// ─── Report Card ───────────────────────────────────────────
export interface IReportCard extends Document {
  studentId:   mongoose.Types.ObjectId
  session:     string
  term:        string
  class:       string
  section:     string
  subjects:    Array<{
    name: string; theoryMax: number; theoryObtained: number;
    practicalMax?: number; practicalObtained?: number;
    grade: string; remarks: string
  }>
  totalMax:    number
  totalObtained: number
  percentage:  number
  grade:       string
  rank:        number
  attendance:  number
  teacherRemarks?: string
  principalRemarks?: string
  isPublished: boolean
}

const reportCardSchema = new Schema<IReportCard>({
  studentId:   { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  session:     { type: String, required: true },
  term:        { type: String, required: true },
  class:       { type: String, required: true },
  section:     { type: String, required: true },
  subjects: [{
    name: String, theoryMax: Number, theoryObtained: Number,
    practicalMax: Number, practicalObtained: Number,
    grade: String, remarks: String,
  }],
  totalMax:    Number,
  totalObtained: Number,
  percentage:  Number,
  grade:       String,
  rank:        Number,
  attendance:  Number,
  teacherRemarks:    String,
  principalRemarks:  String,
  isPublished: { type: Boolean, default: false },
}, { timestamps: true })

export const Question    = mongoose.models.Question    ?? mongoose.model<IQuestion>('Question', questionSchema)
export const Exam        = mongoose.models.Exam        ?? mongoose.model<IExam>('Exam', examSchema)
export const ExamAttempt = mongoose.models.ExamAttempt ?? mongoose.model<IExamAttempt>('ExamAttempt', examAttemptSchema)
export const ReportCard  = mongoose.models.ReportCard  ?? mongoose.model<IReportCard>('ReportCard', reportCardSchema)
