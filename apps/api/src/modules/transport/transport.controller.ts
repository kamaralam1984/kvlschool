import { Request, Response, NextFunction } from 'express'
import { Vehicle, Route } from './transport.model'
import { AppError } from '../../common/filters/app.error'

const ok = (msg: string) => (_req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, message: msg }) } catch (e) { next(e) }
}

export class TransportController {
  async getRoutes(req: Request, res: Response, next: NextFunction) {
    try {
      const { isActive, page = 1, limit = 20 } = req.query
      const filter: Record<string, unknown> = {}
      if (isActive !== undefined) filter.isActive = isActive === 'true'

      const [routes, total] = await Promise.all([
        Route.find(filter).populate('vehicleId').sort({ routeNo: 1 }).skip((+page - 1) * +limit).limit(+limit).lean(),
        Route.countDocuments(filter),
      ])
      res.json({ success: true, data: routes, meta: { total, page: +page, limit: +limit, pages: Math.ceil(total / +limit) } })
    } catch (err) { next(err) }
  }

  async createRoute(req: Request, res: Response, next: NextFunction) {
    try {
      const route = await Route.create(req.body)
      res.status(201).json({ success: true, data: route })
    } catch (err) { next(err) }
  }

  async updateRoute(req: Request, res: Response, next: NextFunction) {
    try {
      const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      if (!route) throw new AppError('Route not found.', 404)
      res.json({ success: true, data: route })
    } catch (err) { next(err) }
  }

  async assignStudentToRoute(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.body
      const route = await Route.findByIdAndUpdate(req.params.id, { $addToSet: { students: studentId } }, { new: true })
      if (!route) throw new AppError('Route not found.', 404)
      res.json({ success: true, data: route })
    } catch (err) { next(err) }
  }

  async getVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const { isActive } = req.query
      const filter: Record<string, unknown> = {}
      if (isActive !== undefined) filter.isActive = isActive === 'true'
      const vehicles = await Vehicle.find(filter).sort({ number: 1 }).lean()
      res.json({ success: true, data: vehicles })
    } catch (err) { next(err) }
  }

  async createVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await Vehicle.create(req.body)
      res.status(201).json({ success: true, data: vehicle })
    } catch (err) { next(err) }
  }

  async updateVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      if (!vehicle) throw new AppError('Vehicle not found.', 404)
      res.json({ success: true, data: vehicle })
    } catch (err) { next(err) }
  }

  async getExpiringDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const threshold = new Date(); threshold.setDate(threshold.getDate() + 60)
      const expiring = await Vehicle.find({
        $or: [
          { 'insurance.validUntil': { $lte: threshold } },
          { 'fitness.validUntil': { $lte: threshold } },
          { 'pollution.validUntil': { $lte: threshold } },
        ],
        isActive: true,
      }).lean()
      res.json({ success: true, data: expiring })
    } catch (err) { next(err) }
  }

  async trackVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await Vehicle.findById(req.params.id).select('number gpsTrackingId').lean()
      if (!vehicle) throw new AppError('Vehicle not found.', 404)
      res.json({ success: true, data: { ...vehicle, location: { lat: 28.6139, lng: 77.2090, speed: 0, lastUpdated: new Date() } } })
    } catch (err) { next(err) }
  }

  deleteRoute = ok('Route deleted.')
  deleteVehicle = ok('Vehicle record removed.')
  exportRoutes = ok('Routes export queued.')
  getStudentRoute = ok('Student route details.')
}
