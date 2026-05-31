import { Router } from 'express'
import { body, param } from 'express-validator'
import { validate } from '../../common/pipes/validate'
import { authenticate } from '../../common/guards/auth.guard'
import { AuthController } from './auth.controller'
import { rateLimit } from 'express-rate-limit'

const router = Router()
const ctrl = new AuthController()

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many login attempts' })

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]

const registerValidation = [
  body('name').trim().notEmpty().isLength({ min: 2 }).withMessage('Name required'),
  body('email').isEmail().normalizeEmail(),
  body('password').isStrongPassword({ minLength: 8, minNumbers: 1, minUppercase: 1 }),
  body('role').isIn(['student', 'teacher', 'parent', 'admin']),
]

// Public routes
router.post('/login',            authLimiter, loginValidation,    validate, ctrl.login)
router.post('/register',         registerValidation,              validate, ctrl.register)
router.post('/refresh-token',                                               ctrl.refreshToken)
router.post('/forgot-password',  authLimiter,
  [body('email').isEmail()],                                      validate, ctrl.forgotPassword)
router.post('/reset-password',
  [body('token').notEmpty(), body('password').isStrongPassword()], validate, ctrl.resetPassword)
router.post('/verify-email',
  [param('token').notEmpty()],                                    validate, ctrl.verifyEmail)

// Google OAuth
router.post('/google',           ctrl.googleAuth)

// Protected routes
router.use(authenticate)
router.post('/logout',           ctrl.logout)
router.get('/me',                ctrl.getMe)
router.put('/change-password',
  [body('currentPassword').notEmpty(), body('newPassword').isStrongPassword()],
  validate, ctrl.changePassword)
router.post('/setup-2fa',        ctrl.setup2FA)
router.post('/verify-2fa',       ctrl.verify2FA)
router.delete('/disable-2fa',    ctrl.disable2FA)
router.get('/sessions',          ctrl.getSessions)
router.delete('/sessions/:id',   ctrl.revokeSession)

export default router
