import axios from 'axios';

export const API_BASE_URL = 'http://localhost:4000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject auth token on every request
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — AuthContext will handle logout
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// API endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',

  // Student
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_ATTENDANCE: '/student/attendance',
  STUDENT_MARKS: '/student/marks',
  STUDENT_TIMETABLE: '/student/timetable',
  STUDENT_FEES: '/student/fees',

  // Parent
  PARENT_DASHBOARD: '/parent/dashboard',
  PARENT_CHILDREN: '/parent/children',
  PARENT_FEES: '/parent/fees',
  PARENT_NOTICES: '/parent/notices',

  // Teacher
  TEACHER_DASHBOARD: '/teacher/dashboard',
  TEACHER_TIMETABLE: '/teacher/timetable',
  TEACHER_ATTENDANCE: '/teacher/attendance',
  TEACHER_GRADES: '/teacher/grades',

  // Shared
  NOTIFICATIONS: '/notifications',
};
