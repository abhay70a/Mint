import prisma from '@/lib/db/prisma'
import { Role, RequestStatus, Priority } from '@prisma/client'
import { AppError } from '@/lib/errors/AppError'
import { CreateRequestDTO, UpdateRequestDTO } from '@/lib/validators/request.schema'
import { paginate, PaginationParams } from '@/lib/utils/pagination'

export class RequestService {
  static async listRequests(userId: string, role: Role, filters: {
    status?: RequestStatus[]
    priority?: Priority
    search?: string
  } & PaginationParams) {
    const { skip, take, page, perPage } = paginate(filters)
    
    const where: any = {}
    if (role === Role.CLIENT) {
      where.clientId = userId
    }
    
    if (filters.status && filters.status.length > 0) {
      where.status = { in: filters.status }
    }
    
    if (filters.priority) {
      where.priority = filters.priority
    }
    
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    const [data, total] = await Promise.all([
      prisma.request.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { fullName: true, email: true } },
          _count: { select: { files: true, messages: true } },
        },
      }),
      prisma.request.count({ where }),
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

  static async createRequest(userId: string, data: CreateRequestDTO) {
    return await prisma.request.create({
      data: {
        ...data,
        clientId: userId,
      },
    })
  }

  static async getRequestById(id: string, userId: string, role: Role) {
    const request = await prisma.request.findUnique({
      where: { id },
      include: {
        files: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { select: { fullName: true, role: true } } },
        },
        statusLogs: { orderBy: { createdAt: 'desc' } },
        client: { select: { fullName: true, avatarUrl: true } },
      },
    })

    if (!request) throw new AppError('NOT_FOUND', 'Request not found', 404)
    if (role === Role.CLIENT && request.clientId !== userId) {
      throw new AppError('FORBIDDEN', 'Access denied', 403)
    }

    return request
  }

  static async updateRequest(id: string, userId: string, role: Role, data: UpdateRequestDTO) {
    const request = await this.getRequestById(id, userId, role)

    if (role === Role.CLIENT && request.status !== RequestStatus.PENDING) {
      throw new AppError('FORBIDDEN', 'Can only update pending requests', 403)
    }

    return await prisma.request.update({
      where: { id },
      data,
    })
  }

  static async updateStatus(id: string, adminId: string, newStatus: RequestStatus, note?: string) {
    const request = await prisma.request.findUnique({ where: { id } })
    if (!request) throw new AppError('NOT_FOUND', 'Request not found', 404)

    return await prisma.$transaction(async (tx: any) => {
      const updated = await tx.request.update({
        where: { id },
        data: {
          status: newStatus,
          resolvedAt: newStatus === RequestStatus.COMPLETED ? new Date() : undefined,
        },
      })

      await tx.statusLog.create({
        data: {
          requestId: id,
          fromStatus: request.status,
          toStatus: newStatus,
          changedBy: adminId,
          note,
        },
      })

      return updated
    })
  }

  static async deleteRequest(id: string, userId: string, role: Role) {
    await this.getRequestById(id, userId, role)
    return await prisma.request.delete({ where: { id } })
  }
}
