import { Router } from 'express'
import { authenticate, authorize } from '../../common/guards/auth.guard'
import { HRController } from './hr.controller'

const router = Router()
const ctrl   = new HRController()

router.use(authenticate)

// Leave
router.get('/leaves',                    authorize('super_admin','principal','admin','hr'), ctrl.getLeaveRequests.bind(ctrl))
router.post('/leaves',                   ctrl.applyLeave.bind(ctrl))
router.put('/leaves/:id/approve',        authorize('super_admin','principal','admin','hr'), ctrl.approveLeave.bind(ctrl))
router.get('/leaves/stats',              authorize('super_admin','principal','admin','hr'), ctrl.getLeaveStats.bind(ctrl))
router.get('/leaves/export',             authorize('super_admin','admin','hr'),             ctrl.exportLeaves)

// Payroll
router.get('/payroll',                   authorize('super_admin','admin','hr','accountant'), ctrl.getPayroll.bind(ctrl))
router.post('/payroll',                  authorize('super_admin','admin','hr'),              ctrl.processPayroll.bind(ctrl))
router.put('/payroll/:id/approve',       authorize('super_admin','principal','admin'),       ctrl.approvePayroll.bind(ctrl))
router.get('/payroll/:id/payslip',       ctrl.getPaySlip.bind(ctrl))
router.get('/payroll/:id/payslip/pdf',   ctrl.generatePaySlipPDF)
router.post('/payroll/bulk',             authorize('super_admin','admin','hr'),              ctrl.bulkProcessPayroll)
router.get('/payroll/export',            authorize('super_admin','admin','hr','accountant'), ctrl.exportPayroll)

export default router
