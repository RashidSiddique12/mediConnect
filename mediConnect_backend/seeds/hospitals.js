const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const User = require("../models/User");
const Hospital = require("../models/Hospital");

const HOSPITALS = [
  {
    name: "Apollo General Hospital",
    type: "general",
    address: {
      street: "21 Greams Road",
      city: "Chennai",
      state: "Tamil Nadu",
      zipCode: "600006",
    },
    phone: "9100000001",
    email: "apollo.chennai@mediconnect.com",
    website: "https://apollo-chennai.example.com",
    emergencyContact: "9100000101",
    registrationNumber: "TN-HOSP-1001",
    description:
      "A leading multi-specialty hospital offering world-class healthcare services.",
    operatingHours: { open: "08:00", close: "22:00", is24x7: false },
    facilities: ["ICU", "Emergency", "Pharmacy", "Lab", "Radiology"],
    insurancePanels: ["Star Health", "ICICI Lombard", "Max Bupa"],
  },
  {
    name: "Fortis Heart & Vascular Institute",
    type: "specialty",
    address: {
      street: "154/9 Bannerghatta Road",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560076",
    },
    phone: "9100000002",
    email: "fortis.blr@mediconnect.com",
    website: "https://fortis-blr.example.com",
    emergencyContact: "9100000102",
    registrationNumber: "KA-HOSP-1002",
    description:
      "Specialized in cardiology, cardiac surgery, and vascular treatments.",
    operatingHours: { open: "00:00", close: "23:59", is24x7: true },
    facilities: ["Cath Lab", "ICU", "Emergency", "Pharmacy", "Blood Bank"],
    insurancePanels: ["HDFC Ergo", "Bajaj Allianz"],
  },
  {
    name: "Medanta Super Specialty Hospital",
    type: "specialty",
    address: {
      street: "CH Baktawar Singh Road",
      city: "Gurugram",
      state: "Haryana",
      zipCode: "122001",
    },
    phone: "9100000003",
    email: "medanta.ggn@mediconnect.com",
    website: "https://medanta-ggn.example.com",
    emergencyContact: "9100000103",
    registrationNumber: "HR-HOSP-1003",
    description:
      "Multi-super-specialty institute with advanced robotic surgery capabilities.",
    operatingHours: { open: "00:00", close: "23:59", is24x7: true },
    facilities: ["Robotic Surgery", "ICU", "NICU", "Dialysis", "Pharmacy"],
    insurancePanels: ["Star Health", "New India Assurance", "United India"],
  },
  {
    name: "City Care Clinic",
    type: "clinic",
    address: {
      street: "45 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
    },
    phone: "9100000004",
    email: "citycare.mum@mediconnect.com",
    emergencyContact: "9100000104",
    registrationNumber: "MH-HOSP-1004",
    description:
      "A modern outpatient clinic for primary care and minor procedures.",
    operatingHours: { open: "09:00", close: "18:00", is24x7: false },
    facilities: ["Consultation", "Minor OT", "Pharmacy"],
    insurancePanels: ["Star Health"],
  },
  {
    name: "HealthFirst Diagnostics",
    type: "diagnostic_center",
    address: {
      street: "12 Park Street",
      city: "Kolkata",
      state: "West Bengal",
      zipCode: "700016",
    },
    phone: "9100000005",
    email: "healthfirst.kol@mediconnect.com",
    website: "https://healthfirst-kol.example.com",
    registrationNumber: "WB-HOSP-1005",
    description:
      "State-of-the-art diagnostic center with MRI, CT, and full-body health checkups.",
    operatingHours: { open: "07:00", close: "21:00", is24x7: false },
    facilities: ["MRI", "CT Scan", "X-Ray", "Pathology", "Ultrasound"],
    insurancePanels: ["ICICI Lombard", "Religare"],
  },
  {
    name: "Sunshine Children's Hospital",
    type: "specialty",
    address: {
      street: "1-7-201 Secunderabad",
      city: "Hyderabad",
      state: "Telangana",
      zipCode: "500003",
    },
    phone: "9100000006",
    email: "sunshine.hyd@mediconnect.com",
    website: "https://sunshine-hyd.example.com",
    emergencyContact: "9100000106",
    registrationNumber: "TS-HOSP-1006",
    description:
      "Dedicated pediatric hospital with neonatal ICU and child-friendly facilities.",
    operatingHours: { open: "00:00", close: "23:59", is24x7: true },
    facilities: ["NICU", "PICU", "Pediatric OT", "Pharmacy", "Play Area"],
    insurancePanels: ["Star Health", "Max Bupa", "HDFC Ergo"],
  },
  {
    name: "Green Valley General Hospital",
    type: "general",
    address: {
      street: "78 Civil Lines",
      city: "Jaipur",
      state: "Rajasthan",
      zipCode: "302006",
    },
    phone: "9100000007",
    email: "greenvalley.jpr@mediconnect.com",
    emergencyContact: "9100000107",
    registrationNumber: "RJ-HOSP-1007",
    description:
      "Full-service general hospital serving the Jaipur region with quality care.",
    operatingHours: { open: "08:00", close: "20:00", is24x7: false },
    facilities: ["ICU", "Emergency", "OT", "Lab", "Pharmacy"],
    insurancePanels: ["Bajaj Allianz", "New India Assurance"],
  },
  {
    name: "LifeLine Trauma Center",
    type: "general",
    address: {
      street: "33 GT Road",
      city: "Lucknow",
      state: "Uttar Pradesh",
      zipCode: "226001",
    },
    phone: "9100000008",
    email: "lifeline.lko@mediconnect.com",
    website: "https://lifeline-lko.example.com",
    emergencyContact: "9100000108",
    registrationNumber: "UP-HOSP-1008",
    description: "Level-1 trauma center with 24/7 emergency and critical care.",
    operatingHours: { open: "00:00", close: "23:59", is24x7: true },
    facilities: ["Trauma Bay", "ICU", "Blood Bank", "OT", "Pharmacy"],
    insurancePanels: ["United India", "Star Health"],
  },
  {
    name: "Caring Hands Women's Hospital",
    type: "specialty",
    address: {
      street: "99 FC Road",
      city: "Pune",
      state: "Maharashtra",
      zipCode: "411004",
    },
    phone: "9100000009",
    email: "caringhands.pun@mediconnect.com",
    registrationNumber: "MH-HOSP-1009",
    description: "Specialized in obstetrics, gynecology, and women's wellness.",
    operatingHours: { open: "08:00", close: "21:00", is24x7: false },
    facilities: ["Labor Room", "NICU", "OT", "Ultrasound", "Pharmacy"],
    insurancePanels: ["ICICI Lombard", "Max Bupa"],
  },
  {
    name: "NeuroCare Institute",
    type: "specialty",
    address: {
      street: "5 Residency Road",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560025",
    },
    phone: "9100000010",
    email: "neurocare.blr@mediconnect.com",
    website: "https://neurocare-blr.example.com",
    emergencyContact: "9100000110",
    registrationNumber: "KA-HOSP-1010",
    description:
      "Specialized neurology and neurosurgery center with advanced imaging.",
    operatingHours: { open: "00:00", close: "23:59", is24x7: true },
    facilities: ["MRI", "EEG Lab", "Neuro ICU", "OT", "Pharmacy"],
    insurancePanels: ["HDFC Ergo", "Star Health", "Bajaj Allianz"],
  },
  {
    name: "Harmony Wellness Clinic",
    type: "clinic",
    address: {
      street: "22 Camac Street",
      city: "Kolkata",
      state: "West Bengal",
      zipCode: "700017",
    },
    phone: "9100000011",
    email: "harmony.kol@mediconnect.com",
    registrationNumber: "WB-HOSP-1011",
    description:
      "Holistic wellness clinic offering preventive care and lifestyle management.",
    operatingHours: { open: "10:00", close: "19:00", is24x7: false },
    facilities: ["Consultation", "Physiotherapy", "Diet Counseling"],
    insurancePanels: [],
  },
  {
    name: "Royal Orthopedic Hospital",
    type: "specialty",
    address: {
      street: "8 Sardar Patel Marg",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110021",
    },
    phone: "9100000012",
    email: "royalortho.del@mediconnect.com",
    website: "https://royalortho-del.example.com",
    emergencyContact: "9100000112",
    registrationNumber: "DL-HOSP-1012",
    description:
      "Premier orthopedic center with joint replacement and sports medicine expertise.",
    operatingHours: { open: "08:00", close: "20:00", is24x7: false },
    facilities: ["OT", "Physiotherapy", "Sports Rehab", "X-Ray", "Pharmacy"],
    insurancePanels: ["New India Assurance", "HDFC Ergo"],
  },
  {
    name: "PrimeCare Diagnostics & Lab",
    type: "diagnostic_center",
    address: {
      street: "67 Anna Salai",
      city: "Chennai",
      state: "Tamil Nadu",
      zipCode: "600002",
    },
    phone: "9100000013",
    email: "primecare.chen@mediconnect.com",
    website: "https://primecare-chen.example.com",
    registrationNumber: "TN-HOSP-1013",
    description:
      "NABL-accredited lab with home sample collection and digital reports.",
    operatingHours: { open: "06:00", close: "22:00", is24x7: false },
    facilities: ["Pathology", "Microbiology", "Biochemistry", "Radiology"],
    insurancePanels: ["Star Health", "Religare", "ICICI Lombard"],
  },
  {
    name: "Evergreen General Hospital",
    type: "general",
    address: {
      street: "14 Mall Road",
      city: "Chandigarh",
      state: "Chandigarh",
      zipCode: "160017",
    },
    phone: "9100000014",
    email: "evergreen.chd@mediconnect.com",
    emergencyContact: "9100000114",
    registrationNumber: "CH-HOSP-1014",
    description:
      "Trusted multi-specialty general hospital serving the tri-city region.",
    operatingHours: { open: "07:00", close: "23:00", is24x7: false },
    facilities: ["ICU", "Emergency", "OT", "Lab", "Pharmacy", "Dialysis"],
    insurancePanels: ["Bajaj Allianz", "United India", "Max Bupa"],
  },
  {
    name: "Lakshmi Eye Hospital",
    type: "specialty",
    address: {
      street: "3 Race Course Road",
      city: "Coimbatore",
      state: "Tamil Nadu",
      zipCode: "641018",
    },
    phone: "9100000015",
    email: "lakshmieye.cbe@mediconnect.com",
    website: "https://lakshmieye-cbe.example.com",
    registrationNumber: "TN-HOSP-1015",
    description:
      "Leading eye care hospital with LASIK, cataract, and retina surgery.",
    operatingHours: { open: "08:00", close: "18:00", is24x7: false },
    facilities: ["OT", "Optometry", "Laser Suite", "Pharmacy"],
    insurancePanels: ["Star Health", "HDFC Ergo"],
  },
];

