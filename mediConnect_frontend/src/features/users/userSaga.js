import { takeLatest, call, put } from "redux-saga/effects";
import * as userSlice from "./userSlice";
import {
  fetchDashboardUsers,
  fetchUserById,
  toggleUserStatus,
} from "@/services/api";

function* handleFetchUsers(action) {
  try {
    const response = yield call(fetchDashboardUsers, action.payload);
    yield put(
      userSlice.fetchUsersSuccess({
        data: response.data.data || [],
        pagination: response.data.pagination || null,
      }),
    );
  } catch (error) {
    const message = error?.message || 'Failed to fetch users'
    yield put(userSlice.fetchUsersFailure(message));
  }
}

function* handleFetchUserById(action) {
  try {
    const response = yield call(fetchUserById, action.payload);
    yield put(userSlice.fetchUserByIdSuccess(response.data.data));
  } catch (error) {
    const message = error?.message || 'Failed to fetch user'
    yield put(userSlice.fetchUserByIdFailure(message));
  }
}

function* handleToggleUserStatus(action) {
  try {
    const response = yield call(toggleUserStatus, action.payload);
    yield put(userSlice.toggleUserStatusSuccess(response.data.data));
  } catch (error) {
    const message = error?.message || 'Failed to toggle user status'
    yield put(userSlice.toggleUserStatusFailure(message));
  }
}

export function* watchUserSaga() {
  yield takeLatest(userSlice.fetchUsersRequest.type, handleFetchUsers);
  yield takeLatest(userSlice.fetchUserByIdRequest.type, handleFetchUserById);
  yield takeLatest(
    userSlice.toggleUserStatusRequest.type,
    handleToggleUserStatus,
  );
}
