/**
 * @author Healthcare Appointment App
 * @description AppRoutes — full application route tree with role-based lazy loading.
 * JIRA: HAA-007 #comment App routing setup
 */

import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import MainLayout from '@/layout/MainLayout'
import Loader from '@/components/common/Loader'
import { USER_ROLES } from '@/constants/roles'

// ─── Auth ─────────────────────────────────────────────────────────────────────
const Login    = lazy(() => import('@/pages/auth/Login'))
const Register = lazy(() => import('@/pages/auth/Register'))

// ─── Super Admin ──────────────────────────────────────────────────────────────
const AdminDashboard    = lazy(() => import('@/pages/admin/Dashboard'))
const HospitalList      = lazy(() => import('@/pages/admin/Hospitals/HospitalList'))
const UserList          = lazy(() => import('@/pages/admin/Users/UserList'))
const SpecialtyList     = lazy(() => import('@/pages/admin/Specialties/SpecialtyList'))
const ReviewModeration  = lazy(() => import('@/pages/admin/Reviews/ReviewModeration'))

// ─── Hospital Admin ───────────────────────────────────────────────────────────
const HospitalDashboard   = lazy(() => import('@/pages/hospital/Dashboard'))
const HospitalProfile     = lazy(() => import('@/pages/hospital/Profile/HospitalProfile'))
const DoctorList          = lazy(() => import('@/pages/hospital/Doctors/DoctorList'))
const AddDoctor           = lazy(() => import('@/pages/hospital/Doctors/AddDoctor'))
const EditDoctor          = lazy(() => import('@/pages/hospital/Doctors/EditDoctor'))
const ScheduleList        = lazy(() => import('@/pages/hospital/Schedules/ScheduleList'))
const ManageSlots         = lazy(() => import('@/pages/hospital/Schedules/ManageSlots'))
const HospAppointmentList = lazy(() => import('@/pages/hospital/Appointments/AppointmentList'))
const AppointmentDetails  = lazy(() => import('@/pages/hospital/Appointments/AppointmentDetails'))
const UploadPrescription  = lazy(() => import('@/pages/hospital/Prescriptions/UploadPrescription'))

// ─── Patient ──────────────────────────────────────────────────────────────────
const PatientHome        = lazy(() => import('@/pages/patient/Home'))
const PatientProfile     = lazy(() => import('@/pages/patient/Profile/PatientProfile'))
const SearchHospitals    = lazy(() => import('@/pages/patient/Search/SearchHospitals'))
const SearchDoctors      = lazy(() => import('@/pages/patient/Search/SearchDoctors'))
const DoctorProfile      = lazy(() => import('@/pages/patient/Search/DoctorProfile'))
const BookAppointment    = lazy(() => import('@/pages/patient/Appointments/BookAppointment'))
const MyAppointments     = lazy(() => import('@/pages/patient/Appointments/MyAppointments'))
const MyPrescriptions    = lazy(() => import('@/pages/patient/Prescriptions/MyPrescriptions'))
const SubmitReview       = lazy(() => import('@/pages/patient/Reviews/SubmitReview'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ── Public ── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Super Admin ── */}
        <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN]} />}>
          <Route element={<MainLayout role="admin" />}>
            <Route path="/admin"              element={<AdminDashboard />} />
            <Route path="/admin/hospitals"    element={<HospitalList />} />
            <Route path="/admin/users"        element={<UserList />} />
            <Route path="/admin/specialties"  element={<SpecialtyList />} />
            <Route path="/admin/reviews"      element={<ReviewModeration />} />
          </Route>
        </Route>

        {/* ── Hospital Admin ── */}
        <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.HOSPITAL_ADMIN]} />}>
          <Route element={<MainLayout role="hospital" />}>
            <Route path="/hospital"                              element={<HospitalDashboard />} />
            <Route path="/hospital/profile"                      element={<HospitalProfile />} />
            <Route path="/hospital/doctors"                      element={<DoctorList />} />
            <Route path="/hospital/doctors/add"                  element={<AddDoctor />} />
            <Route path="/hospital/doctors/edit/:id"             element={<EditDoctor />} />
            <Route path="/hospital/schedules"                    element={<ScheduleList />} />
            <Route path="/hospital/schedules/slots/:doctorId"    element={<ManageSlots />} />
            <Route path="/hospital/appointments"                 element={<HospAppointmentList />} />
            <Route path="/hospital/appointments/:id"             element={<AppointmentDetails />} />
            <Route path="/hospital/prescriptions/upload/:id"     element={<UploadPrescription />} />
          </Route>
        </Route>

        {/* ── Patient ── */}
        <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]} />}>
          <Route element={<MainLayout role="patient" />}>
            <Route path="/patient"                      element={<PatientHome />} />
            <Route path="/patient/profile"              element={<PatientProfile />} />
            <Route path="/patient/hospitals"            element={<SearchHospitals />} />
            <Route path="/patient/doctors"              element={<SearchDoctors />} />
            <Route path="/patient/doctors/:id"          element={<DoctorProfile />} />
            <Route path="/patient/book/:doctorId"       element={<BookAppointment />} />
            <Route path="/patient/appointments"         element={<MyAppointments />} />
            <Route path="/patient/prescriptions"        element={<MyPrescriptions />} />
            <Route path="/patient/review/:appointmentId" element={<SubmitReview />} />
          </Route>
        </Route>

        {/* ── Fallbacks ── */}
        <Route path="/dashboard" element={<Navigate to="/login" replace />} />
        <Route path="*"          element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}
