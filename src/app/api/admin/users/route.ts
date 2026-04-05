import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { tryCatch } from '@/lib/middleware/tryCatch'
import { withLogging } from '@/lib/middleware/withLogging'
import { UserService } from '@/lib/services/user.service'
import { successResponse } from '@/lib/utils/response'

export const GET = withLogging(
  withAuth(
    tryCatch(async (req: NextRequest) => {
      const { searchParams } = new URL(req.url)
      const role = searchParams.get('role') as any || undefined
      const isSuspended = searchParams.get('isSuspended') === 'true' ? true : searchParams.get('isSuspended') === 'false' ? false : undefined
      const search = searchParams.get('search') || undefined
      const page = Number(searchParams.get('page')) || 1
      const perPage = Number(searchParams.get('perPage')) || 20

      const result = await UserService.listUsers({
        role,
        isSuspended,
        search,
        page,
        perPage,
      })

      return successResponse(result.data, result.meta)
    }),
    { roles: ['ADMIN'] }
  )
)
