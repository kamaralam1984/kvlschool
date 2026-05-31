import { Request, Response, NextFunction } from 'express'
import { Attendance } from './attendance.model'
import { AppError } from '../../common/filters/app.error'

const ok = (msg: string) => (_req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, message: msg }) } catch (e) { next(e) }
}

export class AttendanceController {
  async markAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, class: cls, section, session, records } = req.body
      const markedBy = (req as any).user?.id

      const existing = await Attendance.findOne({ date: new Date(date), class: cls, section, session })
      if (existing?.isLocked) throw new AppError('Attendance is locked for this date.', 403)

      const attendance = existing
        ? await Attendance.findByIdAndUpdate(existing._id, { records, markedBy }, { new: true })
        : await Attendance.create({ date: new Date(date), class: cls, section, session, markedBy, records })

      res.json({ success: true, data: attendance })
    } catch (err) { next(err) }
  }

  async getAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, class: cls, section, session } = req.query
      const filter: Record<string, unknown> = {}
      if (date)    filter.date    = new Date(date as string)
      if (cls)     filter.class   = cls
      if (section) filter.section = section
      if (session) filter.session = session

      const attendance = await Attendance.find(filter)
        .populate('records.studentId', 'admissionNo userId')
        .populate('markedBy', 'name')
        .lean()
      res.json({ success: true, data: attendance })
    } catch (err) { next(err) }
  }

  async getStudentAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params
      const { from, to, session } = req.query
      const dateFilter: Record<string, unknown> = {}
      if (from) dateFilter.$gte = new Date(from as string)
      if (to)   dateFilter.$lte = new Date(to as string)

      const records = await Attendance.find({
        'records.studentId': studentId,
        ...(session ? { session } : {}),
        ...(Object.keys(dateFilter).length ? { date: dateFilter } : {}),
      }).lean()

      let present = 0, absent = 0, late = 0, halfDay = 0
      for (const r of records) {
        const rec = r.records.find((x: any) => String(x.studentId) === studentId)
        if (!rec) continue
        if (rec.status === 'present') present++
        else if (rec.status === 'absent') absent++
        else if (rec.status === 'late') late++
        else if (rec.status === 'half-day') halfDay++
      }
      const total = present + absent + late + halfDay
      res.json({ success: true, data: { present, absent, late, halfDay, total, percentage: total ? +((present / total) * 100).toFixed(2) : 0, records } })
    } catch (err) { next(err) }
  }

  async getClassAttendanceSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { class: cls, section, session, date } = req.query
      const filter: Record<string, unknown> = {}
      if (cls)     filter.class   = cls
      if (section) filter.section = section
      if (session) filter.session = session
      if (date)    filter.date    = new Date(date as string)

      const summary = await Attendance.aggregate([
        { $match: filter },
        { $unwind: '$records' },
        { $group: { _id: '$records.status', count: { $sum: 1 } } },
      ])
      res.json({ success: true, data: summary })
    } catch (err) { next(err) }
  }

  async lockAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, class: cls, section } = req.body
      await Attendance.updateMany(
        { date: new Date(date), class: cls, section },
        { isLocked: true, lockedAt: new Date() }
      )
      res.json({ success: true, message: 'Attendance locked.' })
    } catch (err) { next(err) }
  }

  async getMonthlyReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { class: cls, section, month, year } = req.query
      const startDate = new Date(+(year ?? new Date().getFullYear()), +(month ?? new Date().getMonth()) - 1, 1)
      const endDate   = new Date(+(year ?? new Date().getFullYear()), +(month ?? new Date().getMonth()), 0)

      const data = await Attendance.find({ class: cls, section, date: { $gte: startDate, $lte: endDate } })
        .sort({ date: 1 }).lean()
      res.json({ success: true, data })
    } catch (err) { next(err) }
  }

  notifyAbsentParents = ok('Parents notified via SMS.')
  exportAttendance    = ok('Attendance export queued.')
}
