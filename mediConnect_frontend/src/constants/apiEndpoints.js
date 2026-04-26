const API_VERSION = '/api/v1';

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_VERSION}/auth/login`,
  REGISTER: `${API_VERSION}/auth/register`,
  LOGOUT: `${API_VERSION}/auth/logout`,
  REFRESH_TOKEN: `${API_VERSION}/auth/refresh`,
  FORGOT_PASSWORD: `${API_VERSION}/auth/forgot-password`,
  RESET_PASSWORD: `${API_VERSION}/auth/reset-password`,
};

export const HOSPITAL_ENDPOINTS = {
  LIST: `${API_VERSION}/hospitals`,
  GET_BY_ID: (id) => `${API_VERSION}/hospitals/${id}`,
  CREATE: `${API_VERSION}/hospitals`,
  UPDATE: (id) => `${API_VERSION}/hospitals/${id}`,
  DELETE: (id) => `${API_VERSION}/hospitals/${id}`,
  TOGGLE_STATUS: (id) => `${API_VERSION}/hospitals/${id}/status`,
};

export const DOCTOR_ENDPOINTS = {
  LIST: `${API_VERSION}/doctors`,
  GET_BY_ID: (id) => `${API_VERSION}/doctors/${id}`,
  CREATE: `${API_VERSION}/doctors`,
  UPDATE: (id) => `${API_VERSION}/doctors/${id}`,
  DELETE: (id) => `${API_VERSION}/doctors/${id}`,
  BY_HOSPITAL: (hospitalId) => `${API_VERSION}/hospitals/${hospitalId}/doctors`,
  BY_SPECIALTY: (specialtyId) => `${API_VERSION}/specialties/${specialtyId}/doctors`,
};

export const SCHEDULE_ENDPOINTS = {
  LIST: `${API_VERSION}/schedules`,
  BY_DOCTOR: (doctorId) => `${API_VERSION}/doctors/${doctorId}/schedules`,
  CREATE: `${API_VERSION}/schedules`,
  UPDATE: (id) => `${API_VERSION}/schedules/${id}`,
  DELETE: (id) => `${API_VERSION}/schedules/${id}`,
  GENERATE_SLOTS: (doctorId) => `${API_VERSION}/doctors/${doctorId}/slots`,
};

export const APPOINTMENT_ENDPOINTS = {
  LIST: `${API_VERSION}/appointments`,
  GET_BY_ID: (id) => `${API_VERSION}/appointments/${id}`,
  CREATE: `${API_VERSION}/appointments`,
  UPDATE: (id) => `${API_VERSION}/appointments/${id}`,
  CANCEL: (id) => `${API_VERSION}/appointments/${id}/cancel`,
  BY_PATIENT: (patientId) => `${API_VERSION}/patients/${patientId}/appointments`,
  BY_DOCTOR: (doctorId) => `${API_VERSION}/doctors/${doctorId}/appointments`,
  AVAILABLE_SLOTS: (doctorId, date) => `${API_VERSION}/doctors/${doctorId}/slots?date=${date}`,
};

export const PRESCRIPTION_ENDPOINTS = {
  LIST: `${API_VERSION}/prescriptions`,
  GET_BY_ID: (id) => `${API_VERSION}/prescriptions/${id}`,
  UPLOAD: `${API_VERSION}/prescriptions/upload`,
  BY_APPOINTMENT: (appointmentId) => `${API_VERSION}/appointments/${appointmentId}/prescription`,
  BY_PATIENT: (patientId) => `${API_VERSION}/patients/${patientId}/prescriptions`,
};

export const REVIEW_ENDPOINTS = {
  LIST: `${API_VERSION}/reviews`,
  CREATE: `${API_VERSION}/reviews`,
  UPDATE: (id) => `${API_VERSION}/reviews/${id}`,
  DELETE: (id) => `${API_VERSION}/reviews/${id}`,
  APPROVE: (id) => `${API_VERSION}/reviews/${id}/approve`,
  REJECT: (id) => `${API_VERSION}/reviews/${id}/reject`,
  BY_DOCTOR: (doctorId) => `${API_VERSION}/doctors/${doctorId}/reviews`,
  BY_HOSPITAL: (hospitalId) => `${API_VERSION}/hospitals/${hospitalId}/reviews`,
};

export const SPECIALTY_ENDPOINTS = {
  LIST: `${API_VERSION}/specialties`,
  GET_BY_ID: (id) => `${API_VERSION}/specialties/${id}`,
  CREATE: `${API_VERSION}/specialties`,
  UPDATE: (id) => `${API_VERSION}/specialties/${id}`,
  DELETE: (id) => `${API_VERSION}/specialties/${id}`,
};

export const USER_ENDPOINTS = {
  LIST: `${API_VERSION}/users`,
  GET_BY_ID: (id) => `${API_VERSION}/users/${id}`,
  UPDATE_PROFILE: `${API_VERSION}/users/profile`,
  CHANGE_PASSWORD: `${API_VERSION}/users/change-password`,
};

export const DASHBOARD_ENDPOINTS = {
  ADMIN_STATS: `${API_VERSION}/dashboard/admin`,
  HOSPITAL_STATS: `${API_VERSION}/dashboard/hospital`,
  PATIENT_STATS: `${API_VERSION}/dashboard/patient`,
};
