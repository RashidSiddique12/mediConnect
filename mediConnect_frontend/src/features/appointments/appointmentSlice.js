import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  pagination: null,
  current: null,
  loading: false,
  bookingLoading: false,
  booked: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    fetchAppointmentsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAppointmentsSuccess(state, action) {
      state.loading = false;
      state.list = action.payload.data;
      state.pagination = action.payload.pagination || null;
    },
    fetchAppointmentsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchAppointmentByIdRequest(state) {
      state.loading = true;
      state.current = null;
      state.error = null;
    },
    fetchAppointmentByIdSuccess(state, action) {
      state.loading = false;
      state.current = action.payload;
    },
    fetchAppointmentByIdFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    bookAppointmentRequest(state) {
      state.bookingLoading = true;
      state.booked = false;
      state.error = null;
    },
    bookAppointmentSuccess(state) {
      state.bookingLoading = false;
      state.booked = true;
    },
    bookAppointmentFailure(state, action) {
      state.bookingLoading = false;
      state.error = action.payload;
    },
    cancelAppointmentRequest() {},
    cancelAppointmentSuccess(state, action) {
      state.list = state.list.map((a) =>
        a._id === action.payload ? { ...a, status: "cancelled" } : a,
      );
    },
    cancelAppointmentFailure(state, action) {
      state.error = action.payload;
    },
    updateAppointmentRequest() {},
    updateAppointmentSuccess(state, action) {
      const updated = action.payload;
      state.current = updated;
      state.list = state.list.map((a) => (a._id === updated._id ? updated : a));
    },
    updateAppointmentFailure(state, action) {
      state.error = action.payload;
    },
    resetBooking(state) {
      state.booked = false;
      state.bookingLoading = false;
    },
  },
});

const {
  fetchAppointmentsRequest,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
  fetchAppointmentByIdRequest,
  fetchAppointmentByIdSuccess,
  fetchAppointmentByIdFailure,
  bookAppointmentRequest,
  bookAppointmentSuccess,
  bookAppointmentFailure,
  cancelAppointmentRequest,
  cancelAppointmentSuccess,
  cancelAppointmentFailure,
  updateAppointmentRequest,
  updateAppointmentSuccess,
  updateAppointmentFailure,
  resetBooking,
} = appointmentSlice.actions;

const appointmentReducer = appointmentSlice.reducer;

export {
  fetchAppointmentsRequest,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
  fetchAppointmentByIdRequest,
  fetchAppointmentByIdSuccess,
  fetchAppointmentByIdFailure,
  bookAppointmentRequest,
  bookAppointmentSuccess,
  bookAppointmentFailure,
  cancelAppointmentRequest,
  cancelAppointmentSuccess,
  cancelAppointmentFailure,
  updateAppointmentRequest,
  updateAppointmentSuccess,
  updateAppointmentFailure,
  resetBooking,
  appointmentReducer,
};
