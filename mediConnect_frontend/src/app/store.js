/**
 * @author Healthcare Appointment App
 * @description Redux store — configures Redux Toolkit with Saga middleware,
 *              disables default thunk, enables Redux DevTools.
 * OWASP: Avoid storing sensitive data (passwords, raw tokens) in Redux state.
 * JIRA: HAA-001 #comment Redux store configuration
 */

import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './rootReducer'
import rootSaga from './rootSaga'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
  devTools: import.meta.env.DEV,
})

sagaMiddleware.run(rootSaga)

export default store
