import { Router } from 'express'
import { authenticate, authorize } from '../../common/guards/auth.guard'
import { LibraryController } from './library.controller'

const router = Router()
const ctrl   = new LibraryController()

router.use(authenticate)

// Books
router.get('/',                        ctrl.getBooks.bind(ctrl))
router.post('/',                       authorize('super_admin','admin','librarian'),  ctrl.addBook.bind(ctrl))
router.put('/:id',                     authorize('super_admin','admin','librarian'),  ctrl.updateBook.bind(ctrl))
router.delete('/:id',                  authorize('super_admin','librarian'),          ctrl.deleteBook)
router.get('/stats',                   ctrl.getStats.bind(ctrl))
router.get('/export',                  authorize('super_admin','librarian'),          ctrl.exportCatalog)
router.get('/overdue',                 authorize('super_admin','admin','librarian'),  ctrl.getOverdueBooks.bind(ctrl))
router.post('/overdue/reminders',      authorize('super_admin','librarian'),          ctrl.sendFineReminders)

// Issue / Return
router.post('/issue',                  authorize('super_admin','admin','librarian'),  ctrl.issueBook.bind(ctrl))
router.put('/return/:id',              authorize('super_admin','admin','librarian'),  ctrl.returnBook.bind(ctrl))

// Member history
router.get('/member/:memberId/history', ctrl.getMemberHistory.bind(ctrl))

export default router
