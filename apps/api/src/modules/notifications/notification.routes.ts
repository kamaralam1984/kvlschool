import { Router } from 'express'
import { authenticate } from '../../common/guards/auth.guard'
import { notificationController } from './notification.controller'

const router = Router()

// Public status endpoint (no auth needed for frontend config check)
router.get('/status', notificationController.getStatus)

// All other routes require auth
router.use(authenticate)

router.get('/notices',        notificationController.listNotices)
router.post('/send',          notificationController.sendNotice)
router.post('/sms',           notificationController.sendDirectSMS)
router.post('/whatsapp',      notificationController.sendDirectWhatsApp)
router.post('/test-sms',      notificationController.testSMS)
router.post('/test-whatsapp', notificationController.testWhatsApp)

// Legacy stubs kept for backwards compatibility
router.get('/',    (_, res) => res.json({ success: true, message: 'Use /notices for notice list', data: [] }))
router.get('/:id', (_, res) => res.json({ success: true, message: 'Use /notices for notice details', data: null }))

export default router
