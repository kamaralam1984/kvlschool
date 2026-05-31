import { Router } from 'express'
import { AttendanceController } from './attendance.controller'
import { authenticate } from '../../common/guards/auth.guard'

const router = Router()
const ctrl   = new AttendanceController()

router.use(authenticate)

router.post('/',                       ctrl.markAttendance.bind(ctrl))
router.get('/',                        ctrl.getAttendance.bind(ctrl))
router.get('/summary',                 ctrl.getClassAttendanceSummary.bind(ctrl))
router.get('/monthly-report',          ctrl.getMonthlyReport.bind(ctrl))
router.get('/export',                  ctrl.exportAttendance)
router.post('/lock',                   ctrl.lockAttendance.bind(ctrl))
router.post('/notify-absent',          ctrl.notifyAbsentParents)
router.get('/student/:studentId',      ctrl.getStudentAttendance.bind(ctrl))

export default router
