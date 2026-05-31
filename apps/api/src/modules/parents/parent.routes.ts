import { Router } from 'express'
import { authenticate, authorize } from '../../common/guards/auth.guard'
import { ParentController } from './parent.controller'

const router = Router()
const ctrl   = new ParentController()

router.use(authenticate)

router.get('/',                   authorize('super_admin','principal','admin'), ctrl.getParents.bind(ctrl))
router.post('/',                  authorize('super_admin','admin'),             ctrl.createParent.bind(ctrl))
router.get('/export',             authorize('super_admin','admin'),             ctrl.exportParents)
router.post('/bulk-notify',       authorize('super_admin','admin'),             ctrl.bulkNotify)
router.get('/:id',                ctrl.getParent.bind(ctrl))
router.put('/:id',                authorize('super_admin','admin'),             ctrl.updateParent.bind(ctrl))
router.get('/:id/children',       ctrl.getChildrenDetails.bind(ctrl))
router.post('/:id/message',       ctrl.sendMessage.bind(ctrl))
router.get('/:id/notifications',  ctrl.getNotifications.bind(ctrl))

export default router
