import { Router } from 'express'
import { authenticate, authorize } from '../../common/guards/auth.guard'
import { HostelController } from './hostel.controller'

const router = Router()
const ctrl   = new HostelController()

router.use(authenticate)

// Rooms
router.get('/rooms',                          ctrl.getRooms.bind(ctrl))
router.post('/rooms',                         authorize('super_admin','admin','hostel_manager'), ctrl.createRoom.bind(ctrl))
router.put('/rooms/:id',                      authorize('super_admin','admin','hostel_manager'), ctrl.updateRoom.bind(ctrl))
router.post('/rooms/:id/assign',              authorize('super_admin','admin','hostel_manager'), ctrl.assignResident.bind(ctrl))
router.get('/rooms/stats',                    ctrl.getOccupancyStats)

// Residents
router.get('/residents',                      authorize('super_admin','admin','hostel_manager'), ctrl.getResidents.bind(ctrl))
router.put('/residents/:residentId/vacate',   authorize('super_admin','admin','hostel_manager'), ctrl.vacateResident.bind(ctrl))
router.get('/residents/export',               authorize('super_admin','admin'),                  ctrl.exportResidents)

// Complaints
router.get('/complaints',                     ctrl.getComplaints.bind(ctrl))
router.post('/complaints',                    ctrl.createComplaint.bind(ctrl))
router.put('/complaints/:id',                 authorize('super_admin','admin','hostel_manager'), ctrl.updateComplaint.bind(ctrl))

export default router
