import { Router } from 'express'
import { authenticate, authorize } from '../../common/guards/auth.guard'
import { v4 as uuid } from 'uuid'

const router = Router()
const ok = (msg: string) => (_: any, res: any) => res.json({ success: true, message: msg })

router.use(authenticate)

// ─── Live Class Sessions ───────────────────────────────────
router.post('/sessions', authorize('teacher','admin','super_admin'), (req, res) => {
  const { title, class: cls, subject } = req.body
  const sessionId  = uuid()
  const meetingUrl = `${process.env.JITSI_URL ?? 'https://meet.jit.si'}/kvl-${sessionId}`
  res.status(201).json({
    success:  true,
    data:     { sessionId, meetingUrl, title, class: cls, subject, startedAt: new Date() },
  })
})

router.get('/sessions', (req, res) => {
  const { class: cls, status } = req.query
  res.json({ success: true, data: [], message: `Active streams for class ${cls ?? 'all'}.` })
})

router.get('/sessions/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      sessionId:  req.params.id,
      status:     'live',
      meetingUrl: `${process.env.JITSI_URL ?? 'https://meet.jit.si'}/kvl-${req.params.id}`,
      attendees:  0,
    },
  })
})

router.post('/sessions/:id/end', authorize('teacher','admin','super_admin'), (req, res) => {
  const io = (req as any).app.get('io')
  if (io) io.to(`session:${req.params.id}`).emit('stream:ended', { sessionId: req.params.id })
  res.json({ success: true, message: 'Live session ended.' })
})

router.post('/sessions/:id/join', (req, res) => {
  const io = (req as any).app.get('io')
  if (io) io.to(`session:${req.params.id}`).emit('stream:viewer-joined', { userId: (req as any).user?.id })
  res.json({ success: true, message: 'Joined session.', data: { joinUrl: `${process.env.JITSI_URL ?? 'https://meet.jit.si'}/kvl-${req.params.id}` } })
})

// ─── Recordings ────────────────────────────────────────────
router.get('/recordings',           (req, res) => {
  res.json({ success: true, data: [], message: 'Recordings list.' })
})

router.get('/recordings/:id',       (req, res) => {
  res.json({ success: true, data: { id: req.params.id, url: null, status: 'processing' } })
})

router.delete('/recordings/:id',    authorize('teacher','admin','super_admin'), ok('Recording deleted.'))

// ─── WebRTC signalling (SDP/ICE relay) ────────────────────
router.post('/signal', (req, res) => {
  const io = (req as any).app.get('io')
  const { targetId, signal } = req.body
  if (io && targetId) io.to(targetId).emit('stream:signal', { from: (req as any).user?.id, signal })
  res.json({ success: true, message: 'Signal relayed.' })
})

export default router
