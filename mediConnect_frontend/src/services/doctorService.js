
import api from './api';
import { DOCTOR_ENDPOINTS } from '../constants/apiEndpoints';

export const doctorService = {
  getAll: async (params = {}) => {
    const response = await api.get(DOCTOR_ENDPOINTS.LIST, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(DOCTOR_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  },

  create: async (doctorData) => {
    const response = await api.post(DOCTOR_ENDPOINTS.CREATE, doctorData);
    return response.data;
  },

  update: async (id, doctorData) => {
    const response = await api.put(DOCTOR_ENDPOINTS.UPDATE(id), doctorData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(DOCTOR_ENDPOINTS.DELETE(id));
    return response.data;
  },

  getByHospital: async (hospitalId) => {
    const response = await api.get(DOCTOR_ENDPOINTS.BY_HOSPITAL(hospitalId));
    return response.data;
  },

  getBySpecialty: async (specialtyId) => {
    const response = await api.get(DOCTOR_ENDPOINTS.BY_SPECIALTY(specialtyId));
    return response.data;
  },
};

export default doctorService;
