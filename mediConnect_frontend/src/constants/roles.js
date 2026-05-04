export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  HOSPITAL_ADMIN: "hospital_admin",
  PATIENT: "patient",
};

export const ROLE_LABELS = {
  [USER_ROLES.SUPER_ADMIN]: "Super Admin",
  [USER_ROLES.HOSPITAL_ADMIN]: "Hospital Admin",
  [USER_ROLES.PATIENT]: "Patient",
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: [
    "manage_hospitals",
    "manage_specialties",
    "manage_users",
    "view_all_appointments",
    "moderate_reviews",
    "view_analytics",
  ],
  [USER_ROLES.HOSPITAL_ADMIN]: [
    "manage_hospital_profile",
    "manage_doctors",
    "manage_schedules",
    "view_appointments",
    "update_appointment_status",
    "upload_prescriptions",
    "view_patient_details",
  ],
  [USER_ROLES.PATIENT]: [
    "view_profile",
    "update_profile",
    "search_hospitals",
    "search_doctors",
    "book_appointments",
    "cancel_appointments",
    "view_prescriptions",
    "upload_documents",
    "submit_reviews",
  ],
};

export const ROLE_ROUTES = {
  [USER_ROLES.SUPER_ADMIN]: "/admin",
  [USER_ROLES.HOSPITAL_ADMIN]: "/hospital",
  [USER_ROLES.PATIENT]: "/patient",
};

export default USER_ROLES;
