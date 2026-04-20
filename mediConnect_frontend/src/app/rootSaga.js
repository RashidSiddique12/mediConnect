/**
 * @author Healthcare Appointment App
 * @description Root Saga — registers all page-level sagas.
 * JIRA: HAA-001 #comment Redux-Saga root registration
 */

import { all } from 'redux-saga/effects'
import { watchAuthSaga } from '@/pages/auth/authSaga'
import { watchDashboardSaga } from '@/pages/dashboard/dashboardSaga'

export default function* rootSaga() {
  yield all([
    watchAuthSaga(),
    watchDashboardSaga(),
  ])
}
