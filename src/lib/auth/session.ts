import prisma from '@/lib/db/prisma'

export async function createSession(userId: string, refreshToken: string, userAgent?: string, ipAddress?: string) {
  return await prisma.session.create({
    data: {
      userId,
      refreshToken,
      userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  })
}

export async function getSessionByToken(refreshToken: string) {
  return await prisma.session.findUnique({
    where: { refreshToken },
    include: { user: true },
  })
}

export async function deleteSession(refreshToken: string) {
  return await prisma.session.delete({
    where: { refreshToken },
  })
}

export async function updateSessionToken(oldToken: string, newToken: string) {
  return await prisma.session.update({
    where: { refreshToken: oldToken },
    data: {
      refreshToken: newToken,
      createdAt: new Date(), // Reset rotation timer
    },
  })
}
