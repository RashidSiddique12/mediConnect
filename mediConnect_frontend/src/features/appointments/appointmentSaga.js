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
    const message = error?.message || 'Failed to fetch appointments'
    yield put(appointmentSlice.fetchAppointmentsFailure(message));
  }
}

function* handleFetchAppointmentById(action) {
  try {
    const response = yield call(fetchAppointmentById, action.payload);
    yield put(appointmentSlice.fetchAppointmentByIdSuccess(response.data.data));
  } catch (error) {
    const message = error?.message || 'Failed to fetch appointment'
    yield put(appointmentSlice.fetchAppointmentByIdFailure(message));
  }
}

function* handleBookAppointment(action) {
  try {
    yield call(bookAppointment, action.payload);
    yield put(appointmentSlice.bookAppointmentSuccess());
  } catch (error) {
    const message = error?.message || 'Failed to book appointment'
    yield put(appointmentSlice.bookAppointmentFailure(message));
  }
}

function* handleCancelAppointment(action) {
  try {
    yield call(cancelAppointment, action.payload);
    yield put(appointmentSlice.cancelAppointmentSuccess(action.payload));
  } catch (error) {
    const message = error?.message || 'Failed to cancel appointment'
    yield put(appointmentSlice.cancelAppointmentFailure(message));
  }
}

function* handleUpdateAppointment(action) {
  try {
    const { id, ...data } = action.payload;
    const response = yield call(updateAppointment, id, data);
    yield put(appointmentSlice.updateAppointmentSuccess(response.data.data));
  } catch (error) {
    const message = error?.message || 'Failed to update appointment'
    yield put(appointmentSlice.updateAppointmentFailure(message));
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
