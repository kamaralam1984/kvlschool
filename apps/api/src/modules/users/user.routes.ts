import { Router } from 'express'
import { authenticate, authorize } from '../../common/guards/auth.guard'
import { User } from './user.model'
import { AppError } from '../../common/filters/app.error'

const router = Router()

router.use(authenticate)

// Get all users (admin only)
router.get('/', authorize('super_admin','admin'), async (req, res, next) => {
  try {
    const { role, isActive, search, page = 1, limit = 20 } = req.query
    const filter: Record<string, unknown> = {}
    if (role)     filter.role     = role
    if (isActive !== undefined) filter.isActive = isActive === 'true'
    if (search)   filter.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]

    const [users, total] = await Promise.all([
      User.find(filter).select('-password -totpSecret -emailVerifyToken')
        .sort({ name: 1 }).skip((+page-1)*+limit).limit(+limit).lean(),
      User.countDocuments(filter),
    ])
    res.json({ success: true, data: users, meta: { total, page: +page, limit: +limit, pages: Math.ceil(total/+limit) } })
  } catch (err) { next(err) }
})

// Get own profile
router.get('/me', async (req, res, next) => {
  try {
    const user = await User.findById((req as any).user?.id).select('-password -totpSecret -emailVerifyToken').lean()
    if (!user) throw new AppError('User not found.', 404)
    res.json({ success: true, data: user })
  } catch (err) { next(err) }
})

// Update own profile
router.put('/me', async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'avatar', 'address']
    const update  = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)))
    const user    = await User.findByIdAndUpdate((req as any).user?.id, update, { new: true }).select('-password').lean()
    if (!user) throw new AppError('User not found.', 404)
    res.json({ success: true, data: user })
  } catch (err) { next(err) }
})

// Get specific user (admin)
router.get('/:id', authorize('super_admin','admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -totpSecret').lean()
    if (!user) throw new AppError('User not found.', 404)
    res.json({ success: true, data: user })
  } catch (err) { next(err) }
})

// Update user (admin)
router.put('/:id', authorize('super_admin','admin'), async (req, res, next) => {
  try {
    const forbidden = ['password', 'totpSecret', 'emailVerifyToken']
    forbidden.forEach(k => delete req.body[k])
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password').lean()
    if (!user) throw new AppError('User not found.', 404)
    res.json({ success: true, data: user })
  } catch (err) { next(err) }
})

// Deactivate user (super_admin only)
router.delete('/:id', authorize('super_admin'), async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false })
    res.json({ success: true, message: 'User deactivated.' })
  } catch (err) { next(err) }
})

// Change role (super_admin only)
router.patch('/:id/role', authorize('super_admin'), async (req, res, next) => {
  try {
    const { role } = req.body
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password').lean()
    if (!user) throw new AppError('User not found.', 404)
    res.json({ success: true, data: user })
  } catch (err) { next(err) }
})

// Reset password (admin)
router.post('/:id/reset-password', authorize('super_admin','admin'), async (req, res, next) => {
  try {
    const bcrypt = await import('bcryptjs')
    const hashed = await bcrypt.hash(req.body.password ?? 'KVL@1234', 12)
    await User.findByIdAndUpdate(req.params.id, { password: hashed })
    res.json({ success: true, message: 'Password reset successfully.' })
  } catch (err) { next(err) }
})

export default router
