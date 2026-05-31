import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IBook extends Document {
  title: string; author: string[]; isbn: string; publisher?: string; year?: number
  category: string; edition?: string; language: string; pages?: number
  totalCopies: number; availableCopies: number; location: string
  coverImage?: string; description?: string; tags: string[]
  isActive: boolean; createdAt: Date; updatedAt: Date
}

const bookSchema = new Schema<IBook>({
  title:          { type: String, required: true },
  author:         [{ type: String }],
  isbn:           { type: String, required: true, unique: true },
  publisher:      String, year: Number,
  category:       { type: String, required: true },
  edition:        String, language: { type: String, default: 'English' }, pages: Number,
  totalCopies:    { type: Number, required: true, min: 1 },
  availableCopies:{ type: Number, required: true, min: 0 },
  location:       { type: String, required: true },
  coverImage:     String, description: String, tags: [String],
  isActive:       { type: Boolean, default: true },
}, { timestamps: true })

bookSchema.index({ title: 'text', author: 'text', isbn: 1 })
bookSchema.index({ category: 1, availableCopies: 1 })

export const Book: Model<IBook> = mongoose.models.Book ?? mongoose.model<IBook>('Book', bookSchema)

// ─── Book Issue ──────────────────────────────────────────────
export interface IBookIssue extends Document {
  bookId:     mongoose.Types.ObjectId
  memberId:   mongoose.Types.ObjectId
  memberType: 'student' | 'teacher' | 'staff'
  issueDate:  Date
  dueDate:    Date
  returnDate?: Date
  status:     'issued' | 'returned' | 'overdue' | 'lost'
  fine:       number; finePaid: boolean
  issuedBy:   mongoose.Types.ObjectId
  returnedTo?: mongoose.Types.ObjectId
  notes?:     string
  createdAt:  Date
}

const bookIssueSchema = new Schema<IBookIssue>({
  bookId:     { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  memberId:   { type: Schema.Types.ObjectId, required: true },
  memberType: { type: String, enum: ['student','teacher','staff'], required: true },
  issueDate:  { type: Date, default: Date.now },
  dueDate:    { type: Date, required: true },
  returnDate: Date,
  status:     { type: String, enum: ['issued','returned','overdue','lost'], default: 'issued' },
  fine:       { type: Number, default: 0 }, finePaid: { type: Boolean, default: false },
  issuedBy:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  returnedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  notes:      String,
}, { timestamps: true })

bookIssueSchema.index({ memberId: 1, status: 1 })
bookIssueSchema.index({ dueDate: 1, status: 1 })

export const BookIssue: Model<IBookIssue> = mongoose.models.BookIssue ?? mongoose.model<IBookIssue>('BookIssue', bookIssueSchema)
