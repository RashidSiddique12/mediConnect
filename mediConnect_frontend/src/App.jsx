/**
 * @author Healthcare Appointment App
 * @description App root — wraps routes in BrowserRouter and ErrorBoundary.
 * JIRA: HAA-001 #comment App entry
 */

import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '@/routes/AppRoutes'
import ErrorBoundary from '@/components/common/ErrorBoundary'

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  )
}
