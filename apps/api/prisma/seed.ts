import { PrismaClient, AttendanceStatus, FeeStatus } from '@prisma/client'

const prisma = new PrismaClient()

const students = [
  { id: '64a1b2c3d4e5f6a7b8c9d0e1', name: 'Aarav Sharma',    class: '10', section: 'A' },
  { id: '64a1b2c3d4e5f6a7b8c9d0e2', name: 'Priya Patel',     class: '10', section: 'A' },
  { id: '64a1b2c3d4e5f6a7b8c9d0e3', name: 'Rohit Verma',     class: '10', section: 'A' },
  { id: '64a1b2c3d4e5f6a7b8c9d0e4', name: 'Sneha Gupta',     class: '10', section: 'B' },
  { id: '64a1b2c3d4e5f6a7b8c9d0e5', name: 'Karan Mehta',     class: '9',  section: 'A' },
  { id: '64a1b2c3d4e5f6a7b8c9d0e6', name: 'Anjali Singh',    class: '9',  section: 'B' },
  { id: '64a1b2c3d4e5f6a7b8c9d0e7', name: 'Vikram Rao',      class: '11', section: 'A' },
  { id: '64a1b2c3d4e5f6a7b8c9d0e8', name: 'Neha Joshi',      class: '11', section: 'A' },
  { id: '64a1b2c3d4e5f6a7b8c9d0e9', name: 'Arjun Kumar',     class: '8',  section: 'A' },
  { id: '64a1b2c3d4e5f6a7b8c9d0ea', name: 'Pooja Nair',      class: '8',  section: 'B' },
]

const dates = [
  new Date('2025-01-06'),
  new Date('2025-01-07'),
  new Date('2025-01-08'),
]

const statuses: AttendanceStatus[] = [
  'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'LEAVE',
  'PRESENT', 'PRESENT', 'ABSENT', 'PRESENT', 'PRESENT',
  'PRESENT', 'LEAVE',   'PRESENT', 'PRESENT', 'ABSENT',
  'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT',  'PRESENT',
  'LEAVE',   'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT',
  'PRESENT', 'ABSENT',  'PRESENT', 'PRESENT', 'PRESENT',
]

async function seedAttendance() {
  console.log('Seeding attendance records...')
  let idx = 0
  for (const date of dates) {
    for (const student of students) {
      await prisma.attendanceRecord.upsert({
        where: { studentId_date: { studentId: student.id, date } },
        update: {},
        create: {
          studentId:   student.id,
          studentName: student.name,
          class:       student.class,
          section:     student.section,
          date,
          status:      statuses[idx % statuses.length],
          markedBy:    'teacher_001',
          remarks:     statuses[idx % statuses.length] === 'ABSENT' ? 'Not informed' : null,
        },
      })
      idx++
    }
  }
  console.log(`Created ${idx} attendance records`)
}

