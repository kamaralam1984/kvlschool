import Redis from 'ioredis'
import { logger } from '../config/logger'

let redisClient: Redis | null = null
let redisAvailable = false

export async function connectRedis(): Promise<void> {
  const client = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    retryStrategy: () => null, // don't retry — fail fast
    enableOfflineQueue: false,
  })

  client.on('error', () => { /* suppress ioredis noise */ })

  try {
    await client.connect()
    await client.ping()
    redisClient = client
    redisAvailable = true
    logger.info('Redis connected')
    client.on('close', () => {
      redisAvailable = false
      logger.warn('Redis connection closed — caching disabled')
    })
  } catch {
    logger.warn('Redis unavailable — running without cache (sessions will not persist across restarts)')
    client.disconnect()
  }
}

export function getRedis(): Redis | null {
  return redisAvailable ? redisClient : null
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redisAvailable || !redisClient) return null
  try {
    const data = await redisClient.get(key)
    return data ? (JSON.parse(data) as T) : null
  } catch { return null }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 3600): Promise<void> {
  if (!redisAvailable || !redisClient) return
  try { await redisClient.setex(key, ttlSeconds, JSON.stringify(value)) } catch { /* no-op */ }
}

export async function cacheDel(key: string): Promise<void> {
  if (!redisAvailable || !redisClient) return
  try { await redisClient.del(key) } catch { /* no-op */ }
}

export async function cacheDelPattern(pattern: string): Promise<void> {
  if (!redisAvailable || !redisClient) return
  try {
    const keys = await redisClient.keys(pattern)
    if (keys.length > 0) await redisClient.del(...keys)
  } catch { /* no-op */ }
}
