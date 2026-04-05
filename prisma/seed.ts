import prisma from '../src/lib/db/prisma'
import { hashPassword } from '../src/lib/auth/password'
import { Role, RequestStatus, Priority } from '@prisma/client'

async function main() {
  console.log('Seed started...')

  // Clean DB
  await prisma.auditLog.deleteMany()
  await prisma.session.deleteMany()
  await prisma.message.deleteMany()
  await prisma.file.deleteMany()
  await prisma.statusLog.deleteMany()
  await prisma.request.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.user.deleteMany()

  const adminPw = await hashPassword('Admin1234!')
  const clientPw = await hashPassword('Client1234!')

  const admin = await prisma.user.create({
    data: {
      email: 'admin@mint.app',
      passwordHash: adminPw,
      fullName: 'Admin User',
      role: Role.ADMIN,
    },
  })

  const client1 = await prisma.user.create({
    data: {
      email: 'client@mint.app',
      passwordHash: clientPw,
      fullName: 'John Doe',
      role: Role.CLIENT,
    },
  })

  const client2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      passwordHash: clientPw,
      fullName: 'Jane Smith',
      role: Role.CLIENT,
    },
  })

  // Sample Request
  await prisma.request.create({
    data: {
      title: 'Website Redesign',
      description: 'I need a premium dark-themed portfolio website.',
      priority: Priority.HIGH,
      status: RequestStatus.IN_PROGRESS,
      clientId: client1.id,
      category: 'Web Development',
    },
  })

  await prisma.request.create({
    data: {
      title: 'Mobile App Discovery',
      description: 'Consultation for a new iOS app.',
      priority: Priority.MEDIUM,
      status: RequestStatus.PENDING,
      clientId: client1.id,
      category: 'Consulting',
    },
  })

  console.log('Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
