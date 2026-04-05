import { NextRequest, NextResponse } from 'next/server'
import { AppError } from '@/lib/errors/AppError'
import { errorResponse } from '@/lib/utils/response'
import logger from '@/lib/utils/logger'

type RouteHandler = (req: NextRequest, ctx: any) => Promise<NextResponse>

export function tryCatch(handler: RouteHandler) {
  return async (req: NextRequest, ctx: any) => {
    try {
      return await handler(req, ctx)
    } catch (err: any) {
      if (err instanceof AppError) {
        return errorResponse(err.code, err.message, err.statusCode, err.field)
      }

      logger.error('Unhandled error', {
        message: err.message,
        stack: err.stack,
        url: req.url,
      })

      return errorResponse('INTERNAL_ERROR', 'Something went wrong', 500)
    }
  }
}
