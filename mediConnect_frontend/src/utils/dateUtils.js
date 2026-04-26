/**
 * Format date to display string
 * @param {Date|string} date
 * @param {string} format - 'short' | 'long' | 'time'
 * @returns {string}
 */
export const formatDate = (date, format = 'short') => {
  const d = new Date(date);
  
  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' },
    datetime: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
  };

  return d.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Format time slot for display
 * @param {string} time - HH:mm format
 * @returns {string}
 */
export const formatTimeSlot = (time) => {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

/**
 * Get day of week name
 * @param {number} dayIndex - 0-6 (Sunday-Saturday)
 * @returns {string}
 */
export const getDayName = (dayIndex) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex] || '';
};

/**
 * Check if date is today
 * @param {Date|string} date
 * @returns {boolean}
 */
export const isToday = (date) => {
  const today = new Date();
  const d = new Date(date);
  return d.toDateString() === today.toDateString();
};

/**
 * Check if date is in the past
 * @param {Date|string} date
 * @returns {boolean}
 */
export const isPast = (date) => {
  return new Date(date) < new Date();
};

/**
 * Check if date is in the future
 * @param {Date|string} date
 * @returns {boolean}
 */
export const isFuture = (date) => {
  return new Date(date) > new Date();
};

/**
 * Get relative time string (e.g., "2 days ago", "in 3 hours")
 * @param {Date|string} date
 * @returns {string}
 */
export const getRelativeTime = (date) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const now = new Date();
  const d = new Date(date);
  const diffInSeconds = Math.floor((d - now) / 1000);
  
  const units = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ];

  for (const { unit, seconds } of units) {
    const value = Math.floor(Math.abs(diffInSeconds) / seconds);
    if (value >= 1) {
      return rtf.format(diffInSeconds > 0 ? value : -value, unit);
    }
  }
  return 'just now';
};

/**
 * Add days to date
 * @param {Date|string} date
 * @param {number} days
 * @returns {Date}
 */
export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Get date range for current week
 * @returns {Object} { start, end }
 */
export const getCurrentWeekRange = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - dayOfWeek);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
};

export default {
  formatDate,
  formatTimeSlot,
  getDayName,
  isToday,
  isPast,
  isFuture,
  getRelativeTime,
  addDays,
  getCurrentWeekRange,
};
