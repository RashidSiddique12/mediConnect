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
    yield put(userSlice.fetchUsersFailure(error.message));
  }
}

function* handleFetchUserById(action) {
  try {
    const response = yield call(fetchUserById, action.payload);
    yield put(userSlice.fetchUserByIdSuccess(response.data.data));
  } catch (error) {
    yield put(userSlice.fetchUserByIdFailure(error.message));
  }
}

function* handleToggleUserStatus(action) {
  try {
    const response = yield call(toggleUserStatus, action.payload);
    yield put(userSlice.toggleUserStatusSuccess(response.data.data));
  } catch (error) {
    yield put(userSlice.toggleUserStatusFailure(error.message));
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
