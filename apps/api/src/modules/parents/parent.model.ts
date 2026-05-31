import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IParent extends Document {
  userId:      mongoose.Types.ObjectId
  parentId:    string
  relation:    'father' | 'mother' | 'guardian'
  occupation:  string
  income?:     number
  education?:  string
  children:    mongoose.Types.ObjectId[]
  address:     { street: string; city: string; state: string; pincode: string }
  altPhone?:   string
  workPhone?:  string
  isAppUser:   boolean
  appToken?:   string
  smsOptIn:    boolean
  emailOptIn:  boolean
  notes?:      string
  createdAt:   Date
  updatedAt:   Date
}

const parentSchema = new Schema<IParent>(
  {
    userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    parentId:  { type: String, required: true, unique: true },
    relation:  { type: String, enum: ['father','mother','guardian'], required: true },
    occupation:{ type: String },
    income:    { type: Number },
    education: { type: String },
    children:  [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    address:   { street: String, city: String, state: String, pincode: String },
    altPhone:  { type: String },
    workPhone: { type: String },
    isAppUser: { type: Boolean, default: false },
    appToken:  { type: String },
    smsOptIn:  { type: Boolean, default: true },
    emailOptIn:{ type: Boolean, default: true },
    notes:     { type: String },
  },
  { timestamps: true }
)

parentSchema.index({ children: 1 })

export const Parent: Model<IParent> = mongoose.models.Parent ?? mongoose.model<IParent>('Parent', parentSchema)
