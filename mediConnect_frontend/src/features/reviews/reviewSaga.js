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
    yield put(reviewSlice.fetchReviewsFailure(error.message));
  }
}

function* handleSubmitReview(action) {
  try {
    yield call(submitReview, action.payload);
    yield put(reviewSlice.submitReviewSuccess());
  } catch (error) {
    yield put(reviewSlice.submitReviewFailure(error.message));
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
    yield put(reviewSlice.moderateReviewFailure(error.message));
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
