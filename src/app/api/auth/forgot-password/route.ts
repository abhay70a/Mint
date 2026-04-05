import { NextRequest } from 'next/server'
import { tryCatch } from '@/lib/middleware/tryCatch'
import { withLogging } from '@/lib/middleware/withLogging'
import { validate } from '@/lib/utils/validate'
import { forgotPasswordSchema } from '@/lib/validators/auth.schema'
import prisma from '@/lib/db/prisma'
import { EmailService } from '@/lib/services/email.service'
import { successResponse } from '@/lib/utils/response'
import { v4 as uuidv4 } from 'uuid'
import redis from '@/lib/redis'

export const POST = withLogging(
  tryCatch(async (req: NextRequest) => {
    const body = await req.json()
    const { email } = validate(forgotPasswordSchema, body)

    const user = await prisma.user.findUnique({ where: { email } })
    
    if (user) {
      const token = uuidv4()
      // Store in Redis with 15m expiry
      await redis.set(`reset:${token}`, user.id, 'EX', 15 * 60)
      
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`
      await EmailService.sendPasswordReset(email, resetLink)
    }

    // Always return success even if user not found (security)
    return successResponse({ message: 'If an account exists, a reset link has been sent' })
  })
)
