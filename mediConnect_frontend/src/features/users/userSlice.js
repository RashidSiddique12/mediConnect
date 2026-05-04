import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  pagination: null,
  currentUser: null,
  loading: false,
  detailLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchUsersRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess(state, action) {
      state.loading = false;
      state.list = action.payload.data;
      state.pagination = action.payload.pagination || null;
    },
    fetchUsersFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchUserByIdRequest(state) {
      state.detailLoading = true;
      state.error = null;
    },
    fetchUserByIdSuccess(state, action) {
      state.detailLoading = false;
      state.currentUser = action.payload;
    },
    fetchUserByIdFailure(state, action) {
      state.detailLoading = false;
      state.error = action.payload;
    },
    clearCurrentUser(state) {
      state.currentUser = null;
    },
    toggleUserStatusRequest() {},
    toggleUserStatusSuccess(state, action) {
      const updated = action.payload;
      state.list = state.list.map((u) =>
        (u._id || u.id) === (updated._id || updated.id)
          ? { ...u, status: updated.status }
          : u,
      );
      if (
        state.currentUser &&
        (state.currentUser._id || state.currentUser.id) ===
          (updated._id || updated.id)
      ) {
        state.currentUser = { ...state.currentUser, status: updated.status };
      }
    },
    toggleUserStatusFailure(state, action) {
      state.error = action.payload;
    },
  },
});

const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserByIdRequest,
  fetchUserByIdSuccess,
  fetchUserByIdFailure,
  clearCurrentUser,
  toggleUserStatusRequest,
  toggleUserStatusSuccess,
  toggleUserStatusFailure,
} = userSlice.actions;

const userReducer = userSlice.reducer;

export {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserByIdRequest,
  fetchUserByIdSuccess,
  fetchUserByIdFailure,
  clearCurrentUser,
  toggleUserStatusRequest,
  toggleUserStatusSuccess,
  toggleUserStatusFailure,
  userReducer,
};
