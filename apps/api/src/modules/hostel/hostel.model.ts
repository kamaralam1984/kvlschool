import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IRoom extends Document {
  number:   string; block: string; floor: string
  type:     'economy' | 'standard' | 'premium'
  capacity: number; occupied: number
  amenities: string[]; rent: number
  isActive: boolean; status: 'available' | 'full' | 'maintenance'
  createdAt: Date; updatedAt: Date
}

const roomSchema = new Schema<IRoom>({
  number:   { type: String, required: true, unique: true },
  block:    { type: String, required: true }, floor: String,
  type:     { type: String, enum: ['economy','standard','premium'], default: 'standard' },
  capacity: { type: Number, required: true }, occupied: { type: Number, default: 0 },
  amenities:[String], rent: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  status:   { type: String, enum: ['available','full','maintenance'], default: 'available' },
}, { timestamps: true })

export const Room: Model<IRoom> = mongoose.models.Room ?? mongoose.model<IRoom>('Room', roomSchema)

export interface IResident extends Document {
  studentId:  mongoose.Types.ObjectId; roomId: mongoose.Types.ObjectId
  joinDate:   Date; leaveDate?: Date
  feePerMonth: number; depositPaid: number
  guardianName: string; guardianPhone: string; guardianRelation: string
  medicalInfo?: string; dietType?: 'veg' | 'non-veg' | 'both'
  isActive:   boolean; createdAt: Date; updatedAt: Date
}

const residentSchema = new Schema<IResident>({
  studentId:  { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  roomId:     { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  joinDate:   { type: Date, required: true }, leaveDate: Date,
  feePerMonth: { type: Number, required: true }, depositPaid: { type: Number, default: 0 },
  guardianName: String, guardianPhone: String, guardianRelation: String,
  medicalInfo: String, dietType: { type: String, enum: ['veg','non-veg','both'] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

residentSchema.index({ roomId: 1, isActive: 1 })

export const Resident: Model<IResident> = mongoose.models.Resident ?? mongoose.model<IResident>('Resident', residentSchema)

export interface IComplaint extends Document {
  roomId:    mongoose.Types.ObjectId; reportedBy: mongoose.Types.ObjectId
  type:      string; description: string; priority: 'low' | 'medium' | 'high'
  status:    'open' | 'in-progress' | 'resolved'; resolvedAt?: Date
  assignedTo?: mongoose.Types.ObjectId; resolutionNotes?: string
  createdAt: Date; updatedAt: Date
}

const complaintSchema = new Schema<IComplaint>({
  roomId:    { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  reportedBy:{ type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: String, description: { type: String, required: true },
  priority:  { type: String, enum: ['low','medium','high'], default: 'medium' },
  status:    { type: String, enum: ['open','in-progress','resolved'], default: 'open' },
  resolvedAt: Date, assignedTo: { type: Schema.Types.ObjectId, ref: 'User' }, resolutionNotes: String,
}, { timestamps: true })

export const Complaint: Model<IComplaint> = mongoose.models.Complaint ?? mongoose.model<IComplaint>('Complaint', complaintSchema)
