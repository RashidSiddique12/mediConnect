import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    fetchDashboardRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDashboardSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchDashboardFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

const { fetchDashboardRequest, fetchDashboardSuccess, fetchDashboardFailure } =
  dashboardSlice.actions;

const dashboardReducer = dashboardSlice.reducer;

export {
  fetchDashboardRequest,
  fetchDashboardSuccess,
  fetchDashboardFailure,
  dashboardReducer,
};
