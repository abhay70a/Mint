import prisma from '@/lib/db/prisma'
import { Role } from '@prisma/client'
import { AppError } from '@/lib/errors/AppError'
import { paginate, PaginationParams } from '@/lib/utils/pagination'

export class UserService {
  static async listUsers(filters: {
    role?: Role
    search?: string
    isSuspended?: boolean
  } & PaginationParams) {
    const { skip, take, page, perPage } = paginate(filters)
    
    const where: any = {}
    if (filters.role) where.role = filters.role
    if (filters.isSuspended !== undefined) where.isSuspended = filters.isSuspended
    
    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
          isSuspended: true,
          createdAt: true,
          lastLoginAt: true,
          _count: { select: { requests: true } },
        },
      }),
      prisma.user.count({ where }),
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

  static async getUserDetail(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: { select: { requests: true, logs: true } },
      },
    })
    
    if (!user) throw new AppError('NOT_FOUND', 'User not found', 404)
    return user
  }

  static async updateUser(id: string, data: { role?: Role; isSuspended?: boolean; isActive?: boolean }) {
    return await prisma.user.update({
      where: { id },
      data,
    })
  }

  static async updateProfile(id: string, data: { fullName?: string; avatarUrl?: string }) {
    return await prisma.user.update({
      where: { id },
      data,
    })
  }
}
