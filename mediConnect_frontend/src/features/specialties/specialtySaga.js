import { takeLatest, call, put } from 'redux-saga/effects'
import * as specialtySlice from './specialtySlice'
import { fetchSpecialties, addSpecialty, updateSpecialty, deleteSpecialty } from '@/services/api'

function* handleFetchSpecialties() {
  try {
    const response = yield call(fetchSpecialties)
    yield put(specialtySlice.fetchSpecialtiesSuccess(response.data.data || []))
  } catch (error) {
    yield put(specialtySlice.fetchSpecialtiesFailure(error.message))
  }
}

function* handleAddSpecialty(action) {
  try {
    const response = yield call(addSpecialty, action.payload)
    yield put(specialtySlice.addSpecialtySuccess(response.data.data))
  } catch (error) {
    yield put(specialtySlice.addSpecialtyFailure(error.message))
  }
}

function* handleUpdateSpecialty(action) {
  try {
    const { id, data } = action.payload
    const response = yield call(updateSpecialty, id, data)
    yield put(specialtySlice.updateSpecialtySuccess(response.data.data))
  } catch (error) {
    yield put(specialtySlice.updateSpecialtyFailure(error.message))
  }
}

function* handleDeleteSpecialty(action) {
  try {
    yield call(deleteSpecialty, action.payload)
    yield put(specialtySlice.deleteSpecialtySuccess(action.payload))
  } catch (error) {
    yield put(specialtySlice.deleteSpecialtyFailure(error.message))
  }
}

export function* watchSpecialtySaga() {
  yield takeLatest(specialtySlice.fetchSpecialtiesRequest.type, handleFetchSpecialties)
  yield takeLatest(specialtySlice.addSpecialtyRequest.type, handleAddSpecialty)
  yield takeLatest(specialtySlice.updateSpecialtyRequest.type, handleUpdateSpecialty)
  yield takeLatest(specialtySlice.deleteSpecialtyRequest.type, handleDeleteSpecialty)
}
