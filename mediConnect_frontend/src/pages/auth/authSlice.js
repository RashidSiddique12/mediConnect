
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state) {
      state.loading = true
      state.error = null
    },
    loginSuccess(state, action) {
      state.loading = false
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
    },
    loginFailure(state, action) {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    },
    registerRequest(state) {
      state.loading = true
      state.error = null
    },
    registerSuccess(state) {
      state.loading = false
      state.error = null
    },
    registerFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const { 
  loginRequest, 
  loginSuccess, 
  loginFailure, 
  logout,
  registerRequest,
  registerSuccess,
  registerFailure,
} = authSlice.actions

export default authSlice.reducer
