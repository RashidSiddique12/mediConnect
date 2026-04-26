import { all } from 'redux-saga/effects'
import { watchAuthSaga } from '@/features/auth/authSaga'
import { watchDashboardSaga } from '@/features/dashboard/dashboardSaga'
import { watchHospitalSaga } from '@/features/hospitals/hospitalSaga'
import { watchSpecialtySaga } from '@/features/specialties/specialtySaga'
import { watchUserSaga } from '@/features/users/userSaga'
import { watchDoctorSaga } from '@/features/doctors/doctorSaga'
import { watchAppointmentSaga } from '@/features/appointments/appointmentSaga'
import { watchPrescriptionSaga } from '@/features/prescriptions/prescriptionSaga'
import { watchReviewSaga } from '@/features/reviews/reviewSaga'
import { watchScheduleSaga } from '@/features/schedules/scheduleSaga'

export default function* rootSaga() {
  yield all([
    watchAuthSaga(),
    watchDashboardSaga(),
    watchHospitalSaga(),
    watchSpecialtySaga(),
    watchUserSaga(),
    watchDoctorSaga(),
    watchAppointmentSaga(),
    watchPrescriptionSaga(),
    watchReviewSaga(),
    watchScheduleSaga(),
  ])
}
