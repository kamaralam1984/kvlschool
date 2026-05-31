import { Router } from 'express'
import { authenticate } from '../../common/guards/auth.guard'
import { rateLimit } from 'express-rate-limit'
import { AIController } from './ai.controller'

const router = Router()
const ctrl = new AIController()

const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 20 })

router.use(authenticate)
router.use(aiLimiter)

router.post('/chat',                ctrl.chat)
router.post('/admission-assistant', ctrl.admissionAssistant)
router.get('/student/:id/analysis', ctrl.studentPerformanceAnalysis)
router.get('/predictions/attendance', ctrl.attendancePrediction)
router.get('/predictions/fees',     ctrl.feePrediction)
router.post('/marketing/email',     ctrl.generateMarketingEmail)
router.post('/marketing/social',    ctrl.generateSocialPost)
router.get('/insights/admissions',  ctrl.admissionInsights)
router.get('/insights/academic',    ctrl.academicInsights)
router.post('/document/summarize',  ctrl.summarizeDocument)
router.post('/generate-questions',  ctrl.generateQuestions)
router.post('/generate-lesson-plan', ctrl.generateLessonPlan)
router.post('/generate-circular',   ctrl.generateCircular)
router.post('/analyze-performance', ctrl.analyzePerformance)

export default router
