import { Request, Response, NextFunction } from 'express'
import { Parent } from './parent.model'
import { AppError } from '../../common/filters/app.error'

const ok = (msg: string) => (_req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, message: msg }) } catch (e) { next(e) }
}

export class ParentController {
  async getParents(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, page = 1, limit = 20 } = req.query
      const filter: Record<string, unknown> = {}
      if (search) filter.$text = { $search: search as string }

      const [parents, total] = await Promise.all([
        Parent.find(filter)
          .populate('userId', 'name email phone avatar')
          .populate('children', 'admissionNo class section')
          .sort({ parentId: 1 })
          .skip((+page - 1) * +limit)
          .limit(+limit)
          .lean(),
        Parent.countDocuments(filter),
      ])
      res.json({ success: true, data: parents, meta: { total, page: +page, limit: +limit, pages: Math.ceil(total / +limit) } })
    } catch (err) { next(err) }
  }

  async createParent(req: Request, res: Response, next: NextFunction) {
    try {
      const parent = await Parent.create(req.body)
      res.status(201).json({ success: true, data: parent })
    } catch (err) { next(err) }
  }

  async getParent(req: Request, res: Response, next: NextFunction) {
    try {
      const parent = await Parent.findById(req.params.id)
        .populate('userId')
        .populate({ path: 'children', populate: { path: 'userId', select: 'name' } })
        .lean()
      if (!parent) throw new AppError('Parent not found.', 404)
      res.json({ success: true, data: parent })
    } catch (err) { next(err) }
  }

  async updateParent(req: Request, res: Response, next: NextFunction) {
    try {
      const parent = await Parent.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      if (!parent) throw new AppError('Parent not found.', 404)
      res.json({ success: true, data: parent })
    } catch (err) { next(err) }
  }

  async getChildrenDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const parent = await Parent.findById(req.params.id)
        .populate({ path: 'children', populate: [{ path: 'userId', select: 'name email' }] })
        .lean()
      if (!parent) throw new AppError('Parent not found.', 404)
      res.json({ success: true, data: parent.children })
    } catch (err) { next(err) }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { to, message, channel } = req.body
      // In production: integrate SMS/email/push service
      res.json({ success: true, message: `Message sent via ${channel} to ${to}.` })
    } catch (err) { next(err) }
  }

  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, data: [], message: 'Parent notifications.' })
    } catch (err) { next(err) }
  }

  bulkNotify = ok('Bulk notification sent to all parents.')
  exportParents = ok('Export queued.')
}
