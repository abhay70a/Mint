import { Queue, Worker } from 'bullmq'
import { Resend } from 'resend'
import redis from '@/lib/redis'
import { RequestStatus } from '@prisma/client'

const resend = new Resend(process.env.RESEND_API_KEY)
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@mint.app'

export const emailQueue = new Queue('emailQueue', { connection: redis })

export class EmailService {
  static async sendWelcome(to: string, name: string) {
    await emailQueue.add('welcome', { to, name })
  }

  static async sendStatusUpdate(to: string, requestTitle: string, newStatus: RequestStatus) {
    await emailQueue.add('statusUpdate', { to, requestTitle, newStatus })
  }

  static async sendPasswordReset(to: string, resetLink: string) {
    await emailQueue.add('passwordReset', { to, resetLink })
  }

  static async sendNewMessage(to: string, requestTitle: string, senderName: string) {
    await emailQueue.add('newMessage', { to, requestTitle, senderName })
  }
}

// Simple Worker Implementation (would normally run in a separate process/edge function handle)
export const startEmailWorker = () => {
  const worker = new Worker('emailQueue', async (job) => {
    const { to, name, requestTitle, newStatus, resetLink, senderName } = job.data
    
    try {
      if (job.name === 'welcome') {
        await resend.emails.send({
          from: EMAIL_FROM,
          to,
          subject: 'Welcome to Mint',
          html: `<p>Hi ${name}, welcome to the platform!</p>`,
        })
      } else if (job.name === 'statusUpdate') {
        await resend.emails.send({
          from: EMAIL_FROM,
          to,
          subject: `Status Update: ${requestTitle}`,
          html: `<p>Your request "${requestTitle}" is now: <strong>${newStatus}</strong></p>`,
        })
      }
      // Add other templates...
    } catch (err) {
      console.error('Email Job Failed:', err)
      throw err
    }
  }, { connection: redis })

  return worker
}
