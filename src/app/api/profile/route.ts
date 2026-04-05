import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { tryCatch } from '@/lib/middleware/tryCatch'
import { withLogging } from '@/lib/middleware/withLogging'
import prisma from '@/lib/db/prisma'
import { successResponse } from '@/lib/utils/response'
import { UserService } from '@/lib/services/user.service'

export const GET = withLogging(
  withAuth(
    tryCatch(async (req: NextRequest, { user: tokenUser }) => {
      const user = await UserService.getUserDetail(tokenUser.sub)
      return successResponse({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        role: user.role,
        createdAt: user.createdAt,
      })
    })
  )
)

export const PATCH = withLogging(
  withAuth(
    tryCatch(async (req: NextRequest, { user: tokenUser }) => {
      const body = await req.json()
      const allowedFields = ['fullName', 'avatarUrl']
      const data: any = {}
      
      allowedFields.forEach(f => {
        if (f in body) data[f] = body[f]
      })

      const updated = await UserService.updateProfile(tokenUser.sub, data)
      return successResponse(updated)
    })
  )
)
