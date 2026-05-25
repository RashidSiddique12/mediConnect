import { takeLatest, call, put } from "redux-saga/effects";
import * as hospitalSlice from "./hospitalSlice";
import {
  fetchHospitals,
  fetchHospitalById,
  fetchMyHospital,
  addHospital,
  updateHospital,
  toggleHospitalStatus,
} from "@/services/api";

function* handleFetchHospitals(action) {
  try {
    const response = yield call(fetchHospitals, action.payload);
    yield put(
      hospitalSlice.fetchHospitalsSuccess({
        data: response.data.data || [],
        pagination: response.data.pagination || null,
      }),
    );
  } catch (error) {
    const message = error?.message || 'Failed to fetch hospitals'
    yield put(hospitalSlice.fetchHospitalsFailure(message));
  }
}

function* handleAddHospital(action) {
  try {
    const response = yield call(addHospital, action.payload);
    yield put(hospitalSlice.addHospitalSuccess(response.data.data));
  } catch (error) {
    const message = error?.message || 'Failed to add hospital'
    yield put(hospitalSlice.addHospitalFailure(message));
  }
}

function* handleToggleHospitalStatus(action) {
  try {
    const response = yield call(toggleHospitalStatus, action.payload);
    yield put(hospitalSlice.toggleHospitalStatusSuccess(response.data.data));
  } catch (error) {
    const message = error?.message || 'Failed to toggle hospital status'
    yield put(hospitalSlice.toggleHospitalStatusFailure(message));
  }
}

function* handleFetchHospitalById(action) {
  try {
    const response = yield call(fetchHospitalById, action.payload);
    yield put(hospitalSlice.fetchHospitalByIdSuccess(response.data.data));
  } catch (error) {
    const message = error?.message || 'Failed to fetch hospital'
    yield put(hospitalSlice.fetchHospitalByIdFailure(message));
  }
}

function* handleFetchMyHospital() {
  try {
    const response = yield call(fetchMyHospital);
    yield put(hospitalSlice.fetchMyHospitalSuccess(response.data.data));
  } catch (error) {
    const message = error?.message || 'Failed to fetch hospital'
    yield put(hospitalSlice.fetchMyHospitalFailure(message));
  }
}

function* handleEditHospital(action) {
  try {
    const { id, ...data } = action.payload;
    const response = yield call(updateHospital, id, data);
    yield put(hospitalSlice.editHospitalSuccess(response.data.data));
  } catch (error) {
    const message = error?.message || 'Failed to update hospital'
    yield put(hospitalSlice.editHospitalFailure(message));
  }
}

export function* watchHospitalSaga() {
  yield takeLatest(
    hospitalSlice.fetchHospitalsRequest.type,
    handleFetchHospitals,
  );
  yield takeLatest(
    hospitalSlice.fetchHospitalByIdRequest.type,
    handleFetchHospitalById,
  );
  yield takeLatest(
    hospitalSlice.fetchMyHospitalRequest.type,
    handleFetchMyHospital,
  );
  yield takeLatest(hospitalSlice.addHospitalRequest.type, handleAddHospital);
  yield takeLatest(hospitalSlice.editHospitalRequest.type, handleEditHospital);
  yield takeLatest(
    hospitalSlice.toggleHospitalStatusRequest.type,
    handleToggleHospitalStatus,
  );
}
