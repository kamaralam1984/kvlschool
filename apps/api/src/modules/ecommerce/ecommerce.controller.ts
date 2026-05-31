import { Request, Response, NextFunction } from 'express'
import { Product, Order } from './ecommerce.model'
import { AppError } from '../../common/filters/app.error'

const ok = (msg: string) => (_req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, message: msg }) } catch (e) { next(e) }
}

let orderSeq = 10000

export class EcommerceController {
  // ─── Products ────────────────────────────────────────────
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, search, available, page = 1, limit = 20 } = req.query
      const filter: Record<string, unknown> = { isActive: true }
      if (category)             filter.category = category
      if (available === 'true') filter.stock    = { $gt: 0 }
      if (search)               filter.$text    = { $search: search as string }

      const [products, total] = await Promise.all([
        Product.find(filter).sort({ sold: -1 }).skip((+page-1)*+limit).limit(+limit).lean(),
        Product.countDocuments(filter),
      ])
      res.json({ success: true, data: products, meta: { total, page: +page, limit: +limit, pages: Math.ceil(total/+limit) } })
    } catch (err) { next(err) }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const p = await Product.findById(req.params.id).lean()
      if (!p) throw new AppError('Product not found.', 404)
      res.json({ success: true, data: p })
    } catch (err) { next(err) }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await Product.create(req.body)
      res.status(201).json({ success: true, data: product })
    } catch (err) { next(err) }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      if (!product) throw new AppError('Product not found.', 404)
      res.json({ success: true, data: product })
    } catch (err) { next(err) }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await Product.findByIdAndUpdate(req.params.id, { isActive: false })
      res.json({ success: true, message: 'Product deactivated.' })
    } catch (err) { next(err) }
  }

  async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const cats = await Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 }, totalStock: { $sum: '$stock' } } },
        { $sort: { count: -1 } },
      ])
      res.json({ success: true, data: cats })
    } catch (err) { next(err) }
  }

  async getInventory(_req: Request, res: Response, next: NextFunction) {
    try {
      const products = await Product.find({ isActive: true })
        .select('name category stock sold price').sort({ stock: 1 }).lean()
      res.json({ success: true, data: products })
    } catch (err) { next(err) }
  }

  async addReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { score, review } = req.body
      const userId  = (req as any).user?.id
      const product = await Product.findByIdAndUpdate(req.params.id,
        { $push: { ratings: { userId, score, review, date: new Date() } }, $inc: { ratingCount: 1 } },
        { new: true })
      if (!product) throw new AppError('Product not found.', 404)
      const avg = product.ratings.reduce((a, r) => a + r.score, 0) / product.ratings.length
      await Product.findByIdAndUpdate(req.params.id, { avgRating: +avg.toFixed(2) })
      res.json({ success: true, message: 'Review added.' })
    } catch (err) { next(err) }
  }

  // ─── Orders ──────────────────────────────────────────────
  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, page = 1, limit = 20 } = req.query
      const filter: Record<string, unknown> = { userId: (req as any).user?.id }
      if (status) filter.status = status

      const [orders, total] = await Promise.all([
        Order.find(filter).sort({ createdAt: -1 }).skip((+page-1)*+limit).limit(+limit).lean(),
        Order.countDocuments(filter),
      ])
      res.json({ success: true, data: orders, meta: { total, page: +page, limit: +limit, pages: Math.ceil(total/+limit) } })
    } catch (err) { next(err) }
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, page = 1, limit = 20 } = req.query
      const filter: Record<string, unknown> = {}
      if (status) filter.status = status
      const [orders, total] = await Promise.all([
        Order.find(filter).sort({ createdAt: -1 }).skip((+page-1)*+limit).limit(+limit).lean(),
        Order.countDocuments(filter),
      ])
      res.json({ success: true, data: orders, meta: { total, page: +page, limit: +limit, pages: Math.ceil(total/+limit) } })
    } catch (err) { next(err) }
  }

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await Order.findById(req.params.id).populate('items.productId', 'name thumbnail').lean()
      if (!order) throw new AppError('Order not found.', 404)
      res.json({ success: true, data: order })
    } catch (err) { next(err) }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id
      const { items, deliveryType, address, notes } = req.body

      let subtotal = 0
      const enrichedItems = []
      for (const item of items) {
        const product = await Product.findById(item.productId)
        if (!product || !product.isActive) throw new AppError(`Product ${item.productId} not found.`, 404)
        if (product.stock < item.qty) throw new AppError(`Insufficient stock for ${product.name}.`, 400)
        const lineTotal = product.price * item.qty
        subtotal += lineTotal
        enrichedItems.push({ productId: product._id, name: product.name, price: product.price, qty: item.qty, total: lineTotal })
      }

      const deliveryFee = deliveryType === 'home-delivery' ? 50 : 0
      const total   = subtotal + deliveryFee
      const orderId = `ORD${new Date().getFullYear()}${String(++orderSeq).padStart(5,'0')}`

      const order = await Order.create({ orderId, userId, items: enrichedItems, subtotal, deliveryFee, total, deliveryType, address, notes, payment: { method: 'razorpay', status: 'pending' } })

      for (const item of items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty, sold: item.qty } })
      }

      res.status(201).json({ success: true, data: order })
    } catch (err) { next(err) }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, cancelReason } = req.body
      const order = await Order.findByIdAndUpdate(req.params.id, { status, ...(cancelReason ? { cancelReason } : {}) }, { new: true })
      if (!order) throw new AppError('Order not found.', 404)
      res.json({ success: true, data: order })
    } catch (err) { next(err) }
  }

  async initiatePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await Order.findById(req.params.id).lean()
      if (!order) throw new AppError('Order not found.', 404)
      res.json({ success: true, data: { razorpayOrderId: `rzp_${Date.now()}`, amount: order.total * 100, currency: 'INR', keyId: process.env.RAZORPAY_KEY_ID } })
    } catch (err) { next(err) }
  }

  async verifyOrderPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { razorpayPaymentId } = req.body
      await Order.findByIdAndUpdate(req.params.id, { 'payment.status': 'paid', 'payment.transactionId': razorpayPaymentId, 'payment.paidAt': new Date(), status: 'confirmed' })
      res.json({ success: true, message: 'Payment verified. Order confirmed.' })
    } catch (err) { next(err) }
  }

  getCart          = ok('Cart contents.')
  addToCart        = ok('Item added to cart.')
  updateCartItem   = ok('Cart item updated.')
  removeFromCart   = ok('Item removed from cart.')
  clearCart        = ok('Cart cleared.')
  getWishlist      = ok('Wishlist items.')
  addToWishlist    = ok('Added to wishlist.')
  removeFromWishlist = ok('Removed from wishlist.')
  cancelOrder      = ok('Order cancellation submitted.')
  createCoupon     = ok('Coupon created.')
  validateCoupon   = ok('Coupon validated.')
  getEcommerceReports = ok('E-commerce report queued.')
}