async function seedFeePayments() {
  console.log('Seeding fee payments...')
  const payments = [
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e1', studentName: 'Aarav Sharma',  class: '10', feeType: 'Tuition Fee', amount: 12000, paidAmount: 12000, dueDate: new Date('2025-01-10'), paidDate: new Date('2025-01-08'), status: 'PAID'    as FeeStatus, paymentMode: 'online',  transactionId: 'TXN_001', receipt: 'RCP_001' },
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e2', studentName: 'Priya Patel',    class: '10', feeType: 'Tuition Fee', amount: 12000, paidAmount: 12000, dueDate: new Date('2025-01-10'), paidDate: new Date('2025-01-09'), status: 'PAID'    as FeeStatus, paymentMode: 'online',  transactionId: 'TXN_002', receipt: 'RCP_002' },
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e3', studentName: 'Rohit Verma',    class: '10', feeType: 'Tuition Fee', amount: 12000, paidAmount:     0, dueDate: new Date('2025-01-10'), paidDate: null,                  status: 'OVERDUE' as FeeStatus, paymentMode: null,     transactionId: null,      receipt: null      },
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e4', studentName: 'Sneha Gupta',    class: '10', feeType: 'Tuition Fee', amount: 12000, paidAmount:  6000, dueDate: new Date('2025-01-10'), paidDate: new Date('2025-01-07'), status: 'PARTIAL' as FeeStatus, paymentMode: 'cash',    transactionId: 'TXN_004', receipt: 'RCP_004' },
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e5', studentName: 'Karan Mehta',    class: '9',  feeType: 'Tuition Fee', amount: 10000, paidAmount: 10000, dueDate: new Date('2025-01-10'), paidDate: new Date('2025-01-05'), status: 'PAID'    as FeeStatus, paymentMode: 'online',  transactionId: 'TXN_005', receipt: 'RCP_005' },
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e6', studentName: 'Anjali Singh',   class: '9',  feeType: 'Tuition Fee', amount: 10000, paidAmount:     0, dueDate: new Date('2025-01-10'), paidDate: null,                  status: 'PENDING' as FeeStatus, paymentMode: null,     transactionId: null,      receipt: null      },
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e7', studentName: 'Vikram Rao',     class: '11', feeType: 'Tuition Fee', amount: 14000, paidAmount: 14000, dueDate: new Date('2025-01-10'), paidDate: new Date('2025-01-10'), status: 'PAID'    as FeeStatus, paymentMode: 'cheque',  transactionId: 'TXN_007', receipt: 'RCP_007' },
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e8', studentName: 'Neha Joshi',     class: '11', feeType: 'Tuition Fee', amount: 14000, paidAmount:     0, dueDate: new Date('2024-12-10'), paidDate: null,                  status: 'OVERDUE' as FeeStatus, paymentMode: null,     transactionId: null,      receipt: null      },
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e9', studentName: 'Arjun Kumar',    class: '8',  feeType: 'Tuition Fee', amount: 9000,  paidAmount:  9000, dueDate: new Date('2025-01-10'), paidDate: new Date('2025-01-06'), status: 'PAID'    as FeeStatus, paymentMode: 'online',  transactionId: 'TXN_009', receipt: 'RCP_009' },
    { studentId: '64a1b2c3d4e5f6a7b8c9d0ea', studentName: 'Pooja Nair',     class: '8',  feeType: 'Tuition Fee', amount: 9000,  paidAmount:     0, dueDate: new Date('2025-01-10'), paidDate: null,                  status: 'PENDING' as FeeStatus, paymentMode: null,     transactionId: null,      receipt: null      },
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e1', studentName: 'Aarav Sharma',  class: '10', feeType: 'Lab Fee',     amount: 2000,  paidAmount:  2000, dueDate: new Date('2025-01-10'), paidDate: new Date('2025-01-08'), status: 'PAID'    as FeeStatus, paymentMode: 'online',  transactionId: 'TXN_011', receipt: 'RCP_011' },
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e2', studentName: 'Priya Patel',    class: '10', feeType: 'Lab Fee',     amount: 2000,  paidAmount:     0, dueDate: new Date('2024-12-10'), paidDate: null,                  status: 'OVERDUE' as FeeStatus, paymentMode: null,     transactionId: null,      receipt: null      },
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e5', studentName: 'Karan Mehta',    class: '9',  feeType: 'Sports Fee',  amount: 1500,  paidAmount:  1500, dueDate: new Date('2025-01-10'), paidDate: new Date('2025-01-03'), status: 'PAID'    as FeeStatus, paymentMode: 'cash',    transactionId: 'TXN_013', receipt: 'RCP_013' },
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e7', studentName: 'Vikram Rao',     class: '11', feeType: 'Library Fee', amount: 500,   paidAmount:   500, dueDate: new Date('2025-01-10'), paidDate: new Date('2025-01-10'), status: 'PAID'    as FeeStatus, paymentMode: 'cash',    transactionId: 'TXN_014', receipt: 'RCP_014' },
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e3', studentName: 'Rohit Verma',    class: '10', feeType: 'Sports Fee',  amount: 1500,  paidAmount:   750, dueDate: new Date('2025-01-10'), paidDate: new Date('2025-01-04'), status: 'PARTIAL' as FeeStatus, paymentMode: 'cash',    transactionId: 'TXN_015', receipt: 'RCP_015' },
  ]

  for (const p of payments) {
    await prisma.feePayment.upsert({
      where: { transactionId: p.transactionId ?? `NULL_${p.studentId}_${p.feeType}` },
      update: {},
      create: {
        studentId:    p.studentId,
        studentName:  p.studentName,
        class:        p.class,
        feeType:      p.feeType,
        amount:       p.amount,
        paidAmount:   p.paidAmount,
        dueDate:      p.dueDate,
        paidDate:     p.paidDate,
        status:       p.status,
        paymentMode:  p.paymentMode,
        transactionId: p.transactionId,
        receipt:      p.receipt,
      },
    })
  }
  console.log(`Created ${payments.length} fee payment records`)
}

