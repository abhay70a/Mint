import prisma from '@/lib/db/prisma'
import { LogAction, Role } from '@prisma/client'
import { paginate, PaginationParams } from '@/lib/utils/pagination'

export class LogService {
  static async log(params: {
    userId?: string
    action: LogAction
    entityType?: string
    entityId?: string
    ipAddress?: string
    userAgent?: string
    metadata?: any
  }) {
    // Fire and forget (non-blocking)
    prisma.auditLog.create({
      data: params,
    }).catch((err: any) => console.error('Audit Log Error:', err))
  }

  static async getLogs(filters: {
    userId?: string
    action?: LogAction
    entityType?: string
    entityId?: string
    startDate?: Date
    endDate?: Date
  } & PaginationParams) {
    const { skip, take, page, perPage } = paginate(filters)
    
    const where: any = {}
    if (filters.userId) where.userId = filters.userId
    if (filters.action) where.action = filters.action
    if (filters.entityType) where.entityType = filters.entityType
    if (filters.entityId) where.entityId = filters.entityId
    
    if (filters.startDate || filters.endDate) {
      where.createdAt = {}
      if (filters.startDate) where.createdAt.gte = filters.startDate
      if (filters.endDate) where.createdAt.lte = filters.endDate
    }

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { fullName: true, email: true } } },
      }),
      prisma.auditLog.count({ where }),
    ])

    return {
      data,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
        hasNextPage: page * perPage < total,
        hasPrevPage: page > 1,
      },
    }
  }
}
