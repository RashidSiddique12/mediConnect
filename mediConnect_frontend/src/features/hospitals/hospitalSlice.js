import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  list: [],
  current: null,
  loading: false,
  error: null,
}

const hospitalSlice = createSlice({
  name: 'hospitals',
  initialState,
  reducers: {
    fetchHospitalsRequest(state) {
      state.loading = true
      state.error = null
    },
    fetchHospitalsSuccess(state, action) {
      state.loading = false
      state.list = action.payload
    },
    fetchHospitalsFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },
    addHospitalRequest(state) {
      state.error = null
    },
    addHospitalSuccess(state, action) {
      state.list.unshift(action.payload)
    },
    addHospitalFailure(state, action) {
      state.error = action.payload
    },
    toggleHospitalStatusRequest() {},
    toggleHospitalStatusSuccess(state, action) {
      const updated = action.payload
      state.list = state.list.map((h) => (h._id === updated._id ? updated : h))
    },
    toggleHospitalStatusFailure(state, action) {
      state.error = action.payload
    },
    fetchHospitalByIdRequest(state) {
      state.loading = true
      state.current = null
      state.error = null
    },
    fetchHospitalByIdSuccess(state, action) {
      state.loading = false
      state.current = action.payload
    },
    fetchHospitalByIdFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },
    editHospitalRequest(state) {
      state.error = null
    },
    editHospitalSuccess(state, action) {
      const updated = action.payload
      state.current = updated
      state.list = state.list.map((h) => (h._id === updated._id ? updated : h))
    },
    editHospitalFailure(state, action) {
      state.error = action.payload
    },
  },
})

const {
  fetchHospitalsRequest,
  fetchHospitalsSuccess,
  fetchHospitalsFailure,
  addHospitalRequest,
  addHospitalSuccess,
  addHospitalFailure,
  toggleHospitalStatusRequest,
  toggleHospitalStatusSuccess,
  toggleHospitalStatusFailure,
  fetchHospitalByIdRequest,
  fetchHospitalByIdSuccess,
  fetchHospitalByIdFailure,
  editHospitalRequest,
  editHospitalSuccess,
  editHospitalFailure,
} = hospitalSlice.actions

const hospitalReducer = hospitalSlice.reducer

export {
  fetchHospitalsRequest,
  fetchHospitalsSuccess,
  fetchHospitalsFailure,
  addHospitalRequest,
  addHospitalSuccess,
  addHospitalFailure,
  toggleHospitalStatusRequest,
  toggleHospitalStatusSuccess,
  toggleHospitalStatusFailure,
  fetchHospitalByIdRequest,
  fetchHospitalByIdSuccess,
  fetchHospitalByIdFailure,
  editHospitalRequest,
  editHospitalSuccess,
  editHospitalFailure,
  hospitalReducer,
}
