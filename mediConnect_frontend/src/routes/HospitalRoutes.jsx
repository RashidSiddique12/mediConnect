import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { USER_ROLES } from "../constants/roles";

// Hospital components
const HospitalDashboard = React.lazy(
  () => import("../pages/hospital/Dashboard"),
);
import HospitalProfile from "../pages/hospital/Profile/HospitalProfile";
import DoctorList from "../pages/hospital/Doctors/DoctorList";
import AddDoctor from "../pages/hospital/Doctors/AddDoctor";
import EditDoctor from "../pages/hospital/Doctors/EditDoctor";
import DoctorDetail from "../pages/hospital/Doctors/DoctorDetail";
import ScheduleList from "../pages/hospital/Schedules/ScheduleList";
import ManageSlots from "../pages/hospital/Schedules/ManageSlots";
import AppointmentList from "../pages/hospital/Appointments/AppointmentList";
import AppointmentDetails from "../pages/hospital/Appointments/AppointmentDetails";
import UploadPrescription from "../pages/hospital/Prescriptions/UploadPrescription";

const HospitalRoutes = () => {
  return (
    <Routes>
      <Route
        element={<ProtectedRoute allowedRoles={[USER_ROLES.HOSPITAL_ADMIN]} />}
      >
        <Route index element={<HospitalDashboard />} />
        <Route path="dashboard" element={<HospitalDashboard />} />

        {/* Hospital Profile */}
        <Route path="profile" element={<HospitalProfile />} />

        {/* Doctor Management */}
        <Route path="doctors" element={<DoctorList />} />
        <Route path="doctors/add" element={<AddDoctor />} />
        <Route path="doctors/edit/:id" element={<EditDoctor />} />
        <Route path="doctors/:id" element={<DoctorDetail />} />

        {/* Schedule Management */}
        <Route path="schedules" element={<ScheduleList />} />
        <Route path="schedules/slots/:doctorId" element={<ManageSlots />} />

        {/* Appointment Management */}
        <Route path="appointments" element={<AppointmentList />} />
        <Route path="appointments/:id" element={<AppointmentDetails />} />

        {/* Prescription Management */}
        <Route
          path="prescriptions/upload/:appointmentId"
          element={<UploadPrescription />}
        />
      </Route>
    </Routes>
  );
};

export default HospitalRoutes;
