import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/utils/response'
import prisma from '@/lib/db/prisma'
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt'
import { createSession } from '@/lib/auth/session'
import { tryCatch } from '@/lib/middleware/tryCatch'
import { withLogging } from '@/lib/middleware/withLogging'
import { LogService } from '@/lib/services/log.service'
import { LogAction } from '@prisma/client'
import { hashPassword } from '@/lib/auth/password'

export const POST = withLogging(
  tryCatch(async (req: NextRequest) => {
    const { email, fullName, googleUid } = await req.json()

    if (!email || !googleUid) {
      return errorResponse('BAD_REQUEST', 'Missing email or Google credentials', 400)
    }

    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Creating a placeholder secure password since they use Google to authenticate
      const randomPass = Date.now().toString(36) + Math.random().toString(36).substring(2)
      const passwordHash = await hashPassword(randomPass)
      user = await prisma.user.create({
        data: {
          fullName: fullName || 'Google User',
          email: email,
          passwordHash,
        },
      })
    } else if (user.isSuspended) {
      return errorResponse('FORBIDDEN', 'Your account has been suspended', 403)
    }

    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = await signAccessToken(payload)
    const refreshToken = await signRefreshToken(payload)

    await createSession(user.id, refreshToken, req.headers.get('user-agent') || undefined)

    LogService.log({
      userId: user.id,
      action: LogAction.AUTH_LOGIN,
      metadata: { method: 'google_oauth' },
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
