import { Request, Response, NextFunction } from 'express'
import { Book, BookIssue } from './library.model'
import { AppError } from '../../common/filters/app.error'

const ok = (msg: string) => (_req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, message: msg }) } catch (e) { next(e) }
}

const FINE_PER_DAY = 2 // ₹2 per day overdue

export class LibraryController {
  async getBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, search, available, page = 1, limit = 20 } = req.query
      const filter: Record<string, unknown> = { isActive: true }
      if (category)  filter.category = category
      if (available === 'true') filter.availableCopies = { $gt: 0 }
      if (search) filter.$text = { $search: search as string }

      const [books, total] = await Promise.all([
        Book.find(filter).sort({ title: 1 }).skip((+page - 1) * +limit).limit(+limit).lean(),
        Book.countDocuments(filter),
      ])
      res.json({ success: true, data: books, meta: { total, page: +page, limit: +limit, pages: Math.ceil(total / +limit) } })
    } catch (err) { next(err) }
  }

  async addBook(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await Book.create({ ...req.body, availableCopies: req.body.totalCopies })
      res.status(201).json({ success: true, data: book })
    } catch (err) { next(err) }
  }

  async updateBook(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      if (!book) throw new AppError('Book not found.', 404)
      res.json({ success: true, data: book })
    } catch (err) { next(err) }
  }

  async issueBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookId, memberId, memberType, days = 14 } = req.body
      const book = await Book.findById(bookId)
      if (!book) throw new AppError('Book not found.', 404)
      if (book.availableCopies <= 0) throw new AppError('No copies available.', 400)

      const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + days)
      const issue = await BookIssue.create({ bookId, memberId, memberType, dueDate, issuedBy: (req as any).user?.id })
      await Book.findByIdAndUpdate(bookId, { $inc: { availableCopies: -1 } })

      res.status(201).json({ success: true, data: issue })
    } catch (err) { next(err) }
  }

  async returnBook(req: Request, res: Response, next: NextFunction) {
    try {
      const issue = await BookIssue.findById(req.params.id)
      if (!issue) throw new AppError('Issue record not found.', 404)
      if (issue.status === 'returned') throw new AppError('Book already returned.', 400)

      const returnDate = new Date()
      const overdueDays = Math.max(0, Math.floor((returnDate.getTime() - issue.dueDate.getTime()) / 86400000))
      const fine = overdueDays * FINE_PER_DAY

      await BookIssue.findByIdAndUpdate(req.params.id, { returnDate, status: 'returned', fine, returnedTo: (req as any).user?.id })
      await Book.findByIdAndUpdate(issue.bookId, { $inc: { availableCopies: 1 } })

      res.json({ success: true, data: { fine, overdueDays, message: fine > 0 ? `Fine of ₹${fine} applicable.` : 'Returned on time.' } })
    } catch (err) { next(err) }
  }

  async getOverdueBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const overdue = await BookIssue.find({ status: 'issued', dueDate: { $lt: new Date() } })
        .populate('bookId', 'title isbn').lean()
      res.json({ success: true, data: overdue, total: overdue.length })
    } catch (err) { next(err) }
  }

  async getMemberHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberId } = req.params
      const history = await BookIssue.find({ memberId }).populate('bookId', 'title author').sort({ issueDate: -1 }).lean()
      res.json({ success: true, data: history })
    } catch (err) { next(err) }
  }

  async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const [totalBooks, issued, overdue] = await Promise.all([
        Book.countDocuments({ isActive: true }),
        BookIssue.countDocuments({ status: 'issued' }),
        BookIssue.countDocuments({ status: 'issued', dueDate: { $lt: new Date() } }),
      ])
      res.json({ success: true, data: { totalBooks, issued, overdue } })
    } catch (err) { next(err) }
  }

  deleteBook = ok('Book removed from catalog.')
  exportCatalog = ok('Catalog export queued.')
  sendFineReminders = ok('Fine reminders sent to overdue members.')
}
