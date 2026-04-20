/**
 * @author Healthcare Appointment App
 * @description Root Reducer — combines all page-level slices.
 * OWASP: No sensitive data stored in Redux state beyond session-scoped tokens.
 * JIRA: HAA-001 #comment Redux store setup
 */

import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '@/pages/auth/authSlice'
import dashboardReducer from '@/pages/dashboard/dashboardSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
})

export default rootReducer
