/**
 * @file appointmentService.js
 * @description Appointment API service for MediConnect
 * @author Healthcare App Team
 * @created 2026-04-15
 */

import api from './api';
import { APPOINTMENT_ENDPOINTS } from '../constants/apiEndpoints';

export const appointmentService = {
  getAll: async (params = {}) => {
    const response = await api.get(APPOINTMENT_ENDPOINTS.LIST, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(APPOINTMENT_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  },

  create: async (appointmentData) => {
    const response = await api.post(APPOINTMENT_ENDPOINTS.CREATE, appointmentData);
    return response.data;
  },

  update: async (id, appointmentData) => {
    const response = await api.put(APPOINTMENT_ENDPOINTS.UPDATE(id), appointmentData);
    return response.data;
  },

  cancel: async (id, reason) => {
    const response = await api.patch(APPOINTMENT_ENDPOINTS.CANCEL(id), { reason });
    return response.data;
  },

  getByPatient: async (patientId) => {
    const response = await api.get(APPOINTMENT_ENDPOINTS.BY_PATIENT(patientId));
    return response.data;
  },

  getByDoctor: async (doctorId) => {
    const response = await api.get(APPOINTMENT_ENDPOINTS.BY_DOCTOR(doctorId));
    return response.data;
  },

  getAvailableSlots: async (doctorId, date) => {
    const response = await api.get(APPOINTMENT_ENDPOINTS.AVAILABLE_SLOTS(doctorId, date));
    return response.data;
  },
};

export default appointmentService;
