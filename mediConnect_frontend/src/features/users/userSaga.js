import { takeLatest, call, put } from 'redux-saga/effects'
import * as userSlice from './userSlice'
import { fetchDashboardUsers } from '@/services/api'

function* handleFetchUsers(action) {
  try {
    const response = yield call(fetchDashboardUsers, action.payload)
    yield put(userSlice.fetchUsersSuccess(response.data.data || []))
  } catch (error) {
    yield put(userSlice.fetchUsersFailure(error.message))
  }
}

export function* watchUserSaga() {
  yield takeLatest(userSlice.fetchUsersRequest.type, handleFetchUsers)
}
