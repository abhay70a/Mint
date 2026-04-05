import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { deleteSession } from '@/lib/auth/session'
import { successResponse } from '@/lib/utils/response'
import { tryCatch } from '@/lib/middleware/tryCatch'
import { withLogging } from '@/lib/middleware/withLogging'
import { LogService } from '@/lib/services/log.service'
import { LogAction } from '@prisma/client'

export const POST = withLogging(
  tryCatch(async (req: NextRequest) => {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value

    if (refreshToken) {
      const session = await deleteSession(refreshToken).catch(() => null)
      if (session) {
        LogService.log({
          userId: session.userId,
          action: LogAction.AUTH_LOGOUT as any,
        })
      }
    }

    const response = successResponse({ message: 'Logged out' })
    response.cookies.delete('refreshToken')
    return response
  })
)
