import { Router } from 'express'
import { authenticate, authorize, requirePermission } from '../../common/guards/auth.guard'
import { ExamController } from './exam.controller'

const router = Router()
const ctrl = new ExamController()

router.use(authenticate)

// Question bank
router.get('/questions',              requirePermission('exam:view'), ctrl.getQuestions)
router.post('/questions',             requirePermission('exam:create'), ctrl.createQuestion)
router.post('/questions/bulk-import', requirePermission('exam:create'), ctrl.bulkImportQuestions)
router.put('/questions/:id',          requirePermission('exam:edit'), ctrl.updateQuestion)
router.delete('/questions/:id',       requirePermission('exam:delete'), ctrl.deleteQuestion)

// Exams
router.get('/',                       ctrl.getExams)
router.post('/',                      requirePermission('exam:create'), ctrl.createExam)
router.get('/:id',                    ctrl.getExam)
router.put('/:id',                    requirePermission('exam:edit'), ctrl.updateExam)
router.post('/:id/publish',           requirePermission('exam:publish'), ctrl.publishExam)

// Student-facing exam routes
router.post('/:id/start',             ctrl.startExam)
router.post('/:id/submit',            ctrl.submitExam)
router.get('/:id/result',             ctrl.getExamResult)
router.get('/my/attempts',            ctrl.getMyAttempts)

// Offline exam management
router.post('/:id/seat-allocation',   requirePermission('exam:manage'), ctrl.allocateSeats)
router.get('/:id/hall-tickets',       requirePermission('exam:view'), ctrl.generateHallTickets)
router.post('/:id/attendance',        requirePermission('exam:manage'), ctrl.markExamAttendance)

// Results & report cards
router.post('/:id/evaluate',          requirePermission('exam:evaluate'), ctrl.evaluateExam)
router.get('/report-cards',           requirePermission('exam:view'), ctrl.getReportCards)
router.post('/report-cards/generate', requirePermission('exam:manage'), ctrl.generateReportCards)
router.post('/report-cards/:id/publish', requirePermission('exam:publish'), ctrl.publishReportCard)
router.get('/report-cards/:id/download', ctrl.downloadReportCard)

// Merit lists
router.get('/:id/merit-list',         requirePermission('exam:view'), ctrl.getMeritList)
router.get('/analytics',              requirePermission('exam:analytics'), ctrl.getExamAnalytics)

export default router
