const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
const API  = `${BASE}/api/v1`

// ─── Token helpers ────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('admin_token')
}

function setTokens(access: string, refresh: string) {
  localStorage.setItem('admin_token', access)
  localStorage.setItem('admin_refresh', refresh)
}

// ─── Core fetch wrapper ───────────────────────────────────
async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API}${path}`, { ...options, headers })

  // Token expired — try refresh
  if (res.status === 401) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      const retryHeaders = { ...headers, Authorization: `Bearer ${getToken()}` }
      const retry = await fetch(`${API}${path}`, { ...options, headers: retryHeaders })
      if (!retry.ok) throw new ApiError(retry.status, (await retry.json()).message)
      return retry.json()
    }
    // Refresh failed — logout
    localStorage.clear()
    window.location.href = '/admin/login'
    throw new ApiError(401, 'Session expired')
  }

  const data = await res.json()
  if (!res.ok) throw new ApiError(res.status, data.message ?? 'Request failed')
  return data
}

async function tryRefresh(): Promise<boolean> {
  try {
    const refresh = localStorage.getItem('admin_refresh')
    if (!refresh) return false
    const res = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    })
    if (!res.ok) return false
    const { data } = await res.json()
    setTokens(data.tokens.accessToken, data.tokens.refreshToken)
    return true
  } catch {
    return false
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

// ─── Auth ─────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ data: { tokens: { accessToken: string; refreshToken: string }; user: Record<string, unknown> } }>(
      '/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }
    ),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
  me: () => apiFetch('/auth/me'),
}

// ─── Students ─────────────────────────────────────────────
export interface StudentAPI {
  _id: string
  admissionNo: string
  rollNo: string
  class: string
  section: string
  session: string
  gender: string
  dateOfBirth: string
  isActive: boolean
  admissionDate: string
  userId?: {
    name: string
    email: string
    phone?: string
  }
  address?: { city: string; state: string }
  feeStatus?: string
}

export const studentsApi = {
  list: (params?: { page?: number; limit?: number; class?: string; section?: string; search?: string; isActive?: boolean }) => {
    const q = new URLSearchParams()
    if (params?.page)    q.set('page', String(params.page))
    if (params?.limit)   q.set('limit', String(params.limit))
    if (params?.class)   q.set('class', params.class)
    if (params?.section) q.set('section', params.section)
    if (params?.search)  q.set('search', params.search)
    if (params?.isActive !== undefined) q.set('isActive', String(params.isActive))
    return apiFetch<{ success: boolean; data: StudentAPI[]; meta: { total: number; page: number; limit: number; pages: number } }>(`/students?${q}`)
  },
  get: (id: string) => apiFetch<{ data: StudentAPI }>(`/students/${id}`),
  create: (body: Record<string, unknown>) =>
    apiFetch<{ data: StudentAPI }>('/students', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Record<string, unknown>) =>
    apiFetch<{ data: StudentAPI }>(`/students/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => apiFetch(`/students/${id}`, { method: 'DELETE' }),
}

// ─── Finance ──────────────────────────────────────────────
export const financeApi = {
  payments: (params?: Record<string, string | number>) => {
    const q = new URLSearchParams(Object.entries(params ?? {}).map(([k, v]) => [k, String(v)]))
    return apiFetch<{ success: boolean; data: unknown[]; meta: Record<string, unknown> }>(`/finance/payments?${q}`)
  },
  createPayment: (body: Record<string, unknown>) =>
    apiFetch('/finance/payments', { method: 'POST', body: JSON.stringify(body) }),
  razorpayOrder: (body: { amount: number; currency?: string; receipt?: string }) =>
    apiFetch<{ data: { orderId: string; amount: number; currency: string; key: string } }>(
      '/finance/razorpay/order', { method: 'POST', body: JSON.stringify(body) }
    ),
  transactions: () => apiFetch<{ data: unknown[] }>('/finance/transactions'),
  feeStructure: () => apiFetch<{ data: unknown[] }>('/finance/fee-structure'),
}

