import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { tryCatch } from '@/lib/middleware/tryCatch'
import { withLogging } from '@/lib/middleware/withLogging'
import { MessageService } from '@/lib/services/message.service'
import { successResponse } from '@/lib/utils/response'
import { LogService } from '@/lib/services/log.service'
import { LogAction } from '@prisma/client'

export const GET = withLogging(
  withAuth(
    tryCatch(async (req: NextRequest, { user, params }: any) => {
      const { id } = await params
      const messages = await MessageService.getThread(id, user.sub, user.role)
      return successResponse(messages)
    })
  )
)

export const POST = withLogging(
  withAuth(
    tryCatch(async (req: NextRequest, { user, params }: any) => {
      const { id } = await params
      const { body, isAdminNote = false } = await req.json()

      if (isAdminNote && user.role !== 'ADMIN') {
        throw new Error('FORBIDDEN')
      }

      const message = await MessageService.sendMessage(id, user.sub, body, isAdminNote)

      LogService.log({
        userId: user.sub,
        action: LogAction.MESSAGE_SENT as any,
        entityType: 'request',
        entityId: id,
      })

      return successResponse(message, null, 201)
    })
  )
)
