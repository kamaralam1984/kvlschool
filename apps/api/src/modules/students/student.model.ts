import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IStudent extends Document {
  userId:         mongoose.Types.ObjectId
  admissionNo:    string
  rollNo:         string
  class:          string
  section:        string
  session:        string
  dateOfBirth:    Date
  gender:         'male' | 'female' | 'other'
  bloodGroup?:    string
  nationality:    string
  religion?:      string
  category:       'general' | 'obc' | 'sc' | 'st' | 'other'
  address: {
    present: { line1: string; city: string; state: string; pincode: string }
    permanent: { line1: string; city: string; state: string; pincode: string }
  }
  father: { name: string; phone: string; occupation: string; email?: string }
  mother: { name: string; phone: string; occupation: string; email?: string }
  guardian?: { name: string; phone: string; relation: string }
  emergencyContact: { name: string; phone: string; relation: string }
  documents: Array<{ type: string; url: string; uploadedAt: Date }>
  photo?: string
  idCard?: string
  hostelId?:    mongoose.Types.ObjectId
  transportId?: mongoose.Types.ObjectId
  libraryId?:   string
  isActive:     boolean
  admissionDate: Date
  promotedTo?:   string
  leftDate?:     Date
  leftReason?:   string
  achievements:  Array<{ title: string; date: Date; category: string; description?: string }>
  medicalInfo?: { conditions: string[]; allergies: string[]; doctorName?: string; doctorPhone?: string }
  previousSchool?: { name: string; board: string; lastClass: string; percentage: number }
  scholarships: Array<{ name: string; amount: number; year: string }>
  createdAt: Date
  updatedAt: Date
}

const studentSchema = new Schema<IStudent>(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    admissionNo: { type: String, required: true, unique: true },
    rollNo:      { type: String, required: true },
    class:       { type: String, required: true },
    section:     { type: String, required: true },
    session:     { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender:      { type: String, enum: ['male', 'female', 'other'], required: true },
    bloodGroup:  { type: String },
    nationality: { type: String, default: 'Indian' },
    religion:    { type: String },
    category:    { type: String, enum: ['general', 'obc', 'sc', 'st', 'other'], default: 'general' },
    address: {
      present:   { line1: String, city: String, state: String, pincode: String },
      permanent: { line1: String, city: String, state: String, pincode: String },
    },
    father:  { name: String, phone: String, occupation: String, email: String },
    mother:  { name: String, phone: String, occupation: String, email: String },
    guardian: { name: String, phone: String, relation: String },
    emergencyContact: { name: String, phone: String, relation: String },
    documents:   [{ type: { type: String }, url: String, uploadedAt: Date }],
    photo:       { type: String },
    idCard:      { type: String },
    hostelId:    { type: Schema.Types.ObjectId, ref: 'HostelRoom' },
    transportId: { type: Schema.Types.ObjectId, ref: 'Transport' },
    libraryId:   { type: String },
    isActive:    { type: Boolean, default: true },
    admissionDate: { type: Date, required: true },
    promotedTo:  { type: String },
    leftDate:    { type: Date },
    leftReason:  { type: String },
    achievements: [{ title: String, date: Date, category: String, description: String }],
    medicalInfo: {
      conditions: [String],
      allergies:  [String],
      doctorName: String,
      doctorPhone: String,
    },
    previousSchool: { name: String, board: String, lastClass: String, percentage: Number },
    scholarships: [{ name: String, amount: Number, year: String }],
  },
  { timestamps: true }
)

studentSchema.index({ class: 1, section: 1 })
studentSchema.index({ session: 1 })

export const Student: Model<IStudent> = mongoose.models.Student ?? mongoose.model<IStudent>('Student', studentSchema)
