import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ILeaveRequest extends Document {
  employeeId:  mongoose.Types.ObjectId
  employeeType: 'teacher' | 'staff'
  type:        'casual' | 'sick' | 'earned' | 'maternity' | 'paternity' | 'unpaid' | 'compensatory'
  from:        Date; to: Date; days: number
  reason:      string; attachments?: string[]
  status:      'pending' | 'approved' | 'rejected' | 'cancelled'
  approvedBy?: mongoose.Types.ObjectId; approvedAt?: Date
  rejectionReason?: string
  substituteTeacher?: mongoose.Types.ObjectId
  createdAt:   Date; updatedAt: Date
}

const leaveSchema = new Schema<ILeaveRequest>({
  employeeId:   { type: Schema.Types.ObjectId, required: true },
  employeeType: { type: String, enum: ['teacher','staff'], required: true },
  type:         { type: String, enum: ['casual','sick','earned','maternity','paternity','unpaid','compensatory'], required: true },
  from:         { type: Date, required: true }, to: { type: Date, required: true }, days: { type: Number, required: true },
  reason:       { type: String, required: true }, attachments: [String],
  status:       { type: String, enum: ['pending','approved','rejected','cancelled'], default: 'pending' },
  approvedBy:   { type: Schema.Types.ObjectId, ref: 'User' }, approvedAt: Date,
  rejectionReason: String, substituteTeacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
}, { timestamps: true })

leaveSchema.index({ employeeId: 1, status: 1 })
leaveSchema.index({ from: 1, status: 1 })

export const LeaveRequest: Model<ILeaveRequest> = mongoose.models.LeaveRequest ?? mongoose.model<ILeaveRequest>('LeaveRequest', leaveSchema)

export interface IPayroll extends Document {
  employeeId:  mongoose.Types.ObjectId; employeeType: 'teacher' | 'staff'
  month:       number; year: number; workingDays: number; presentDays: number; absentDays: number
  basic:       number; hra: number; da: number; ta: number; otherAllowances: number
  pf:          number; esi: number; tds: number; loanDeduction: number; otherDeductions: number
  gross:       number; net: number; status: 'draft' | 'approved' | 'paid'
  paymentDate?: Date; paymentRef?: string; bankRef?: string
  processedBy: mongoose.Types.ObjectId; createdAt: Date; updatedAt: Date
}

const payrollSchema = new Schema<IPayroll>({
  employeeId:   { type: Schema.Types.ObjectId, required: true },
  employeeType: { type: String, enum: ['teacher','staff'], required: true },
  month: { type: Number, required: true, min: 1, max: 12 }, year: { type: Number, required: true },
  workingDays: Number, presentDays: Number, absentDays: Number,
  basic: Number, hra: Number, da: Number, ta: Number, otherAllowances: Number,
  pf: Number, esi: Number, tds: Number, loanDeduction: Number, otherDeductions: Number,
  gross: Number, net: Number,
  status: { type: String, enum: ['draft','approved','paid'], default: 'draft' },
  paymentDate: Date, paymentRef: String, bankRef: String,
  processedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true })

export const Payroll: Model<IPayroll> = mongoose.models.Payroll ?? mongoose.model<IPayroll>('Payroll', payrollSchema)
