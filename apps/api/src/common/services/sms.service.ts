import twilio from 'twilio'

export class SMSService {
  private client: twilio.Twilio
  private from: string
  private whatsappFrom: string
  private enabled: boolean

  constructor() {
    const sid = process.env.TWILIO_ACCOUNT_SID
    const token = process.env.TWILIO_AUTH_TOKEN
    this.enabled = !!(sid && token && sid !== 'placeholder' && sid !== 'your_account_sid_here')
    if (this.enabled) {
      this.client = twilio(sid, token)
    }
    this.from = process.env.TWILIO_PHONE ?? '+1234567890'
    this.whatsappFrom = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM ?? '+14155238886'}`
  }

  async sendSMS(to: string, message: string): Promise<{ success: boolean; sid?: string; error?: string }> {
    if (!this.enabled) return { success: false, error: 'Twilio not configured. Add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to .env' }
    try {
      const result = await this.client.messages.create({
        body: message,
        from: this.from,
        to: to.startsWith('+') ? to : `+91${to}`,
      })
      return { success: true, sid: result.sid }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  async sendWhatsApp(to: string, message: string): Promise<{ success: boolean; sid?: string; error?: string }> {
    if (!this.enabled) return { success: false, error: 'Twilio not configured. Add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to .env' }
    try {
      const result = await this.client.messages.create({
        body: message,
        from: this.whatsappFrom,
        to: `whatsapp:${to.startsWith('+') ? to : `+91${to}`}`,
      })
      return { success: true, sid: result.sid }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  async sendFeeReminder(phone: string, studentName: string, amount: number, dueDate: string, viaWhatsApp = true) {
    const msg = `🏫 KVL International School\n\nDear Parent,\n\nFee reminder for *${studentName}*:\nAmount: ₹${amount.toLocaleString('en-IN')}\nDue Date: ${dueDate}\n\nPay online: ${process.env.FRONTEND_URL}/fees\n\nFor queries: +91 98765 43210`
    return viaWhatsApp ? this.sendWhatsApp(phone, msg) : this.sendSMS(phone, msg.replace(/\*/g, ''))
  }

  async sendAttendanceAlert(phone: string, studentName: string, date: string, status: string) {
    const emoji = status === 'absent' ? '❌' : '⚠️'
    const msg = `${emoji} KVL School Attendance Alert\n\n${studentName} was marked *${status}* on ${date}.\n\nFor queries, contact the school.\nKVL International School`
    return this.sendWhatsApp(phone, msg)
  }

  async sendExamResult(phone: string, studentName: string, examName: string, percentage: number, grade: string) {
    const msg = `📊 KVL School Result\n\n${studentName}'s result for *${examName}*:\nScore: ${percentage}%\nGrade: ${grade}\n\nView full report: ${process.env.FRONTEND_URL}/results\nKVL International School`
    return this.sendWhatsApp(phone, msg)
  }

  async sendAdmissionUpdate(phone: string, parentName: string, status: string, studentName: string) {
    const msg = `🎓 KVL Admissions\n\nDear ${parentName},\n\nAdmission update for *${studentName}*: Your application status is now *${status}*.\n\nFor details: ${process.env.FRONTEND_URL}/admissions\nKVL International School`
    return this.sendWhatsApp(phone, msg)
  }

  async sendBulkSMS(recipients: { phone: string; message: string }[]) {
    const results = await Promise.allSettled(
      recipients.map(r => this.sendSMS(r.phone, r.message))
    )
    const success = results.filter(r => r.status === 'fulfilled' && (r.value as any).success).length
    return { total: recipients.length, success, failed: recipients.length - success }
  }

  isConfigured(): boolean { return this.enabled }
}

export const smsService = new SMSService()