async function seedExpenses() {
  console.log('Seeding expense records...')
  const expenses = [
    { category: 'Utilities',     description: 'Electricity bill - January 2025',        amount: 18500, vendor: 'BESCOM',               approvedBy: 'principal_001', status: 'approved', date: new Date('2025-01-05') },
    { category: 'Maintenance',   description: 'Classroom furniture repair',              amount: 12000, vendor: 'FurnitureFix Co.',      approvedBy: 'principal_001', status: 'approved', date: new Date('2025-01-06') },
    { category: 'Stationery',    description: 'Examination answer sheets bulk purchase', amount:  8750, vendor: 'PaperMart',             approvedBy: 'admin_001',     status: 'approved', date: new Date('2025-01-07') },
    { category: 'IT',            description: 'Annual antivirus subscription renewal',   amount: 15000, vendor: 'SecureIT Solutions',    approvedBy: 'principal_001', status: 'approved', date: new Date('2025-01-08') },
    { category: 'Utilities',     description: 'Water tanker supply',                     amount:  4200, vendor: 'AquaSupply',            approvedBy: 'admin_001',     status: 'approved', date: new Date('2025-01-09') },
    { category: 'Sports',        description: 'New cricket kit and equipment',            amount: 22000, vendor: 'SportZone',             approvedBy: 'principal_001', status: 'approved', date: new Date('2025-01-10') },
    { category: 'Library',       description: 'New books acquisition - NCERT 2025 ed',   amount: 35000, vendor: 'National Book Depot',   approvedBy: 'principal_001', status: 'pending',  date: new Date('2025-01-11') },
    { category: 'Maintenance',   description: 'CCTV camera servicing',                   amount:  6500, vendor: 'SafeVision Security',   approvedBy: 'admin_001',     status: 'approved', date: new Date('2025-01-12') },
    { category: 'Salary',        description: 'Guest faculty honorarium - Jan 2025',     amount: 45000, vendor: null,                    approvedBy: 'principal_001', status: 'approved', date: new Date('2025-01-15') },
    { category: 'Events',        description: 'Annual Day celebration expenses',          amount: 55000, vendor: 'EventPro',              approvedBy: 'principal_001', status: 'pending',  date: new Date('2025-01-20') },
  ]

  for (const e of expenses) {
    await prisma.expense.create({ data: e })
  }
  console.log(`Created ${expenses.length} expense records`)
}

