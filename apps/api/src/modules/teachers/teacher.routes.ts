import { Router } from 'express'
import { authenticate, authorize } from '../../common/guards/auth.guard'
import { TeacherController } from './teacher.controller'

const router = Router()
const ctrl   = new TeacherController()

router.use(authenticate)

router.get('/',                     authorize('super_admin','principal','admin'), ctrl.getTeachers.bind(ctrl))
router.post('/',                    authorize('super_admin','admin'),             ctrl.createTeacher.bind(ctrl))
router.get('/departments',          ctrl.getTeachersByDepartment.bind(ctrl))
router.get('/export',               authorize('super_admin','admin'),             ctrl.exportTeachers)
router.get('/:id',                  ctrl.getTeacher.bind(ctrl))
router.put('/:id',                  authorize('super_admin','admin'),             ctrl.updateTeacher.bind(ctrl))
router.delete('/:id',               authorize('super_admin'),                    ctrl.deleteTeacher.bind(ctrl))
router.post('/:id/assign-class',    authorize('super_admin','admin'),             ctrl.assignClass.bind(ctrl))
router.get('/:id/leave-balance',    ctrl.getLeaveBalance.bind(ctrl))
router.get('/:id/payslip',          ctrl.generatePaySlip)
router.get('/:id/performance',      authorize('super_admin','principal'),         ctrl.getPerformanceReport)
router.post('/:id/documents',       ctrl.uploadDocument)

export default router
