import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { tryCatch } from '@/lib/middleware/tryCatch'
import { withLogging } from '@/lib/middleware/withLogging'
import { UserService } from '@/lib/services/user.service'
import { successResponse } from '@/lib/utils/response'
import { LogService } from '@/lib/services/log.service'
import { LogAction } from '@prisma/client'

export const GET = withLogging(
  withAuth(
    tryCatch(async (req: NextRequest, { params }: any) => {
      const { id } = await params
      const user = await UserService.getUserDetail(id)
      return successResponse(user)
    }),
    { roles: ['ADMIN'] }
  )
)

export const PATCH = withLogging(
  withAuth(
    tryCatch(async (req: NextRequest, { user: admin, params }: any) => {
      const { id } = await params
      const body = await req.json()
      
      const updated = await UserService.updateUser(id, body)

      LogService.log({
        userId: admin.sub,
        action: LogAction.USER_UPDATED as any,
        entityType: 'user',
        entityId: id,
        metadata: body,
      })

      return successResponse(updated)
    }),
    { roles: ['ADMIN'] }
  )
)
