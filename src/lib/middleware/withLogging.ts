import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/utils/logger'

export type RouteHandler = (req: NextRequest, ctx: any) => Promise<NextResponse>

export function withLogging(handler: RouteHandler) {
  return async (req: NextRequest, ctx: any) => {
    const start = Date.now()
    const res = await handler(req, ctx)
    const duration = Date.now() - start

    logger.info('Request complete', {
      method: req.method,
      url: req.url,
      status: res.status,
      durationMs: duration,
    })

    return res
  }
}
