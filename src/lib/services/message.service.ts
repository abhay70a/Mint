import prisma from '@/lib/db/prisma'
import { Role } from '@prisma/client'
import { AppError } from '@/lib/errors/AppError'

export class MessageService {
  static async getThread(requestId: string, userId: string, role: Role) {
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      select: { clientId: true },
    })

    if (!request) throw new AppError('NOT_FOUND', 'Request not found', 404)
    if (role === Role.CLIENT && request.clientId !== userId) {
      throw new AppError('FORBIDDEN', 'Access denied', 403)
    }

    return await prisma.message.findMany({
      where: {
        requestId,
        ...(role === Role.CLIENT ? { isAdminNote: false } : {}),
      },
      include: {
        sender: { select: { fullName: true, role: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    })
  }

  static async sendMessage(requestId: string, senderId: string, body: string, isAdminNote: boolean = false) {
    return await prisma.message.create({
      data: {
        requestId,
        senderId,
        body,
        isAdminNote,
      },
      include: {
        sender: { select: { fullName: true, role: true, avatarUrl: true } },
      },
    })
  }
}
