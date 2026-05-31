import { Router } from 'express'
import { authenticate, authorize } from '../../common/guards/auth.guard'
import { AnalyticsController } from './analytics.controller'

const router = Router()
const ctrl   = new AnalyticsController()

router.use(authenticate)

router.get('/dashboard',        ctrl.getDashboardStats.bind(ctrl))
router.get('/attendance',       ctrl.getAttendanceAnalytics.bind(ctrl))
router.get('/class-performance',ctrl.getClassPerformance.bind(ctrl))
router.get('/fees',             ctrl.getFeeAnalytics.bind(ctrl))
router.get('/teachers',         authorize('super_admin','principal','admin'), ctrl.getTeacherAnalytics.bind(ctrl))
router.get('/student-growth',   ctrl.getStudentGrowth.bind(ctrl))
router.get('/report/:type',     authorize('super_admin','principal','admin'), ctrl.generateReport.bind(ctrl))

export default router