async function seedTimetable() {
  console.log('Seeding timetable for Class 10A...')
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const periods = [
    { period: 1, startTime: '08:00', endTime: '08:45' },
    { period: 2, startTime: '08:45', endTime: '09:30' },
    { period: 3, startTime: '09:30', endTime: '10:15' },
    { period: 4, startTime: '10:30', endTime: '11:15' },
    { period: 5, startTime: '11:15', endTime: '12:00' },
    { period: 6, startTime: '12:45', endTime: '13:30' },
    { period: 7, startTime: '13:30', endTime: '14:15' },
    { period: 8, startTime: '14:15', endTime: '15:00' },
  ]

  const schedule: Record<string, { subject: string; teacherId: string; teacherName: string; room: string }[]> = {
    Monday:    [
      { subject: 'Mathematics',       teacherId: 'TCH_001', teacherName: 'Mr. Ramesh Iyer',      room: 'Room 101' },
      { subject: 'Physics',           teacherId: 'TCH_002', teacherName: 'Mrs. Lakshmi Devi',    room: 'Lab 1'    },
      { subject: 'English',           teacherId: 'TCH_003', teacherName: 'Ms. Preethi Nair',     room: 'Room 101' },
      { subject: 'Chemistry',         teacherId: 'TCH_004', teacherName: 'Mr. Suresh Babu',      room: 'Lab 2'    },
      { subject: 'Hindi',             teacherId: 'TCH_005', teacherName: 'Mrs. Kavita Sharma',   room: 'Room 101' },
      { subject: 'Biology',           teacherId: 'TCH_006', teacherName: 'Dr. Anand Pillai',     room: 'Lab 3'    },
      { subject: 'Social Science',    teacherId: 'TCH_007', teacherName: 'Mr. Vijay Kumar',      room: 'Room 101' },
      { subject: 'Computer Science',  teacherId: 'TCH_008', teacherName: 'Ms. Divya Menon',      room: 'Comp Lab' },
    ],
    Tuesday:   [
      { subject: 'Physics',           teacherId: 'TCH_002', teacherName: 'Mrs. Lakshmi Devi',    room: 'Lab 1'    },
      { subject: 'Mathematics',       teacherId: 'TCH_001', teacherName: 'Mr. Ramesh Iyer',      room: 'Room 101' },
      { subject: 'Chemistry',         teacherId: 'TCH_004', teacherName: 'Mr. Suresh Babu',      room: 'Lab 2'    },
      { subject: 'English',           teacherId: 'TCH_003', teacherName: 'Ms. Preethi Nair',     room: 'Room 101' },
      { subject: 'Computer Science',  teacherId: 'TCH_008', teacherName: 'Ms. Divya Menon',      room: 'Comp Lab' },
      { subject: 'Hindi',             teacherId: 'TCH_005', teacherName: 'Mrs. Kavita Sharma',   room: 'Room 101' },
      { subject: 'Mathematics',       teacherId: 'TCH_001', teacherName: 'Mr. Ramesh Iyer',      room: 'Room 101' },
      { subject: 'Physical Education',teacherId: 'TCH_009', teacherName: 'Mr. Rajan Pillai',     room: 'Ground'   },
    ],
    Wednesday: [
      { subject: 'English',           teacherId: 'TCH_003', teacherName: 'Ms. Preethi Nair',     room: 'Room 101' },
      { subject: 'Social Science',    teacherId: 'TCH_007', teacherName: 'Mr. Vijay Kumar',      room: 'Room 101' },
      { subject: 'Mathematics',       teacherId: 'TCH_001', teacherName: 'Mr. Ramesh Iyer',      room: 'Room 101' },
      { subject: 'Biology',           teacherId: 'TCH_006', teacherName: 'Dr. Anand Pillai',     room: 'Lab 3'    },
      { subject: 'Physics',           teacherId: 'TCH_002', teacherName: 'Mrs. Lakshmi Devi',    room: 'Lab 1'    },
      { subject: 'Chemistry',         teacherId: 'TCH_004', teacherName: 'Mr. Suresh Babu',      room: 'Lab 2'    },
      { subject: 'Hindi',             teacherId: 'TCH_005', teacherName: 'Mrs. Kavita Sharma',   room: 'Room 101' },
      { subject: 'Art & Craft',       teacherId: 'TCH_010', teacherName: 'Mrs. Sunita Reddy',    room: 'Art Room' },
    ],
    Thursday:  [
      { subject: 'Chemistry',         teacherId: 'TCH_004', teacherName: 'Mr. Suresh Babu',      room: 'Lab 2'    },
      { subject: 'Hindi',             teacherId: 'TCH_005', teacherName: 'Mrs. Kavita Sharma',   room: 'Room 101' },
      { subject: 'Physics',           teacherId: 'TCH_002', teacherName: 'Mrs. Lakshmi Devi',    room: 'Lab 1'    },
      { subject: 'Mathematics',       teacherId: 'TCH_001', teacherName: 'Mr. Ramesh Iyer',      room: 'Room 101' },
      { subject: 'English',           teacherId: 'TCH_003', teacherName: 'Ms. Preethi Nair',     room: 'Room 101' },
      { subject: 'Computer Science',  teacherId: 'TCH_008', teacherName: 'Ms. Divya Menon',      room: 'Comp Lab' },
      { subject: 'Biology',           teacherId: 'TCH_006', teacherName: 'Dr. Anand Pillai',     room: 'Lab 3'    },
      { subject: 'Social Science',    teacherId: 'TCH_007', teacherName: 'Mr. Vijay Kumar',      room: 'Room 101' },
    ],
    Friday:    [
      { subject: 'Hindi',             teacherId: 'TCH_005', teacherName: 'Mrs. Kavita Sharma',   room: 'Room 101' },
      { subject: 'English',           teacherId: 'TCH_003', teacherName: 'Ms. Preethi Nair',     room: 'Room 101' },
      { subject: 'Social Science',    teacherId: 'TCH_007', teacherName: 'Mr. Vijay Kumar',      room: 'Room 101' },
      { subject: 'Physics',           teacherId: 'TCH_002', teacherName: 'Mrs. Lakshmi Devi',    room: 'Lab 1'    },
      { subject: 'Mathematics',       teacherId: 'TCH_001', teacherName: 'Mr. Ramesh Iyer',      room: 'Room 101' },
      { subject: 'Biology',           teacherId: 'TCH_006', teacherName: 'Dr. Anand Pillai',     room: 'Lab 3'    },
      { subject: 'Chemistry',         teacherId: 'TCH_004', teacherName: 'Mr. Suresh Babu',      room: 'Lab 2'    },
      { subject: 'Physical Education',teacherId: 'TCH_009', teacherName: 'Mr. Rajan Pillai',     room: 'Ground'   },
    ],
    Saturday:  [
      { subject: 'Mathematics',       teacherId: 'TCH_001', teacherName: 'Mr. Ramesh Iyer',      room: 'Room 101' },
      { subject: 'Computer Science',  teacherId: 'TCH_008', teacherName: 'Ms. Divya Menon',      room: 'Comp Lab' },
      { subject: 'English',           teacherId: 'TCH_003', teacherName: 'Ms. Preethi Nair',     room: 'Room 101' },
      { subject: 'Hindi',             teacherId: 'TCH_005', teacherName: 'Mrs. Kavita Sharma',   room: 'Room 101' },
      { subject: 'Social Science',    teacherId: 'TCH_007', teacherName: 'Mr. Vijay Kumar',      room: 'Room 101' },
      { subject: 'Art & Craft',       teacherId: 'TCH_010', teacherName: 'Mrs. Sunita Reddy',    room: 'Art Room' },
      { subject: 'Physics',           teacherId: 'TCH_002', teacherName: 'Mrs. Lakshmi Devi',    room: 'Lab 1'    },
      { subject: 'Chemistry',         teacherId: 'TCH_004', teacherName: 'Mr. Suresh Babu',      room: 'Lab 2'    },
    ],
  }

  let count = 0
  for (const day of days) {
    for (const p of periods) {
      const slot = schedule[day][p.period - 1]
      await prisma.timetableSlot.upsert({
        where: { class_section_day_period: { class: '10', section: 'A', day, period: p.period } },
        update: {},
        create: {
          class:       '10',
          section:     'A',
          day,
          period:      p.period,
          startTime:   p.startTime,
          endTime:     p.endTime,
          subject:     slot.subject,
          teacherId:   slot.teacherId,
          teacherName: slot.teacherName,
          room:        slot.room,
        },
      })
      count++
    }
  }
  console.log(`Created ${count} timetable slots`)
}

