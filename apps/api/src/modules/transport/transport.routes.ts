import { Router } from 'express'
import { authenticate, authorize } from '../../common/guards/auth.guard'
import { TransportController } from './transport.controller'

const router = Router()
const ctrl   = new TransportController()

router.use(authenticate)

// Routes
router.get('/routes',                      ctrl.getRoutes.bind(ctrl))
router.post('/routes',                     authorize('super_admin','admin'),          ctrl.createRoute.bind(ctrl))
router.put('/routes/:id',                  authorize('super_admin','admin'),          ctrl.updateRoute.bind(ctrl))
router.delete('/routes/:id',               authorize('super_admin'),                  ctrl.deleteRoute)
router.post('/routes/:id/assign-student',  authorize('super_admin','admin'),          ctrl.assignStudentToRoute.bind(ctrl))
router.get('/routes/export',               authorize('super_admin','admin'),          ctrl.exportRoutes)

// Vehicles
router.get('/vehicles',                    ctrl.getVehicles.bind(ctrl))
router.post('/vehicles',                   authorize('super_admin','admin'),          ctrl.createVehicle.bind(ctrl))
router.put('/vehicles/:id',                authorize('super_admin','admin'),          ctrl.updateVehicle.bind(ctrl))
router.delete('/vehicles/:id',             authorize('super_admin'),                  ctrl.deleteVehicle)
router.get('/vehicles/expiring-docs',      authorize('super_admin','admin'),          ctrl.getExpiringDocuments.bind(ctrl))
router.get('/vehicles/:id/track',          ctrl.trackVehicle.bind(ctrl))

// Student lookup
router.get('/student-route',               ctrl.getStudentRoute)

export default router
