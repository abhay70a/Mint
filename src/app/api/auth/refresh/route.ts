import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '@/lib/auth/jwt'
import { getSessionByToken, updateSessionToken } from '@/lib/auth/session'
import { successResponse, errorResponse } from '@/lib/utils/response'
import { tryCatch } from '@/lib/middleware/tryCatch'
import { withLogging } from '@/lib/middleware/withLogging'

export const POST = withLogging(
  tryCatch(async (req: NextRequest) => {
    const cookieStore = await cookies()
    const oldRefreshToken = cookieStore.get('refreshToken')?.value

    if (!oldRefreshToken) {
      return errorResponse('UNAUTHORIZED', 'No refresh token', 401)
    }

    const payload = await verifyRefreshToken(oldRefreshToken)
    const session = await getSessionByToken(oldRefreshToken)

    if (!payload || !session || session.user.isSuspended) {
      return errorResponse('UNAUTHORIZED', 'Invalid session', 401)
    }

    const newPayload = { sub: session.user.id, email: session.user.email, role: session.user.role }
    const accessToken = await signAccessToken(newPayload)
    const newRefreshToken = await signRefreshToken(newPayload)

    await updateSessionToken(oldRefreshToken, newRefreshToken)

    const response = successResponse({ accessToken })
    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  })
)
