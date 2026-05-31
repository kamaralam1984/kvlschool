import mongoose, { Schema, Document, Model } from 'mongoose'

// ─── Fee Structure ─────────────────────────────────────────
export interface IFeeStructure extends Document {
  session:    string
  class:      string
  category:   string
  components: Array<{ name: string; amount: number; isOptional: boolean; frequency: 'one_time' | 'monthly' | 'quarterly' | 'annual' }>
  totalAnnual: number
  isActive:   boolean
}

const feeStructureSchema = new Schema<IFeeStructure>({
  session:    { type: String, required: true },
  class:      { type: String, required: true },
  category:   { type: String, required: true },
  components: [{ name: String, amount: Number, isOptional: Boolean, frequency: { type: String, enum: ['one_time','monthly','quarterly','annual'] } }],
  totalAnnual:{ type: Number },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true })

// ─── Fee Invoice ───────────────────────────────────────────
export interface IFeeInvoice extends Document {
  invoiceNo:    string
  studentId:    mongoose.Types.ObjectId
  session:      string
  month?:       string
  components:   Array<{ name: string; amount: number; waiver?: number; netAmount: number }>
  subtotal:     number
  discount:     number
  lateFine:     number
  totalAmount:  number
  paidAmount:   number
  balance:      number
  dueDate:      Date
  status:       'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled'
  gstAmount?:   number
  gstNo?:       string
  createdAt:    Date
}

const feeInvoiceSchema = new Schema<IFeeInvoice>({
  invoiceNo:   { type: String, required: true, unique: true },
  studentId:   { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  session:     { type: String, required: true },
  month:       { type: String },
  components:  [{ name: String, amount: Number, waiver: Number, netAmount: Number }],
  subtotal:    { type: Number, required: true },
  discount:    { type: Number, default: 0 },
  lateFine:    { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paidAmount:  { type: Number, default: 0 },
  balance:     { type: Number },
  dueDate:     { type: Date, required: true },
  status:      { type: String, enum: ['pending','partial','paid','overdue','cancelled'], default: 'pending' },
  gstAmount:   { type: Number },
  gstNo:       { type: String },
}, { timestamps: true })

// ─── Payment Transaction ───────────────────────────────────
export interface IPayment extends Document {
  invoiceId:         mongoose.Types.ObjectId
  studentId:         mongoose.Types.ObjectId
  amount:            number
  method:            'online' | 'cash' | 'cheque' | 'bank_transfer' | 'upi'
  status:            'pending' | 'success' | 'failed' | 'refunded'
  razorpayOrderId?:  string
  razorpayPaymentId?: string
  razorpaySignature?: string
  chequeNo?:         string
  bankRef?:          string
  receiptNo:         string
  paidBy:            string
  remarks?:          string
  paidAt:            Date
}

const paymentSchema = new Schema<IPayment>({
  invoiceId:          { type: Schema.Types.ObjectId, ref: 'FeeInvoice', required: true },
  studentId:          { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  amount:             { type: Number, required: true },
  method:             { type: String, enum: ['online','cash','cheque','bank_transfer','upi'] },
  status:             { type: String, enum: ['pending','success','failed','refunded'], default: 'pending' },
  razorpayOrderId:    { type: String },
  razorpayPaymentId:  { type: String },
  razorpaySignature:  { type: String },
  chequeNo:           { type: String },
  bankRef:            { type: String },
  receiptNo:          { type: String, unique: true },
  paidBy:             { type: String, required: true },
  remarks:            { type: String },
  paidAt:             { type: Date, default: Date.now },
}, { timestamps: true })

// ─── Income & Expense ──────────────────────────────────────
export interface ITransaction extends Document {
  type:        'income' | 'expense'
  category:    string
  description: string
  amount:      number
  date:        Date
  paymentMode: string
  reference?:  string
  attachments: string[]
  addedBy:     mongoose.Types.ObjectId
}

const transactionSchema = new Schema<ITransaction>({
  type:        { type: String, enum: ['income','expense'], required: true },
  category:    { type: String, required: true },
  description: { type: String, required: true },
  amount:      { type: Number, required: true },
  date:        { type: Date, required: true },
  paymentMode: { type: String },
  reference:   { type: String },
  attachments: [String],
  addedBy:     { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

// ─── Scholarship ───────────────────────────────────────────
export interface IScholarship extends Document {
  name:        string
  description: string
  type:        'merit' | 'need_based' | 'sports' | 'cultural' | 'government'
  amount:      number
  percentage?: number
  criteria:    string
  eligibility: string[]
  session:     string
  isActive:    boolean
}

const scholarshipSchema = new Schema<IScholarship>({
  name:        { type: String, required: true },
  description: { type: String },
  type:        { type: String, enum: ['merit','need_based','sports','cultural','government'] },
  amount:      { type: Number },
  percentage:  { type: Number },
  criteria:    { type: String },
  eligibility: [String],
  session:     { type: String },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true })

export const FeeStructure = mongoose.models.FeeStructure ?? mongoose.model<IFeeStructure>('FeeStructure', feeStructureSchema)
export const FeeInvoice   = mongoose.models.FeeInvoice   ?? mongoose.model<IFeeInvoice>('FeeInvoice', feeInvoiceSchema)
export const Payment      = mongoose.models.Payment      ?? mongoose.model<IPayment>('Payment', paymentSchema)
export const Transaction  = mongoose.models.Transaction  ?? mongoose.model<ITransaction>('Transaction', transactionSchema)
export const Scholarship  = mongoose.models.Scholarship  ?? mongoose.model<IScholarship>('Scholarship', scholarshipSchema)
