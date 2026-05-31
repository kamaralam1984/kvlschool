import { Request, Response } from 'express'
import { EmailService } from '../../common/services/email.service'
import { smsService } from '../../common/services/sms.service'
import { logger } from '../../config/logger'

const emailService = new EmailService()

// In-memory notice store (replace with DB in production)
const notices: any[] = []

export const notificationController = {

  // GET /notifications/notices
  async listNotices(req: Request, res: Response) {
    res.json({ success: true, data: notices })
  },

  // POST /notifications/send
  async sendNotice(req: Request, res: Response) {
    const { title, body, audience, priority, channel, recipients } = req.body
    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'title and body are required' })
    }

    const notice = {
      id: String(Date.now()),
      title, body, audience, priority, channel,
      sentAt: new Date().toISOString(),
      sentBy: (req as any).user?.name ?? 'Admin',
      readCount: 0,
      totalCount: recipients?.length ?? 0,
      deliveryResults: [] as any[],
    }

    const phoneList: string[] = recipients?.phones ?? []
    const emailList: string[] = recipients?.emails ?? []

    // Send via selected channel
    if (channel === 'SMS' || channel === 'All') {
      const bulkResults = await Promise.allSettled(
        phoneList.map((phone: string) => smsService.sendSMS(phone, `${title}\n\n${body}`))
      )
      const smsSuccess = bulkResults.filter(r => r.status === 'fulfilled' && (r.value as any).success).length
      notice.deliveryResults.push({ channel: 'SMS', sent: smsSuccess, failed: phoneList.length - smsSuccess })
      logger.info(`SMS notices: ${smsSuccess}/${phoneList.length} sent`)
    }

    if (channel === 'WhatsApp' || channel === 'All') {
      const bulkResults = await Promise.allSettled(
        phoneList.map((phone: string) => smsService.sendWhatsApp(phone, `*${title}*\n\n${body}`))
      )
      const waSuccess = bulkResults.filter(r => r.status === 'fulfilled' && (r.value as any).success).length
      notice.deliveryResults.push({ channel: 'WhatsApp', sent: waSuccess, failed: phoneList.length - waSuccess })
      logger.info(`WhatsApp notices: ${waSuccess}/${phoneList.length} sent`)
    }

    if (channel === 'Email' || channel === 'All') {
      await emailService.sendBulkEmail(emailList, title, `<p>${body.replace(/\n/g, '<br>')}</p>`)
      notice.deliveryResults.push({ channel: 'Email', sent: emailList.length, failed: 0 })
      logger.info(`Email notices sent to ${emailList.length} recipients`)
    }

    notices.unshift(notice)
    res.json({ success: true, data: notice })
  },

  // POST /notifications/sms
  async sendDirectSMS(req: Request, res: Response) {
    const { to, message } = req.body
    if (!to || !message) {
      return res.status(400).json({ success: false, message: 'to and message are required' })
    }
    const result = await smsService.sendSMS(to, message)
    res.json({ success: result.success, data: result })
  },

  // POST /notifications/whatsapp
  async sendDirectWhatsApp(req: Request, res: Response) {
    const { to, message } = req.body
    if (!to || !message) {
      return res.status(400).json({ success: false, message: 'to and message are required' })
    }
    const result = await smsService.sendWhatsApp(to, message)
    res.json({ success: result.success, data: result })
  },

  // POST /notifications/test-sms
  async testSMS(req: Request, res: Response) {
    const { to } = req.body
    if (!to) return res.status(400).json({ success: false, message: 'to (phone number) is required' })
    const result = await smsService.sendSMS(to, `Test SMS from KVL International School. If you received this, SMS is working correctly. — ${new Date().toLocaleString('en-IN')}`)
    res.json({ success: result.success, data: result })
  },

  // POST /notifications/test-whatsapp
  async testWhatsApp(req: Request, res: Response) {
    const { to } = req.body
    if (!to) return res.status(400).json({ success: false, message: 'to (phone number) is required' })
    const result = await smsService.sendWhatsApp(to, `✅ *KVL School* — WhatsApp test message received successfully!\n\nTime: ${new Date().toLocaleString('en-IN')}`)
    res.json({ success: result.success, data: result })
  },

  // GET /notifications/status
  async getStatus(_req: Request, res: Response) {
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const emailConfigured = !!(smtpUser && smtpPass && smtpPass !== 'placeholder')

    res.json({
      success: true,
      data: {
        sms: smsService.isConfigured(),
        whatsapp: smsService.isConfigured(),
        email: emailConfigured,
      },
    })
  },
}
