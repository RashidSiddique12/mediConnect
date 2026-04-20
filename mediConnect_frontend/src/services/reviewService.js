/**
 * @file reviewService.js
 * @description Review API service for MediConnect
 * @author Healthcare App Team
 * @created 2026-04-15
 */

import api from './api';
import { REVIEW_ENDPOINTS } from '../constants/apiEndpoints';

export const reviewService = {
  getAll: async (params = {}) => {
    const response = await api.get(REVIEW_ENDPOINTS.LIST, { params });
    return response.data;
  },

  create: async (reviewData) => {
    const response = await api.post(REVIEW_ENDPOINTS.CREATE, reviewData);
    return response.data;
  },

  update: async (id, reviewData) => {
    const response = await api.put(REVIEW_ENDPOINTS.UPDATE(id), reviewData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(REVIEW_ENDPOINTS.DELETE(id));
    return response.data;
  },

  approve: async (id) => {
    const response = await api.patch(REVIEW_ENDPOINTS.APPROVE(id));
    return response.data;
  },

  reject: async (id) => {
    const response = await api.patch(REVIEW_ENDPOINTS.REJECT(id));
    return response.data;
  },

  getByDoctor: async (doctorId) => {
    const response = await api.get(REVIEW_ENDPOINTS.BY_DOCTOR(doctorId));
    return response.data;
  },

  getByHospital: async (hospitalId) => {
    const response = await api.get(REVIEW_ENDPOINTS.BY_HOSPITAL(hospitalId));
    return response.data;
  },
};

export default reviewService;
