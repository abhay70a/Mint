import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { tryCatch } from '@/lib/middleware/tryCatch'
import { withLogging } from '@/lib/middleware/withLogging'
import { FileService } from '@/lib/services/file.service'
import { successResponse } from '@/lib/utils/response'
import { LogService } from '@/lib/services/log.service'
import { LogAction } from '@prisma/client'

export const POST = withLogging(
  withAuth(
    tryCatch(async (req: NextRequest, { user }) => {
      const formData = await req.formData()
      const file = formData.get('file') as File
      const requestId = formData.get('requestId') as string

      if (!file || !requestId) throw new Error('MISSING_FIELDS')

      const buffer = Buffer.from(await file.arrayBuffer())
      const savedFile = await FileService.uploadFile(requestId, user.sub, {
        name: file.name,
        type: file.type,
        size: file.size,
        buffer,
      })

      LogService.log({
        userId: user.sub,
        action: LogAction.FILE_UPLOADED as any,
        entityType: 'file',
        entityId: savedFile.id,
      })

      return successResponse(savedFile, null, 201)
    })
  )
)