// ─── Analytics ────────────────────────────────────────────
export const analyticsApi = {
  dashboard: () => apiFetch<{ data: Record<string, unknown> }>('/analytics/dashboard'),
  revenue: (params?: { period?: string }) => apiFetch<{ data: unknown[] }>(`/analytics/revenue${params?.period ? `?period=${params.period}` : ''}`),
  attendance: () => apiFetch<{ data: unknown[] }>('/analytics/attendance'),
}

// ─── Attendance ───────────────────────────────────────────
export const attendanceApi = {
  mark: (records: { studentId: string; status: 'present' | 'absent' | 'leave'; date: string; class: string; section: string }[]) =>
    apiFetch('/academics/attendance', { method: 'POST', body: JSON.stringify({ records }) }),
  get: (params: { class: string; section: string; date: string }) => {
    const q = new URLSearchParams(params)
    return apiFetch<{ data: unknown[] }>(`/academics/attendance?${q}`)
  },
}

// ─── Exams ────────────────────────────────────────────────
export const examsApi = {
  list: () => apiFetch<{ data: unknown[] }>('/exams'),
  create: (body: Record<string, unknown>) =>
    apiFetch('/exams', { method: 'POST', body: JSON.stringify(body) }),
  results: (examId: string) => apiFetch<{ data: unknown[] }>(`/exams/${examId}/results`),
  saveResults: (examId: string, results: unknown[]) =>
    apiFetch(`/exams/${examId}/results`, { method: 'POST', body: JSON.stringify({ results }) }),
}

// ─── Admissions ───────────────────────────────────────────
export const admissionsApi = {
  enquiries: () => apiFetch<{ data: unknown[] }>('/admissions/enquiries'),
  createEnquiry: (body: Record<string, unknown>) =>
    apiFetch('/admissions/enquiries', { method: 'POST', body: JSON.stringify(body) }),
  applications: () => apiFetch<{ data: unknown[] }>('/admissions/applications'),
  updateApplicationStatus: (id: string, status: string) =>
    apiFetch(`/admissions/applications/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}

// ─── Communications ───────────────────────────────────────
export const communicationsApi = {
  notices: () => apiFetch<{ data: unknown[] }>('/notifications/notices'),
  send: (body: { title: string; body: string; audience: string; priority: string; channel: string }) =>
    apiFetch('/notifications/send', { method: 'POST', body: JSON.stringify(body) }),
}

// ─── LMS ──────────────────────────────────────────────────
export const lmsApi = {
  courses: () => apiFetch<{ data: unknown[] }>('/lms/courses'),
  createCourse: (body: Record<string, unknown>) =>
    apiFetch('/lms/courses', { method: 'POST', body: JSON.stringify(body) }),
  liveSessions: () => apiFetch<{ data: unknown[] }>('/lms/live-sessions'),
  scheduleSession: (body: Record<string, unknown>) =>
    apiFetch('/lms/live-sessions', { method: 'POST', body: JSON.stringify(body) }),
}

// ─── HR ───────────────────────────────────────────────────
export const hrApi = {
  staff: () => apiFetch<{ data: unknown[] }>('/hr/staff'),
  payroll: (month: string) => apiFetch<{ data: unknown[] }>(`/hr/payroll?month=${month}`),
  leaves: () => apiFetch<{ data: unknown[] }>('/hr/leaves'),
  approveLeave: (id: string, status: 'approved' | 'rejected') =>
    apiFetch(`/hr/leaves/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}

// ─── Store ────────────────────────────────────────────────
export const storeApi = {
  products: () => apiFetch<{ data: unknown[] }>('/ecommerce/products'),
  orders: () => apiFetch<{ data: unknown[] }>('/ecommerce/orders'),
  updateOrderStatus: (id: string, status: string) =>
    apiFetch(`/ecommerce/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}

// ─── AI ───────────────────────────────────────────────────
export const aiApi = {
  chat: (message: string, context?: string) =>
    apiFetch<{ data: { reply: string } }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    }),
}

export default apiFetch
