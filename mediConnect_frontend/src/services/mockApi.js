/**
 * @file mockApi.js
 * @description Mock API layer — returns dummy data for all user types.
 *              Drop-in replacement for real API calls while backend is not ready.
 *              TOGGLE: set VITE_USE_MOCK=true in .env.local to enable.
 * @author Healthcare Appointment App
 * OWASP: No real credentials or tokens are validated here — mock only.
 * JIRA: HAA-MOCK #comment Frontend mock data layer
 */

// ─── Simulate network latency ─────────────────────────────────────────────────
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms))

// ─── Demo Users ───────────────────────────────────────────────────────────────
const MOCK_USERS = {
  'admin@healthcare.com': {
    id: 'u-001',
    name: 'Super Admin',
    email: 'admin@healthcare.com',
    role: 'super_admin',
    avatar: null,
    password: 'Admin@123',
  },
  'hospital@healthcare.com': {
    id: 'u-002',
    name: 'Dr. City Hospital Admin',
    email: 'hospital@healthcare.com',
    role: 'hospital_admin',
    hospitalId: 'h-001',
    hospitalName: 'City General Hospital',
    avatar: null,
    password: 'Hospital@123',
  },
  'patient@healthcare.com': {
    id: 'u-003',
    name: 'John Doe',
    email: 'patient@healthcare.com',
    role: 'patient',
    phone: '+1-555-0100',
    dob: '1990-06-15',
    gender: 'male',
    avatar: null,
    password: 'Patient@123',
  },
}

// ─── Mock Hospitals ───────────────────────────────────────────────────────────
export const MOCK_HOSPITALS = [
  { id: 'h-001', name: 'City General Hospital',   city: 'New York',    rating: 4.5, totalDoctors: 42, totalAppointments: 380 },
  { id: 'h-002', name: 'Sunrise Medical Center',  city: 'Los Angeles', rating: 4.2, totalDoctors: 30, totalAppointments: 210 },
  { id: 'h-003', name: 'Green Valley Clinic',     city: 'Chicago',     rating: 4.7, totalDoctors: 18, totalAppointments: 140 },
]

// ─── Mock Specialties ─────────────────────────────────────────────────────────
export const MOCK_SPECIALTIES = [
  { id: 's-001', name: 'Cardiology',      icon: '❤️',  totalDoctors: 12 },
  { id: 's-002', name: 'Neurology',       icon: '🧠',  totalDoctors: 8  },
  { id: 's-003', name: 'Orthopedics',     icon: '🦴',  totalDoctors: 15 },
  { id: 's-004', name: 'Pediatrics',      icon: '👶',  totalDoctors: 10 },
  { id: 's-005', name: 'Dermatology',     icon: '🩺',  totalDoctors: 7  },
  { id: 's-006', name: 'General Practice',icon: '🏥',  totalDoctors: 20 },
]

// ─── Mock Doctors ─────────────────────────────────────────────────────────────
export const MOCK_DOCTORS = [
  { id: 'd-001', name: 'Dr. Sarah Mitchell',  specialty: 'Cardiology',       hospitalId: 'h-001', rating: 4.8, experience: 12, fee: 150 },
  { id: 'd-002', name: 'Dr. James Lee',        specialty: 'Neurology',        hospitalId: 'h-001', rating: 4.6, experience: 9,  fee: 180 },
  { id: 'd-003', name: 'Dr. Priya Sharma',    specialty: 'Pediatrics',       hospitalId: 'h-002', rating: 4.9, experience: 15, fee: 120 },
  { id: 'd-004', name: 'Dr. Alan Brooks',     specialty: 'Orthopedics',      hospitalId: 'h-002', rating: 4.4, experience: 7,  fee: 140 },
  { id: 'd-005', name: 'Dr. Nina Watson',     specialty: 'Dermatology',      hospitalId: 'h-003', rating: 4.7, experience: 6,  fee: 110 },
  { id: 'd-006', name: 'Dr. Carlos Ruiz',     specialty: 'General Practice', hospitalId: 'h-003', rating: 4.3, experience: 11, fee: 90  },
]

