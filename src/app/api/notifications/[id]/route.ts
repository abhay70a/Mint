import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { tryCatch } from '@/lib/middleware/tryCatch'
import { withLogging } from '@/lib/middleware/withLogging'
import prisma from '@/lib/db/prisma'
import { successResponse } from '@/lib/utils/response'

export const PATCH = withLogging(
  withAuth(
    tryCatch(async (req: NextRequest, { user, params }: any) => {
      const { id } = await params
      const body = await req.json()

      const updated = await prisma.notification.update({
        where: { id, userId: user.sub },
        data: { isRead: body.isRead ?? true },
      })

      return successResponse(updated)
    })
  )
)
