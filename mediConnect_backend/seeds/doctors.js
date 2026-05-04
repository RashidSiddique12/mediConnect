const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const Doctor = require("../models/Doctor");
const Specialty = require("../models/Specialty");

// ── Pass hospital ID as CLI argument: node seeds/doctors.js <hospitalId> ──
const hospitalId = process.argv[2];
if (!hospitalId) {
  console.error("Usage: node seeds/doctors.js <hospitalId>");
  process.exit(1);
}

const DOCTORS = [
  {
    name: "Dr. Arjun Mehta",
    experience: 12,
    consultationFee: 800,
    qualification: "MBBS, MD (Cardiology)",
    gender: "male",
    bio: "Senior cardiologist with expertise in interventional cardiology and heart failure management.",
    specialtyName: "Cardiology",
  },
  {
    name: "Dr. Priya Sharma",
    experience: 8,
    consultationFee: 600,
    qualification: "MBBS, MS (Orthopedics)",
    gender: "female",
    bio: "Orthopedic surgeon specializing in joint replacement and sports injuries.",
    specialtyName: "Orthopedics",
  },
  {
    name: "Dr. Rahul Verma",
    experience: 15,
    consultationFee: 1000,
    qualification: "MBBS, DM (Neurology)",
    gender: "male",
    bio: "Consultant neurologist with experience in stroke management and epilepsy.",
    specialtyName: "Neurology",
  },
  {
    name: "Dr. Sneha Iyer",
    experience: 6,
    consultationFee: 500,
    qualification: "MBBS, MD (Pediatrics)",
    gender: "female",
    bio: "Pediatrician focused on newborn care, vaccinations, and child development.",
    specialtyName: "Pediatrics",
  },
  {
    name: "Dr. Vikram Joshi",
    experience: 10,
    consultationFee: 700,
    qualification: "MBBS, MD (Dermatology)",
    gender: "male",
    bio: "Dermatologist with expertise in cosmetic dermatology and skin allergy management.",
    specialtyName: "Dermatology",
  },
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for doctor seeding...\n");

    const specialties = await Specialty.find({ status: "active" });
    const specMap = new Map(specialties.map((s) => [s.name, s._id]));

    let created = 0;
    for (const doc of DOCTORS) {
      const existing = await Doctor.findOne({ name: doc.name, hospitalId });
      if (existing) {
        console.log(`[SKIP] ${doc.name} already exists in this hospital`);
        continue;
      }

      const specId = specMap.get(doc.specialtyName);
      if (!specId) {
        console.log(
          `[WARN] Specialty "${doc.specialtyName}" not found, skipping ${doc.name}`,
        );
        continue;
      }

      await Doctor.create({
        hospitalId,
        name: doc.name,
        specialtyIds: [specId],
        experience: doc.experience,
        consultationFee: doc.consultationFee,
        qualification: doc.qualification,
        gender: doc.gender,
        bio: doc.bio,
        status: "active",
      });
      console.log(
        `[CREATED] ${doc.name} — ${doc.specialtyName} | Fee: ₹${doc.consultationFee}`,
      );
      created++;
    }

    console.log(
      `\n=== Doctor seeding complete! Created ${created} doctors ===`,
    );
    process.exit(0);
  } catch (error) {
    console.error("Doctor seeding failed:", error.message);
    process.exit(1);
  }
};

seedDoctors();
