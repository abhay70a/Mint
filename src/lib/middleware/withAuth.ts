import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken, JWTPayload } from '@/lib/auth/jwt'
import { errorResponse } from '@/lib/utils/response'

export type AuthenticatedHandler = (
  req: NextRequest,
  context: any
) => Promise<NextResponse>

export function withAuth(
  handler: AuthenticatedHandler,
  options?: { roles?: ('CLIENT' | 'ADMIN')[] }
) {
  return async (req: NextRequest, ctx: any = {}): Promise<NextResponse> => {
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return errorResponse('UNAUTHORIZED', 'No access token provided', 401)
    }

    const payload = await verifyAccessToken(token)
    if (!payload) {
      return errorResponse('UNAUTHORIZED', 'Invalid or expired token', 401)
    }

    if (options?.roles && !options.roles.includes(payload.role)) {
      return errorResponse('FORBIDDEN', 'Insufficient permissions', 403)
    }

    return handler(req, { ...ctx, user: payload })
  }
}
