import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  order: null,
  orderLoading: false,
  verifying: false,
  verified: false,
  error: null,
}

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    createOrderRequest(state) {
      state.orderLoading = true
      state.order = null
      state.error = null
      state.verified = false
    },
    createOrderSuccess(state, action) {
      state.orderLoading = false
      state.order = action.payload
    },
    createOrderFailure(state, action) {
      state.orderLoading = false
      state.error = action.payload
    },

    verifyPaymentRequest(state) {
      state.verifying = true
      state.verified = false
      state.error = null
    },
    verifyPaymentSuccess(state) {
      state.verifying = false
      state.verified = true
    },
    verifyPaymentFailure(state, action) {
      state.verifying = false
      state.error = action.payload
    },

    resetPayment(state) {
      state.order = null
      state.orderLoading = false
      state.verifying = false
      state.verified = false
      state.error = null
    },
  },
})

const {
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,
  verifyPaymentRequest,
  verifyPaymentSuccess,
  verifyPaymentFailure,
  resetPayment,
} = paymentSlice.actions

const paymentReducer = paymentSlice.reducer

export {
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,
  verifyPaymentRequest,
  verifyPaymentSuccess,
  verifyPaymentFailure,
  resetPayment,
  paymentReducer,
}
