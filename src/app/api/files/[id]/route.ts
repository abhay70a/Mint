import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { tryCatch } from '@/lib/middleware/tryCatch'
import { withLogging } from '@/lib/middleware/withLogging'
import { FileService } from '@/lib/services/file.service'
import { LogService } from '@/lib/services/log.service'
import { LogAction } from '@prisma/client'

export const GET = withLogging(
  withAuth(
    tryCatch(async (req: NextRequest, { user, params }: any) => {
      const { id } = await params
      const { buffer, fileName, mimeType } = await FileService.getFile(id, user.sub, user.role)

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      })
    })
  )
)

export const DELETE = withLogging(
  withAuth(
    tryCatch(async (req: NextRequest, { user, params }: any) => {
      const { id } = await params
      await FileService.deleteFile(id, user.sub, user.role)

      LogService.log({
        userId: user.sub,
        action: LogAction.FILE_DELETED as any,
        entityType: 'file',
        entityId: id,
      })

      return NextResponse.json({ success: true })
    })
  )
)
