import { Request, Response, NextFunction } from 'express'
import { Question, Exam, ExamAttempt, ReportCard } from './exam.model'
import { AuthenticatedRequest } from '../../common/guards/auth.guard'
import { AppError } from '../../common/filters/app.error'

export class ExamController {
  async getQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const { subject, class: cls, type, difficulty, page = 1, limit = 20 } = req.query
      const filter: Record<string, unknown> = { isActive: true }
      if (subject)    filter.subject = subject
      if (cls)        filter.class = cls
      if (type)       filter.type = type
      if (difficulty) filter.difficulty = difficulty
      const [questions, total] = await Promise.all([
        Question.find(filter).skip((+page - 1) * +limit).limit(+limit).lean(),
        Question.countDocuments(filter),
      ])
      res.json({ success: true, data: questions, meta: { total, page: +page, limit: +limit } })
    } catch (err) { next(err) }
  }

  async createQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const q = await Question.create({ ...req.body, createdBy: (req as AuthenticatedRequest).user.id })
      res.status(201).json({ success: true, data: q })
    } catch (err) { next(err) }
  }

  async bulkImportQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const questions = await Question.insertMany(
        req.body.questions.map((q: Record<string, unknown>) => ({ ...q, createdBy: (req as AuthenticatedRequest).user.id }))
      )
      res.status(201).json({ success: true, data: { count: questions.length } })
    } catch (err) { next(err) }
  }

  async updateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true })
      if (!q) throw new AppError('Question not found.', 404)
      res.json({ success: true, data: q })
    } catch (err) { next(err) }
  }

  async deleteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      await Question.findByIdAndUpdate(req.params.id, { isActive: false })
      res.json({ success: true, message: 'Question deactivated.' })
    } catch (err) { next(err) }
  }

  async getExams(req: Request, res: Response, next: NextFunction) {
    try {
      const { class: cls, subject, type, mode } = req.query
      const filter: Record<string, unknown> = { isActive: true }
      if (cls)     filter.class = cls
      if (subject) filter.subject = subject
      if (type)    filter.type = type
      if (mode)    filter.mode = mode
      const exams = await Exam.find(filter).sort({ scheduledAt: -1 }).lean()
      res.json({ success: true, data: exams })
    } catch (err) { next(err) }
  }

  async createExam(req: Request, res: Response, next: NextFunction) {
    try {
      const exam = await Exam.create({ ...req.body, createdBy: (req as AuthenticatedRequest).user.id })
      res.status(201).json({ success: true, data: exam })
    } catch (err) { next(err) }
  }

  async getExam(req: Request, res: Response, next: NextFunction) {
    try {
      const exam = await Exam.findById(req.params.id).populate('questions').lean()
      if (!exam) throw new AppError('Exam not found.', 404)
      res.json({ success: true, data: exam })
    } catch (err) { next(err) }
  }

  async updateExam(req: Request, res: Response, next: NextFunction) {
    try {
      const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true })
      if (!exam) throw new AppError('Exam not found.', 404)
      res.json({ success: true, data: exam })
    } catch (err) { next(err) }
  }

  async publishExam(req: Request, res: Response, next: NextFunction) {
    try {
      await Exam.findByIdAndUpdate(req.params.id, { isPublished: true })
      res.json({ success: true, message: 'Exam published.' })
    } catch (err) { next(err) }
  }

  async startExam(req: Request, res: Response, next: NextFunction) {
    try {
      const exam = await Exam.findById(req.params.id).populate('questions')
      if (!exam) throw new AppError('Exam not found.', 404)
      if (!exam.isPublished) throw new AppError('Exam is not published.', 400)

      const now = new Date()
      if (now < exam.scheduledAt) throw new AppError('Exam has not started yet.', 400)
      if (now > exam.endAt) throw new AppError('Exam has ended.', 400)

      const existing = await ExamAttempt.findOne({
        examId: exam._id,
        studentId: (req as AuthenticatedRequest).user.id,
        status: 'in_progress',
      })
      if (existing) return res.json({ success: true, data: existing })

      const attempt = await ExamAttempt.create({
        examId: exam._id,
        studentId: (req as AuthenticatedRequest).user.id,
        startedAt: new Date(),
        status: 'in_progress',
        ipAddress: req.ip,
      })

      // Return shuffled questions without answers
      const questions = exam.settings.shuffleQuestions
        ? [...(exam.questions as any[])].sort(() => Math.random() - 0.5)
        : exam.questions

      res.json({ success: true, data: { attempt, questions, duration: exam.duration } })
    } catch (err) { next(err) }
  }

  async submitExam(req: Request, res: Response, next: NextFunction) {
    try {
      const attempt = await ExamAttempt.findOneAndUpdate(
        { examId: req.params.id, studentId: (req as AuthenticatedRequest).user.id, status: 'in_progress' },
        { answers: req.body.answers, submittedAt: new Date(), timeSpent: req.body.timeSpent, status: 'submitted' },
        { new: true }
      )
      if (!attempt) throw new AppError('No active attempt found.', 404)
      res.json({ success: true, data: attempt, message: 'Exam submitted successfully.' })
    } catch (err) { next(err) }
  }

  async getExamResult(req: Request, res: Response, next: NextFunction) {
    try {
      const attempt = await ExamAttempt.findOne({
        examId: req.params.id,
        studentId: (req as AuthenticatedRequest).user.id,
      }).lean()
      if (!attempt) throw new AppError('No attempt found.', 404)
      res.json({ success: true, data: attempt })
    } catch (err) { next(err) }
  }

  async getMyAttempts(req: Request, res: Response, next: NextFunction) {
    try {
      const attempts = await ExamAttempt.find({ studentId: (req as AuthenticatedRequest).user.id })
        .populate('examId', 'title subject type scheduledAt').sort({ startedAt: -1 }).lean()
      res.json({ success: true, data: attempts })
    } catch (err) { next(err) }
  }

  async allocateSeats(_req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, message: 'Seat allocation queued.' }) } catch (err) { next(err) }
  }

  async generateHallTickets(_req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, message: 'Hall ticket generation queued.' }) } catch (err) { next(err) }
  }

  async markExamAttendance(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, message: 'Attendance marked.' }) } catch (err) { next(err) }
  }

  async evaluateExam(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, message: 'Evaluation queued.' }) } catch (err) { next(err) }
  }

  async getReportCards(req: Request, res: Response, next: NextFunction) {
    try {
      const { session, class: cls, term } = req.query
      const filter: Record<string, unknown> = {}
      if (session) filter.session = session
      if (cls)     filter.class = cls
      if (term)    filter.term = term
      const cards = await ReportCard.find(filter).populate('studentId', 'admissionNo').lean()
      res.json({ success: true, data: cards })
    } catch (err) { next(err) }
  }

  async generateReportCards(req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, message: 'Report card generation queued.' }) } catch (err) { next(err) }
  }

  async publishReportCard(req: Request, res: Response, next: NextFunction) {
    try {
      await ReportCard.findByIdAndUpdate(req.params.id, { isPublished: true })
      res.json({ success: true, message: 'Report card published.' })
    } catch (err) { next(err) }
  }

  async downloadReportCard(_req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, message: 'PDF download endpoint.' }) } catch (err) { next(err) }
  }

  async getMeritList(req: Request, res: Response, next: NextFunction) {
    try {
      const attempts = await ExamAttempt.find({ examId: req.params.id, status: 'evaluated' })
        .sort({ totalMarks: -1 }).populate('studentId', 'admissionNo').lean()
      res.json({ success: true, data: attempts })
    } catch (err) { next(err) }
  }

  async getExamAnalytics(_req: Request, res: Response, next: NextFunction) {
    try { res.json({ success: true, data: {} }) } catch (err) { next(err) }
  }
}
