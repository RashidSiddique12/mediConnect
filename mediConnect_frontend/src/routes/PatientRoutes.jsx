import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { USER_ROLES } from "../constants/roles";

// Patient components
const PatientHome = React.lazy(() => import("../pages/patient/Home"));
const PatientProfile = React.lazy(
  () => import("../pages/patient/Profile/PatientProfile"),
);
import SearchHospitals from "../pages/patient/Search/SearchHospitals";
import SearchDoctors from "../pages/patient/Search/SearchDoctors";
import DoctorProfile from "../pages/patient/Search/DoctorProfile";
import BookAppointment from "../pages/patient/Appointments/BookAppointment";
import MyAppointments from "../pages/patient/Appointments/MyAppointments";
import PatientAppointmentDetails from "../pages/patient/Appointments/AppointmentDetails";
import MyPrescriptions from "../pages/patient/Prescriptions/MyPrescriptions";
import UploadDocuments from "../pages/patient/Prescriptions/UploadDocuments";
import SubmitReview from "../pages/patient/Reviews/SubmitReview";

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
        <Route path="appointments/:id" element={<PatientAppointmentDetails />} />

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
