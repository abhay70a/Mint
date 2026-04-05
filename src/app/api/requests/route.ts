import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { tryCatch } from '@/lib/middleware/tryCatch'
import { withLogging } from '@/lib/middleware/withLogging'
import { RequestService } from '@/lib/services/request.service'
import { validate } from '@/lib/utils/validate'
import { createRequestSchema } from '@/lib/validators/request.schema'
import { successResponse } from '@/lib/utils/response'
import { LogService } from '@/lib/services/log.service'
import { LogAction } from '@prisma/client'

export const GET = withLogging(
  withAuth(
    tryCatch(async (req: NextRequest, { user }) => {
      const { searchParams } = new URL(req.url)
      const status = searchParams.get('status')?.split(',') as any[]
      const priority = searchParams.get('priority') as any
      const search = searchParams.get('search') || undefined
      const page = Number(searchParams.get('page')) || 1
      const perPage = Number(searchParams.get('perPage')) || 20

      const result = await RequestService.listRequests(user.sub, user.role, {
        status,
        priority,
        search,
        page,
        perPage,
      })

      return successResponse(result.data, result.meta)
    })
  )
)

export const POST = withLogging(
  withAuth(
    tryCatch(async (req: NextRequest, { user }) => {
      const body = await req.json()
      const data = validate(createRequestSchema, body)

      const request = await RequestService.createRequest(user.sub, data)

      LogService.log({
        userId: user.sub,
        action: LogAction.REQUEST_CREATED as any,
        entityType: 'request',
        entityId: request.id,
      })

      return successResponse(request, null, 201)
    }),
    { roles: ['CLIENT'] }
  )
)
