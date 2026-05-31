import mongoose, { Schema, Document, Model } from 'mongoose'

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day' | 'on-leave'

export interface IAttendance extends Document {
  date:      Date
  class:     string
  section:   string
  session:   string
  markedBy:  mongoose.Types.ObjectId
  records:   Array<{
    studentId: mongoose.Types.ObjectId
    status:    AttendanceStatus
    inTime?:   string
    outTime?:  string
    reason?:   string
    notified:  boolean
  }>
  periodwise?: Array<{
    period:    number
    subject:   string
    teacherId: mongoose.Types.ObjectId
    records:   Array<{ studentId: mongoose.Types.ObjectId; status: AttendanceStatus }>
  }>
  isLocked:  boolean
  lockedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const attendanceSchema = new Schema<IAttendance>(
  {
    date:     { type: Date, required: true },
    class:    { type: String, required: true },
    section:  { type: String, required: true },
    session:  { type: String, required: true },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    records:  [{
      studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
      status:    { type: String, enum: ['present','absent','late','half-day','on-leave'], required: true },
      inTime:    String,
      outTime:   String,
      reason:    String,
      notified:  { type: Boolean, default: false },
    }],
    periodwise: [{
      period:    Number,
      subject:   String,
      teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
      records:   [{ studentId: { type: Schema.Types.ObjectId, ref: 'Student' }, status: String }],
    }],
    isLocked: { type: Boolean, default: false },
    lockedAt: { type: Date },
  },
  { timestamps: true }
)

attendanceSchema.index({ date: 1, class: 1, section: 1 }, { unique: true })
attendanceSchema.index({ 'records.studentId': 1, date: 1 })
attendanceSchema.index({ session: 1 })

export const Attendance: Model<IAttendance> = mongoose.models.Attendance ?? mongoose.model<IAttendance>('Attendance', attendanceSchema)
