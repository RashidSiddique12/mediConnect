import { combineReducers } from '@reduxjs/toolkit'
import * as authSlice from '@/features/auth/authSlice'
import * as dashboardSlice from '@/features/dashboard/dashboardSlice'
import * as hospitalSlice from '@/features/hospitals/hospitalSlice'
import * as specialtySlice from '@/features/specialties/specialtySlice'
import * as userSlice from '@/features/users/userSlice'
import * as doctorSlice from '@/features/doctors/doctorSlice'
import * as appointmentSlice from '@/features/appointments/appointmentSlice'
import * as prescriptionSlice from '@/features/prescriptions/prescriptionSlice'
import * as reviewSlice from '@/features/reviews/reviewSlice'
import * as scheduleSlice from '@/features/schedules/scheduleSlice'

const rootReducer = combineReducers({
  auth: authSlice.authReducer,
  dashboard: dashboardSlice.dashboardReducer,
  hospitals: hospitalSlice.hospitalReducer,
  specialties: specialtySlice.specialtyReducer,
  users: userSlice.userReducer,
  doctors: doctorSlice.doctorReducer,
  appointments: appointmentSlice.appointmentReducer,
  prescriptions: prescriptionSlice.prescriptionReducer,
  reviews: reviewSlice.reviewReducer,
  schedules: scheduleSlice.scheduleReducer,
})

export default rootReducer
