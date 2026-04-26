import api from './api';
import { AUTH_ENDPOINTS } from '../constants/apiEndpoints';

export const authService = {

  login: async (credentials) => {
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  /**
   * Register new patient
   * @param {Object} userData - { name, email, password, phone }
   * @returns {Promise} API response
   */
  register: async (userData) => {
    const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  /**
   * Logout current user
   * @returns {Promise} API response
   */
  logout: async () => {
    const response = await api.post(AUTH_ENDPOINTS.LOGOUT);
    return response.data;
  },

  /**
   * Refresh access token
   * @param {string} refreshToken
   * @returns {Promise} API response with new tokens
   */
  refreshToken: async (refreshToken) => {
    const response = await api.post(AUTH_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
    return response.data;
  },

  /**
   * Request password reset
   * @param {string} email
   * @returns {Promise} API response
   */
  forgotPassword: async (email) => {
    const response = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data;
  },

  /**
   * Reset password with token
   * @param {Object} data - { token, newPassword }
   * @returns {Promise} API response
   */
  resetPassword: async (data) => {
    const response = await api.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
    return response.data;
  },
};

export default authService;
