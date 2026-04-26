import { takeLatest, call, put } from 'redux-saga/effects'
import * as doctorSlice from './doctorSlice'
import {
  fetchDoctors, fetchDoctorById, addDoctor, updateDoctor, deleteDoctor,
  fetchDoctorsByHospital,
} from '@/services/api'

function* handleFetchDoctors(action) {
  try {
    const params = action.payload
    let response
    if (params?.hospitalId) {
      response = yield call(fetchDoctorsByHospital, params.hospitalId)
    } else {
      response = yield call(fetchDoctors, params)
    }
    yield put(doctorSlice.fetchDoctorsSuccess(response.data.data || []))
  } catch (error) {
    yield put(doctorSlice.fetchDoctorsFailure(error.message))
  }
}

function* handleFetchDoctorById(action) {
  try {
    const response = yield call(fetchDoctorById, action.payload)
    yield put(doctorSlice.fetchDoctorByIdSuccess(response.data.data))
  } catch (error) {
    yield put(doctorSlice.fetchDoctorByIdFailure(error.message))
  }
}

function* handleCreateDoctor(action) {
  try {
    const response = yield call(addDoctor, action.payload)
    yield put(doctorSlice.createDoctorSuccess(response.data.data))
  } catch (error) {
    yield put(doctorSlice.createDoctorFailure(error.message))
  }
}

function* handleUpdateDoctor(action) {
  try {
    const { id, ...data } = action.payload
    const response = yield call(updateDoctor, id, data)
    yield put(doctorSlice.updateDoctorSuccess(response.data.data))
  } catch (error) {
    yield put(doctorSlice.updateDoctorFailure(error.message))
  }
}

function* handleDeleteDoctor(action) {
  try {
    yield call(deleteDoctor, action.payload)
    yield put(doctorSlice.deleteDoctorSuccess(action.payload))
  } catch (error) {
    yield put(doctorSlice.deleteDoctorFailure(error.message))
  }
}

export function* watchDoctorSaga() {
  yield takeLatest(doctorSlice.fetchDoctorsRequest.type, handleFetchDoctors)
  yield takeLatest(doctorSlice.fetchDoctorByIdRequest.type, handleFetchDoctorById)
  yield takeLatest(doctorSlice.createDoctorRequest.type, handleCreateDoctor)
  yield takeLatest(doctorSlice.updateDoctorRequest.type, handleUpdateDoctor)
  yield takeLatest(doctorSlice.deleteDoctorRequest.type, handleDeleteDoctor)
}
