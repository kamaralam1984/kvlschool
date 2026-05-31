import { Request, Response, NextFunction } from 'express'
import { Student } from '../students/student.model'
import { Teacher } from '../teachers/teacher.model'
import { Attendance } from '../attendance/attendance.model'

export class AnalyticsController {
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const [totalStudents, totalTeachers] = await Promise.all([
        Student.countDocuments({ isActive: true }),
        Teacher.countDocuments({ isActive: true }),
      ])
      res.json({
        success: true,
        data: {
          totalStudents,
          totalTeachers,
          totalClasses: 28,
          attendanceRate: 93.8,
          feeCollectionRate: 94.2,
          passRate: 96.8,
        },
      })
    } catch (err) { next(err) }
  }

  async getAttendanceAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const { session, class: cls } = req.query
      const matchFilter: Record<string, unknown> = {}
      if (session) matchFilter.session = session
      if (cls)     matchFilter.class   = cls

      const data = await Attendance.aggregate([
        { $match: matchFilter },
        { $unwind: '$records' },
        { $group: {
          _id: { month: { $month: '$date' }, year: { $year: '$date' }, status: '$records.status' },
          count: { $sum: 1 },
        }},
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ])
      res.json({ success: true, data })
    } catch (err) { next(err) }
  }

  async getClassPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const performance = [
        { class: 'XII-A', avgScore: 86, attendance: 96.2, passRate: 100 },
        { class: 'XII-B', avgScore: 81, attendance: 94.8, passRate: 97.0 },
        { class: 'XI-A',  avgScore: 79, attendance: 93.5, passRate: 97.2 },
        { class: 'XI-B',  avgScore: 77, attendance: 92.1, passRate: 100  },
        { class: 'X-A',   avgScore: 82, attendance: 95.3, passRate: 97.6 },
        { class: 'X-B',   avgScore: 78, attendance: 93.8, passRate: 94.9 },
      ]
      res.json({ success: true, data: performance })
    } catch (err) { next(err) }
  }

  async getFeeAnalytics(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        success: true,
        data: {
          totalAnnualFee:    12400000,
          collected:         11680000,
          pending:            720000,
          collectionRate:    94.2,
          monthlyBreakdown: [
            { month: 'Jan', collected: 1850000 },
            { month: 'Feb', collected: 1920000 },
            { month: 'Mar', collected: 2100000 },
            { month: 'Apr', collected: 1780000 },
            { month: 'May', collected: 2030000 },
          ],
        },
      })
    } catch (err) { next(err) }
  }

  async getTeacherAnalytics(_req: Request, res: Response, next: NextFunction) {
    try {
      const byDept = await Teacher.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$department', count: { $sum: 1 }, avgExp: { $avg: '$totalExperience' } } },
        { $sort: { count: -1 } },
      ])
      res.json({ success: true, data: byDept })
    } catch (err) { next(err) }
  }

  async getStudentGrowth(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        success: true,
        data: [
          { year: '2021-22', enrolled: 3820 },
          { year: '2022-23', enrolled: 3950 },
          { year: '2023-24', enrolled: 4090 },
          { year: '2024-25', enrolled: 4180 },
          { year: '2025-26', enrolled: 4218 },
        ],
      })
    } catch (err) { next(err) }
  }

  async generateReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.params
      res.json({ success: true, message: `${type} report generation queued. Download link will be emailed.` })
    } catch (err) { next(err) }
  }
}
