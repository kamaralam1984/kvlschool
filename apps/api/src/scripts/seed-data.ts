import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/school_ecosystem')
  console.log('Connected to MongoDB\n')

  // ── Models (inline to avoid import issues) ──────────────
  const UserModel = mongoose.models.User ?? mongoose.model('User', new mongoose.Schema({
    name: String, email: { type: String, unique: true }, password: String,
    role: String, isActive: Boolean, isEmailVerified: Boolean,
    phone: String, twoFactorEnabled: Boolean, loginAttempts: Number, permissions: [String],
  }, { timestamps: true }))

  const StudentModel = mongoose.models.Student ?? mongoose.model('Student', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    admissionNo: { type: String, required: true, unique: true },
    rollNo: { type: String, required: true },
    class: { type: String, required: true },
    section: { type: String, required: true },
    session: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    nationality: { type: String, default: 'Indian' },
    admissionDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    feeStatus: { type: String, default: 'pending' },
    address: { street: String, city: String, state: String, pincode: String, country: String },
    father: { name: String, phone: String, occupation: String, email: String },
    emergencyContact: { name: String, phone: String, relation: String },
  }, { timestamps: true }))

  // ── Seed Students ────────────────────────────────────────
  const students = [
    { name:'Aarav Sharma',  email:'aarav.sharma@kvl.edu.in',  phone:'9876543210', rollNo:'KVL-2024-001', admissionNo:'ADM2024001', class:'10', section:'A', gender:'male',   dob:'2009-04-12', city:'Lucknow',   fatherName:'Ramesh Sharma',  fatherPhone:'9876543200' },
    { name:'Priya Singh',   email:'priya.singh@kvl.edu.in',   phone:'9876543211', rollNo:'KVL-2024-002', admissionNo:'ADM2024002', class:'10', section:'B', gender:'female', dob:'2009-07-22', city:'Kanpur',    fatherName:'Suresh Singh',   fatherPhone:'9876543201' },
    { name:'Rohan Verma',   email:'rohan.verma@kvl.edu.in',   phone:'9876543212', rollNo:'KVL-2024-003', admissionNo:'ADM2024003', class:'9',  section:'A', gender:'male',   dob:'2010-01-15', city:'Agra',      fatherName:'Mohan Verma',    fatherPhone:'9876543202' },
    { name:'Ananya Gupta',  email:'ananya.gupta@kvl.edu.in',  phone:'9876543213', rollNo:'KVL-2024-004', admissionNo:'ADM2024004', class:'11', section:'A', gender:'female', dob:'2008-11-30', city:'Varanasi',  fatherName:'Rajesh Gupta',   fatherPhone:'9876543203' },
    { name:'Arjun Mishra',  email:'arjun.mishra@kvl.edu.in',  phone:'9876543214', rollNo:'KVL-2024-005', admissionNo:'ADM2024005', class:'8',  section:'C', gender:'male',   dob:'2011-03-08', city:'Allahabad', fatherName:'Vijay Mishra',   fatherPhone:'9876543204' },
    { name:'Kavya Patel',   email:'kavya.patel@kvl.edu.in',   phone:'9876543215', rollNo:'KVL-2024-006', admissionNo:'ADM2024006', class:'12', section:'B', gender:'female', dob:'2007-09-19', city:'Mathura',   fatherName:'Dinesh Patel',   fatherPhone:'9876543205' },
    { name:'Dev Agarwal',   email:'dev.agarwal@kvl.edu.in',   phone:'9876543216', rollNo:'KVL-2024-007', admissionNo:'ADM2024007', class:'7',  section:'A', gender:'male',   dob:'2012-06-25', city:'Meerut',    fatherName:'Sunil Agarwal',  fatherPhone:'9876543206' },
    { name:'Sneha Yadav',   email:'sneha.yadav@kvl.edu.in',   phone:'9876543217', rollNo:'KVL-2024-008', admissionNo:'ADM2024008', class:'9',  section:'B', gender:'female', dob:'2010-12-05', city:'Bareilly',  fatherName:'Manoj Yadav',    fatherPhone:'9876543207' },
    { name:'Harsh Tiwari',  email:'harsh.tiwari@kvl.edu.in',  phone:'9876543218', rollNo:'KVL-2024-009', admissionNo:'ADM2024009', class:'10', section:'A', gender:'male',   dob:'2009-08-14', city:'Lucknow',   fatherName:'Ram Tiwari',     fatherPhone:'9876543208' },
    { name:'Nisha Dubey',   email:'nisha.dubey@kvl.edu.in',   phone:'9876543219', rollNo:'KVL-2024-010', admissionNo:'ADM2024010', class:'11', section:'B', gender:'female', dob:'2008-03-22', city:'Kanpur',    fatherName:'Shyam Dubey',    fatherPhone:'9876543209' },
    { name:'Vikram Sharma', email:'vikram.sharma@kvl.edu.in', phone:'9876543220', rollNo:'KVL-2024-011', admissionNo:'ADM2024011', class:'12', section:'A', gender:'male',   dob:'2007-05-10', city:'Lucknow',   fatherName:'Anil Sharma',    fatherPhone:'9876543210' },
    { name:'Pooja Singh',   email:'pooja.singh@kvl.edu.in',   phone:'9876543221', rollNo:'KVL-2024-012', admissionNo:'ADM2024012', class:'8',  section:'A', gender:'female', dob:'2011-11-18', city:'Varanasi',  fatherName:'Rakesh Singh',   fatherPhone:'9876543211' },
    { name:'Amit Kumar',    email:'amit.kumar@kvl.edu.in',    phone:'9876543222', rollNo:'KVL-2024-013', admissionNo:'ADM2024013', class:'9',  section:'C', gender:'male',   dob:'2010-07-04', city:'Agra',      fatherName:'Suresh Kumar',   fatherPhone:'9876543212' },
    { name:'Riya Pandey',   email:'riya.pandey@kvl.edu.in',   phone:'9876543223', rollNo:'KVL-2024-014', admissionNo:'ADM2024014', class:'7',  section:'B', gender:'female', dob:'2012-02-28', city:'Meerut',    fatherName:'Deepak Pandey',  fatherPhone:'9876543213' },
    { name:'Rahul Joshi',   email:'rahul.joshi@kvl.edu.in',   phone:'9876543224', rollNo:'KVL-2024-015', admissionNo:'ADM2024015', class:'10', section:'B', gender:'male',   dob:'2009-09-15', city:'Bareilly',  fatherName:'Vivek Joshi',    fatherPhone:'9876543214' },
  ]

  const hashedPwd = await bcrypt.hash('Student@123', 10)
  let created = 0

  for (const s of students) {
    try {
      // Create or update User
      const user = await UserModel.findOneAndUpdate(
        { email: s.email },
        { name: s.name, email: s.email, phone: s.phone, password: hashedPwd,
          role: 'student', isActive: true, isEmailVerified: true,
          twoFactorEnabled: false, loginAttempts: 0, permissions: [] },
        { upsert: true, new: true }
      )

      // Create or update Student
      await StudentModel.findOneAndUpdate(
        { admissionNo: s.admissionNo },
        {
          userId: user._id,
          admissionNo: s.admissionNo,
          rollNo: s.rollNo,
          class: s.class,
          section: s.section,
          session: '2024-25',
          dateOfBirth: new Date(s.dob),
          gender: s.gender,
          nationality: 'Indian',
          admissionDate: new Date('2024-06-01'),
          isActive: true,
          feeStatus: ['paid','pending','overdue'][Math.floor(Math.random() * 3)],
          address: { street: 'School Road', city: s.city, state: 'UP', pincode: '226001', country: 'India' },
          father: { name: s.fatherName, phone: s.fatherPhone, occupation: 'Business', email: '' },
          emergencyContact: { name: s.fatherName, phone: s.fatherPhone, relation: 'Father' },
        },
        { upsert: true, new: true }
      )

      console.log(`✅ ${s.name} — Class ${s.class}-${s.section}`)
      created++
    } catch (err: any) {
      console.log(`❌ ${s.name}: ${err.message}`)
    }
  }

  // ── Seed Finance Transactions ────────────────────────────
  const TransactionModel = mongoose.models.Transaction ?? mongoose.model('Transaction', new mongoose.Schema({
    type: String, category: String, amount: Number, description: String,
    date: Date, paidBy: String, paymentMode: String, reference: String,
  }, { timestamps: true }))

  const transactions = [
    { type: 'income', category: 'tuition', amount: 185000, description: 'Tuition fee - Class 10A', paidBy: 'Ramesh Sharma', paymentMode: 'online', reference: 'TXN-8821', date: new Date('2025-01-08') },
    { type: 'income', category: 'tuition', amount: 150000, description: 'Tuition fee - Class 9A', paidBy: 'Mohan Verma', paymentMode: 'cash', reference: 'TXN-8822', date: new Date('2025-01-09') },
    { type: 'income', category: 'hostel', amount: 120000, description: 'Hostel fee - Q3', paidBy: 'Rajesh Gupta', paymentMode: 'online', reference: 'TXN-8823', date: new Date('2025-01-10') },
    { type: 'income', category: 'transport', amount: 45000, description: 'Transport fee - Jan', paidBy: 'Multiple Parents', paymentMode: 'online', reference: 'TXN-8824', date: new Date('2025-01-10') },
    { type: 'expense', category: 'salary', amount: 284000, description: 'Staff salary - January 2025', paidBy: 'School', paymentMode: 'bank', reference: 'SAL-JAN25', date: new Date('2025-01-31') },
    { type: 'expense', category: 'utilities', amount: 18500, description: 'Electricity bill - Jan', paidBy: 'School', paymentMode: 'online', reference: 'UTIL-001', date: new Date('2025-01-15') },
  ]

  for (const t of transactions) {
    await TransactionModel.findOneAndUpdate(
      { reference: t.reference },
      t,
      { upsert: true, new: true }
    )
  }
  console.log(`\n✅ ${transactions.length} transactions seeded`)

  console.log(`\n🎉 Seeding complete! ${created} students created.`)
  console.log('\nLogin credentials:')
  console.log('  Admin:   admin@kvlschool.edu.in / KVL@Admin2025')
  console.log('  Student: aarav.sharma@kvl.edu.in / Student@123')
  await mongoose.disconnect()
}

seed().catch(console.error)
