import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IVehicle extends Document {
  number:       string; type: 'bus' | 'van' | 'car'
  vehicleModel: string; year: number; capacity: number
  driverId?:    mongoose.Types.ObjectId; driverName?: string; driverPhone?: string
  helper?:      string; helperPhone?: string
  insurance:    { policyNo: string; validUntil: Date; company: string }
  fitness:      { certificateNo: string; validUntil: Date }
  pollution:    { validUntil: Date }
  gpsDevice?:   string; gpsTrackingId?: string
  isActive:     boolean; notes?: string; createdAt: Date; updatedAt: Date
}

const vehicleSchema = new Schema<IVehicle>({
  number:   { type: String, required: true, unique: true },
  type:     { type: String, enum: ['bus','van','car'], default: 'bus' },
  vehicleModel: { type: String }, year: Number, capacity: { type: Number, required: true },
  driverId: { type: Schema.Types.ObjectId, ref: 'User' }, driverName: String, driverPhone: String,
  helper: String, helperPhone: String,
  insurance: { policyNo: String, validUntil: Date, company: String },
  fitness:   { certificateNo: String, validUntil: Date },
  pollution: { validUntil: Date },
  gpsDevice: String, gpsTrackingId: String,
  isActive:  { type: Boolean, default: true }, notes: String,
}, { timestamps: true })

export const Vehicle: Model<IVehicle> = mongoose.models.Vehicle ?? mongoose.model<IVehicle>('Vehicle', vehicleSchema)

export interface IRoute extends Document {
  routeNo:    string; name: string; vehicleId?: mongoose.Types.ObjectId
  stops:      Array<{ name: string; time: string; lat?: number; lng?: number; order: number }>
  students:   mongoose.Types.ObjectId[]; fee: number; academicYear: string
  morningTime: string; eveningTime: string; isActive: boolean
  createdAt: Date; updatedAt: Date
}

const routeSchema = new Schema<IRoute>({
  routeNo:  { type: String, required: true, unique: true },
  name:     { type: String, required: true },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
  stops:    [{ name: String, time: String, lat: Number, lng: Number, order: Number }],
  students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  fee:      { type: Number, required: true }, academicYear: String,
  morningTime: String, eveningTime: String, isActive: { type: Boolean, default: true },
}, { timestamps: true })

export const Route: Model<IRoute> = mongoose.models.Route ?? mongoose.model<IRoute>('Route', routeSchema)