const seedHospitals = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for hospital seeding...\n");

    for (let i = 0; i < HOSPITALS.length; i++) {
      const hospitalData = HOSPITALS[i];

      // Check if hospital already exists
      const existingHospital = await Hospital.findOne({
        email: hospitalData.email,
      });
      if (existingHospital) {
        console.log(`[SKIP] Hospital already exists: ${hospitalData.name}`);
        continue;
      }

      // Create hospital_admin user
      const adminEmail = `admin.${hospitalData.email}`;
      const existingAdmin = await User.findOne({ email: adminEmail });

      let adminUser;
      if (existingAdmin) {
        adminUser = existingAdmin;
        console.log(`[SKIP] Admin already exists: ${adminEmail}`);
      } else {
        adminUser = await User.create({
          name: `${hospitalData.name} Admin`,
          email: adminEmail,
          password: "test@123",
          role: "hospital_admin",
          phone: hospitalData.phone,
          status: "active",
        });
        console.log(
          `[CREATED] Admin — ${adminUser.email} | Password: test@123`,
        );
      }

      // Create hospital linked to admin
      const hospital = await Hospital.create({
        ...hospitalData,
        hospitalAdminId: adminUser._id,
        status: "active",
        isVerified: true,
      });
      console.log(`[CREATED] Hospital — ${hospital.name} (${hospital.type})`);
      console.log(
        `         City: ${hospital.address.city} | Admin: ${adminUser.email}\n`,
      );
    }

    console.log("=== Hospital seeding complete! ===");
    console.log(`Total: ${HOSPITALS.length} hospitals`);
    console.log("All admin passwords: test@123");
    process.exit(0);
  } catch (error) {
    console.error("Hospital seeding failed:", error.message);
    process.exit(1);
  }
};

seedHospitals();
