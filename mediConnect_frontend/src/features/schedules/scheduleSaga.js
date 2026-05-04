import { takeLatest, call, put } from "redux-saga/effects";
import * as scheduleSlice from "./scheduleSlice";
import {
  fetchSchedulesByDoctor,
  fetchSchedules,
  createSchedule,
  createBulkSchedules,
  deleteSchedule,
} from "@/services/api";

function* handleFetchSchedules(action) {
  try {
    let response;
    if (action.payload?.doctorId) {
      const { doctorId, ...params } = action.payload;
      response = yield call(fetchSchedulesByDoctor, doctorId, params);
    } else {
      response = yield call(fetchSchedules, action.payload);
    }
    yield put(scheduleSlice.fetchSchedulesSuccess(response.data.data || []));
  } catch (error) {
    yield put(scheduleSlice.fetchSchedulesFailure(error.message));
  }
}

function* handleCreateSchedule(action) {
  try {
    const response = yield call(createSchedule, action.payload);
    yield put(scheduleSlice.createScheduleSuccess(response.data.data));
  } catch (error) {
    yield put(scheduleSlice.createScheduleFailure(error.message));
  }
}

function* handleCreateBulkSchedules(action) {
  try {
    const response = yield call(createBulkSchedules, action.payload);
    yield put(
      scheduleSlice.createBulkSchedulesSuccess(response.data.data.schedules),
    );
  } catch (error) {
    yield put(scheduleSlice.createBulkSchedulesFailure(error.message));
  }
}

function* handleDeleteSchedule(action) {
  try {
    yield call(deleteSchedule, action.payload);
    yield put(scheduleSlice.deleteScheduleSuccess(action.payload));
  } catch (error) {
    yield put(scheduleSlice.deleteScheduleFailure(error.message));
  }
}

export function* watchScheduleSaga() {
  yield takeLatest(
    scheduleSlice.fetchSchedulesRequest.type,
    handleFetchSchedules,
  );
  yield takeLatest(
    scheduleSlice.createScheduleRequest.type,
    handleCreateSchedule,
  );
  yield takeLatest(
    scheduleSlice.createBulkSchedulesRequest.type,
    handleCreateBulkSchedules,
  );
  yield takeLatest(
    scheduleSlice.deleteScheduleRequest.type,
    handleDeleteSchedule,
  );
}
