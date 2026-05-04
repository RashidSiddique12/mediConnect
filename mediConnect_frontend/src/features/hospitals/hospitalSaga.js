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
    yield put(hospitalSlice.fetchHospitalsFailure(error.message));
  }
}

function* handleAddHospital(action) {
  try {
    const response = yield call(addHospital, action.payload);
    yield put(hospitalSlice.addHospitalSuccess(response.data.data));
  } catch (error) {
    yield put(hospitalSlice.addHospitalFailure(error.message));
  }
}

function* handleToggleHospitalStatus(action) {
  try {
    const response = yield call(toggleHospitalStatus, action.payload);
    yield put(hospitalSlice.toggleHospitalStatusSuccess(response.data.data));
  } catch (error) {
    yield put(hospitalSlice.toggleHospitalStatusFailure(error.message));
  }
}

function* handleFetchHospitalById(action) {
  try {
    const response = yield call(fetchHospitalById, action.payload);
    yield put(hospitalSlice.fetchHospitalByIdSuccess(response.data.data));
  } catch (error) {
    yield put(hospitalSlice.fetchHospitalByIdFailure(error.message));
  }
}

function* handleFetchMyHospital() {
  try {
    const response = yield call(fetchMyHospital);
    yield put(hospitalSlice.fetchMyHospitalSuccess(response.data.data));
  } catch (error) {
    yield put(hospitalSlice.fetchMyHospitalFailure(error.message));
  }
}

function* handleEditHospital(action) {
  try {
    const { id, ...data } = action.payload;
    const response = yield call(updateHospital, id, data);
    yield put(hospitalSlice.editHospitalSuccess(response.data.data));
  } catch (error) {
    yield put(hospitalSlice.editHospitalFailure(error.message));
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
