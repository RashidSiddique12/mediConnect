import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { USER_ROLES } from "../constants/roles";

// Lazy load hospital components
const HospitalDashboard = React.lazy(
  () => import("../pages/hospital/Dashboard"),
);
const HospitalProfile = React.lazy(
  () => import("../pages/hospital/Profile/HospitalProfile"),
);
const DoctorList = React.lazy(
  () => import("../pages/hospital/Doctors/DoctorList"),
);
const AddDoctor = React.lazy(
  () => import("../pages/hospital/Doctors/AddDoctor"),
);
const EditDoctor = React.lazy(
  () => import("../pages/hospital/Doctors/EditDoctor"),
);
const DoctorDetail = React.lazy(
  () => import("../pages/hospital/Doctors/DoctorDetail"),
);
const ScheduleList = React.lazy(
  () => import("../pages/hospital/Schedules/ScheduleList"),
);
const ManageSlots = React.lazy(
  () => import("../pages/hospital/Schedules/ManageSlots"),
);
const AppointmentList = React.lazy(
  () => import("../pages/hospital/Appointments/AppointmentList"),
);
const AppointmentDetails = React.lazy(
  () => import("../pages/hospital/Appointments/AppointmentDetails"),
);
const UploadPrescription = React.lazy(
  () => import("../pages/hospital/Prescriptions/UploadPrescription"),
);

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
