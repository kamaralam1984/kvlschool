import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/school_ecosystem'

const userSchema = new mongoose.Schema({
  name:            String,
  email:           { type: String, unique: true, lowercase: true },
  password:        String,
  role:            String,
  isActive:        { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  permissions:     [String],
  phone:           String,
  employeeId:      String,
  studentId:       String,
}, { timestamps: true })

const User = mongoose.models.User ?? mongoose.model('User', userSchema)

const users = [
  { name: 'Super Admin',    email: 'superadmin@kvlschool.com',  password: 'Admin@123456',    role: 'super_admin',   employeeId: 'EMP_001' },
  { name: 'Principal',      email: 'principal@kvlschool.com',   password: 'Principal@123',   role: 'principal',     employeeId: 'EMP_002' },
  { name: 'Admin Staff',    email: 'admin@kvlschool.com',       password: 'Admin@123456',    role: 'admin',         employeeId: 'EMP_003' },
  { name: 'Ramesh Iyer',    email: 'teacher@kvlschool.com',     password: 'Teacher@123',     role: 'teacher',       employeeId: 'TCH_001' },
  { name: 'Parent User',    email: 'parent@kvlschool.com',      password: 'Parent@123456',   role: 'parent' },
  { name: 'Aarav Sharma',   email: 'student@kvlschool.com',     password: 'Student@123',     role: 'student',       studentId: '64a1b2c3d4e5f6a7b8c9d0e1' },
  { name: 'Accountant',     email: 'accounts@kvlschool.com',    password: 'Account@123',     role: 'accountant',    employeeId: 'EMP_004' },
  { name: 'HR Manager',     email: 'hr@kvlschool.com',          password: 'HrAdmin@123',     role: 'hr',            employeeId: 'EMP_005' },
  { name: 'Librarian',      email: 'library@kvlschool.com',     password: 'Library@123',     role: 'librarian',     employeeId: 'EMP_006' },
]

async function main() {
  await mongoose.connect(MONGODB_URI)
  console.log('MongoDB connected')

  for (const u of users) {
    const existing = await User.findOne({ email: u.email })
    if (existing) {
      console.log(`⏭  Skipping ${u.email} (already exists)`)
      continue
    }
    const hashed = await bcrypt.hash(u.password, 12)
    await User.create({ ...u, password: hashed, isEmailVerified: true, isActive: true })
    console.log(`✅ Created ${u.role}: ${u.email}`)
  }

  console.log('\n📋 Login credentials:')
  users.forEach(u => console.log(`  ${u.role.padEnd(15)} ${u.email.padEnd(35)} ${u.password}`))
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => mongoose.disconnect())
