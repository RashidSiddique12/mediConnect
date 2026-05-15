const ROLES = {
  SUPER_ADMIN: "super_admin",
  HOSPITAL_ADMIN: "hospital_admin",
  PATIENT: "patient",
};

const APPOINTMENT_STATUS = {
  BOOKED: "booked",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const REVIEW_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
}

const DEFAULT_CURRENCY = 'INR'

module.exports = { ROLES, APPOINTMENT_STATUS, REVIEW_STATUS, CURRENCIES, DEFAULT_CURRENCY };
