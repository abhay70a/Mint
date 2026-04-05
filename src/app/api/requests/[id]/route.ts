import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { tryCatch } from '@/lib/middleware/tryCatch'
import { withLogging } from '@/lib/middleware/withLogging'
import { RequestService } from '@/lib/services/request.service'
import { validate } from '@/lib/utils/validate'
import { updateRequestSchema, updateStatusSchema } from '@/lib/validators/request.schema'
import { successResponse } from '@/lib/utils/response'
import { LogService } from '@/lib/services/log.service'
import { LogAction } from '@prisma/client'

export const GET = withLogging(
  withAuth(
    tryCatch(async (req: NextRequest, { user, params }: any) => {
      const { id } = await params
      const request = await RequestService.getRequestById(id, user.sub, user.role)
      return successResponse(request)
    })
  )
)

export const PATCH = withLogging(
  withAuth(
    tryCatch(async (req: NextRequest, { user, params }: any) => {
      const { id } = await params
      const body = await req.json()
      
      // If it's a status update (Admin only)
      if ('status' in body && !('title' in body)) {
        if (user.role !== 'ADMIN') throw new Error('FORBIDDEN')
        const data = validate(updateStatusSchema, body)
        const updated = await RequestService.updateStatus(id, user.sub, data.status, data.note)
        
        LogService.log({
          userId: user.sub,
          action: LogAction.REQUEST_STATUS_CHANGED as any,
          entityType: 'request',
          entityId: id,
          metadata: { to: data.status },
        })

        return successResponse(updated)
      }

      // Normal update
      const data = validate(updateRequestSchema, body)
      const updated = await RequestService.updateRequest(id, user.sub, user.role, data)

      LogService.log({
        userId: user.sub,
        action: LogAction.REQUEST_UPDATED as any,
        entityType: 'request',
        entityId: id,
      })

      return successResponse(updated)
    })
  )
)

export const DELETE = withLogging(
  withAuth(
    tryCatch(async (req: NextRequest, { user, params }: any) => {
      const { id } = await params
      await RequestService.deleteRequest(id, user.sub, user.role)
      
      LogService.log({
        userId: user.sub,
        action: LogAction.REQUEST_DELETED as any,
        entityType: 'request',
        entityId: id,
      })

      return successResponse({ message: 'Request deleted' })
    }),
    { roles: ['ADMIN', 'CLIENT'] }
  )
)
