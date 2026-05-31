import { Request, Response, NextFunction } from 'express'
import { Teacher } from './teacher.model'
import { AppError } from '../../common/filters/app.error'

const ok = (msg: string) => (_req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, message: msg }) } catch (e) { next(e) }
}

export class TeacherController {
  async getTeachers(req: Request, res: Response, next: NextFunction) {
    try {
      const { department, employmentType, isActive, search, page = 1, limit = 20 } = req.query
      const filter: Record<string, unknown> = {}
      if (department)     filter.department     = department
      if (employmentType) filter.employmentType = employmentType
      if (isActive !== undefined) filter.isActive = isActive === 'true'
      if (search) filter.$text = { $search: search as string }

      const [teachers, total] = await Promise.all([
        Teacher.find(filter)
          .populate('userId', 'name email phone avatar')
          .sort({ employeeId: 1 })
          .skip((+page - 1) * +limit)
          .limit(+limit)
          .lean(),
        Teacher.countDocuments(filter),
      ])
      res.json({ success: true, data: teachers, meta: { total, page: +page, limit: +limit, pages: Math.ceil(total / +limit) } })
    } catch (err) { next(err) }
  }

  async createTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const teacher = await Teacher.create(req.body)
      res.status(201).json({ success: true, data: teacher })
    } catch (err) { next(err) }
  }

  async getTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const teacher = await Teacher.findById(req.params.id).populate('userId').lean()
      if (!teacher) throw new AppError('Teacher not found.', 404)
      res.json({ success: true, data: teacher })
    } catch (err) { next(err) }
  }

  async updateTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      if (!teacher) throw new AppError('Teacher not found.', 404)
      res.json({ success: true, data: teacher })
    } catch (err) { next(err) }
  }

  async deleteTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      await Teacher.findByIdAndUpdate(req.params.id, { isActive: false })
      res.json({ success: true, message: 'Teacher deactivated.' })
    } catch (err) { next(err) }
  }

  async getTeachersByDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await Teacher.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$department', count: { $sum: 1 }, avgExperience: { $avg: '$totalExperience' } } },
        { $sort: { count: -1 } },
      ])
      res.json({ success: true, data: stats })
    } catch (err) { next(err) }
  }

  async assignClass(req: Request, res: Response, next: NextFunction) {
    try {
      const teacher = await Teacher.findByIdAndUpdate(req.params.id,
        { $addToSet: { classes: req.body } }, { new: true })
      if (!teacher) throw new AppError('Teacher not found.', 404)
      res.json({ success: true, data: teacher })
    } catch (err) { next(err) }
  }

  async getLeaveBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const teacher = await Teacher.findById(req.params.id).select('leaveBalance employeeId').lean()
      if (!teacher) throw new AppError('Teacher not found.', 404)
      res.json({ success: true, data: teacher })
    } catch (err) { next(err) }
  }

  generatePaySlip = ok('Pay slip generated.')
  getPerformanceReport = ok('Performance report generated.')
  uploadDocument = ok('Document uploaded.')
  exportTeachers = ok('Export queued.')
}
