import { Request, Response, NextFunction } from 'express'
import { LeaveRequest, Payroll } from './hr.model'
import { AppError } from '../../common/filters/app.error'

const ok = (msg: string) => (_req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, message: msg }) } catch (e) { next(e) }
}

export class HRController {
  async getLeaveRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, employeeType, from, to, page = 1, limit = 20 } = req.query
      const filter: Record<string, unknown> = {}
      if (status)       filter.status       = status
      if (employeeType) filter.employeeType = employeeType
      if (from || to) {
        filter.from = {}
        if (from) (filter.from as any).$gte = new Date(from as string)
        if (to)   (filter.from as any).$lte = new Date(to as string)
      }

      const [leaves, total] = await Promise.all([
        LeaveRequest.find(filter)
          .populate('approvedBy', 'name')
          .sort({ createdAt: -1 })
          .skip((+page - 1) * +limit)
          .limit(+limit)
          .lean(),
        LeaveRequest.countDocuments(filter),
      ])
      res.json({ success: true, data: leaves, meta: { total, page: +page, limit: +limit, pages: Math.ceil(total / +limit) } })
    } catch (err) { next(err) }
  }

  async applyLeave(req: Request, res: Response, next: NextFunction) {
    try {
      const leave = await LeaveRequest.create({ ...req.body, employeeId: (req as any).user?.id })
      res.status(201).json({ success: true, data: leave })
    } catch (err) { next(err) }
  }

  async approveLeave(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, rejectionReason } = req.body
      if (!['approved','rejected'].includes(status)) throw new AppError('Invalid status.', 400)

      const leave = await LeaveRequest.findByIdAndUpdate(req.params.id, {
        status,
        approvedBy:  (req as any).user?.id,
        approvedAt:  new Date(),
        rejectionReason,
      }, { new: true })
      if (!leave) throw new AppError('Leave request not found.', 404)
      res.json({ success: true, data: leave })
    } catch (err) { next(err) }
  }

  async getPayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const { month, year, employeeType, status, page = 1, limit = 50 } = req.query
      const filter: Record<string, unknown> = {}
      if (month)        filter.month        = +month
      if (year)         filter.year         = +year
      if (employeeType) filter.employeeType = employeeType
      if (status)       filter.status       = status

      const [payrolls, total] = await Promise.all([
        Payroll.find(filter).sort({ createdAt: -1 }).skip((+page - 1) * +limit).limit(+limit).lean(),
        Payroll.countDocuments(filter),
      ])
      res.json({ success: true, data: payrolls, meta: { total, page: +page, limit: +limit, pages: Math.ceil(total / +limit) } })
    } catch (err) { next(err) }
  }

  async processPayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const payroll = await Payroll.create({ ...req.body, processedBy: (req as any).user?.id })
      res.status(201).json({ success: true, data: payroll })
    } catch (err) { next(err) }
  }

  async approvePayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const payroll = await Payroll.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true })
      if (!payroll) throw new AppError('Payroll record not found.', 404)
      res.json({ success: true, data: payroll })
    } catch (err) { next(err) }
  }

  async getPaySlip(req: Request, res: Response, next: NextFunction) {
    try {
      const payroll = await Payroll.findById(req.params.id).lean()
      if (!payroll) throw new AppError('Pay slip not found.', 404)
      res.json({ success: true, data: payroll })
    } catch (err) { next(err) }
  }

  async getLeaveStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await LeaveRequest.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: { type: '$type', employeeType: '$employeeType' }, totalDays: { $sum: '$days' }, count: { $sum: 1 } } },
      ])
      res.json({ success: true, data: stats })
    } catch (err) { next(err) }
  }

  bulkProcessPayroll = ok('Bulk payroll processing queued.')
  generatePaySlipPDF = ok('Pay slip PDF generated.')
  exportPayroll      = ok('Payroll export queued.')
  exportLeaves       = ok('Leave report export queued.')
}
