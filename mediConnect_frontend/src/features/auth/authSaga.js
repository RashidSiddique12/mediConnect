import { takeLatest, call, put } from "redux-saga/effects";
import * as authSlice from "./authSlice";
import { loginUser, updateProfile } from "@/services/api";

const ROLE_ROUTES = {
  super_admin: "/admin",
  hospital_admin: "/hospital",
  patient: "/patient",
};

function* handleLogin(action) {
  try {
    const response = yield call(loginUser, action.payload);
    const { accessToken, refreshToken, user } = response.data.data;

    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("user", JSON.stringify(user));

    yield put(authSlice.loginSuccess(user));

    // Role-based redirect
    const route = ROLE_ROUTES[user.role] || "/dashboard";
    window.location.href = route;
  } catch (error) {
    yield put(authSlice.loginFailure(error.message));
  }
}

function* handleRegister(action) {
  try {
    // Mock register — in real app call registerUser API
    yield put(authSlice.registerSuccess());
    window.location.href = "/login";
  } catch (error) {
    yield put(authSlice.registerFailure(error.message));
  }
}

function* handleUpdateProfile(action) {
  try {
    const response = yield call(updateProfile, action.payload);
    const user = response.data.data;

    localStorage.setItem("user", JSON.stringify(user));
    yield put(authSlice.updateProfileSuccess(user));
  } catch (error) {
    yield put(authSlice.updateProfileFailure(error.message));
  }
}

export function* watchAuthSaga() {
  yield takeLatest(authSlice.loginRequest.type, handleLogin);
  yield takeLatest(authSlice.registerRequest.type, handleRegister);
  yield takeLatest(authSlice.updateProfileRequest.type, handleUpdateProfile);
}
