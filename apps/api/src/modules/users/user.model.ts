import mongoose, { Schema, Document, Model } from 'mongoose'

export type UserRole =
  | 'super_admin' | 'chairman' | 'director' | 'principal' | 'vice_principal'
  | 'admin' | 'accountant' | 'hr' | 'teacher' | 'librarian'
  | 'hostel_manager' | 'transport_manager' | 'receptionist'
  | 'parent' | 'student' | 'alumni'

export interface IUser extends Document {
  name:              string
  email:             string
  password:          string
  role:              UserRole
  avatar?:           string
  phone?:            string
  isActive:          boolean
  isEmailVerified:   boolean
  emailVerifyToken?: string
  googleId?:         string
  twoFactorEnabled:  boolean
  totpSecret?:       string
  loginAttempts?:    number
  lockedUntil?:      Date
  lastLoginAt?:      Date
  lastLoginIp?:      string
  permissions:       string[]
  customRole?:       string
  department?:       string
  employeeId?:       string
  studentId?:        string
  createdAt:         Date
  updatedAt:         Date
}

const userSchema = new Schema<IUser>(
  {
    name:              { type: String, required: true, trim: true },
    email:             { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:          { type: String, required: true, select: false },
    role:              { type: String, enum: [
      'super_admin','chairman','director','principal','vice_principal',
      'admin','accountant','hr','teacher','librarian',
      'hostel_manager','transport_manager','receptionist',
      'parent','student','alumni',
    ], default: 'student' },
    avatar:            { type: String },
    phone:             { type: String },
    isActive:          { type: Boolean, default: true },
    isEmailVerified:   { type: Boolean, default: false },
    emailVerifyToken:  { type: String, select: false },
    googleId:          { type: String },
    twoFactorEnabled:  { type: Boolean, default: false },
    totpSecret:        { type: String, select: false },
    loginAttempts:     { type: Number, default: 0 },
    lockedUntil:       { type: Date },
    lastLoginAt:       { type: Date },
    lastLoginIp:       { type: String },
    permissions:       { type: [String], default: [] },
    customRole:        { type: String },
    department:        { type: String },
    employeeId:        { type: String },
    studentId:         { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret.password
        delete ret.totpSecret
        delete ret.emailVerifyToken
        delete ret.__v
      },
    },
  }
)

userSchema.index({ role: 1 })
userSchema.index({ isActive: 1 })
userSchema.index({ studentId: 1 })
userSchema.index({ employeeId: 1 })

export const User: Model<IUser> = mongoose.models.User ?? mongoose.model<IUser>('User', userSchema)
