import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  pagination: null,
  loading: false,
  submitting: false,
  submitted: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    fetchReviewsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchReviewsSuccess(state, action) {
      state.loading = false;
      state.list = action.payload.data;
      state.pagination = action.payload.pagination || null;
    },
    fetchReviewsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    submitReviewRequest(state) {
      state.submitting = true;
      state.submitted = false;
      state.error = null;
    },
    submitReviewSuccess(state) {
      state.submitting = false;
      state.submitted = true;
    },
    submitReviewFailure(state, action) {
      state.submitting = false;
      state.error = action.payload;
    },
    resetReviewSubmission(state) {
      state.submitted = false;
      state.submitting = false;
    },
    moderateReviewRequest(state) {
      state.error = null;
    },
    moderateReviewSuccess(state, action) {
      const { id, status } = action.payload;
      state.list = state.list.map((r) => (r._id === id ? { ...r, status } : r));
    },
    moderateReviewFailure(state, action) {
      state.error = action.payload;
    },
  },
});

const {
  fetchReviewsRequest,
  fetchReviewsSuccess,
  fetchReviewsFailure,
  submitReviewRequest,
  submitReviewSuccess,
  submitReviewFailure,
  resetReviewSubmission,
  moderateReviewRequest,
  moderateReviewSuccess,
  moderateReviewFailure,
} = reviewSlice.actions;

const reviewReducer = reviewSlice.reducer;

export {
  fetchReviewsRequest,
  fetchReviewsSuccess,
  fetchReviewsFailure,
  submitReviewRequest,
  submitReviewSuccess,
  submitReviewFailure,
  resetReviewSubmission,
  moderateReviewRequest,
  moderateReviewSuccess,
  moderateReviewFailure,
  reviewReducer,
};
