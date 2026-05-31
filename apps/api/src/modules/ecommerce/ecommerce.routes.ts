import { Router } from 'express'
import { authenticate, authorize } from '../../common/guards/auth.guard'
import { EcommerceController } from './ecommerce.controller'

const router = Router()
const ctrl   = new EcommerceController()

// Public — product browsing
router.get('/products',              ctrl.getProducts.bind(ctrl))
router.get('/products/:id',          ctrl.getProduct.bind(ctrl))
router.get('/categories',            ctrl.getCategories.bind(ctrl))

// Authenticated
router.use(authenticate)

// Cart (session/Redis backed)
router.get('/cart',                  ctrl.getCart)
router.post('/cart',                 ctrl.addToCart)
router.put('/cart/:itemId',          ctrl.updateCartItem)
router.delete('/cart/:itemId',       ctrl.removeFromCart)
router.delete('/cart',               ctrl.clearCart)

// Wishlist
router.get('/wishlist',              ctrl.getWishlist)
router.post('/wishlist',             ctrl.addToWishlist)
router.delete('/wishlist/:id',       ctrl.removeFromWishlist)

// Orders — own orders
router.get('/orders',                ctrl.getOrders.bind(ctrl))
router.post('/orders',               ctrl.createOrder.bind(ctrl))
router.get('/orders/:id',            ctrl.getOrder.bind(ctrl))
router.post('/orders/:id/payment',   ctrl.initiatePayment.bind(ctrl))
router.post('/orders/:id/verify',    ctrl.verifyOrderPayment.bind(ctrl))
router.post('/orders/:id/cancel',    ctrl.cancelOrder)

// Reviews
router.post('/products/:id/review',  ctrl.addReview.bind(ctrl))

// Coupons
router.post('/coupons/validate',     ctrl.validateCoupon)

// Admin
router.post('/products',             authorize('super_admin','admin'), ctrl.createProduct.bind(ctrl))
router.put('/products/:id',          authorize('super_admin','admin'), ctrl.updateProduct.bind(ctrl))
router.delete('/products/:id',       authorize('super_admin','admin'), ctrl.deleteProduct.bind(ctrl))
router.get('/admin/orders',          authorize('super_admin','admin'), ctrl.getAllOrders.bind(ctrl))
router.put('/admin/orders/:id',      authorize('super_admin','admin'), ctrl.updateOrderStatus.bind(ctrl))
router.get('/admin/inventory',       authorize('super_admin','admin'), ctrl.getInventory.bind(ctrl))
router.post('/admin/coupons',        authorize('super_admin','admin'), ctrl.createCoupon)
router.get('/admin/reports',         authorize('super_admin','admin'), ctrl.getEcommerceReports)

export default router
