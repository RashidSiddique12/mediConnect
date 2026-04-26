import { takeLatest, call, put } from 'redux-saga/effects'
import * as scheduleSlice from './scheduleSlice'
import {
  fetchSchedulesByDoctor, fetchSchedules, createSchedule, deleteSchedule,
} from '@/services/api'

function* handleFetchSchedules(action) {
  try {
    let response
    if (action.payload?.doctorId) {
      response = yield call(fetchSchedulesByDoctor, action.payload.doctorId)
    } else {
      response = yield call(fetchSchedules, action.payload)
    }
    yield put(scheduleSlice.fetchSchedulesSuccess(response.data.data || []))
  } catch (error) {
    yield put(scheduleSlice.fetchSchedulesFailure(error.message))
  }
}

function* handleCreateSchedule(action) {
  try {
    const response = yield call(createSchedule, action.payload)
    yield put(scheduleSlice.createScheduleSuccess(response.data.data))
  } catch (error) {
    yield put(scheduleSlice.createScheduleFailure(error.message))
  }
}

function* handleDeleteSchedule(action) {
  try {
    yield call(deleteSchedule, action.payload)
    yield put(scheduleSlice.deleteScheduleSuccess(action.payload))
  } catch (error) {
    yield put(scheduleSlice.deleteScheduleFailure(error.message))
  }
}

export function* watchScheduleSaga() {
  yield takeLatest(scheduleSlice.fetchSchedulesRequest.type, handleFetchSchedules)
  yield takeLatest(scheduleSlice.createScheduleRequest.type, handleCreateSchedule)
  yield takeLatest(scheduleSlice.deleteScheduleRequest.type, handleDeleteSchedule)
}
