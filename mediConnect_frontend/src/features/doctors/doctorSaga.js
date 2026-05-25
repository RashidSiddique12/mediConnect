import { takeLatest, call, put } from "redux-saga/effects";
import * as doctorSlice from "./doctorSlice";
import {
  fetchDoctors,
  fetchDoctorById,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  fetchDoctorsByHospital,
  fetchMyHospitalDoctors,
} from "@/services/api";

function* handleFetchDoctors(action) {
  try {
    const params = action.payload;
    let response;
    if (params?.myHospital) {
      const { myHospital, ...query } = params;
      response = yield call(fetchMyHospitalDoctors, query);
    } else {
      response = yield call(fetchDoctors, params);
    }
    yield put(
      doctorSlice.fetchDoctorsSuccess({
        data: response.data.data || [],
        pagination: response.data.pagination || null,
      }),
    );
  } catch (error) {
    const message = error?.message || 'Failed to fetch doctors'
    yield put(doctorSlice.fetchDoctorsFailure(message));
  }
}

function* handleFetchDoctorById(action) {
  try {
    const response = yield call(fetchDoctorById, action.payload);
    yield put(doctorSlice.fetchDoctorByIdSuccess(response.data.data));
  } catch (error) {
    const message = error?.message || 'Failed to fetch doctor'
    yield put(doctorSlice.fetchDoctorByIdFailure(message));
  }
}

function* handleCreateDoctor(action) {
  try {
    const response = yield call(addDoctor, action.payload);
    yield put(doctorSlice.createDoctorSuccess(response.data.data));
  } catch (error) {
    const message = error?.message || 'Failed to create doctor'
    yield put(doctorSlice.createDoctorFailure(message));
  }
}

function* handleUpdateDoctor(action) {
  try {
    const { id, ...data } = action.payload;
    const response = yield call(updateDoctor, id, data);
    yield put(doctorSlice.updateDoctorSuccess(response.data.data));
  } catch (error) {
    const message = error?.message || 'Failed to update doctor'
    yield put(doctorSlice.updateDoctorFailure(message));
  }
}

function* handleDeleteDoctor(action) {
  try {
    yield call(deleteDoctor, action.payload);
    yield put(doctorSlice.deleteDoctorSuccess(action.payload));
  } catch (error) {
    const message = error?.message || 'Failed to delete doctor'
    yield put(doctorSlice.deleteDoctorFailure(message));
  }
}

export function* watchDoctorSaga() {
  yield takeLatest(doctorSlice.fetchDoctorsRequest.type, handleFetchDoctors);
  yield takeLatest(
    doctorSlice.fetchDoctorByIdRequest.type,
    handleFetchDoctorById,
  );
  yield takeLatest(doctorSlice.createDoctorRequest.type, handleCreateDoctor);
  yield takeLatest(doctorSlice.updateDoctorRequest.type, handleUpdateDoctor);
  yield takeLatest(doctorSlice.deleteDoctorRequest.type, handleDeleteDoctor);
}
