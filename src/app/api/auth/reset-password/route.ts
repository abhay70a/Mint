import { NextRequest } from 'next/server'
import { tryCatch } from '@/lib/middleware/tryCatch'
import { withLogging } from '@/lib/middleware/withLogging'
import { validate } from '@/lib/utils/validate'
import { resetPasswordSchema } from '@/lib/validators/auth.schema'
import prisma from '@/lib/db/prisma'
import { hashPassword } from '@/lib/auth/password'
import { successResponse, errorResponse } from '@/lib/utils/response'
import redis from '@/lib/redis'
import { LogService } from '@/lib/services/log.service'
import { LogAction } from '@prisma/client'

export const POST = withLogging(
  tryCatch(async (req: NextRequest) => {
    const body = await req.json()
    const { token, newPassword } = validate(resetPasswordSchema, body)

    const userId = await redis.get(`reset:${token}`)
    if (!userId) {
      return errorResponse('UNAUTHORIZED', 'Invalid or expired reset token', 401)
    }

    const passwordHash = await hashPassword(newPassword)
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    })

    // Delete token and purge all user sessions for safety
    await redis.del(`reset:${token}`)
    await prisma.session.deleteMany({ where: { userId } })

    LogService.log({
      userId,
      action: LogAction.USER_UPDATED as any,
      metadata: { field: 'password', method: 'reset' },
    })

    return successResponse({ message: 'Password reset successfully' })
  })
)
