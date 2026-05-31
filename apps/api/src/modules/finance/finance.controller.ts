import { Request, Response, NextFunction } from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import {
  FeeStructure, FeeInvoice, Payment, Transaction, Scholarship
} from './finance.model'
import { AuthenticatedRequest } from '../../common/guards/auth.guard'
import { AppError } from '../../common/filters/app.error'
import { cacheGet, cacheSet } from '../../database/redis'
import { prisma } from '../../database/prisma'

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export class FinanceController {
  async getFeeStructures(req: Request, res: Response, next: NextFunction) {
    try {
      const { session, class: cls } = req.query
      const filter: Record<string, unknown> = {}
      if (session) filter.session = session
      if (cls) filter.class = cls
      const structures = await FeeStructure.find(filter).lean()
      res.json({ success: true, data: structures })
    } catch (err) { next(err) }
  }

  async createFeeStructure(req: Request, res: Response, next: NextFunction) {
    try {
      const structure = await FeeStructure.create(req.body)
      res.status(201).json({ success: true, data: structure })
    } catch (err) { next(err) }
  }

  async updateFeeStructure(req: Request, res: Response, next: NextFunction) {
    try {
      const s = await FeeStructure.findByIdAndUpdate(req.params.id, req.body, { new: true })
      if (!s) throw new AppError('Fee structure not found.', 404)
      res.json({ success: true, data: s })
    } catch (err) { next(err) }
  }

  async getInvoices(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId, status, session, page = 1, limit = 20 } = req.query
      const filter: Record<string, unknown> = {}
      if (studentId) filter.studentId = studentId
      if (status)    filter.status = status
      if (session)   filter.session = session

      const [invoices, total] = await Promise.all([
        FeeInvoice.find(filter)
          .sort({ createdAt: -1 })
          .skip((+page - 1) * +limit)
          .limit(+limit)
          .populate('studentId', 'admissionNo class section')
          .lean(),
        FeeInvoice.countDocuments(filter),
      ])

      res.json({ success: true, data: invoices, meta: { total, page: +page, limit: +limit } })
    } catch (err) { next(err) }
  }

  async getInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const invoice = await FeeInvoice.findById(req.params.id).populate('studentId').lean()
      if (!invoice) throw new AppError('Invoice not found.', 404)
      res.json({ success: true, data: invoice })
    } catch (err) { next(err) }
  }

  async createInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const invoice = await FeeInvoice.create(req.body)
      res.status(201).json({ success: true, data: invoice })
    } catch (err) { next(err) }
  }

  async bulkGenerateInvoices(req: Request, res: Response, next: NextFunction) {
    try {
      const { session, class: cls, section, month, dueDate } = req.body
      res.json({ success: true, message: 'Bulk invoice generation queued.', data: { session, class: cls, section, month } })
    } catch (err) { next(err) }
  }

  async createRazorpayOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { invoiceId, amount } = req.body
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: `inv_${invoiceId}`,
        notes: { invoiceId },
      })
      res.json({ success: true, data: { orderId: order.id, amount: order.amount, currency: order.currency } })
    } catch (err) { next(err) }
  }

  async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature, invoiceId } = req.body

      const body = `${razorpayOrderId}|${razorpayPaymentId}`
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest('hex')

      if (expectedSignature !== razorpaySignature) {
        throw new AppError('Payment verification failed. Invalid signature.', 400)
      }

      const invoice = await FeeInvoice.findById(invoiceId)
      if (!invoice) throw new AppError('Invoice not found.', 404)

      const payment = await Payment.create({
        invoiceId,
        studentId: invoice.studentId,
        amount: invoice.balance,
        method: 'online',
        status: 'success',
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        receiptNo: `RCP-${Date.now()}`,
        paidBy: (req as AuthenticatedRequest).user.id,
        paidAt: new Date(),
      })

      invoice.paidAmount += payment.amount
      invoice.balance = invoice.totalAmount - invoice.paidAmount
      invoice.status = invoice.balance <= 0 ? 'paid' : 'partial'
      await invoice.save()

      res.json({ success: true, data: payment, message: 'Payment verified and recorded.' })
    } catch (err) { next(err) }
  }

  async recordCashPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { invoiceId, amount, remarks } = req.body
      const invoice = await FeeInvoice.findById(invoiceId)
      if (!invoice) throw new AppError('Invoice not found.', 404)

      const payment = await Payment.create({
        invoiceId,
        studentId: invoice.studentId,
        amount,
        method: 'cash',
        status: 'success',
        receiptNo: `RCP-CASH-${Date.now()}`,
        paidBy: (req as AuthenticatedRequest).user.id,
        remarks,
        paidAt: new Date(),
      })

      invoice.paidAmount += amount
      invoice.balance = invoice.totalAmount - invoice.paidAmount
      invoice.status = invoice.balance <= 0 ? 'paid' : 'partial'
      await invoice.save()

      res.status(201).json({ success: true, data: payment })
    } catch (err) { next(err) }
  }

  async getPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId, status, from, to, page = 1, limit = 20 } = req.query
      const filter: Record<string, unknown> = {}
      if (studentId) filter.studentId = studentId
      if (status)    filter.status = status
      if (from || to) filter.paidAt = { ...(from && { $gte: from }), ...(to && { $lte: to }) }

      const [payments, total] = await Promise.all([
        Payment.find(filter).sort({ paidAt: -1 }).skip((+page - 1) * +limit).limit(+limit).lean(),
        Payment.countDocuments(filter),
      ])
      res.json({ success: true, data: payments, meta: { total, page: +page, limit: +limit } })
    } catch (err) { next(err) }
  }

  async downloadReceipt(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, message: 'Receipt PDF generation endpoint.' })
    } catch (err) { next(err) }
  }

  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const transactions = await Transaction.find({}).sort({ date: -1 }).limit(50).lean()
      res.json({ success: true, data: transactions })
    } catch (err) { next(err) }
  }

  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const tx = await Transaction.create({ ...req.body, addedBy: (req as AuthenticatedRequest).user.id })
      res.status(201).json({ success: true, data: tx })
    } catch (err) { next(err) }
  }

  async collectionReport(_req: Request, res: Response, next: NextFunction) {
    try {
      const [total, paid, pending] = await Promise.all([
        FeeInvoice.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
        FeeInvoice.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
        FeeInvoice.aggregate([{ $match: { status: { $in: ['pending', 'overdue'] } } }, { $group: { _id: null, total: { $sum: '$balance' } } }]),
      ])
      res.json({ success: true, data: { total: total[0]?.total ?? 0, paid: paid[0]?.total ?? 0, pending: pending[0]?.total ?? 0 } })
    } catch (err) { next(err) }
  }

  async outstandingReport(req: Request, res: Response, next: NextFunction) {
    try {
      const outstanding = await FeeInvoice.find({ status: { $in: ['pending', 'overdue'] } })
        .populate('studentId', 'admissionNo class section').sort({ dueDate: 1 }).lean()
      res.json({ success: true, data: outstanding })
    } catch (err) { next(err) }
  }

  async monthlyReport(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, data: [] })
    } catch (err) { next(err) }
  }

  async exportReport(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, message: 'Export queued.' })
    } catch (err) { next(err) }
  }

  async getScholarships(_req: Request, res: Response, next: NextFunction) {
    try {
      const scholarships = await Scholarship.find({ isActive: true }).lean()
      res.json({ success: true, data: scholarships })
    } catch (err) { next(err) }
  }

  async createScholarship(req: Request, res: Response, next: NextFunction) {
    try {
      const s = await Scholarship.create(req.body)
      res.status(201).json({ success: true, data: s })
    } catch (err) { next(err) }
  }

  async assignScholarship(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, message: 'Scholarship assigned.' })
    } catch (err) { next(err) }
  }

  // ─── PostgreSQL / Prisma endpoints ───────────────────────────────────────

  /** GET /finance/fee-payments — list FeePayment rows from PostgreSQL */
  async getPgFeePayments(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId, status, class: cls, feeType, page = 1, limit = 20 } = req.query
      const where: Record<string, unknown> = {}
      if (studentId) where.studentId = studentId as string
      if (status)    where.status    = status as string
      if (cls)       where.class     = cls as string
      if (feeType)   where.feeType   = feeType as string

      const [payments, total] = await Promise.all([
        prisma.feePayment.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip:  (+page - 1) * +limit,
          take:  +limit,
        }),
        prisma.feePayment.count({ where }),
      ])

      res.json({ success: true, data: payments, meta: { total, page: +page, limit: +limit } })
    } catch (err) { next(err) }
  }

  /** POST /finance/fee-payments — create a FeePayment row in PostgreSQL */
  async createPgFeePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        studentId, studentName, class: cls, feeType,
        amount, paidAmount, dueDate, paidDate,
        status, paymentMode, transactionId, razorpayOrderId, receipt,
      } = req.body

      if (!studentId || !studentName || !cls || !feeType || amount == null)
        throw new AppError('studentId, studentName, class, feeType and amount are required.', 400)

      const payment = await prisma.feePayment.create({
        data: {
          studentId,
          studentName,
          class:          cls,
          feeType,
          amount,
          paidAmount:     paidAmount ?? 0,
          dueDate:        dueDate ? new Date(dueDate) : new Date(),
          paidDate:       paidDate ? new Date(paidDate) : null,
          status:         status ?? 'PENDING',
          paymentMode:    paymentMode ?? null,
          transactionId:  transactionId ?? null,
          razorpayOrderId: razorpayOrderId ?? null,
          receipt:        receipt ?? null,
        },
      })

      res.status(201).json({ success: true, data: payment })
    } catch (err) { next(err) }
  }

  /** GET /finance/dashboard-stats — aggregate fee stats from PostgreSQL */
  async getPgDashboardStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const [totalCollected, totalPending, totalOverdue, statusCounts] = await Promise.all([
        prisma.feePayment.aggregate({
          _sum: { paidAmount: true },
          where: { status: 'PAID' },
        }),
        prisma.feePayment.aggregate({
          _sum: { amount: true },
          where: { status: 'PENDING' },
        }),
        prisma.feePayment.aggregate({
          _sum: { amount: true },
          where: { status: 'OVERDUE' },
        }),
        prisma.feePayment.groupBy({
          by: ['status'],
          _count: { id: true },
          _sum:   { amount: true, paidAmount: true },
        }),
      ])

      res.json({
        success: true,
        data: {
          totalCollected: totalCollected._sum.paidAmount ?? 0,
          totalPending:   totalPending._sum.amount       ?? 0,
          totalOverdue:   totalOverdue._sum.amount       ?? 0,
          byStatus:       statusCounts.map((s) => ({
            status: s.status,
            count:  s._count.id,
            amount: s._sum.amount,
            paid:   s._sum.paidAmount,
          })),
        },
      })
    } catch (err) { next(err) }
  }
}
