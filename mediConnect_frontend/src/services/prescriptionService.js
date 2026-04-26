import api from './api';
import { PRESCRIPTION_ENDPOINTS } from '../constants/apiEndpoints';

export const prescriptionService = {
  getAll: async (params = {}) => {
    const response = await api.get(PRESCRIPTION_ENDPOINTS.LIST, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(PRESCRIPTION_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  },

  upload: async (formData) => {
    const response = await api.post(PRESCRIPTION_ENDPOINTS.UPLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getByAppointment: async (appointmentId) => {
    const response = await api.get(PRESCRIPTION_ENDPOINTS.BY_APPOINTMENT(appointmentId));
    return response.data;
  },

  getByPatient: async (patientId) => {
    const response = await api.get(PRESCRIPTION_ENDPOINTS.BY_PATIENT(patientId));
    return response.data;
  },
};

export default prescriptionService;
