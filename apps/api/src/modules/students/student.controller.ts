import { Request, Response, NextFunction } from 'express'
import { Student } from './student.model'
import { AppError } from '../../common/filters/app.error'

const stub = (msg: string) => (_req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, message: msg }) } catch (e) { next(e) }
}

export class StudentController {
  async getStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const { class: cls, section, session, search, page = 1, limit = 20, isActive } = req.query
      const filter: Record<string, unknown> = {}
      if (cls)      filter.class = cls
      if (section)  filter.section = section
      if (session)  filter.session = session
      if (isActive !== undefined) filter.isActive = isActive === 'true'

      const [students, total] = await Promise.all([
        Student.find(filter).populate('userId', 'name email phone avatar')
          .sort({ admissionNo: 1 })
          .skip((+page - 1) * +limit)
          .limit(+limit)
          .lean(),
        Student.countDocuments(filter),
      ])
      res.json({ success: true, data: students, meta: { total, page: +page, limit: +limit, pages: Math.ceil(total / +limit) } })
    } catch (err) { next(err) }
  }

  async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await Student.create(req.body)
      res.status(201).json({ success: true, data: student })
    } catch (err) { next(err) }
  }

  async getStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await Student.findById(req.params.id).populate('userId').lean()
      if (!student) throw new AppError('Student not found.', 404)
      res.json({ success: true, data: student })
    } catch (err) { next(err) }
  }

  async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      if (!student) throw new AppError('Student not found.', 404)
      res.json({ success: true, data: student })
    } catch (err) { next(err) }
  }

  async deleteStudent(req: Request, res: Response, next: NextFunction) {
    try {
      await Student.findByIdAndUpdate(req.params.id, { isActive: false })
      res.json({ success: true, message: 'Student deactivated.' })
    } catch (err) { next(err) }
  }

  generateIdCard = stub('ID card generation queued.')
  getAttendance  = stub('Attendance records.')
  markBulkAttendance = stub('Attendance marked.')
  promoteStudents = stub('Promotion queued.')
  transferStudent = stub('Transfer processed.')
  generateTC      = stub('Transfer certificate generated.')
  uploadDocument  = stub('Document uploaded.')
  getDocuments    = stub('Documents list.')
  getStudentAnalytics = stub('Analytics data.')
  exportStudents  = stub('Export queued.')
  bulkImport      = stub('Bulk import queued.')
}
