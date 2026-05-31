// ─── Common ──────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: Array<{ field: string; message: string }>
  meta?: {
    total:   number
    page:    number
    limit:   number
    pages:   number
  }
}

export interface PaginationQuery {
  page?:   number
  limit?:  number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ─── User ─────────────────────────────────────────────────────
export type UserRole =
  | 'super_admin' | 'chairman' | 'director' | 'principal' | 'vice_principal'
  | 'admin' | 'accountant' | 'hr' | 'teacher' | 'librarian'
  | 'hostel_manager' | 'transport_manager' | 'receptionist'
  | 'parent' | 'student' | 'alumni'

export interface UserProfile {
  id:              string
  name:            string
  email:           string
  role:            UserRole
  avatar?:         string
  phone?:          string
  isActive:        boolean
  twoFactorEnabled:boolean
  department?:     string
  employeeId?:     string
  studentId?:      string
  createdAt:       string
}

// ─── Auth ─────────────────────────────────────────────────────
export interface AuthTokens {
  accessToken:  string
  refreshToken: string
}

export interface LoginResponse {
  tokens: AuthTokens
  user:   Pick<UserProfile, 'id' | 'name' | 'email' | 'role' | 'avatar'>
}

// ─── Student ──────────────────────────────────────────────────
export interface Student {
  id:          string
  userId:      string
  admissionNo: string
  rollNo:      string
  class:       string
  section:     string
  session:     string
  name:        string
  email?:      string
  phone?:      string
  gender:      'male' | 'female' | 'other'
  dateOfBirth: string
  category:    string
  isActive:    boolean
  photo?:      string
  father:      { name: string; phone: string }
  mother:      { name: string; phone: string }
  admissionDate: string
}

// ─── Academic ─────────────────────────────────────────────────
export interface ClassInfo {
  id:       string
  name:     string
  sections: string[]
  teacher?: string
  strength: number
}

export interface Subject {
  id:      string
  name:    string
  code:    string
  class:   string
  teacher?: string
  maxMarks: number
}

// ─── Exam ─────────────────────────────────────────────────────
export type ExamType = 'unit_test' | 'mid_term' | 'final' | 'mock' | 'olympiad' | 'scholarship' | 'competitive'
export type ExamMode = 'online' | 'offline' | 'hybrid'

export interface Exam {
  id:           string
  title:        string
  type:         ExamType
  mode:         ExamMode
  class:        string
  section:      string
  subject:      string
  totalMarks:   number
  passingMarks: number
  duration:     number
  scheduledAt:  string
  isPublished:  boolean
}

// ─── Finance ──────────────────────────────────────────────────
export interface FeeInvoice {
  id:          string
  invoiceNo:   string
  studentId:   string
  totalAmount: number
  paidAmount:  number
  balance:     number
  dueDate:     string
  status:      'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled'
}

// ─── E-Commerce ───────────────────────────────────────────────
export interface Product {
  id:          string
  name:        string
  description: string
  price:       number
  mrp?:        number
  category:    'book' | 'uniform' | 'stationery' | 'sports' | 'digital' | 'other'
  images:      string[]
  inStock:     boolean
  stock?:      number
  sku?:        string
  tags:        string[]
  isActive:    boolean
}

export interface CartItem {
  productId: string
  product:   Product
  quantity:  number
  price:     number
}

export interface Order {
  id:        string
  orderNo:   string
  items:     CartItem[]
  subtotal:  number
  shipping:  number
  tax:       number
  total:     number
  status:    'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
}

// ─── LMS ──────────────────────────────────────────────────────
export interface Course {
  id:          string
  title:       string
  description: string
  subject:     string
  class:       string
  teacher:     string
  thumbnail?:  string
  totalLessons:number
  duration:    number
  isPublished: boolean
}

export interface Lesson {
  id:          string
  courseId:    string
  title:       string
  type:        'video' | 'document' | 'quiz' | 'live'
  content?:    string
  videoUrl?:   string
  duration?:   number
  order:       number
  isPublished: boolean
}

// ─── Notification ─────────────────────────────────────────────
export interface Notification {
  id:        string
  title:     string
  message:   string
  type:      'info' | 'success' | 'warning' | 'error'
  channel:   'email' | 'sms' | 'push' | 'whatsapp' | 'in_app'
  isRead:    boolean
  createdAt: string
}

// ─── Analytics ────────────────────────────────────────────────
export interface DashboardStats {
  totalStudents:      number
  totalTeachers:      number
  todayAttendance:    number
  monthlyCollection:  number
  activeAdmissions:   number
  pendingFees:        number
  onlineLiveClasses:  number
  newAdmissionsMonth: number
}
