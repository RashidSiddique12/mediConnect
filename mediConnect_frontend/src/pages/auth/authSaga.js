

import { takeLatest, call, put } from 'redux-saga/effects'
import { loginRequest, loginSuccess, loginFailure, registerRequest, registerSuccess, registerFailure } from './authSlice'
import { loginUser } from '@/services/api'

const ROLE_ROUTES = {
  super_admin: '/admin',
  hospital_admin: '/hospital',
  patient: '/patient',
}

function* handleLogin(action) {
  try {
    const response = yield call(loginUser, action.payload)
    const { token, user } = response.data

    // OWASP note: XSS risk — consider switching to httpOnly cookies in production.
    localStorage.setItem('authToken', token)
    localStorage.setItem('userRole', user.role)

    yield put(loginSuccess(user))

    // Role-based redirect
    const route = ROLE_ROUTES[user.role] || '/dashboard'
    window.location.href = route
  } catch (error) {
    yield put(loginFailure(error.message))
  }
}

function* handleRegister(action) {
  try {
    // Mock register — in real app call registerUser API
    yield put(registerSuccess())
    window.location.href = '/login'
  } catch (error) {
    yield put(registerFailure(error.message))
  }
}

export function* watchAuthSaga() {
  yield takeLatest(loginRequest.type, handleLogin)
  yield takeLatest(registerRequest.type, handleRegister)
}
