import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/school_ecosystem')
  console.log('Connected to MongoDB')

  const UserModel = mongoose.model('User', new mongoose.Schema({
    name: String, email: { type: String, unique: true }, password: String,
    role: String, isActive: Boolean, isEmailVerified: Boolean,
    twoFactorEnabled: Boolean, loginAttempts: Number, permissions: [String],
  }, { timestamps: true }))

  const users = [
    { name: 'Super Admin',                email: 'admin@kvlschool.edu.in',     password: 'KVL@Admin2025',     role: 'super_admin' },
    { name: 'Dr. Rajesh Kumar Verma',     email: 'principal@kvlschool.edu.in', password: 'KVL@Principal2025', role: 'principal' },
    { name: 'Ms. Priya Sharma',           email: 'teacher@kvlschool.edu.in',   password: 'KVL@Teacher2025',   role: 'teacher' },
    { name: 'Mr. Ravi Accountant',        email: 'accounts@kvlschool.edu.in',  password: 'KVL@Accounts2025',  role: 'accountant' },
  ]

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10)
    await UserModel.findOneAndUpdate(
      { email: u.email },
      { name: u.name, email: u.email, password: hashed, role: u.role,
        isActive: true, isEmailVerified: true, twoFactorEnabled: false,
        loginAttempts: 0, permissions: [] },
      { upsert: true, new: true }
    )
    console.log(`✅ Created: ${u.role} — ${u.email} / ${u.password}`)
  }

  await mongoose.disconnect()
  console.log('\nSeeding complete!')
}

seed().catch(console.error)
