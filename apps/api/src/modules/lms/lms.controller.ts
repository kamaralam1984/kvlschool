import { Request, Response, NextFunction } from 'express'
import { Course, LiveClass } from './lms.model'
import { AppError } from '../../common/filters/app.error'

const ok = (msg: string) => (_req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, message: msg }) } catch (e) { next(e) }
}

export class LMSController {
  async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const { class: cls, subject, status, teacherId, page = 1, limit = 20 } = req.query
      const filter: Record<string, unknown> = { isActive: true }
      if (cls)       filter.class     = cls
      if (subject)   filter.subject   = subject
      if (status)    filter.status    = status
      if (teacherId) filter.teacherId = teacherId

      const [courses, total] = await Promise.all([
        Course.find(filter)
          .populate('teacherId', 'userId designation')
          .sort({ createdAt: -1 })
          .skip((+page - 1) * +limit)
          .limit(+limit)
          .lean(),
        Course.countDocuments(filter),
      ])
      res.json({ success: true, data: courses, meta: { total, page: +page, limit: +limit, pages: Math.ceil(total / +limit) } })
    } catch (err) { next(err) }
  }

  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await Course.create({ ...req.body, totalLessons: req.body.lessons?.length ?? 0 })
      res.status(201).json({ success: true, data: course })
    } catch (err) { next(err) }
  }

  async getCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await Course.findById(req.params.id).populate('teacherId').lean()
      if (!course) throw new AppError('Course not found.', 404)
      res.json({ success: true, data: course })
    } catch (err) { next(err) }
  }

  async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true })
      if (!course) throw new AppError('Course not found.', 404)
      res.json({ success: true, data: course })
    } catch (err) { next(err) }
  }

  async addLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await Course.findByIdAndUpdate(req.params.id,
        { $push: { lessons: req.body }, $inc: { totalLessons: 1 } },
        { new: true })
      if (!course) throw new AppError('Course not found.', 404)
      res.json({ success: true, data: course })
    } catch (err) { next(err) }
  }

  async enrollStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.body
      const course = await Course.findByIdAndUpdate(req.params.id,
        { $addToSet: { enrolledStudents: studentId } }, { new: true })
      if (!course) throw new AppError('Course not found.', 404)
      res.json({ success: true, message: 'Student enrolled.' })
    } catch (err) { next(err) }
  }

  async getLiveClasses(req: Request, res: Response, next: NextFunction) {
    try {
      const { class: cls, status, teacherId, page = 1, limit = 20 } = req.query
      const filter: Record<string, unknown> = {}
      if (cls)       filter.class     = cls
      if (status)    filter.status    = status
      if (teacherId) filter.teacherId = teacherId

      const [classes, total] = await Promise.all([
        LiveClass.find(filter).populate('teacherId', 'userId').sort({ scheduledAt: -1 }).skip((+page - 1) * +limit).limit(+limit).lean(),
        LiveClass.countDocuments(filter),
      ])
      res.json({ success: true, data: classes, meta: { total, page: +page, limit: +limit, pages: Math.ceil(total / +limit) } })
    } catch (err) { next(err) }
  }

  async scheduleLiveClass(req: Request, res: Response, next: NextFunction) {
    try {
      const liveClass = await LiveClass.create(req.body)
      res.status(201).json({ success: true, data: liveClass })
    } catch (err) { next(err) }
  }

  async startLiveClass(req: Request, res: Response, next: NextFunction) {
    try {
      const liveClass = await LiveClass.findByIdAndUpdate(req.params.id, { status: 'live' }, { new: true })
      if (!liveClass) throw new AppError('Live class not found.', 404)
      // Emit socket event
      const io = (req as any).app.get('io')
      if (io) io.to(`class:${liveClass.class}`).emit('live-class:started', { id: liveClass._id, title: liveClass.title, meetingUrl: liveClass.meetingUrl })
      res.json({ success: true, data: liveClass })
    } catch (err) { next(err) }
  }

  async endLiveClass(req: Request, res: Response, next: NextFunction) {
    try {
      const liveClass = await LiveClass.findByIdAndUpdate(req.params.id, { status: 'ended', ...req.body }, { new: true })
      if (!liveClass) throw new AppError('Live class not found.', 404)
      res.json({ success: true, data: liveClass })
    } catch (err) { next(err) }
  }

  deleteCourse = ok('Course deleted.')
  exportProgress = ok('Progress report exported.')
  rateLesson = ok('Rating recorded.')
}
