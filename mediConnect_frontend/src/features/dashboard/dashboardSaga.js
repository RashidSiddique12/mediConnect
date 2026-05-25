import { takeLatest, call, put, select } from "redux-saga/effects";
import * as dashboardSlice from "./dashboardSlice";
import {
  fetchDashboardStats,
  fetchHospitalDashboard,
  fetchPatientDashboard,
} from "@/services/api";

function* handleFetchDashboard() {
  try {
    const user = yield select((s) => s.auth.user);
    const role = user?.role || localStorage.getItem("userRole");
    let response;
    if (role === "patient") {
      response = yield call(fetchPatientDashboard);
    } else if (role === "hospital_admin") {
      response = yield call(fetchHospitalDashboard);
    } else {
      response = yield call(fetchDashboardStats);
    }
    yield put(dashboardSlice.fetchDashboardSuccess(response.data.data));
  } catch (error) {
    const message = error?.message || 'Failed to fetch dashboard'
    yield put(dashboardSlice.fetchDashboardFailure(message));
  }
}

export function* watchDashboardSaga() {
  yield takeLatest(
    dashboardSlice.fetchDashboardRequest.type,
    handleFetchDashboard,
  );
}
