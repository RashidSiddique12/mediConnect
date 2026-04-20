/**
 * @author Healthcare Appointment App
 * @description ProtectedRoute — redirects unauthenticated users to /login.
 *              Also enforces role-based access control (RBAC).
 * OWASP: Broken Access Control — always enforce server-side auth; this is UI-only gating.
 * JIRA: HAA-007 #comment Protected route guard
 */

import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const token = localStorage.getItem('authToken')

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard
    const roleMap = {
      super_admin: '/admin',
      hospital_admin: '/hospital',
      patient: '/patient',
    }
    return <Navigate to={roleMap[user.role] || '/login'} replace />
  }

  return <Outlet />
}
