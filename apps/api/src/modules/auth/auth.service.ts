import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import { v4 as uuid } from 'uuid'
import { User, IUser } from '../users/user.model'
import { cacheGet, cacheSet, cacheDel } from '../../database/redis'
import { EmailService } from '../../common/services/email.service'
import { AppError } from '../../common/filters/app.error'
import { logger } from '../../config/logger'

const emailService = new EmailService()

const JWT_SECRET         = process.env.JWT_SECRET!
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!
const JWT_EXPIRES_IN     = process.env.JWT_EXPIRES_IN    ?? '15m'
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d'

interface TokenPair {
  accessToken: string
  refreshToken: string
}

interface LoginPayload {
  email: string
  password: string
  totpCode?: string
  ip?: string
  deviceInfo?: Record<string, string>
}

export class AuthService {
  private signTokens(userId: string, role: string): TokenPair {
    const accessToken = jwt.sign({ sub: userId, role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    })
    const refreshToken = jwt.sign({ sub: userId, jti: uuid() }, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES as jwt.SignOptions['expiresIn'],
    })
    return { accessToken, refreshToken }
  }

  async login({ email, password, totpCode, ip, deviceInfo }: LoginPayload) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +totpSecret')
    if (!user) throw new AppError('Invalid email or password.', 401)
    if (!user.isActive) throw new AppError('Account is deactivated. Contact admin.', 403)
    if (!user.isEmailVerified) throw new AppError('Please verify your email first.', 403)

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts ?? 0) + 1
      if (user.loginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000)
        user.isActive = false
      }
      await user.save()
      throw new AppError('Invalid email or password.', 401)
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new AppError('Account temporarily locked. Try again later.', 423)
    }

    if (user.twoFactorEnabled) {
      if (!totpCode) throw new AppError('2FA token required.', 403)
      const valid = speakeasy.totp.verify({
        secret: user.totpSecret!,
        encoding: 'base32',
        token: totpCode,
        window: 1,
      })
      if (!valid) throw new AppError('Invalid 2FA code.', 401)
    }

    user.loginAttempts = 0
    user.lockedUntil = undefined
    user.lastLoginAt = new Date()
    user.lastLoginIp = ip
    await user.save()

    const tokens = this.signTokens(String(user._id), user.role)
    await cacheSet(`refresh:${tokens.refreshToken}`, { userId: user._id, role: user.role }, 7 * 24 * 3600)

    return {
      tokens,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    }
  }

  async register(data: Partial<IUser> & { password: string }) {
    const exists = await User.findOne({ email: data.email!.toLowerCase() })
    if (exists) throw new AppError('Email already registered.', 409)

    const hashed = await bcrypt.hash(data.password, parseInt(process.env.BCRYPT_ROUNDS ?? '12'))
    const verifyToken = uuid()

    const user = await User.create({
      ...data,
      email: data.email!.toLowerCase(),
      password: hashed,
      emailVerifyToken: verifyToken,
      isEmailVerified: false,
    })

    await emailService.sendVerificationEmail(user.email, user.name, verifyToken)
    return { id: user._id, email: user.email, name: user.name }
  }

  async refreshToken(token: string) {
    const cached = await cacheGet<{ userId: string; role: string }>(`refresh:${token}`)
    if (!cached) throw new AppError('Invalid or expired refresh token.', 401)

    let payload: jwt.JwtPayload
    try {
      payload = jwt.verify(token, JWT_REFRESH_SECRET) as jwt.JwtPayload
    } catch {
      throw new AppError('Invalid refresh token.', 401)
    }

    const user = await User.findById(payload.sub)
    if (!user || !user.isActive) throw new AppError('User not found or inactive.', 401)

    await cacheDel(`refresh:${token}`)
    const tokens = this.signTokens(String(user._id), user.role)
    await cacheSet(`refresh:${tokens.refreshToken}`, { userId: user._id, role: user.role }, 7 * 24 * 3600)
    return tokens
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) await cacheDel(`refresh:${refreshToken}`)
    logger.info(`User ${userId} logged out`)
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return // Don't reveal if email exists

    const token = uuid()
    await cacheSet(`pwd-reset:${token}`, user._id, 3600)
    await emailService.sendPasswordResetEmail(user.email, user.name, token)
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = await cacheGet<string>(`pwd-reset:${token}`)
    if (!userId) throw new AppError('Password reset link expired or invalid.', 400)

    const hashed = await bcrypt.hash(newPassword, 12)
    await User.findByIdAndUpdate(userId, { password: hashed })
    await cacheDel(`pwd-reset:${token}`)
  }

  async verifyEmail(token: string) {
    const user = await User.findOne({ emailVerifyToken: token })
    if (!user) throw new AppError('Invalid or expired verification link.', 400)

    user.isEmailVerified = true
    user.emailVerifyToken = undefined
    await user.save()
  }

  async googleAuth(credential: string) {
    // Verify Google ID token
    const { OAuth2Client } = await import('google-auth-library')
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID })
    const payload = ticket.getPayload()
    if (!payload?.email) throw new AppError('Invalid Google credential.', 400)

    let user = await User.findOne({ email: payload.email.toLowerCase() })
    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email.toLowerCase(),
        avatar: payload.picture,
        googleId: payload.sub,
        isEmailVerified: true,
        role: 'student',
        password: await bcrypt.hash(uuid(), 12),
      })
    }

    const tokens = this.signTokens(String(user._id), user.role)
    return { tokens, user: { id: user._id, name: user.name, email: user.email, role: user.role } }
  }

  async getProfile(userId: string) {
    const user = await User.findById(userId).select('-password -totpSecret -emailVerifyToken')
    if (!user) throw new AppError('User not found.', 404)
    return user
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await User.findById(userId).select('+password')
    if (!user) throw new AppError('User not found.', 404)

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) throw new AppError('Current password is incorrect.', 401)

    user.password = await bcrypt.hash(newPassword, 12)
    await user.save()
  }

  async setup2FA(userId: string) {
    const user = await User.findById(userId)
    if (!user) throw new AppError('User not found.', 404)

    const secret = speakeasy.generateSecret({ name: `KVL School (${user.email})`, length: 20 })
    await cacheSet(`2fa-setup:${userId}`, secret.base32, 600)

    const qrDataUrl = await qrcode.toDataURL(secret.otpauth_url!)
    return { secret: secret.base32, qrCode: qrDataUrl }
  }

  async verify2FA(userId: string, token: string) {
    const secret = await cacheGet<string>(`2fa-setup:${userId}`)
    if (!secret) throw new AppError('2FA setup expired. Please start over.', 400)

    const valid = speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 })
    if (!valid) throw new AppError('Invalid TOTP code.', 401)

    await User.findByIdAndUpdate(userId, { twoFactorEnabled: true, totpSecret: secret })
    await cacheDel(`2fa-setup:${userId}`)
  }

  async disable2FA(userId: string, password: string) {
    const user = await User.findById(userId).select('+password')
    if (!user) throw new AppError('User not found.', 404)

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new AppError('Password incorrect.', 401)

    user.twoFactorEnabled = false
    user.totpSecret = undefined
    await user.save()
  }

  async getSessions(userId: string) {
    return []
  }

  async revokeSession(userId: string, sessionId: string) {
    logger.info(`Session ${sessionId} revoked for user ${userId}`)
  }
}
