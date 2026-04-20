/**
 * @author Healthcare Appointment App
 * @description Dashboard Redux slice — manages dashboard data, loading, and error.
 * JIRA: HAA-005 #comment Dashboard slice
 */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null,
  loading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchDashboardRequest(state) {
      state.loading = true
      state.error = null
    },
    fetchDashboardSuccess(state, action) {
      state.loading = false
      state.data = action.payload
      state.error = null
    },
    fetchDashboardFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const {
  fetchDashboardRequest,
  fetchDashboardSuccess,
  fetchDashboardFailure,
} = dashboardSlice.actions

export default dashboardSlice.reducer
