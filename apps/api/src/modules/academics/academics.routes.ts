import { Router } from 'express'
import { authenticate, authorize } from '../../common/guards/auth.guard'
import { Subject, ClassSection, Timetable, Homework } from './academics.model'
import { AppError } from '../../common/filters/app.error'

const router = Router()
const ok = (msg: string) => (_: any, res: any) => res.json({ success: true, message: msg })

router.use(authenticate)

// ─── Subjects ─────────────────────────────────────────────
router.get('/subjects', async (req, res, next) => {
  try {
    const { class: cls, type } = req.query
    const filter: any = { isActive: true }
    if (cls)  filter.classes = cls
    if (type) filter.type    = type
    const subjects = await Subject.find(filter).sort({ name: 1 }).lean()
    res.json({ success: true, data: subjects })
  } catch (err) { next(err) }
})
router.post('/subjects',    authorize('super_admin','admin'), async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await Subject.create(req.body) }) } catch (err) { next(err) }
})
router.put('/subjects/:id', authorize('super_admin','admin'), async (req, res, next) => {
  try {
    const s = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!s) throw new AppError('Subject not found.', 404)
    res.json({ success: true, data: s })
  } catch (err) { next(err) }
})
router.delete('/subjects/:id', authorize('super_admin','admin'), async (req, res, next) => {
  try { await Subject.findByIdAndUpdate(req.params.id, { isActive: false }); res.json({ success: true }) } catch (err) { next(err) }
})

// ─── Classes / Sections ────────────────────────────────────
router.get('/classes', async (req, res, next) => {
  try {
    const { session } = req.query
    const filter: any = { isActive: true }
    if (session) filter.session = session
    const classes = await ClassSection.find(filter)
      .populate('classTeacherId', 'userId')
      .populate('subjects.subjectId subjects.teacherId')
      .sort({ name: 1, section: 1 }).lean()
    res.json({ success: true, data: classes })
  } catch (err) { next(err) }
})
router.post('/classes',    authorize('super_admin','admin'), async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await ClassSection.create(req.body) }) } catch (err) { next(err) }
})
router.put('/classes/:id', authorize('super_admin','admin'), async (req, res, next) => {
  try {
    const c = await ClassSection.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!c) throw new AppError('Class not found.', 404)
    res.json({ success: true, data: c })
  } catch (err) { next(err) }
})

// ─── Timetable ─────────────────────────────────────────────
router.get('/timetable', async (req, res, next) => {
  try {
    const { class: cls, section, session } = req.query
    const filter: any = { isActive: true }
    if (cls)     filter.class   = cls
    if (section) filter.section = section
    if (session) filter.session = session
    const tt = await Timetable.find(filter)
      .populate('schedule.periods.subjectId', 'name code')
      .populate('schedule.periods.teacherId', 'userId')
      .lean()
    res.json({ success: true, data: tt })
  } catch (err) { next(err) }
})
router.post('/timetable',    authorize('super_admin','admin','principal'), async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await Timetable.create(req.body) }) } catch (err) { next(err) }
})
router.put('/timetable/:id', authorize('super_admin','admin','principal'), async (req, res, next) => {
  try {
    const tt = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!tt) throw new AppError('Timetable not found.', 404)
    res.json({ success: true, data: tt })
  } catch (err) { next(err) }
})

// ─── Homework ───────────────────────────────────────────────
router.get('/homework', async (req, res, next) => {
  try {
    const { class: cls, section, subject } = req.query
    const filter: any = { isActive: true }
    if (cls)     filter.class   = cls
    if (section) filter.section = section
    if (subject) filter.subject = subject
    const hw = await Homework.find(filter).sort({ dueDate: 1 }).lean()
    res.json({ success: true, data: hw })
  } catch (err) { next(err) }
})
router.post('/homework',    authorize('teacher','admin','super_admin'), async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await Homework.create({ ...req.body, teacherId: (req as any).user?.id }) }) } catch (err) { next(err) }
})
router.post('/homework/:id/submit', async (req, res, next) => {
  try {
    const hw = await Homework.findByIdAndUpdate(req.params.id,
      { $push: { submissions: { studentId: (req as any).user?.id, submittedAt: new Date(), ...req.body } } },
      { new: true })
    if (!hw) throw new AppError('Homework not found.', 404)
    res.json({ success: true, data: hw })
  } catch (err) { next(err) }
})
router.put('/homework/:id/grade/:studentId', authorize('teacher','admin','super_admin'), async (req, res, next) => {
  try {
    const hw = await Homework.findOneAndUpdate(
      { _id: req.params.id, 'submissions.studentId': req.params.studentId },
      { $set: { 'submissions.$.marks': req.body.marks, 'submissions.$.feedback': req.body.feedback } },
      { new: true })
    if (!hw) throw new AppError('Not found.', 404)
    res.json({ success: true, data: hw })
  } catch (err) { next(err) }
})

// ─── Calendar ──────────────────────────────────────────────
router.get('/calendar',     ok('Academic calendar events.'))
router.post('/calendar',    authorize('super_admin','admin','principal'), ok('Event added to calendar.'))
router.delete('/calendar/:id', authorize('super_admin','admin'), ok('Event removed.'))

export default router
