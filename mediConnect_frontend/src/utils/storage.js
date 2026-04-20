/**
 * @file storage.js
 * @description Local storage utility functions for MediConnect
 * @author Healthcare App Team
 * @created 2026-04-15
 * 
 * OWASP Security Considerations:
 * - Do not store sensitive data in localStorage
 * - Use httpOnly cookies for tokens when possible
 * - Clear storage on logout
 */

const STORAGE_PREFIX = 'mediconnect_';

/**
 * Get item from localStorage
 * @param {string} key
 * @returns {*}
 */
export const getItem = (key) => {
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

/**
 * Set item in localStorage
 * @param {string} key
 * @param {*} value
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

/**
 * Remove item from localStorage
 * @param {string} key
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Clear all app-related items from localStorage
 */
export const clearStorage = () => {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Storage keys constants
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Token management
export const getAccessToken = () => getItem(STORAGE_KEYS.ACCESS_TOKEN);
export const setAccessToken = (token) => setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
export const removeAccessToken = () => removeItem(STORAGE_KEYS.ACCESS_TOKEN);

export const getRefreshToken = () => getItem(STORAGE_KEYS.REFRESH_TOKEN);
export const setRefreshToken = (token) => setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
export const removeRefreshToken = () => removeItem(STORAGE_KEYS.REFRESH_TOKEN);

// User management
export const getUser = () => getItem(STORAGE_KEYS.USER);
export const setUser = (user) => setItem(STORAGE_KEYS.USER, user);
export const removeUser = () => removeItem(STORAGE_KEYS.USER);

// Logout - clear all auth data
export const clearAuthData = () => {
  removeAccessToken();
  removeRefreshToken();
  removeUser();
};

export default {
  getItem,
  setItem,
  removeItem,
  clearStorage,
  STORAGE_KEYS,
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
  getUser,
  setUser,
  removeUser,
  clearAuthData,
};
