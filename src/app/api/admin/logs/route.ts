import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { tryCatch } from '@/lib/middleware/tryCatch'
import { withLogging } from '@/lib/middleware/withLogging'
import { LogService } from '@/lib/services/log.service'
import { successResponse } from '@/lib/utils/response'

export const GET = withLogging(
  withAuth(
    tryCatch(async (req: NextRequest) => {
      const { searchParams } = new URL(req.url)
      const action = searchParams.get('action') as any
      const entityType = searchParams.get('entityType') || undefined
      const entityId = searchParams.get('entityId') || undefined
      const userId = searchParams.get('userId') || undefined
      const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
      const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined
      const page = Number(searchParams.get('page')) || 1
      const perPage = Number(searchParams.get('perPage')) || 50

      const result = await LogService.getLogs({
        action,
        entityType,
        entityId,
        userId,
        startDate,
        endDate,
        page,
        perPage,
      })

      return successResponse(result.data, result.meta)
    }),
    { roles: ['ADMIN'] }
  )
)
