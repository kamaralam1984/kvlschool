import mongoose, { Schema, Document, Model } from 'mongoose'

export type AdmissionStatus =
  | 'enquiry' | 'applied' | 'documents-pending' | 'under-review'
  | 'interview-scheduled' | 'interview-done' | 'admitted' | 'waitlist'
  | 'rejected' | 'withdrawn'

export interface IAdmission extends Document {
  applicationNo:  string
  academicYear:   string
  applyingForClass: string
  applyingForSection?: string
  status:         AdmissionStatus
  studentName:    string
  dateOfBirth:    Date
  gender:         'male' | 'female' | 'other'
  nationality:    string
  religion?:      string
  bloodGroup?:    string
  previousSchool?: { name: string; board: string; class: string; percentage: number; tcNo?: string }
  father:         { name: string; phone: string; email?: string; occupation?: string }
  mother:         { name: string; phone: string; email?: string; occupation?: string }
  guardian?:      { name: string; phone: string; email?: string; relation: string }
  address:        { street: string; city: string; state: string; pincode: string }
  documents:      Array<{ type: string; url: string; verified: boolean; uploadedAt: Date }>
  interviewDate?: Date
  interviewNotes?: string
  interviewScore?: number
  reviewedBy?:    mongoose.Types.ObjectId
  admittedDate?:  Date
  studentId?:     mongoose.Types.ObjectId
  rejectionReason?: string
  fees:           { applicationFee: number; paid: boolean; paymentRef?: string }
  source:         'walk-in' | 'online' | 'referral' | 'agent' | 'social-media'
  referredBy?:    string
  notes?:         string
  createdAt:      Date
  updatedAt:      Date
}

const admissionSchema = new Schema<IAdmission>(
  {
    applicationNo:    { type: String, required: true, unique: true },
    academicYear:     { type: String, required: true },
    applyingForClass: { type: String, required: true },
    applyingForSection: { type: String },
    status:           { type: String, enum: ['enquiry','applied','documents-pending','under-review','interview-scheduled','interview-done','admitted','waitlist','rejected','withdrawn'], default: 'applied' },
    studentName:      { type: String, required: true },
    dateOfBirth:      { type: Date, required: true },
    gender:           { type: String, enum: ['male','female','other'], required: true },
    nationality:      { type: String, default: 'Indian' },
    religion:         { type: String },
    bloodGroup:       { type: String },
    previousSchool:   { name: String, board: String, class: String, percentage: Number, tcNo: String },
    father:           { name: String, phone: String, email: String, occupation: String },
    mother:           { name: String, phone: String, email: String, occupation: String },
    guardian:         { name: String, phone: String, email: String, relation: String },
    address:          { street: String, city: String, state: String, pincode: String },
    documents:        [{ type: { type: String }, url: String, verified: { type: Boolean, default: false }, uploadedAt: Date }],
    interviewDate:    { type: Date },
    interviewNotes:   { type: String },
    interviewScore:   { type: Number },
    reviewedBy:       { type: Schema.Types.ObjectId, ref: 'User' },
    admittedDate:     { type: Date },
    studentId:        { type: Schema.Types.ObjectId, ref: 'Student' },
    rejectionReason:  { type: String },
    fees:             { applicationFee: { type: Number, default: 500 }, paid: { type: Boolean, default: false }, paymentRef: String },
    source:           { type: String, enum: ['walk-in','online','referral','agent','social-media'], default: 'online' },
    referredBy:       { type: String },
    notes:            { type: String },
  },
  { timestamps: true }
)

admissionSchema.index({ status: 1 })
admissionSchema.index({ academicYear: 1, applyingForClass: 1 })
admissionSchema.index({ 'father.phone': 1 })

export const Admission: Model<IAdmission> = mongoose.models.Admission ?? mongoose.model<IAdmission>('Admission', admissionSchema)
