import { Router } from 'express'
import { authenticate, authorize } from '../../common/guards/auth.guard'
import { LMSController } from './lms.controller'

const router = Router()
const ctrl   = new LMSController()

router.use(authenticate)

// Courses
router.get('/courses',                    ctrl.getCourses.bind(ctrl))
router.post('/courses',                   authorize('teacher','admin','super_admin'), ctrl.createCourse.bind(ctrl))
router.get('/courses/:id',                ctrl.getCourse.bind(ctrl))
router.put('/courses/:id',                authorize('teacher','admin','super_admin'), ctrl.updateCourse.bind(ctrl))
router.delete('/courses/:id',             authorize('teacher','admin','super_admin'), ctrl.deleteCourse)
router.post('/courses/:id/lessons',       authorize('teacher','admin','super_admin'), ctrl.addLesson.bind(ctrl))
router.post('/courses/:id/enroll',        ctrl.enrollStudent.bind(ctrl))
router.get('/courses/:id/progress',       ctrl.exportProgress)
router.post('/courses/:id/rate',          ctrl.rateLesson)

// Live classes
router.get('/live',                       ctrl.getLiveClasses.bind(ctrl))
router.post('/live',                      authorize('teacher','admin','super_admin'), ctrl.scheduleLiveClass.bind(ctrl))
router.post('/live/:id/start',            authorize('teacher','admin','super_admin'), ctrl.startLiveClass.bind(ctrl))
router.post('/live/:id/end',              authorize('teacher','admin','super_admin'), ctrl.endLiveClass.bind(ctrl))

export default router
