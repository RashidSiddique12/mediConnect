const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const Specialty = require("../models/Specialty");

const SPECIALTIES = [
  {
    name: "Cardiology",
    description:
      "Diagnosis and treatment of heart and cardiovascular system disorders.",
  },
  {
    name: "Neurology",
    description:
      "Diagnosis and treatment of disorders of the nervous system including the brain and spinal cord.",
  },
  {
    name: "Orthopedics",
    description:
      "Treatment of musculoskeletal system conditions including bones, joints, and ligaments.",
  },
  {
    name: "Pediatrics",
    description:
      "Medical care for infants, children, and adolescents up to 18 years of age.",
  },
  {
    name: "Dermatology",
    description: "Diagnosis and treatment of skin, hair, and nail conditions.",
  },
  {
    name: "Ophthalmology",
    description:
      "Medical and surgical care for eye and vision-related disorders.",
  },
  {
    name: "ENT (Otolaryngology)",
    description:
      "Treatment of ear, nose, throat, and related head and neck disorders.",
  },
  {
    name: "Gynecology & Obstetrics",
    description:
      "Women's reproductive health, pregnancy care, and childbirth management.",
  },
  {
    name: "General Surgery",
    description:
      "Surgical procedures for abdominal organs, soft tissue, skin, and hernias.",
  },
  {
    name: "Psychiatry",
    description:
      "Diagnosis, treatment, and prevention of mental, emotional, and behavioral disorders.",
  },
  {
    name: "Oncology",
    description:
      "Diagnosis and treatment of cancer using chemotherapy, radiation, and surgery.",
  },
  {
    name: "Urology",
    description:
      "Treatment of urinary tract and male reproductive system disorders.",
  },
  {
    name: "Pulmonology",
    description:
      "Diagnosis and treatment of respiratory system diseases including lungs and airways.",
  },
  {
    name: "Gastroenterology",
    description:
      "Treatment of digestive system disorders including stomach, intestines, and liver.",
  },
  {
    name: "Endocrinology",
    description:
      "Treatment of hormonal imbalances and disorders like diabetes and thyroid conditions.",
  },
];

const seedSpecialties = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for specialty seeding...\n");

    let created = 0;
    let skipped = 0;

    for (const data of SPECIALTIES) {
      const existing = await Specialty.findOne({ name: data.name });
      if (existing) {
        console.log(`[SKIP] Already exists: ${data.name}`);
        skipped++;
        continue;
      }

      await Specialty.create({ ...data, status: "active" });
      console.log(`[CREATED] ${data.name}`);
      created++;
    }

    console.log(`\n=== Specialty seeding complete! ===`);
    console.log(`Created: ${created} | Skipped: ${skipped}`);
    process.exit(0);
  } catch (error) {
    console.error("Specialty seeding failed:", error.message);
    process.exit(1);
  }
};

seedSpecialties();
