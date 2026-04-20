/**
 * @author Healthcare Appointment App
 * @description Centralized Axios service — all API calls must originate here.
 *              Attaches auth token via request interceptor and handles errors globally.
 * OWASP:
 *  - Tokens are read from localStorage (XSS risk — consider httpOnly cookies in prod).
 *  - Response interceptor clears stale auth on 401 to prevent broken access control.
 *  - baseURL is injected from environment variables only (no hardcoded URLs).
 * JIRA: HAA-002 #comment Centralized Axios setup
 */

import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request Interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ─── Response Interceptor ────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      // Token expired or invalid — clear session to prevent broken access control.
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }

    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred.'

    return Promise.reject(new Error(message))
  },
)

// ─── API Methods ─────────────────────────────────────────────────────────────
import {
  mockLoginUser,
  mockFetchDashboardData,
  mockFetchHospitals,
  mockFetchDoctors,
  mockFetchSpecialties,
  mockFetchAppointments,
  mockFetchPrescriptions,
  mockFetchReviews,
  mockFetchSchedules,
  mockFetchUsers,
  mockAddHospital,
  mockUpdateHospital,
  mockAddSpecialty,
  mockUpdateReview,
  mockBookAppointment,
  mockUpdateAppointment,
  mockAddDoctor,
  mockDeleteDoctor,
  mockSubmitReview,
} from './mockApi'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const loginUser = (credentials) =>
  USE_MOCK ? mockLoginUser(credentials) : apiClient.post('/auth/login', credentials)

export const fetchDashboardData = (role) =>
  USE_MOCK ? mockFetchDashboardData(role) : apiClient.get('/dashboard')

export const fetchHospitals = () =>
  USE_MOCK ? mockFetchHospitals() : apiClient.get('/hospitals')

export const fetchDoctors = (filters) =>
  USE_MOCK ? mockFetchDoctors(filters) : apiClient.get('/doctors', { params: filters })

export const fetchSpecialties = () =>
  USE_MOCK ? mockFetchSpecialties() : apiClient.get('/specialties')

export const fetchAppointments = (filters) =>
  USE_MOCK ? mockFetchAppointments(filters) : apiClient.get('/appointments', { params: filters })

export const fetchPrescriptions = (filters) =>
  USE_MOCK ? mockFetchPrescriptions(filters) : apiClient.get('/prescriptions', { params: filters })

export const fetchReviews = (filters) =>
  USE_MOCK ? mockFetchReviews(filters) : apiClient.get('/reviews', { params: filters })

export const fetchSchedules = (filters) =>
  USE_MOCK ? mockFetchSchedules(filters) : apiClient.get('/schedules', { params: filters })

export const fetchUsers = () =>
  USE_MOCK ? mockFetchUsers() : apiClient.get('/users')

export const addHospital = (data) =>
  USE_MOCK ? mockAddHospital(data) : apiClient.post('/hospitals', data)

export const updateHospital = (id, data) =>
  USE_MOCK ? mockUpdateHospital(id, data) : apiClient.patch(`/hospitals/${id}`, data)

export const addSpecialty = (data) =>
  USE_MOCK ? mockAddSpecialty(data) : apiClient.post('/specialties', data)

export const updateReview = (id, data) =>
  USE_MOCK ? mockUpdateReview(id, data) : apiClient.patch(`/reviews/${id}`, data)

export const bookAppointment = (data) =>
  USE_MOCK ? mockBookAppointment(data) : apiClient.post('/appointments', data)

export const updateAppointment = (id, data) =>
  USE_MOCK ? mockUpdateAppointment(id, data) : apiClient.patch(`/appointments/${id}`, data)

export const addDoctor = (data) =>
  USE_MOCK ? mockAddDoctor(data) : apiClient.post('/doctors', data)

export const deleteDoctor = (id) =>
  USE_MOCK ? mockDeleteDoctor(id) : apiClient.delete(`/doctors/${id}`)

export const submitReview = (data) =>
  USE_MOCK ? mockSubmitReview(data) : apiClient.post('/reviews', data)

export default apiClient
