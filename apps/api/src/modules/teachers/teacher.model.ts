import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITeacher extends Document {
  userId:         mongoose.Types.ObjectId
  employeeId:     string
  designation:    string
  department:     string
  subjects:       string[]
  classes:        Array<{ class: string; section: string; subject: string }>
  qualification:  Array<{ degree: string; institution: string; year: number; grade?: string }>
  experience:     Array<{ institution: string; role: string; from: Date; to?: Date; current?: boolean }>
  totalExperience: number // years
  employmentType: 'full-time' | 'part-time' | 'contract' | 'visiting'
  joinDate:       Date
  salary:         number
  bankAccount?:   { bankName: string; accountNo: string; ifsc: string; branch: string }
  documents:      Array<{ type: string; url: string; verified: boolean }>
  photo?:         string
  address:        { street: string; city: string; state: string; pincode: string }
  emergencyContact: { name: string; phone: string; relation: string }
  leaveBalance:   { casual: number; sick: number; earned: number; maternity?: number }
  isClassTeacher: boolean
  classTeacherOf?: string
  isActive:       boolean
  leftDate?:      Date
  ratings:        Array<{ year: string; score: number; reviewedBy: string }>
  achievements:   Array<{ title: string; date: Date; description?: string }>
  specializations: string[]
  createdAt:      Date
  updatedAt:      Date
}

const teacherSchema = new Schema<ITeacher>(
  {
    userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    employeeId:    { type: String, required: true, unique: true },
    designation:   { type: String, required: true },
    department:    { type: String, required: true },
    subjects:      [{ type: String }],
    classes:       [{ class: String, section: String, subject: String }],
    qualification: [{ degree: String, institution: String, year: Number, grade: String }],
    experience:    [{ institution: String, role: String, from: Date, to: Date, current: Boolean }],
    totalExperience: { type: Number, default: 0 },
    employmentType: { type: String, enum: ['full-time','part-time','contract','visiting'], default: 'full-time' },
    joinDate:      { type: Date, required: true },
    salary:        { type: Number },
    bankAccount:   { bankName: String, accountNo: String, ifsc: String, branch: String },
    documents:     [{ type: { type: String }, url: String, verified: { type: Boolean, default: false } }],
    photo:         { type: String },
    address:       { street: String, city: String, state: String, pincode: String },
    emergencyContact: { name: String, phone: String, relation: String },
    leaveBalance:  { casual: { type: Number, default: 12 }, sick: { type: Number, default: 12 }, earned: { type: Number, default: 18 }, maternity: Number },
    isClassTeacher:  { type: Boolean, default: false },
    classTeacherOf:  { type: String },
    isActive:      { type: Boolean, default: true },
    leftDate:      { type: Date },
    ratings:       [{ year: String, score: Number, reviewedBy: String }],
    achievements:  [{ title: String, date: Date, description: String }],
    specializations: [{ type: String }],
  },
  { timestamps: true }
)

teacherSchema.index({ department: 1 })
teacherSchema.index({ employmentType: 1 })
teacherSchema.index({ isActive: 1 })

export const Teacher: Model<ITeacher> = mongoose.models.Teacher ?? mongoose.model<ITeacher>('Teacher', teacherSchema)