// ─── Mock Appointments ────────────────────────────────────────────────────────
export const MOCK_APPOINTMENTS = [
  { id: 'a-001', patientId: 'u-003', patientName: 'John Doe',       doctorId: 'd-001', doctorName: 'Dr. Sarah Mitchell', hospitalId: 'h-001', specialty: 'Cardiology',   date: '2026-04-22', time: '10:00', status: 'confirmed',  fee: 150 },
  { id: 'a-002', patientId: 'u-003', patientName: 'John Doe',       doctorId: 'd-003', doctorName: 'Dr. Priya Sharma',   hospitalId: 'h-002', specialty: 'Pediatrics',   date: '2026-04-28', time: '14:30', status: 'pending',    fee: 120 },
  { id: 'a-003', patientId: 'u-004', patientName: 'Jane Smith',     doctorId: 'd-002', doctorName: 'Dr. James Lee',      hospitalId: 'h-001', specialty: 'Neurology',    date: '2026-04-20', time: '09:00', status: 'completed',  fee: 180 },
  { id: 'a-004', patientId: 'u-005', patientName: 'Bob Johnson',    doctorId: 'd-004', doctorName: 'Dr. Alan Brooks',    hospitalId: 'h-002', specialty: 'Orthopedics',  date: '2026-04-19', time: '11:00', status: 'cancelled',  fee: 140 },
  { id: 'a-005', patientId: 'u-003', patientName: 'John Doe',       doctorId: 'd-005', doctorName: 'Dr. Nina Watson',    hospitalId: 'h-003', specialty: 'Dermatology',  date: '2026-05-01', time: '16:00', status: 'confirmed',  fee: 110 },
]

// ─── Mock Prescriptions ───────────────────────────────────────────────────────
export const MOCK_PRESCRIPTIONS = [
  {
    id: 'rx-001', appointmentId: 'a-003', patientId: 'u-004', patientName: 'Jane Smith',
    doctorId: 'd-002', doctorName: 'Dr. James Lee', date: '2026-04-20',
    diagnosis: 'Tension Headache',
    medicines: [
      { name: 'Ibuprofen 400mg', dosage: '1 tablet twice daily', duration: '5 days' },
      { name: 'Rest and hydration', dosage: 'As needed', duration: 'Ongoing' },
    ],
    notes: 'Avoid screens for extended periods. Return if symptoms persist.',
  },
  {
    id: 'rx-002', appointmentId: 'a-001', patientId: 'u-003', patientName: 'John Doe',
    doctorId: 'd-001', doctorName: 'Dr. Sarah Mitchell', date: '2026-04-22',
    diagnosis: 'Hypertension - Stage 1',
    medicines: [
      { name: 'Amlodipine 5mg', dosage: '1 tablet daily', duration: '30 days' },
    ],
    notes: 'Low sodium diet. Follow up in 4 weeks.',
  },
]

// ─── Mock Reviews ─────────────────────────────────────────────────────────────
export const MOCK_REVIEWS = [
  { id: 'r-001', patientId: 'u-003', patientName: 'John Doe',    doctorId: 'd-001', doctorName: 'Dr. Sarah Mitchell', hospitalId: 'h-001', rating: 5, comment: 'Excellent care and very professional.', date: '2026-04-10', status: 'approved' },
  { id: 'r-002', patientId: 'u-004', patientName: 'Jane Smith',  doctorId: 'd-002', doctorName: 'Dr. James Lee',      hospitalId: 'h-001', rating: 4, comment: 'Very knowledgeable doctor.', date: '2026-04-15', status: 'approved' },
  { id: 'r-003', patientId: 'u-005', patientName: 'Bob Johnson', doctorId: 'd-004', doctorName: 'Dr. Alan Brooks',    hospitalId: 'h-002', rating: 3, comment: 'Long wait time but good treatment.', date: '2026-04-18', status: 'pending'  },
]

// ─── Dashboard stats per role ─────────────────────────────────────────────────
const MOCK_DASHBOARD = {
  super_admin: {
    stats: {
      totalHospitals:    MOCK_HOSPITALS.length,
      totalDoctors:      MOCK_DOCTORS.length,
      totalPatients:     128,
      totalAppointments: MOCK_APPOINTMENTS.length,
    },
    recentAppointments: MOCK_APPOINTMENTS.slice(0, 5),
    hospitals: MOCK_HOSPITALS,
  },
  hospital_admin: {
    stats: {
      totalDoctors:         MOCK_DOCTORS.filter((d) => d.hospitalId === 'h-001').length,
      todayAppointments:    2,
      pendingAppointments:  1,
      totalPatients:        54,
    },
    recentAppointments: MOCK_APPOINTMENTS.filter((a) => a.hospitalId === 'h-001'),
    doctors: MOCK_DOCTORS.filter((d) => d.hospitalId === 'h-001'),
  },
  patient: {
    stats: {
      upcomingAppointments: MOCK_APPOINTMENTS.filter((a) => a.patientId === 'u-003' && a.status !== 'cancelled').length,
      completedAppointments: MOCK_APPOINTMENTS.filter((a) => a.patientId === 'u-003' && a.status === 'completed').length,
      prescriptions: MOCK_PRESCRIPTIONS.filter((p) => p.patientId === 'u-003').length,
      reviews: MOCK_REVIEWS.filter((r) => r.patientId === 'u-003').length,
    },
    appointments: MOCK_APPOINTMENTS.filter((a) => a.patientId === 'u-003'),
    prescriptions: MOCK_PRESCRIPTIONS.filter((p) => p.patientId === 'u-003'),
  },
}