async function seedExamResults() {
  console.log('Seeding exam results...')
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Hindi']
  const examId   = 'EXAM_2025_HALFYEARLY_10'
  const examName = 'Half Yearly Examination 2025'

  const studentScores = [
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e1', name: 'Aarav Sharma', scores: [88, 82, 79, 91, 85] },
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e2', name: 'Priya Patel',   scores: [95, 90, 92, 97, 88] },
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e3', name: 'Rohit Verma',   scores: [72, 68, 65, 78, 70] },
    { studentId: '64a1b2c3d4e5f6a7b8c9d0e4', name: 'Sneha Gupta',   scores: [84, 80, 77, 89, 82] },
  ]

  const getGrade = (pct: number) => {
    if (pct >= 90) return 'A+'
    if (pct >= 80) return 'A'
    if (pct >= 70) return 'B+'
    if (pct >= 60) return 'B'
    if (pct >= 50) return 'C'
    return 'F'
  }

  let count = 0
  for (const s of studentScores) {
    for (let i = 0; i < subjects.length; i++) {
      const obtained = s.scores[i]
      const maxMarks = 100
      const pct      = obtained
      await prisma.examResult.upsert({
        where: { studentId_examId_subject: { studentId: s.studentId, examId, subject: subjects[i] } },
        update: {},
        create: {
          studentId:     s.studentId,
          studentName:   s.name,
          examId,
          examName,
          class:         '10',
          subject:       subjects[i],
          maxMarks,
          obtainedMarks: obtained,
          grade:         getGrade(pct),
          percentage:    pct,
          rank:          studentScores.indexOf(s) + 1,
          publishedAt:   new Date('2025-01-20'),
        },
      })
      count++
    }
  }
  console.log(`Created ${count} exam result records`)
}

async function main() {
  console.log('Starting seed...')
  await seedAttendance()
  await seedFeePayments()
  await seedExpenses()
  await seedTimetable()
  await seedExamResults()
  console.log('Seed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
