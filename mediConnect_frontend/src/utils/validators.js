
/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password
 * @returns {Object} { isValid, errors }
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate phone number
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate required field
 * @param {*} value
 * @returns {boolean}
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate minimum length
 * @param {string} value
 * @param {number} minLength
 * @returns {boolean}
 */
export const minLength = (value, minLength) => {
  return value && value.length >= minLength;
};

/**
 * Validate maximum length
 * @param {string} value
 * @param {number} maxLength
 * @returns {boolean}
 */
export const maxLength = (value, maxLength) => {
  return !value || value.length <= maxLength;
};

/**
 * Validate number range
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
export const isInRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validate rating (1-5)
 * @param {number} rating
 * @returns {boolean}
 */
export const isValidRating = (rating) => {
  return isInRange(rating, 1, 5);
};

/**
 * Validate date is not in past
 * @param {Date|string} date
 * @returns {boolean}
 */
export const isNotPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) >= today;
};

/**
 * Sanitize input string (basic XSS prevention)
 * @param {string} input
 * @returns {string}
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

export default {
  isValidEmail,
  validatePassword,
  isValidPhone,
  isRequired,
  minLength,
  maxLength,
  isInRange,
  isValidRating,
  isNotPastDate,
  sanitizeInput,
};
