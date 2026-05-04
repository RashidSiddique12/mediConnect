import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { USER_ROLES } from "../constants/roles";

// Lazy load patient components
const PatientHome = React.lazy(() => import("../pages/patient/Home"));
const PatientProfile = React.lazy(
  () => import("../pages/patient/Profile/PatientProfile"),
);
const SearchHospitals = React.lazy(
  () => import("../pages/patient/Search/SearchHospitals"),
);
const SearchDoctors = React.lazy(
  () => import("../pages/patient/Search/SearchDoctors"),
);
const DoctorProfile = React.lazy(
  () => import("../pages/patient/Search/DoctorProfile"),
);
const BookAppointment = React.lazy(
  () => import("../pages/patient/Appointments/BookAppointment"),
);
const MyAppointments = React.lazy(
  () => import("../pages/patient/Appointments/MyAppointments"),
);
const AppointmentHistory = React.lazy(
  () => import("../pages/patient/Appointments/AppointmentHistory"),
);
const MyPrescriptions = React.lazy(
  () => import("../pages/patient/Prescriptions/MyPrescriptions"),
);
const UploadDocuments = React.lazy(
  () => import("../pages/patient/Prescriptions/UploadDocuments"),
);
const SubmitReview = React.lazy(
  () => import("../pages/patient/Reviews/SubmitReview"),
);

const PatientRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]} />}>
        <Route index element={<PatientHome />} />
        <Route path="home" element={<PatientHome />} />

        {/* Profile */}
        <Route path="profile" element={<PatientProfile />} />

        {/* Search */}
        <Route path="hospitals" element={<SearchHospitals />} />
        <Route path="doctors" element={<SearchDoctors />} />
        <Route path="doctors/:id" element={<DoctorProfile />} />

        {/* Appointments */}
        <Route path="book/:doctorId" element={<BookAppointment />} />
        <Route path="appointments" element={<MyAppointments />} />
        <Route path="appointments/history" element={<AppointmentHistory />} />

        {/* Prescriptions */}
        <Route path="prescriptions" element={<MyPrescriptions />} />
        <Route path="documents/upload" element={<UploadDocuments />} />

        {/* Reviews */}
        <Route path="review/:appointmentId" element={<SubmitReview />} />
      </Route>
    </Routes>
  );
};

export default PatientRoutes;
