/**
 * @file appointmentStatus.js
 * @description Appointment status constants for MediConnect
 * @author Healthcare App Team
 * @created 2026-04-15
 */

export const APPOINTMENT_STATUS = {
  BOOKED: 'booked',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const APPOINTMENT_STATUS_LABELS = {
  [APPOINTMENT_STATUS.BOOKED]: 'Booked',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completed',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelled',
};

export const APPOINTMENT_STATUS_COLORS = {
  [APPOINTMENT_STATUS.BOOKED]: '#1976d2',    // Blue
  [APPOINTMENT_STATUS.COMPLETED]: '#2e7d32', // Green
  [APPOINTMENT_STATUS.CANCELLED]: '#d32f2f', // Red
};

export const REVIEW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const REVIEW_STATUS_LABELS = {
  [REVIEW_STATUS.PENDING]: 'Pending',
  [REVIEW_STATUS.APPROVED]: 'Approved',
  [REVIEW_STATUS.REJECTED]: 'Rejected',
};

export default APPOINTMENT_STATUS;
