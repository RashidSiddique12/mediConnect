import { takeLatest, call, put } from "redux-saga/effects";
import * as reviewSlice from "./reviewSlice";
import {
  fetchReviews,
  submitReview,
  approveReview,
  rejectReview,
} from "@/services/api";

function* handleFetchReviews(action) {
  try {
    const response = yield call(fetchReviews, action.payload);
    yield put(
      reviewSlice.fetchReviewsSuccess({
        data: response.data.data || [],
        pagination: response.data.pagination || null,
      }),
    );
  } catch (error) {
    const message = error?.message || 'Failed to fetch reviews'
    yield put(reviewSlice.fetchReviewsFailure(message));
  }
}

function* handleSubmitReview(action) {
  try {
    yield call(submitReview, action.payload);
    yield put(reviewSlice.submitReviewSuccess());
  } catch (error) {
    const message = error?.message || 'Failed to submit review'
    yield put(reviewSlice.submitReviewFailure(message));
  }
}

function* handleModerateReview(action) {
  try {
    const { id, status } = action.payload;
    if (status === "approved") {
      yield call(approveReview, id);
    } else {
      yield call(rejectReview, id);
    }
    yield put(reviewSlice.moderateReviewSuccess({ id, status }));
  } catch (error) {
    const message = error?.message || 'Failed to moderate review'
    yield put(reviewSlice.moderateReviewFailure(message));
  }
}

export function* watchReviewSaga() {
  yield takeLatest(reviewSlice.fetchReviewsRequest.type, handleFetchReviews);
  yield takeLatest(reviewSlice.submitReviewRequest.type, handleSubmitReview);
  yield takeLatest(
    reviewSlice.moderateReviewRequest.type,
    handleModerateReview,
  );
}
