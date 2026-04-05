import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth/password'
import { signupSchema } from '@/lib/validators/auth.schema'
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
    const data = validate(signupSchema, body)

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return errorResponse('CONFLICT', 'Email already registered', 409)
    }

    const passwordHash = await hashPassword(data.password)
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        passwordHash,
      },
    })

    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = await signAccessToken(payload)
    const refreshToken = await signRefreshToken(payload)

    await createSession(user.id, refreshToken, req.headers.get('user-agent') || undefined)

    LogService.log({
      userId: user.id,
      action: LogAction.AUTH_LOGIN,
      metadata: { method: 'signup' },
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
