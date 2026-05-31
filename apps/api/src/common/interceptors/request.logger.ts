import { Request, Response, NextFunction } from 'express'
import { logger } from '../../config/logger'
import { v4 as uuid } from 'uuid'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = uuid()
  const startTime = Date.now()

  req.headers['x-request-id'] = requestId
  res.setHeader('X-Request-ID', requestId)

  res.on('finish', () => {
    const duration = Date.now() - startTime
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info'
    logger[level](`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms [${requestId}]`)
  })

  next()
}