// ─── Public Mock API ──────────────────────────────────────────────────────────

/** POST /auth/login */
export const mockLoginUser = async ({ email, password }) => {
  await delay()
  const user = MOCK_USERS[email]
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password.')
  }
  const { password: _pwd, ...safeUser } = user
  return { data: { token: `mock-token-${safeUser.role}-${Date.now()}`, user: safeUser } }
}

/** GET /dashboard */
export const mockFetchDashboardData = async (role) => {
  await delay()
  const data = MOCK_DASHBOARD[role] ?? MOCK_DASHBOARD.patient
  return { data }
}

/** GET /hospitals */
export const mockFetchHospitals = async () => {
  await delay()
  return { data: MOCK_HOSPITALS }
}

/** GET /doctors */
export const mockFetchDoctors = async (filters = {}) => {
  await delay()
  let doctors = [...MOCK_DOCTORS]
  if (filters.hospitalId) doctors = doctors.filter((d) => d.hospitalId === filters.hospitalId)
  if (filters.specialty)  doctors = doctors.filter((d) => d.specialty === filters.specialty)
  return { data: doctors }
}

/** GET /specialties */
export const mockFetchSpecialties = async () => {
  await delay()
  return { data: MOCK_SPECIALTIES }
}

/** GET /appointments */
export const mockFetchAppointments = async (filters = {}) => {
  await delay()
  let list = [...MOCK_APPOINTMENTS]
  if (filters.patientId)  list = list.filter((a) => a.patientId === filters.patientId)
  if (filters.hospitalId) list = list.filter((a) => a.hospitalId === filters.hospitalId)
  if (filters.doctorId)   list = list.filter((a) => a.doctorId === filters.doctorId)
  return { data: list }
}

/** GET /prescriptions */
export const mockFetchPrescriptions = async (filters = {}) => {
  await delay()
  let list = [...MOCK_PRESCRIPTIONS]
  if (filters.patientId) list = list.filter((p) => p.patientId === filters.patientId)
  return { data: list }
}

/** GET /reviews */
export const mockFetchReviews = async (filters = {}) => {
  await delay()
  let list = [...MOCK_REVIEWS]
  if (filters.patientId) list = list.filter((r) => r.patientId === filters.patientId)
  return { data: list }
}

