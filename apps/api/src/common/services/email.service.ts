import nodemailer from 'nodemailer'
import { logger } from '../../config/logger'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST ?? 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT ?? '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

export class EmailService {
  private async send(to: string, subject: string, html: string) {
    try {
      await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html })
      logger.info(`Email sent to ${to}: ${subject}`)
    } catch (err) {
      logger.error(`Email failed to ${to}:`, err)
    }
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    const url = `${process.env.APP_URL}/verify-email?token=${token}`
    await this.send(to, 'Verify your KVL School email', this.verificationTemplate(name, url))
  }

  async sendPasswordResetEmail(to: string, name: string, token: string) {
    const url = `${process.env.APP_URL}/reset-password?token=${token}`
    await this.send(to, 'Reset your KVL School password', this.passwordResetTemplate(name, url))
  }

  async sendWelcomeEmail(to: string, name: string, role: string) {
    await this.send(to, 'Welcome to KVL International School', this.welcomeTemplate(name, role))
  }

  async sendFeeReminder(to: string, name: string, amount: number, dueDate: string) {
    await this.send(to, 'Fee Payment Reminder — KVL School', this.feeReminderTemplate(name, amount, dueDate))
  }

  async sendAdmissionConfirmation(to: string, name: string, admissionNo: string) {
    await this.send(to, 'Admission Confirmed — KVL International School', this.admissionTemplate(name, admissionNo))
  }

  async sendExamNotification(to: string, name: string, examTitle: string, examDate: string) {
    await this.send(to, `Exam Scheduled: ${examTitle}`, this.examNotificationTemplate(name, examTitle, examDate))
  }

  async sendBulkEmail(recipients: string[], subject: string, html: string) {
    const chunks = []
    for (let i = 0; i < recipients.length; i += 50) chunks.push(recipients.slice(i, i + 50))
    for (const chunk of chunks) {
      await Promise.allSettled(chunk.map((to) => this.send(to, subject, html)))
      await new Promise((r) => setTimeout(r, 1000))
    }
  }

  private baseTemplate(content: string) {
    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width">
<style>
  body { font-family: 'Inter', Arial, sans-serif; background: #f5f0ea; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #0a1628 0%, #1e3a5f 100%); padding: 40px 40px 30px; text-align: center; }
  .logo-text { color: #faf8f5; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
  .logo-sub { color: #c9922a; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }
  .gold-line { width: 60px; height: 2px; background: #c9922a; margin: 20px auto 0; }
  .body { padding: 40px; color: #162d4a; }
  h2 { color: #0a1628; font-size: 22px; margin: 0 0 20px; }
  p { color: #4a5568; line-height: 1.7; margin: 0 0 16px; }
  .btn { display: inline-block; padding: 14px 32px; background: #c9922a; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px; margin: 20px 0; }
  .footer { padding: 24px 40px; background: #f5f0ea; text-align: center; font-size: 12px; color: #8a9ab5; border-top: 1px solid #e8e0d5; }
</style></head><body>
<div class="container">
  <div class="header">
    <div class="logo-text">KVL International School</div>
    <div class="logo-sub">School of Excellence</div>
    <div class="gold-line"></div>
  </div>
  <div class="body">${content}</div>
  <div class="footer">
    <p>KVL International School | 123 Education Avenue, New Delhi — 110001</p>
    <p>+91 98765 43210 | info@kvlschool.edu.in | kvlschool.edu.in</p>
    <p style="margin-top:8px;">© 2024 KVL International School. All rights reserved.</p>
  </div>
</div>
</body></html>`
  }

  private verificationTemplate(name: string, url: string) {
    return this.baseTemplate(`
      <h2>Verify Your Email Address</h2>
      <p>Dear ${name},</p>
      <p>Thank you for registering with KVL International School. Please verify your email address to activate your account.</p>
      <div style="text-align:center;"><a href="${url}" class="btn">Verify Email Address</a></div>
      <p style="font-size:13px;color:#8a9ab5;">This link expires in 24 hours. If you did not create an account, please ignore this email.</p>
    `)
  }

  private passwordResetTemplate(name: string, url: string) {
    return this.baseTemplate(`
      <h2>Reset Your Password</h2>
      <p>Dear ${name},</p>
      <p>We received a request to reset your password. Click the button below to create a new password.</p>
      <div style="text-align:center;"><a href="${url}" class="btn">Reset Password</a></div>
      <p style="font-size:13px;color:#8a9ab5;">This link expires in 1 hour. If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
    `)
  }

  private welcomeTemplate(name: string, role: string) {
    return this.baseTemplate(`
      <h2>Welcome to KVL International School! 🎓</h2>
      <p>Dear ${name},</p>
      <p>We are delighted to welcome you to the KVL International School family. Your ${role} account has been successfully created.</p>
      <p>You can now access the school portal, view relevant information, and stay connected with everything happening at KVL.</p>
      <div style="text-align:center;"><a href="${process.env.APP_URL}/login" class="btn">Access Your Portal</a></div>
    `)
  }

  private feeReminderTemplate(name: string, amount: number, dueDate: string) {
    return this.baseTemplate(`
      <h2>Fee Payment Reminder</h2>
      <p>Dear ${name},</p>
      <p>This is a gentle reminder that your fee payment of <strong>₹${amount.toLocaleString('en-IN')}</strong> is due on <strong>${dueDate}</strong>.</p>
      <p>To avoid late fine charges, please make the payment before the due date.</p>
      <div style="text-align:center;"><a href="${process.env.APP_URL}/fees" class="btn">Pay Online Now</a></div>
      <p style="font-size:13px;color:#8a9ab5;">If you have already made the payment, please disregard this reminder.</p>
    `)
  }

  private admissionTemplate(name: string, admissionNo: string) {
    return this.baseTemplate(`
      <h2>Admission Confirmed ✓</h2>
      <p>Dear ${name},</p>
      <p>We are pleased to inform you that your admission to KVL International School has been confirmed.</p>
      <div style="background:#f5f0ea;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
        <p style="margin:0;font-size:13px;color:#8a9ab5;text-transform:uppercase;letter-spacing:2px;">Admission Number</p>
        <p style="margin:8px 0 0;font-size:28px;font-weight:700;color:#0a1628;">${admissionNo}</p>
      </div>
      <p>Please keep this admission number for all future correspondence. We look forward to welcoming you to our school family.</p>
      <div style="text-align:center;"><a href="${process.env.APP_URL}/admissions" class="btn">View Admission Details</a></div>
    `)
  }

  private examNotificationTemplate(name: string, examTitle: string, examDate: string) {
    return this.baseTemplate(`
      <h2>Exam Scheduled: ${examTitle}</h2>
      <p>Dear ${name},</p>
      <p>Your exam <strong>${examTitle}</strong> has been scheduled for <strong>${examDate}</strong>.</p>
      <p>Please ensure you log in on time and have a stable internet connection for online exams.</p>
      <div style="text-align:center;"><a href="${process.env.APP_URL}/exams" class="btn">View Exam Details</a></div>
    `)
  }
}
