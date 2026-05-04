import { MdLocalHospital, MdCheckCircle, MdCancel } from "react-icons/md";

export const INITIAL_FORM = {
  name: "",
  type: "general",
  registrationNumber: "",
  website: "",
  description: "",
  city: "",
  state: "",
  street: "",
  zipCode: "",
  phone: "",
  email: "",
  emergencyContact: "",
  is24x7: false,
  openTime: "08:00",
  closeTime: "20:00",
  specialties: [],
  facilities: [],
  insurancePanels: "",
  adminName: "",
  adminEmail: "",
  adminPhone: "",
  adminPassword: "",
};

/* ── Hospital type options ── */
export const HOSPITAL_TYPES = [
  { value: "general", label: "General Hospital" },
  { value: "specialty", label: "Specialty Hospital" },
  { value: "clinic", label: "Clinic" },
  { value: "diagnostic_center", label: "Diagnostic Center" },
];

/* ── Facility chip toggle ── */
export const FACILITY_OPTIONS = [
  "ICU",
  "Pharmacy",
  "Laboratory",
  "Ambulance",
  "Emergency",
  "Blood Bank",
  "Radiology",
  "Operation Theater",
  "Physiotherapy",
];

export const STATS = [
  {
    key: "total",
    label: "Total Hospitals",
    icon: MdLocalHospital,
    color: "teal",
  },
  { key: "active", label: "Active", icon: MdCheckCircle, color: "green" },
  { key: "inactive", label: "Inactive", icon: MdCancel, color: "gray" },
];
