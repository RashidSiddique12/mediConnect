import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/layout/MainLayout";
import Loader from "@/components/common/Loader";
import { USER_ROLES } from "@/constants/roles";

// ─── Auth ─────────────────────────────────────────────────────────────────────
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));

// ─── Super Admin ──────────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
import HospitalList from "@/pages/admin/Hospitals/HospitalList";
import HospitalDetail from "@/pages/admin/Hospitals/HospitalDetail";
import AddHospital from "@/pages/admin/Hospitals/AddHospital";
import EditHospital from "@/pages/admin/Hospitals/EditHospital";
import UserList from "@/pages/admin/Users/UserList";
import UserDetail from "@/pages/admin/Users/UserDetail";
import SpecialtyList from "@/pages/admin/Specialties/SpecialtyList";
import ReviewModeration from "@/pages/admin/Reviews/ReviewModeration";

// ─── Hospital Admin ───────────────────────────────────────────────────────────
const HospitalDashboard = lazy(() => import("@/pages/hospital/Dashboard"));
import HospitalProfile from "@/pages/hospital/Profile/HospitalProfile";
import DoctorList from "@/pages/hospital/Doctors/DoctorList";
import AddDoctor from "@/pages/hospital/Doctors/AddDoctor";
import EditDoctor from "@/pages/hospital/Doctors/EditDoctor";
import DoctorDetail from "@/pages/hospital/Doctors/DoctorDetail";
import ScheduleList from "@/pages/hospital/Schedules/ScheduleList";
import ManageSlots from "@/pages/hospital/Schedules/ManageSlots";
import HospAppointmentList from "@/pages/hospital/Appointments/AppointmentList";
import AppointmentDetails from "@/pages/hospital/Appointments/AppointmentDetails";
import UploadPrescription from "@/pages/hospital/Prescriptions/UploadPrescription";

// ─── Patient ──────────────────────────────────────────────────────────────────
const PatientHome = lazy(() => import("@/pages/patient/Home"));
import PatientProfile from "@/pages/patient/Profile/PatientProfile";
import SearchHospitals from "@/pages/patient/Search/SearchHospitals";
import SearchDoctors from "@/pages/patient/Search/SearchDoctors";
import DoctorProfile from "@/pages/patient/Search/DoctorProfile";
import BookAppointment from "@/pages/patient/Appointments/BookAppointment";
import MyAppointments from "@/pages/patient/Appointments/MyAppointments";
import PatientAppointmentDetails from "@/pages/patient/Appointments/AppointmentDetails";
import MyPrescriptions from "@/pages/patient/Prescriptions/MyPrescriptions";
import SubmitReview from "@/pages/patient/Reviews/SubmitReview";

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ── Public ── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Super Admin ── */}
        <Route
          element={<ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN]} />}
        >
          <Route element={<MainLayout role="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/hospitals" element={<HospitalList />} />
            <Route path="/admin/hospitals/new" element={<AddHospital />} />
            <Route
              path="/admin/hospitals/edit/:id"
              element={<EditHospital />}
            />
            <Route path="/admin/hospitals/:id" element={<HospitalDetail />} />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/users/:id" element={<UserDetail />} />
            <Route path="/admin/specialties" element={<SpecialtyList />} />
            <Route path="/admin/reviews" element={<ReviewModeration />} />
          </Route>
        </Route>

        {/* ── Hospital Admin ── */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.HOSPITAL_ADMIN]} />
          }
        >
          <Route element={<MainLayout role="hospital" />}>
            <Route path="/hospital" element={<HospitalDashboard />} />
            <Route path="/hospital/profile" element={<HospitalProfile />} />
            <Route path="/hospital/doctors" element={<DoctorList />} />
            <Route path="/hospital/doctors/add" element={<AddDoctor />} />
            <Route path="/hospital/doctors/edit/:id" element={<EditDoctor />} />
            <Route path="/hospital/doctors/:id" element={<DoctorDetail />} />
            <Route path="/hospital/schedules" element={<ScheduleList />} />
            <Route
              path="/hospital/schedules/slots/:doctorId"
              element={<ManageSlots />}
            />
            <Route
              path="/hospital/appointments"
              element={<HospAppointmentList />}
            />
            <Route
              path="/hospital/appointments/:id"
              element={<AppointmentDetails />}
            />
            <Route
              path="/hospital/prescriptions/upload/:appointmentId"
              element={<UploadPrescription />}
            />
          </Route>
        </Route>

        {/* ── Patient ── */}
        <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]} />}>
          <Route element={<MainLayout role="patient" />}>
            <Route path="/patient" element={<PatientHome />} />
            <Route path="/patient/profile" element={<PatientProfile />} />
            <Route path="/patient/hospitals" element={<SearchHospitals />} />
            <Route path="/patient/doctors" element={<SearchDoctors />} />
            <Route path="/patient/doctors/:id" element={<DoctorProfile />} />
            <Route
              path="/patient/book/:doctorId"
              element={<BookAppointment />}
            />
            <Route path="/patient/appointments" element={<MyAppointments />} />
            <Route
              path="/patient/appointments/:id"
              element={<PatientAppointmentDetails />}
            />
            <Route
              path="/patient/prescriptions"
              element={<MyPrescriptions />}
            />
            <Route
              path="/patient/review/:appointmentId"
              element={<SubmitReview />}
            />
          </Route>
        </Route>

        {/* ── Fallbacks ── */}
        <Route path="/dashboard" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
