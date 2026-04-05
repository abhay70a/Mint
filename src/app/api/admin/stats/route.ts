import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { tryCatch } from '@/lib/middleware/tryCatch'
import { withLogging } from '@/lib/middleware/withLogging'
import prisma from '@/lib/db/prisma'
import { successResponse } from '@/lib/utils/response'
import { RequestStatus } from '@prisma/client'

export const GET = withLogging(
  withAuth(
    tryCatch(async () => {
      const [
        totalUsers,
        totalRequests,
        openRequests,
        completedRequests,
        weeklyRequests,
      ] = await Promise.all([
        prisma.user.count({ where: { role: 'CLIENT' } }),
        prisma.request.count(),
        prisma.request.count({ where: { status: { in: [RequestStatus.PENDING, RequestStatus.IN_PROGRESS] } } }),
        prisma.request.count({ where: { status: RequestStatus.COMPLETED } }),
        prisma.request.count({
          where: {
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        }),
      ])

      const stats = {
        users: { total: totalUsers },
        requests: {
          total: totalRequests,
          open: openRequests,
          completed: completedRequests,
          weeklyCount: weeklyRequests,
        },
      }

      return successResponse(stats)
    }),
    { roles: ['ADMIN'] }
  )
)
