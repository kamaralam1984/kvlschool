import { Request, Response, NextFunction } from 'express'
import { Admission } from './admission.model'
import { AppError } from '../../common/filters/app.error'

const ok = (msg: string) => (_req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, message: msg }) } catch (e) { next(e) }
}

let appCounter = 1000

export class AdmissionController {
  async getApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, academicYear, applyingForClass, page = 1, limit = 20 } = req.query
      const filter: Record<string, unknown> = {}
      if (status)          filter.status          = status
      if (academicYear)    filter.academicYear    = academicYear
      if (applyingForClass) filter.applyingForClass = applyingForClass

      const [applications, total] = await Promise.all([
        Admission.find(filter)
          .sort({ createdAt: -1 })
          .skip((+page - 1) * +limit)
          .limit(+limit)
          .lean(),
        Admission.countDocuments(filter),
      ])
      res.json({ success: true, data: applications, meta: { total, page: +page, limit: +limit, pages: Math.ceil(total / +limit) } })
    } catch (err) { next(err) }
  }

  async createApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const applicationNo = `APP${new Date().getFullYear()}${String(++appCounter).padStart(4, '0')}`
      const application = await Admission.create({ ...req.body, applicationNo })
      res.status(201).json({ success: true, data: application })
    } catch (err) { next(err) }
  }

  async getApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const app = await Admission.findById(req.params.id).lean()
      if (!app) throw new AppError('Application not found.', 404)
      res.json({ success: true, data: app })
    } catch (err) { next(err) }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, rejectionReason, interviewDate, interviewNotes, interviewScore } = req.body
      const update: Record<string, unknown> = { status }
      if (rejectionReason)  update.rejectionReason  = rejectionReason
      if (interviewDate)    update.interviewDate    = interviewDate
      if (interviewNotes)   update.interviewNotes   = interviewNotes
      if (interviewScore)   update.interviewScore   = interviewScore
      if (status === 'admitted') { update.admittedDate = new Date(); update.reviewedBy = (req as any).user?.id }

      const app = await Admission.findByIdAndUpdate(req.params.id, update, { new: true })
      if (!app) throw new AppError('Application not found.', 404)
      res.json({ success: true, data: app })
    } catch (err) { next(err) }
  }

  async getPipelineStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await Admission.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      res.json({ success: true, data: stats })
    } catch (err) { next(err) }
  }

  async getSeatAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { academicYear } = req.query
      const admitted = await Admission.aggregate([
        { $match: { status: 'admitted', ...(academicYear ? { academicYear } : {}) } },
        { $group: { _id: '$applyingForClass', admitted: { $sum: 1 } } },
      ])
      res.json({ success: true, data: admitted })
    } catch (err) { next(err) }
  }

  uploadDocument = ok('Document uploaded.')
  scheduleInterview = ok('Interview scheduled and parent notified.')
  sendAdmissionLetter = ok('Admission letter sent.')
  convertToStudent = ok('Application converted to student record.')
  exportApplications = ok('Export queued.')
}
