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

// Auth
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials)
export const registerUser = (data) => apiClient.post('/auth/register', data)
export const refreshToken = (data) => apiClient.post('/auth/refresh', data)
export const logoutUser = (data) => apiClient.post('/auth/logout', data)

// Dashboard
export const fetchDashboardStats = () => apiClient.get('/dashboard/stats')
export const fetchDashboardUsers = (params) => apiClient.get('/dashboard/users', { params })
export const fetchHospitalDashboard = () => apiClient.get('/dashboard/hospital')
export const fetchPatientDashboard = () => apiClient.get('/dashboard/patient')

// Hospitals
export const fetchHospitals = (params) => apiClient.get('/hospitals', { params })
export const fetchHospitalById = (id) => apiClient.get(`/hospitals/${id}`)
export const addHospital = (data) => apiClient.post('/hospitals', data)
export const updateHospital = (id, data) => apiClient.put(`/hospitals/${id}`, data)
export const deleteHospital = (id) => apiClient.delete(`/hospitals/${id}`)
export const toggleHospitalStatus = (id) => apiClient.patch(`/hospitals/${id}/status`)

// Doctors
export const fetchDoctors = (params) => apiClient.get('/doctors', { params })
export const fetchDoctorById = (id) => apiClient.get(`/doctors/${id}`)
export const addDoctor = (data) => apiClient.post('/doctors', data)
export const updateDoctor = (id, data) => apiClient.put(`/doctors/${id}`, data)
export const deleteDoctor = (id) => apiClient.delete(`/doctors/${id}`)
export const fetchDoctorsByHospital = (hospitalId) => apiClient.get(`/hospitals/${hospitalId}/doctors`)
export const fetchDoctorsBySpecialty = (specialtyId) => apiClient.get(`/specialties/${specialtyId}/doctors`)

// Specialties
export const fetchSpecialties = (params) => apiClient.get('/specialties', { params })
export const fetchSpecialtyById = (id) => apiClient.get(`/specialties/${id}`)
export const addSpecialty = (data) => apiClient.post('/specialties', data)
export const updateSpecialty = (id, data) => apiClient.put(`/specialties/${id}`, data)
export const deleteSpecialty = (id) => apiClient.delete(`/specialties/${id}`)

// Schedules
export const fetchSchedules = (params) => apiClient.get('/schedules', { params })
export const fetchSchedulesByDoctor = (doctorId) => apiClient.get(`/doctors/${doctorId}/schedules`)
export const createSchedule = (data) => apiClient.post('/schedules', data)
export const updateSchedule = (id, data) => apiClient.put(`/schedules/${id}`, data)
export const deleteSchedule = (id) => apiClient.delete(`/schedules/${id}`)

// Appointments
export const fetchAppointments = (params) => apiClient.get('/appointments', { params })
export const fetchAppointmentById = (id) => apiClient.get(`/appointments/${id}`)
export const bookAppointment = (data) => apiClient.post('/appointments', data)
export const updateAppointment = (id, data) => apiClient.put(`/appointments/${id}`, data)
export const cancelAppointment = (id) => apiClient.patch(`/appointments/${id}/cancel`)
export const fetchPatientAppointments = (patientId, params) => apiClient.get(`/patients/${patientId}/appointments`, { params })

// Prescriptions
export const fetchPrescriptions = (params) => apiClient.get('/prescriptions', { params })
export const fetchPrescriptionById = (id) => apiClient.get(`/prescriptions/${id}`)
export const uploadPrescription = (data) =>
  apiClient.post('/prescriptions/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
export const fetchPatientPrescriptions = (patientId) => apiClient.get(`/patients/${patientId}/prescriptions`)

// Reviews
export const fetchReviews = (params) => apiClient.get('/reviews', { params })
export const submitReview = (data) => apiClient.post('/reviews', data)
export const updateReview = (id, data) => apiClient.put(`/reviews/${id}`, data)
export const deleteReview = (id) => apiClient.delete(`/reviews/${id}`)
export const approveReview = (id) => apiClient.patch(`/reviews/${id}/approve`)
export const rejectReview = (id) => apiClient.patch(`/reviews/${id}/reject`)

export default apiClient