// ─── Mock Schedule Slots ──────────────────────────────────────────────────────
export const MOCK_SCHEDULES = [
  { id: 'sch-001', doctorId: 'd-001', doctorName: 'Dr. Sarah Mitchell', day: 'Monday',    start: '09:00', end: '13:00', slots: ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30'] },
  { id: 'sch-002', doctorId: 'd-001', doctorName: 'Dr. Sarah Mitchell', day: 'Wednesday', start: '14:00', end: '17:00', slots: ['14:00','14:30','15:00','15:30','16:00','16:30'] },
  { id: 'sch-003', doctorId: 'd-002', doctorName: 'Dr. James Lee',      day: 'Tuesday',   start: '10:00', end: '14:00', slots: ['10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30'] },
  { id: 'sch-004', doctorId: 'd-003', doctorName: 'Dr. Priya Sharma',   day: 'Thursday',  start: '09:00', end: '12:00', slots: ['09:00','09:30','10:00','10:30','11:00','11:30'] },
]

export const MOCK_USERS_LIST = [
  { id: 'u-001', name: 'Super Admin',               email: 'admin@healthcare.com',    role: 'super_admin',    status: 'active', joinedDate: '2025-01-01' },
  { id: 'u-002', name: 'Dr. City Hospital Admin',   email: 'hospital@healthcare.com', role: 'hospital_admin', status: 'active', hospitalName: 'City General Hospital', joinedDate: '2025-03-15' },
  { id: 'u-003', name: 'John Doe',                  email: 'patient@healthcare.com',  role: 'patient',        status: 'active', joinedDate: '2025-06-20', phone: '+1-555-0100' },
  { id: 'u-004', name: 'Jane Smith',                email: 'jane@example.com',        role: 'patient',        status: 'active', joinedDate: '2025-07-10', phone: '+1-555-0200' },
  { id: 'u-005', name: 'Bob Johnson',               email: 'bob@example.com',         role: 'patient',        status: 'inactive', joinedDate: '2025-08-05', phone: '+1-555-0300' },
  { id: 'u-006', name: 'Sunrise Medical Admin',     email: 'sunrise@healthcare.com',  role: 'hospital_admin', status: 'active', hospitalName: 'Sunrise Medical Center', joinedDate: '2025-04-01' },
]

/** GET /schedules */
export const mockFetchSchedules = async (filters = {}) => {
  await delay()
  let list = [...MOCK_SCHEDULES]
  if (filters.doctorId) list = list.filter((s) => s.doctorId === filters.doctorId)
  return { data: list }
}

/** GET /users */
export const mockFetchUsers = async () => {
  await delay()
  return { data: MOCK_USERS_LIST }
}

/** POST /hospitals (add) */
export const mockAddHospital = async (data) => {
  await delay()
  const newHospital = { id: `h-${Date.now()}`, ...data, totalDoctors: 0, totalAppointments: 0 }
  MOCK_HOSPITALS.push(newHospital)
  return { data: newHospital }
}

/** PATCH /hospitals/:id (update status) */
export const mockUpdateHospital = async (id, updates) => {
  await delay()
  const idx = MOCK_HOSPITALS.findIndex((h) => h.id === id)
  if (idx === -1) throw new Error('Hospital not found')
  MOCK_HOSPITALS[idx] = { ...MOCK_HOSPITALS[idx], ...updates }
  return { data: MOCK_HOSPITALS[idx] }
}

/** POST /specialties/add */
export const mockAddSpecialty = async (data) => {
  await delay()
  const { MOCK_SPECIALTIES: list } = await import('./mockApi')
  const newSpec = { id: `s-${Date.now()}`, ...data, totalDoctors: 0 }
  MOCK_SPECIALTIES.push(newSpec)
  return { data: newSpec }
}

/** PATCH /reviews/:id */
export const mockUpdateReview = async (id, updates) => {
  await delay()
  const idx = MOCK_REVIEWS.findIndex((r) => r.id === id)
  if (idx === -1) throw new Error('Review not found')
  MOCK_REVIEWS[idx] = { ...MOCK_REVIEWS[idx], ...updates }
  return { data: MOCK_REVIEWS[idx] }
}

/** POST /appointments (book) */
export const mockBookAppointment = async (data) => {
  await delay()
  const newAppt = { id: `a-${Date.now()}`, status: 'pending', ...data }
  MOCK_APPOINTMENTS.push(newAppt)
  return { data: newAppt }
}

/** PATCH /appointments/:id */
export const mockUpdateAppointment = async (id, updates) => {
  await delay()
  const idx = MOCK_APPOINTMENTS.findIndex((a) => a.id === id)
  if (idx === -1) throw new Error('Appointment not found')
  MOCK_APPOINTMENTS[idx] = { ...MOCK_APPOINTMENTS[idx], ...updates }
  return { data: MOCK_APPOINTMENTS[idx] }
}

/** POST /doctors (add) */
export const mockAddDoctor = async (data) => {
  await delay()
  const newDoc = { id: `d-${Date.now()}`, rating: 0, ...data }
  MOCK_DOCTORS.push(newDoc)
  return { data: newDoc }
}

/** DELETE /doctors/:id */
export const mockDeleteDoctor = async (id) => {
  await delay()
  const idx = MOCK_DOCTORS.findIndex((d) => d.id === id)
  if (idx !== -1) MOCK_DOCTORS.splice(idx, 1)
  return { data: { success: true } }
}

/** POST /reviews */
export const mockSubmitReview = async (data) => {
  await delay()
  const newReview = { id: `r-${Date.now()}`, status: 'pending', date: new Date().toISOString().split('T')[0], ...data }
  MOCK_REVIEWS.push(newReview)
  return { data: newReview }
}
