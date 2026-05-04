import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  pagination: null,
  current: null,
  loading: false,
  saving: false,
  error: null,
};

const doctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    fetchDoctorsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDoctorsSuccess(state, action) {
      state.loading = false;
      state.list = action.payload.data;
      state.pagination = action.payload.pagination || null;
    },
    fetchDoctorsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchDoctorByIdRequest(state) {
      state.loading = true;
      state.current = null;
      state.error = null;
    },
    fetchDoctorByIdSuccess(state, action) {
      state.loading = false;
      state.current = action.payload;
    },
    fetchDoctorByIdFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    createDoctorRequest(state) {
      state.saving = true;
      state.error = null;
    },
    createDoctorSuccess(state, action) {
      state.saving = false;
      state.list.unshift(action.payload);
    },
    createDoctorFailure(state, action) {
      state.saving = false;
      state.error = action.payload;
    },
    updateDoctorRequest(state) {
      state.saving = true;
      state.error = null;
    },
    updateDoctorSuccess(state, action) {
      state.saving = false;
      const updated = action.payload;
      state.current = updated;
      state.list = state.list.map((d) => (d._id === updated._id ? updated : d));
    },
    updateDoctorFailure(state, action) {
      state.saving = false;
      state.error = action.payload;
    },
    deleteDoctorRequest() {},
    deleteDoctorSuccess(state, action) {
      state.list = state.list.filter((d) => d._id !== action.payload);
    },
    deleteDoctorFailure(state, action) {
      state.error = action.payload;
    },
    clearCurrentDoctor(state) {
      state.current = null;
    },
  },
});

const {
  fetchDoctorsRequest,
  fetchDoctorsSuccess,
  fetchDoctorsFailure,
  fetchDoctorByIdRequest,
  fetchDoctorByIdSuccess,
  fetchDoctorByIdFailure,
  createDoctorRequest,
  createDoctorSuccess,
  createDoctorFailure,
  updateDoctorRequest,
  updateDoctorSuccess,
  updateDoctorFailure,
  deleteDoctorRequest,
  deleteDoctorSuccess,
  deleteDoctorFailure,
  clearCurrentDoctor,
} = doctorSlice.actions;

const doctorReducer = doctorSlice.reducer;

export {
  fetchDoctorsRequest,
  fetchDoctorsSuccess,
  fetchDoctorsFailure,
  fetchDoctorByIdRequest,
  fetchDoctorByIdSuccess,
  fetchDoctorByIdFailure,
  createDoctorRequest,
  createDoctorSuccess,
  createDoctorFailure,
  updateDoctorRequest,
  updateDoctorSuccess,
  updateDoctorFailure,
  deleteDoctorRequest,
  deleteDoctorSuccess,
  deleteDoctorFailure,
  clearCurrentDoctor,
  doctorReducer,
};
