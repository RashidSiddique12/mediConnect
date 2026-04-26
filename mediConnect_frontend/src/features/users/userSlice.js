import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  list: [],
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersRequest(state) {
      state.loading = true
      state.error = null
    },
    fetchUsersSuccess(state, action) {
      state.loading = false
      state.list = action.payload
    },
    fetchUsersFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },
  },
})

const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
} = userSlice.actions

const userReducer = userSlice.reducer

export {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  userReducer,
}
