import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  saving: false,
  error: null,
};

const scheduleSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {
    fetchSchedulesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSchedulesSuccess(state, action) {
      state.loading = false;
      state.list = action.payload;
    },
    fetchSchedulesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    createScheduleRequest(state) {
      state.saving = true;
      state.error = null;
    },
    createScheduleSuccess(state, action) {
      state.saving = false;
      state.list.push(action.payload);
    },
    createScheduleFailure(state, action) {
      state.saving = false;
      state.error = action.payload;
    },
    createBulkSchedulesRequest(state) {
      state.saving = true;
      state.error = null;
    },
    createBulkSchedulesSuccess(state, action) {
      state.saving = false;
      state.list.push(...action.payload);
    },
    createBulkSchedulesFailure(state, action) {
      state.saving = false;
      state.error = action.payload;
    },
    deleteScheduleRequest() {},
    deleteScheduleSuccess(state, action) {
      state.list = state.list.filter((s) => s._id !== action.payload);
    },
    deleteScheduleFailure(state, action) {
      state.error = action.payload;
    },
  },
});

const {
  fetchSchedulesRequest,
  fetchSchedulesSuccess,
  fetchSchedulesFailure,
  createScheduleRequest,
  createScheduleSuccess,
  createScheduleFailure,
  createBulkSchedulesRequest,
  createBulkSchedulesSuccess,
  createBulkSchedulesFailure,
  deleteScheduleRequest,
  deleteScheduleSuccess,
  deleteScheduleFailure,
} = scheduleSlice.actions;

const scheduleReducer = scheduleSlice.reducer;

export {
  fetchSchedulesRequest,
  fetchSchedulesSuccess,
  fetchSchedulesFailure,
  createScheduleRequest,
  createScheduleSuccess,
  createScheduleFailure,
  createBulkSchedulesRequest,
  createBulkSchedulesSuccess,
  createBulkSchedulesFailure,
  deleteScheduleRequest,
  deleteScheduleSuccess,
  deleteScheduleFailure,
  scheduleReducer,
};
