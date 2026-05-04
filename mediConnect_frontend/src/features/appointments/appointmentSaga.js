import { takeLatest, call, put } from "redux-saga/effects";
import * as appointmentSlice from "./appointmentSlice";
import {
  fetchAppointments,
  fetchAppointmentById,
  bookAppointment,
  cancelAppointment,
  updateAppointment,
} from "@/services/api";

function* handleFetchAppointments(action) {
  try {
    const response = yield call(fetchAppointments, action.payload);
    yield put(
      appointmentSlice.fetchAppointmentsSuccess({
        data: response.data.data || [],
        pagination: response.data.pagination || null,
      }),
    );
  } catch (error) {
    yield put(appointmentSlice.fetchAppointmentsFailure(error.message));
  }
}

function* handleFetchAppointmentById(action) {
  try {
    const response = yield call(fetchAppointmentById, action.payload);
    yield put(appointmentSlice.fetchAppointmentByIdSuccess(response.data.data));
  } catch (error) {
    yield put(appointmentSlice.fetchAppointmentByIdFailure(error.message));
  }
}

function* handleBookAppointment(action) {
  try {
    yield call(bookAppointment, action.payload);
    yield put(appointmentSlice.bookAppointmentSuccess());
  } catch (error) {
    yield put(appointmentSlice.bookAppointmentFailure(error.message));
  }
}

function* handleCancelAppointment(action) {
  try {
    yield call(cancelAppointment, action.payload);
    yield put(appointmentSlice.cancelAppointmentSuccess(action.payload));
  } catch (error) {
    yield put(appointmentSlice.cancelAppointmentFailure(error.message));
  }
}

function* handleUpdateAppointment(action) {
  try {
    const { id, ...data } = action.payload;
    const response = yield call(updateAppointment, id, data);
    yield put(appointmentSlice.updateAppointmentSuccess(response.data.data));
  } catch (error) {
    yield put(appointmentSlice.updateAppointmentFailure(error.message));
  }
}

export function* watchAppointmentSaga() {
  yield takeLatest(
    appointmentSlice.fetchAppointmentsRequest.type,
    handleFetchAppointments,
  );
  yield takeLatest(
    appointmentSlice.fetchAppointmentByIdRequest.type,
    handleFetchAppointmentById,
  );
  yield takeLatest(
    appointmentSlice.bookAppointmentRequest.type,
    handleBookAppointment,
  );
  yield takeLatest(
    appointmentSlice.cancelAppointmentRequest.type,
    handleCancelAppointment,
  );
  yield takeLatest(
    appointmentSlice.updateAppointmentRequest.type,
    handleUpdateAppointment,
  );
}
