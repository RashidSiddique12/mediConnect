import { takeLatest, call, put } from "redux-saga/effects";
import * as prescriptionSlice from "./prescriptionSlice";
import { fetchPrescriptions, uploadPrescription } from "@/services/api";
import apiClient from "@/services/api";

function* handleFetchPrescriptions(action) {
  try {
    const response = yield call(fetchPrescriptions, action.payload);
    yield put(
      prescriptionSlice.fetchPrescriptionsSuccess({
        data: response.data.data || [],
        pagination: response.data.pagination || null,
      }),
    );
  } catch (error) {
    yield put(prescriptionSlice.fetchPrescriptionsFailure(error.message));
  }
}

function* handleFetchPrescriptionByAppointment(action) {
  try {
    const response = yield call(
      [apiClient, apiClient.get],
      `/appointments/${action.payload}/prescription`,
    );
    yield put(
      prescriptionSlice.fetchPrescriptionByAppointmentSuccess(
        response.data.data,
      ),
    );
  } catch (error) {
    yield put(
      prescriptionSlice.fetchPrescriptionByAppointmentFailure(error.message),
    );
  }
}

function* handleUploadPrescription(action) {
  try {
    const response = yield call(uploadPrescription, action.payload);
    yield put(prescriptionSlice.uploadPrescriptionSuccess(response.data.data));
  } catch (error) {
    yield put(prescriptionSlice.uploadPrescriptionFailure(error.message));
  }
}

export function* watchPrescriptionSaga() {
  yield takeLatest(
    prescriptionSlice.fetchPrescriptionsRequest.type,
    handleFetchPrescriptions,
  );
  yield takeLatest(
    prescriptionSlice.fetchPrescriptionByAppointmentRequest.type,
    handleFetchPrescriptionByAppointment,
  );
  yield takeLatest(
    prescriptionSlice.uploadPrescriptionRequest.type,
    handleUploadPrescription,
  );
}
