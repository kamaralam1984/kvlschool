import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from '../filters/app.error'
import { User } from '../../modules/users/user.model'
import { cacheGet } from '../../database/redis'

interface JwtPayload {
  sub: string
  role: string
  iat: number
  exp: number
}

export interface AuthenticatedRequest extends Request {
  user: { id: string; role: string; permissions: string[] }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) throw new AppError('No token provided.', 401)

    const token = authHeader.slice(7)
    let payload: JwtPayload

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    } catch (e) {
      throw new AppError('Invalid or expired token.', 401)
    }

    // Check if token is blacklisted (logged out)
    const blacklisted = await cacheGet<boolean>(`blacklist:${token}`)
    if (blacklisted) throw new AppError('Token has been invalidated.', 401)

    const user = await User.findById(payload.sub).select('role isActive permissions')
    if (!user || !user.isActive) throw new AppError('User not found or inactive.', 401)

    ;(req as AuthenticatedRequest).user = {
      id: String(user._id),
      role: user.role,
      permissions: user.permissions,
    }

    next()
  } catch (err) {
    next(err)
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user
    if (!user) return next(new AppError('Not authenticated.', 401))
    if (!roles.includes(user.role)) {
      return next(new AppError('Insufficient permissions.', 403))
    }
    next()
  }
}

export function requirePermission(permission: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user
    if (!user) return next(new AppError('Not authenticated.', 401))

    const isAdmin = ['super_admin', 'principal', 'director', 'chairman'].includes(user.role)
    if (isAdmin) return next()

    if (!user.permissions.includes(permission)) {
      return next(new AppError(`Permission required: ${permission}`, 403))
    }
    next()
  }
}
