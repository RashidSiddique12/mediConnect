const ROLES = {
  SUPER_ADMIN: 'super_admin',
  HOSPITAL_ADMIN: 'hospital_admin',
  PATIENT: 'patient',
};

const APPOINTMENT_STATUS = {
  BOOKED: 'booked',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const REVIEW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

module.exports = { ROLES, APPOINTMENT_STATUS, REVIEW_STATUS };
