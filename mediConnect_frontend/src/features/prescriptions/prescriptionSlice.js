import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  pagination: null,
  current: null,
  loading: false,
  uploading: false,
  uploaded: false,
  error: null,
};

const prescriptionSlice = createSlice({
  name: "prescriptions",
  initialState,
  reducers: {
    fetchPrescriptionsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPrescriptionsSuccess(state, action) {
      state.loading = false;
      state.list = action.payload.data;
      state.pagination = action.payload.pagination || null;
    },
    fetchPrescriptionsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchPrescriptionByAppointmentRequest(state) {
      state.loading = true;
      state.current = null;
      state.error = null;
    },
    fetchPrescriptionByAppointmentSuccess(state, action) {
      state.loading = false;
      state.current = action.payload;
    },
    fetchPrescriptionByAppointmentFailure(state, action) {
      state.loading = false;
      state.current = null;
      state.error = action.payload;
    },
    uploadPrescriptionRequest(state) {
      state.uploading = true;
      state.uploaded = false;
      state.error = null;
    },
    uploadPrescriptionSuccess(state, action) {
      state.uploading = false;
      state.uploaded = true;
      state.current = action.payload;
    },
    uploadPrescriptionFailure(state, action) {
      state.uploading = false;
      state.error = action.payload;
    },
    resetUpload(state) {
      state.uploaded = false;
      state.uploading = false;
    },
  },
});

const {
  fetchPrescriptionsRequest,
  fetchPrescriptionsSuccess,
  fetchPrescriptionsFailure,
  fetchPrescriptionByAppointmentRequest,
  fetchPrescriptionByAppointmentSuccess,
  fetchPrescriptionByAppointmentFailure,
  uploadPrescriptionRequest,
  uploadPrescriptionSuccess,
  uploadPrescriptionFailure,
  resetUpload,
} = prescriptionSlice.actions;

const prescriptionReducer = prescriptionSlice.reducer;

export {
  fetchPrescriptionsRequest,
  fetchPrescriptionsSuccess,
  fetchPrescriptionsFailure,
  fetchPrescriptionByAppointmentRequest,
  fetchPrescriptionByAppointmentSuccess,
  fetchPrescriptionByAppointmentFailure,
  uploadPrescriptionRequest,
  uploadPrescriptionSuccess,
  uploadPrescriptionFailure,
  resetUpload,
  prescriptionReducer,
};
