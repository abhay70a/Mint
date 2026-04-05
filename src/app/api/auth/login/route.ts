import { NextRequest, NextResponse } from 'next/server'
import { comparePassword } from '@/lib/auth/password'
import { loginSchema } from '@/lib/validators/auth.schema'
import { validate } from '@/lib/utils/validate'
import { successResponse, errorResponse } from '@/lib/utils/response'
import prisma from '@/lib/db/prisma'
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt'
import { createSession } from '@/lib/auth/session'
import { tryCatch } from '@/lib/middleware/tryCatch'
import { withLogging } from '@/lib/middleware/withLogging'
import { LogService } from '@/lib/services/log.service'
import { LogAction } from '@prisma/client'

export const POST = withLogging(
  tryCatch(async (req: NextRequest) => {
    const body = await req.json()
    const data = validate(loginSchema, body)

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user || !(await comparePassword(data.password, user.passwordHash))) {
      LogService.log({
        action: LogAction.AUTH_FAILED_LOGIN,
        metadata: { email: data.email },
      })
      return errorResponse('UNAUTHORIZED', 'Invalid email or password', 401)
    }

    if (user.isSuspended) {
      return errorResponse('FORBIDDEN', 'Your account has been suspended', 403)
    }

    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = await signAccessToken(payload)
    const refreshToken = await signRefreshToken(payload)

    await createSession(user.id, refreshToken, req.headers.get('user-agent') || undefined)

    LogService.log({
      userId: user.id,
      action: LogAction.AUTH_LOGIN,
      metadata: { method: 'login' },
    })

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    const response = successResponse({ user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }, accessToken })
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  })
)
