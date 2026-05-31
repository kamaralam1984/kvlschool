import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IProduct extends Document {
  name:          string
  description:   string
  category:      'uniform' | 'stationery' | 'books' | 'sports' | 'lab' | 'electronics' | 'other'
  price:         number
  mrp:           number
  stock:         number
  sold:          number
  images:        string[]
  thumbnail?:    string
  tags:          string[]
  applicableFor: string[]  // class names
  sku?:          string
  weight?:       number
  isActive:      boolean
  ratings:       Array<{ userId: mongoose.Types.ObjectId; score: number; review?: string; date: Date }>
  avgRating:     number
  ratingCount:   number
  createdAt:     Date
  updatedAt:     Date
}

const productSchema = new Schema<IProduct>({
  name:          { type: String, required: true },
  description:   { type: String, required: true },
  category:      { type: String, enum: ['uniform','stationery','books','sports','lab','electronics','other'], required: true },
  price:         { type: Number, required: true, min: 0 },
  mrp:           { type: Number, required: true, min: 0 },
  stock:         { type: Number, default: 0, min: 0 },
  sold:          { type: Number, default: 0 },
  images:        [String],
  thumbnail:     String,
  tags:          [String],
  applicableFor: [String],
  sku:           { type: String, unique: true, sparse: true },
  weight:        Number,
  isActive:      { type: Boolean, default: true },
  ratings:       [{ userId: { type: Schema.Types.ObjectId, ref: 'User' }, score: Number, review: String, date: Date }],
  avgRating:     { type: Number, default: 0 },
  ratingCount:   { type: Number, default: 0 },
}, { timestamps: true })

productSchema.index({ name: 'text', description: 'text', tags: 'text' })
productSchema.index({ category: 1, isActive: 1, stock: 1 })

export const Product: Model<IProduct> = mongoose.models.Product ?? mongoose.model<IProduct>('Product', productSchema)

// ─── Order ─────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

export interface IOrder extends Document {
  orderId:     string
  userId:      mongoose.Types.ObjectId
  items:       Array<{ productId: mongoose.Types.ObjectId; name: string; price: number; qty: number; total: number }>
  subtotal:    number
  discount:    number
  deliveryFee: number
  total:       number
  status:      OrderStatus
  payment:     { method: string; status: 'pending' | 'paid' | 'failed' | 'refunded'; transactionId?: string; paidAt?: Date }
  deliveryType: 'school-pickup' | 'home-delivery'
  address?:    { line1: string; city: string; pincode: string }
  notes?:      string
  cancelReason?: string
  createdAt:   Date
  updatedAt:   Date
}

let orderCounter = 10000

const orderSchema = new Schema<IOrder>({
  orderId:     { type: String, required: true, unique: true },
  userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items:       [{ productId: { type: Schema.Types.ObjectId, ref: 'Product' }, name: String, price: Number, qty: Number, total: Number }],
  subtotal:    Number, discount: { type: Number, default: 0 }, deliveryFee: { type: Number, default: 0 }, total: Number,
  status:      { type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'], default: 'pending' },
  payment:     { method: String, status: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' }, transactionId: String, paidAt: Date },
  deliveryType: { type: String, enum: ['school-pickup','home-delivery'], default: 'school-pickup' },
  address:     { line1: String, city: String, pincode: String },
  notes:       String, cancelReason: String,
}, { timestamps: true })

orderSchema.index({ userId: 1, createdAt: -1 })
orderSchema.index({ status: 1 })

export const Order: Model<IOrder> = mongoose.models.Order ?? mongoose.model<IOrder>('Order', orderSchema)
export { orderCounter }
