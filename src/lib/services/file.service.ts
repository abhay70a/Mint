import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import prisma from '@/lib/db/prisma'
import { AppError } from '@/lib/errors/AppError'
import { Role } from '@prisma/client'

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads'

export class FileService {
  static async uploadFile(requestId: string, userId: string, file: { name: string; type: string; size: number; buffer: Buffer }) {
    // Basic validation
    if (file.size > 25 * 1024 * 1024) throw new AppError('VALIDATION_ERROR', 'File too large (max 25MB)', 400)
    
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip']
    if (!allowedTypes.includes(file.type)) throw new AppError('VALIDATION_ERROR', 'File type not allowed', 400)

    const storageKey = `${uuidv4()}${path.extname(file.name)}`
    const filePath = path.join(UPLOAD_DIR, storageKey)

    await fs.mkdir(UPLOAD_DIR, { recursive: true })
    await fs.writeFile(filePath, file.buffer)

    return await prisma.file.create({
      data: {
        requestId,
        uploadedBy: userId,
        fileName: file.name,
        storageKey,
        mimeType: file.type,
        sizeBytes: file.size,
      },
    })
  }

  static async getFile(fileId: string, userId: string, role: Role) {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: { request: true },
    })

    if (!file) throw new AppError('NOT_FOUND', 'File not found', 404)
    if (role === Role.CLIENT && file.request.clientId !== userId) {
      throw new AppError('FORBIDDEN', 'Access denied', 403)
    }

    const filePath = path.join(UPLOAD_DIR, file.storageKey)
    const buffer = await fs.readFile(filePath)

    return { buffer, fileName: file.fileName, mimeType: file.mimeType }
  }

  static async deleteFile(fileId: string, userId: string, role: Role) {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: { request: true },
    })

    if (!file) throw new AppError('NOT_FOUND', 'File not found', 404)
    if (role === Role.CLIENT && file.request.clientId !== userId) {
        throw new AppError('FORBIDDEN', 'Access denied', 403)
    }

    await fs.unlink(path.join(UPLOAD_DIR, file.storageKey)).catch(() => {})
    return await prisma.file.delete({ where: { id: fileId } })
  }
}
