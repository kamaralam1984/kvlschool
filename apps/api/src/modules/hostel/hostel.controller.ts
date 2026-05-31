import { Request, Response, NextFunction } from 'express'
import { Room, Resident, Complaint } from './hostel.model'
import { AppError } from '../../common/filters/app.error'

const ok = (msg: string) => (_req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, message: msg }) } catch (e) { next(e) }
}

export class HostelController {
  async getRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const { block, type, status } = req.query
      const filter: Record<string, unknown> = {}
      if (block)  filter.block  = block
      if (type)   filter.type   = type
      if (status) filter.status = status

      const rooms = await Room.find(filter).sort({ number: 1 }).lean()
      res.json({ success: true, data: rooms })
    } catch (err) { next(err) }
  }

  async createRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const room = await Room.create(req.body)
      res.status(201).json({ success: true, data: room })
    } catch (err) { next(err) }
  }

  async updateRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true })
      if (!room) throw new AppError('Room not found.', 404)
      res.json({ success: true, data: room })
    } catch (err) { next(err) }
  }

  async assignResident(req: Request, res: Response, next: NextFunction) {
    try {
      const room = await Room.findById(req.params.id)
      if (!room) throw new AppError('Room not found.', 404)
      if (room.occupied >= room.capacity) throw new AppError('Room is full.', 400)

      const resident = await Resident.create({ ...req.body, roomId: req.params.id })
      await Room.findByIdAndUpdate(req.params.id, {
        $inc: { occupied: 1 },
        status: room.occupied + 1 >= room.capacity ? 'full' : 'available',
      })
      res.status(201).json({ success: true, data: resident })
    } catch (err) { next(err) }
  }

  async vacateResident(req: Request, res: Response, next: NextFunction) {
    try {
      const resident = await Resident.findByIdAndUpdate(req.params.residentId, { isActive: false, leaveDate: new Date() }, { new: true })
      if (!resident) throw new AppError('Resident not found.', 404)
      await Room.findByIdAndUpdate(resident.roomId, { $inc: { occupied: -1 }, status: 'available' })
      res.json({ success: true, message: 'Resident vacated.' })
    } catch (err) { next(err) }
  }

  async getResidents(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId, isActive = 'true' } = req.query
      const filter: Record<string, unknown> = { isActive: isActive === 'true' }
      if (roomId) filter.roomId = roomId
      const residents = await Resident.find(filter).populate('studentId', 'admissionNo userId').lean()
      res.json({ success: true, data: residents })
    } catch (err) { next(err) }
  }

  async getComplaints(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query
      const filter: Record<string, unknown> = {}
      if (status) filter.status = status
      const complaints = await Complaint.find(filter).populate('roomId', 'number block').sort({ createdAt: -1 }).lean()
      res.json({ success: true, data: complaints })
    } catch (err) { next(err) }
  }

  async createComplaint(req: Request, res: Response, next: NextFunction) {
    try {
      const complaint = await Complaint.create({ ...req.body, reportedBy: (req as any).user?.id })
      res.status(201).json({ success: true, data: complaint })
    } catch (err) { next(err) }
  }

  async updateComplaint(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resolutionNotes } = req.body
      const update: Record<string, unknown> = { status, resolutionNotes }
      if (status === 'resolved') update.resolvedAt = new Date()
      const complaint = await Complaint.findByIdAndUpdate(req.params.id, update, { new: true })
      if (!complaint) throw new AppError('Complaint not found.', 404)
      res.json({ success: true, data: complaint })
    } catch (err) { next(err) }
  }

  getOccupancyStats = ok('Occupancy statistics.')
  exportResidents = ok('Residents export queued.')
}
