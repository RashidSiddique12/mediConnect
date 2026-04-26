
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { USER_ROLES } from '../constants/roles';

// Lazy load admin components
const AdminDashboard = React.lazy(() => import('../pages/admin/Dashboard'));
const HospitalList = React.lazy(() => import('../pages/admin/Hospitals/HospitalList'));
const HospitalDetail = React.lazy(() => import('../pages/admin/Hospitals/HospitalDetail'));
const AddHospital = React.lazy(() => import('../pages/admin/Hospitals/AddHospital'));
const EditHospital = React.lazy(() => import('../pages/admin/Hospitals/EditHospital'));
const UserList = React.lazy(() => import('../pages/admin/Users/UserList'));
const SpecialtyList = React.lazy(() => import('../pages/admin/Specialties/SpecialtyList'));
const AddSpecialty = React.lazy(() => import('../pages/admin/Specialties/AddSpecialty'));
const ReviewModeration = React.lazy(() => import('../pages/admin/Reviews/ReviewModeration'));

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN]} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        
        {/* Hospital Management */}
        <Route path="hospitals" element={<HospitalList />} />
        <Route path="hospitals/new" element={<AddHospital />} />
        <Route path="hospitals/:id" element={<HospitalDetail />} />
        <Route path="hospitals/edit/:id" element={<EditHospital />} />
        
        {/* User Management */}
        <Route path="users" element={<UserList />} />
        
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
