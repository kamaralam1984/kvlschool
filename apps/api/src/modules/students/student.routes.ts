import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { validate } from '../../common/pipes/validate'
import { authenticate, authorize, requirePermission } from '../../common/guards/auth.guard'
import { StudentController } from './student.controller'
import multer from 'multer'

const router = Router()
const ctrl = new StudentController()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

router.use(authenticate)

// CRUD
router.get('/',           requirePermission('students:view'), ctrl.getStudents)
router.post('/',          requirePermission('students:create'), ctrl.createStudent)
router.get('/:id',        requirePermission('students:view'), ctrl.getStudent)
router.put('/:id',        requirePermission('students:edit'), ctrl.updateStudent)
router.delete('/:id',     authorize('super_admin','principal'), ctrl.deleteStudent)

// ID Card
router.get('/:id/id-card',     ctrl.generateIdCard)

// Attendance
router.get('/:id/attendance',  ctrl.getAttendance)
router.post('/attendance/bulk', requirePermission('attendance:mark'), ctrl.markBulkAttendance)

// Transfer / Promotion
router.post('/promote',        authorize('super_admin','principal','admin'), ctrl.promoteStudents)
router.post('/:id/transfer',   authorize('super_admin','principal'), ctrl.transferStudent)
router.post('/:id/tc',         authorize('super_admin','principal'), ctrl.generateTC)

// Documents
router.post('/:id/documents',  upload.single('file'), ctrl.uploadDocument)
router.get('/:id/documents',   ctrl.getDocuments)

// Analytics
router.get('/:id/analytics',   ctrl.getStudentAnalytics)
router.get('/export',          requirePermission('students:export'), ctrl.exportStudents)

// Bulk import
router.post('/bulk-import',    authorize('super_admin','admin'), upload.single('file'), ctrl.bulkImport)

export default router
