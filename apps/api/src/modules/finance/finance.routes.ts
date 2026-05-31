import { Router } from 'express'
import { authenticate, authorize, requirePermission } from '../../common/guards/auth.guard'
import { FinanceController } from './finance.controller'

const router = Router()
const ctrl = new FinanceController()

router.use(authenticate)

// Fee Structure (admin only)
router.get('/fee-structure',          ctrl.getFeeStructures)
router.post('/fee-structure',         authorize('super_admin','principal','accountant'), ctrl.createFeeStructure)
router.put('/fee-structure/:id',      authorize('super_admin','principal','accountant'), ctrl.updateFeeStructure)

// Invoices
router.get('/invoices',               requirePermission('finance:view'), ctrl.getInvoices)
router.get('/invoices/:id',           requirePermission('finance:view'), ctrl.getInvoice)
router.post('/invoices',              requirePermission('finance:create'), ctrl.createInvoice)
router.post('/invoices/bulk',         requirePermission('finance:create'), ctrl.bulkGenerateInvoices)

// Payments
router.post('/payments/create-order', ctrl.createRazorpayOrder)
router.post('/payments/verify',       ctrl.verifyPayment)
router.post('/payments/cash',         requirePermission('finance:collect'), ctrl.recordCashPayment)
router.get('/payments',               requirePermission('finance:view'), ctrl.getPayments)
router.get('/payments/receipt/:id',   ctrl.downloadReceipt)

// Transactions
router.get('/transactions',           requirePermission('finance:view'), ctrl.getTransactions)
router.post('/transactions',          requirePermission('finance:create'), ctrl.createTransaction)

// Reports
router.get('/reports/collection',     requirePermission('finance:reports'), ctrl.collectionReport)
router.get('/reports/outstanding',    requirePermission('finance:reports'), ctrl.outstandingReport)
router.get('/reports/monthly',        requirePermission('finance:reports'), ctrl.monthlyReport)
router.get('/reports/export',         requirePermission('finance:reports'), ctrl.exportReport)

// Scholarships
router.get('/scholarships',           ctrl.getScholarships)
router.post('/scholarships',          authorize('super_admin','principal'), ctrl.createScholarship)
router.post('/scholarships/assign',   authorize('super_admin','principal','accountant'), ctrl.assignScholarship)

export default router
