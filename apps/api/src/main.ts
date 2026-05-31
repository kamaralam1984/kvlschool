import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import { createServer } from 'http'
import { Server as SocketIO } from 'socket.io'
import { rateLimit } from 'express-rate-limit'

import { connectMongoDB } from './database/mongodb'
import { connectRedis } from './database/redis'
import { logger } from './config/logger'
import { errorHandler } from './common/filters/error.handler'
import { requestLogger } from './common/interceptors/request.logger'

// Route imports
import authRoutes from './modules/auth/auth.routes'
import studentRoutes from './modules/students/student.routes'
import teacherRoutes from './modules/teachers/teacher.routes'
import parentRoutes from './modules/parents/parent.routes'
import admissionRoutes from './modules/admissions/admission.routes'
import academicsRoutes from './modules/academics/academics.routes'
import attendanceRoutes from './modules/attendance/attendance.routes'
import examRoutes from './modules/exams/exam.routes'
import financeRoutes from './modules/finance/finance.routes'
import libraryRoutes from './modules/library/library.routes'
import transportRoutes from './modules/transport/transport.routes'
import hostelRoutes from './modules/hostel/hostel.routes'
import hrRoutes from './modules/hr/hr.routes'
import ecommerceRoutes from './modules/ecommerce/ecommerce.routes'
import lmsRoutes from './modules/lms/lms.routes'
import streamingRoutes from './modules/streaming/streaming.routes'
import analyticsRoutes from './modules/analytics/analytics.routes'
import notificationRoutes from './modules/notifications/notification.routes'
import aiRoutes from './modules/ai/ai.routes'
import userRoutes from './modules/users/user.routes'

const app = express()
const httpServer = createServer(app)

// Socket.IO for real-time features
const io = new SocketIO(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3000'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})

// ─── Middleware ────────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}))

app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))

app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }))
app.use(requestLogger)

// Global rate limiter
app.use(rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX ?? '100'),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
}))

// ─── Health Check ──────────────────────────────────────────
app.get('/health', (_, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '1.0.0',
    environment: process.env.NODE_ENV,
  })
})

// ─── API Routes ────────────────────────────────────────────
const API = '/api/v1'

app.use(`${API}/auth`,          authRoutes)
app.use(`${API}/users`,         userRoutes)
app.use(`${API}/students`,      studentRoutes)
app.use(`${API}/teachers`,      teacherRoutes)
app.use(`${API}/parents`,       parentRoutes)
app.use(`${API}/admissions`,    admissionRoutes)
app.use(`${API}/academics`,     academicsRoutes)
app.use(`${API}/attendance`,    attendanceRoutes)
app.use(`${API}/exams`,         examRoutes)
app.use(`${API}/finance`,       financeRoutes)
app.use(`${API}/library`,       libraryRoutes)
app.use(`${API}/transport`,     transportRoutes)
app.use(`${API}/hostel`,        hostelRoutes)
app.use(`${API}/hr`,            hrRoutes)
app.use(`${API}/ecommerce`,     ecommerceRoutes)
app.use(`${API}/lms`,           lmsRoutes)
app.use(`${API}/streaming`,     streamingRoutes)
app.use(`${API}/analytics`,     analyticsRoutes)
app.use(`${API}/notifications`, notificationRoutes)
app.use(`${API}/ai`,            aiRoutes)

// ─── Socket.IO handlers ────────────────────────────────────
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`)

  socket.on('join-room', (room: string) => socket.join(room))
  socket.on('leave-room', (room: string) => socket.leave(room))

  // Live class events
  socket.on('live-class:message', (data) => {
    socket.to(data.classId).emit('live-class:message', { ...data, from: socket.id })
  })

  // Attendance
  socket.on('attendance:mark', (data) => {
    io.to('teachers').emit('attendance:update', data)
  })

  // Notifications
  socket.on('notification:read', (notificationId) => {
    logger.debug(`Notification ${notificationId} marked as read by ${socket.id}`)
  })

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`)
  })
})

// Attach io to app for route access
app.set('io', io)

// ─── Error Handler ─────────────────────────────────────────
app.use(errorHandler)

// 404
app.use((_, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' })
})

// ─── Start Server ──────────────────────────────────────────
async function bootstrap() {
  try {
    await connectMongoDB()
    await connectRedis()

    const PORT = parseInt(process.env.PORT ?? '4000')
    httpServer.listen(PORT, () => {
      logger.info(`🚀 KVL School API running on http://localhost:${PORT}`)
      logger.info(`📡 WebSocket server running on ws://localhost:${PORT}`)
      logger.info(`🌍 Environment: ${process.env.NODE_ENV}`)
    })
  } catch (err) {
    logger.error('Failed to start server:', err)
    process.exit(1)
  }
}

bootstrap()

export { io }
