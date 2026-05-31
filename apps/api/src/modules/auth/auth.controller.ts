import { Request, Response, NextFunction } from 'express'
import { AuthService } from './auth.service'

const authService = new AuthService()

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, totpCode, deviceInfo } = req.body
      const result = await authService.login({ email, password, totpCode, ip: req.ip, deviceInfo })
      res.json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body)
      res.status(201).json({ success: true, data: result, message: 'Account created. Please verify your email.' })
    } catch (err) { next(err) }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body
      const result = await authService.refreshToken(refreshToken)
      res.json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.logout((req as any).user.id, req.body.refreshToken)
      res.json({ success: true, message: 'Logged out successfully.' })
    } catch (err) { next(err) }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.forgotPassword(req.body.email)
      res.json({ success: true, message: 'Password reset link sent to your email.' })
    } catch (err) { next(err) }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.resetPassword(req.body.token, req.body.password)
      res.json({ success: true, message: 'Password reset successfully.' })
    } catch (err) { next(err) }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.verifyEmail(req.params.token)
      res.json({ success: true, message: 'Email verified successfully.' })
    } catch (err) { next(err) }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.googleAuth(req.body.credential)
      res.json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getProfile((req as any).user.id)
      res.json({ success: true, data: user })
    } catch (err) { next(err) }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.changePassword((req as any).user.id, req.body.currentPassword, req.body.newPassword)
      res.json({ success: true, message: 'Password changed successfully.' })
    } catch (err) { next(err) }
  }

  async setup2FA(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.setup2FA((req as any).user.id)
      res.json({ success: true, data: result })
    } catch (err) { next(err) }
  }

  async verify2FA(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.verify2FA((req as any).user.id, req.body.token)
      res.json({ success: true, message: '2FA enabled successfully.' })
    } catch (err) { next(err) }
  }

  async disable2FA(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.disable2FA((req as any).user.id, req.body.password)
      res.json({ success: true, message: '2FA disabled.' })
    } catch (err) { next(err) }
  }

  async getSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await authService.getSessions((req as any).user.id)
      res.json({ success: true, data: sessions })
    } catch (err) { next(err) }
  }

  async revokeSession(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.revokeSession((req as any).user.id, req.params.id)
      res.json({ success: true, message: 'Session revoked.' })
    } catch (err) { next(err) }
  }
}
