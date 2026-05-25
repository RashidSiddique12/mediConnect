import { takeLatest, call, put } from "redux-saga/effects";
import * as authSlice from "./authSlice";
import { loginUser, registerUser, updateProfile } from "@/services/api";

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
    const message = error?.message || 'Login failed'
    yield put(authSlice.loginFailure(message));
  }
}

function* handleRegister(action) {
  try {
    yield call(registerUser, action.payload);
    yield put(authSlice.registerSuccess());
    window.location.href = "/login";
  } catch (error) {
    const message = error?.message || 'Registration failed'
    yield put(authSlice.registerFailure(message));
  }
}

function* handleUpdateProfile(action) {
  try {
    const response = yield call(updateProfile, action.payload);
    const user = response.data.data;

    localStorage.setItem("user", JSON.stringify(user));
    yield put(authSlice.updateProfileSuccess(user));
  } catch (error) {
    const message = error?.message || 'Failed to update profile'
    yield put(authSlice.updateProfileFailure(message));
  }
}

export function* watchAuthSaga() {
  yield takeLatest(authSlice.loginRequest.type, handleLogin);
  yield takeLatest(authSlice.registerRequest.type, handleRegister);
  yield takeLatest(authSlice.updateProfileRequest.type, handleUpdateProfile);
}
