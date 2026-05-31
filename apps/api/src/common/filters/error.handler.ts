import { Request, Response, NextFunction } from 'express'
import { AppError } from './app.error'
import { logger } from '../../config/logger'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) logger.error(err.message, { stack: err.stack })
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    })
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values((err as any).errors).map((e: any) => e.message)
    return res.status(422).json({ success: false, message: 'Validation failed.', errors: messages })
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue ?? {})[0] ?? 'field'
    return res.status(409).json({ success: false, message: `${field} already exists.` })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' })
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired.' })
  }

  logger.error('Unhandled error:', { message: err.message, stack: err.stack })

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message,
  })
}
