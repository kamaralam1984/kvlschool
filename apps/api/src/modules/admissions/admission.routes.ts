import { Router } from 'express'
import { authenticate, authorize } from '../../common/guards/auth.guard'
import { AdmissionController } from './admission.controller'

const router = Router()
const ctrl   = new AdmissionController()

// Public — online admission form
router.post('/apply',             ctrl.createApplication.bind(ctrl))
router.get('/check-status',       ctrl.getApplication.bind(ctrl))
router.post('/enquiries',         ctrl.createApplication.bind(ctrl))

// Authenticated
router.use(authenticate)

router.get('/',                          authorize('super_admin','principal','admin','receptionist'), ctrl.getApplications.bind(ctrl))
router.get('/stats/pipeline',            authorize('super_admin','principal','admin'),               ctrl.getPipelineStats.bind(ctrl))
router.get('/stats/seats',               ctrl.getSeatAvailability.bind(ctrl))
router.get('/export',                    authorize('super_admin','admin'),                            ctrl.exportApplications)
router.get('/:id',                       authorize('super_admin','principal','admin','receptionist'), ctrl.getApplication.bind(ctrl))
router.put('/:id/status',                authorize('super_admin','principal','admin'),               ctrl.updateStatus.bind(ctrl))
router.post('/:id/schedule-interview',   authorize('super_admin','principal','admin'),               ctrl.scheduleInterview)
router.post('/:id/send-letter',          authorize('super_admin','principal'),                        ctrl.sendAdmissionLetter)
router.post('/:id/convert-to-student',   authorize('super_admin','admin'),                            ctrl.convertToStudent)
router.post('/:id/documents',            ctrl.uploadDocument)

export default router
