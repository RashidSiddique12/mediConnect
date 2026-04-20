/**
 * @author Healthcare Appointment App
 * @description Dashboard saga — fetches dashboard data via centralized API service.
 * JIRA: HAA-005 #comment Dashboard saga
 */

import { takeLatest, call, put, select } from 'redux-saga/effects'
import {
  fetchDashboardRequest,
  fetchDashboardSuccess,
  fetchDashboardFailure,
} from './dashboardSlice'
import { fetchDashboardData } from '@/services/api'

function* handleFetchDashboard() {
  try {
    const role = yield select((state) => state.auth.user?.role)
    const response = yield call(fetchDashboardData, role)
    yield put(fetchDashboardSuccess(response.data))
  } catch (error) {
    yield put(fetchDashboardFailure(error.message))
  }
}

export function* watchDashboardSaga() {
  yield takeLatest(fetchDashboardRequest.type, handleFetchDashboard)
}
