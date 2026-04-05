import { NextRequest, NextResponse } from 'next/server'
import redis from '@/lib/redis'
import { errorResponse } from '@/lib/utils/response'

export function withRateLimit(
  handler: (req: NextRequest, ctx: any) => Promise<NextResponse>,
  options: { limit: number; window: number } = { limit: 100, window: 60 }
) {
  return async (req: NextRequest, ctx: any) => {
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const key = `ratelimit:${ip}:${req.nextUrl.pathname}`

    const count = await redis.incr(key)
    if (count === 1) {
      await redis.expire(key, options.window)
    }

    if (count > options.limit) {
      return errorResponse('RATE_LIMITED', 'Too many requests', 429)
    }

    return handler(req, ctx)
  }
}
