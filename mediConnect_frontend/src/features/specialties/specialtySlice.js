import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  list: [],
  loading: false,
  error: null,
}

const specialtySlice = createSlice({
  name: 'specialties',
  initialState,
  reducers: {
    fetchSpecialtiesRequest(state) {
      state.loading = true
      state.error = null
    },
    fetchSpecialtiesSuccess(state, action) {
      state.loading = false
      state.list = action.payload
    },
    fetchSpecialtiesFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },
    addSpecialtyRequest(state) {
      state.error = null
    },
    addSpecialtySuccess(state, action) {
      state.list.unshift(action.payload)
    },
    addSpecialtyFailure(state, action) {
      state.error = action.payload
    },
    updateSpecialtyRequest() {},
    updateSpecialtySuccess(state, action) {
      const updated = action.payload
      state.list = state.list.map((s) => (s._id === updated._id ? updated : s))
    },
    updateSpecialtyFailure(state, action) {
      state.error = action.payload
    },
    deleteSpecialtyRequest() {},
    deleteSpecialtySuccess(state, action) {
      state.list = state.list.filter((s) => s._id !== action.payload)
    },
    deleteSpecialtyFailure(state, action) {
      state.error = action.payload
    },
  },
})

const {
  fetchSpecialtiesRequest,
  fetchSpecialtiesSuccess,
  fetchSpecialtiesFailure,
  addSpecialtyRequest,
  addSpecialtySuccess,
  addSpecialtyFailure,
  updateSpecialtyRequest,
  updateSpecialtySuccess,
  updateSpecialtyFailure,
  deleteSpecialtyRequest,
  deleteSpecialtySuccess,
  deleteSpecialtyFailure,
} = specialtySlice.actions

const specialtyReducer = specialtySlice.reducer

export {
  fetchSpecialtiesRequest,
  fetchSpecialtiesSuccess,
  fetchSpecialtiesFailure,
  addSpecialtyRequest,
  addSpecialtySuccess,
  addSpecialtyFailure,
  updateSpecialtyRequest,
  updateSpecialtySuccess,
  updateSpecialtyFailure,
  deleteSpecialtyRequest,
  deleteSpecialtySuccess,
  deleteSpecialtyFailure,
  specialtyReducer,
}
