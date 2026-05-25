import { call, put, takeLatest } from 'redux-saga/effects'
import { createPaymentOrder, verifyPayment } from '@/services/api'
import { toaster } from '@/components/ui/toaster'
import {
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,
  verifyPaymentRequest,
  verifyPaymentSuccess,
  verifyPaymentFailure,
} from './paymentSlice'

function* handleCreateOrder(action) {
  try {
    const response = yield call(createPaymentOrder, action.payload)
    yield put(createOrderSuccess(response.data.data))
  } catch (error) {
    const message =
      error?.message || 'Failed to create payment order'
    yield put(createOrderFailure(message))
    toaster.create({
      title: 'Payment Error',
      description: message,
      type: 'error',
    })
  }
}

function* handleVerifyPayment(action) {
  try {
    yield call(verifyPayment, action.payload)
    yield put(verifyPaymentSuccess())
  } catch (error) {
    const message =
      error?.message || 'Payment verification failed'
    yield put(verifyPaymentFailure(message))
    toaster.create({
      title: 'Verification Failed',
      description: message,
      type: 'error',
    })
  }
}

export function* watchPaymentSaga() {
  yield takeLatest(createOrderRequest.type, handleCreateOrder)
  yield takeLatest(verifyPaymentRequest.type, handleVerifyPayment)
}
