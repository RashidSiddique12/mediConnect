import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { USER_ROLES } from "../constants/roles";

// Admin components
const AdminDashboard = React.lazy(() => import("../pages/admin/Dashboard"));
import HospitalList from "../pages/admin/Hospitals/HospitalList";
import HospitalDetail from "../pages/admin/Hospitals/HospitalDetail";
import AddHospital from "../pages/admin/Hospitals/AddHospital";
import EditHospital from "../pages/admin/Hospitals/EditHospital";
import UserList from "../pages/admin/Users/UserList";
import UserDetail from "../pages/admin/Users/UserDetail";
import SpecialtyList from "../pages/admin/Specialties/SpecialtyList";
import AddSpecialty from "../pages/admin/Specialties/AddSpecialty";
import ReviewModeration from "../pages/admin/Reviews/ReviewModeration";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        element={<ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN]} />}
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Hospital Management */}
        <Route path="hospitals" element={<HospitalList />} />
        <Route path="hospitals/new" element={<AddHospital />} />
        <Route path="hospitals/:id" element={<HospitalDetail />} />
        <Route path="hospitals/edit/:id" element={<EditHospital />} />

        {/* User Management */}
        <Route path="users" element={<UserList />} />
        <Route path="users/:id" element={<UserDetail />} />

        {/* Specialty Management */}
        <Route path="specialties" element={<SpecialtyList />} />
        <Route path="specialties/add" element={<AddSpecialty />} />

        {/* Review Moderation */}
        <Route path="reviews" element={<ReviewModeration />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
