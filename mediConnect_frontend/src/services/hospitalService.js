import api from "./api";
import { HOSPITAL_ENDPOINTS } from "../constants/apiEndpoints";

export const hospitalService = {
  /**
   * Get all hospitals
   * @param {Object} params - { page, limit, search, status }
   * @returns {Promise} API response with hospitals list
   */
  getAll: async (params = {}) => {
    const response = await api.get(HOSPITAL_ENDPOINTS.LIST, { params });
    return response.data;
  },

  /**
   * Get hospital by ID
   * @param {string} id - Hospital ID
   * @returns {Promise} API response with hospital details
   */
  getById: async (id) => {
    const response = await api.get(HOSPITAL_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Create new hospital (Super Admin only)
   * @param {Object} hospitalData
   * @returns {Promise} API response
   */
  create: async (hospitalData) => {
    const response = await api.post(HOSPITAL_ENDPOINTS.CREATE, hospitalData);
    return response.data;
  },

  /**
   * Update hospital
   * @param {string} id - Hospital ID
   * @param {Object} hospitalData
   * @returns {Promise} API response
   */
  update: async (id, hospitalData) => {
    const response = await api.put(HOSPITAL_ENDPOINTS.UPDATE(id), hospitalData);
    return response.data;
  },

  /**
   * Delete hospital (Super Admin only)
   * @param {string} id - Hospital ID
   * @returns {Promise} API response
   */
  delete: async (id) => {
    const response = await api.delete(HOSPITAL_ENDPOINTS.DELETE(id));
    return response.data;
  },

  /**
   * Toggle hospital status (active/inactive)
   * @param {string} id - Hospital ID
   * @returns {Promise} API response
   */
  toggleStatus: async (id) => {
    const response = await api.patch(HOSPITAL_ENDPOINTS.TOGGLE_STATUS(id));
    return response.data;
  },
};

export default hospitalService;
