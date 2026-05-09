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
    name: "Dr. Kavita Reddy",
    email: "kavita.reddy@healthcare.in",
    phone: "9812345601",
    experience: 14,
    consultationFee: 900,
    qualification: "MBBS, MD (General Medicine), DNB",
    gender: "female",
    licenseNumber: "KMC-GEN-2012-54321",
    registrationCouncil: "Karnataka Medical Council",
    registrationYear: 2012,
    languages: ["english", "hindi", "telugu", "kannada"],
    consultationTypes: ["in_person", "video", "phone"],
    bio: "Senior physician specializing in diabetes management, hypertension, and preventive healthcare with 14 years of clinical practice.",
    specialtyName: "General Medicine",
  },
  {
    name: "Dr. Sameer Kapoor",
    email: "sameer.kapoor@healthcare.in",
    phone: "9812345602",
    experience: 18,
    consultationFee: 1200,
    qualification: "MBBS, MS (General Surgery), FRCS",
    gender: "male",
    licenseNumber: "DMC-SUR-2008-11234",
    registrationCouncil: "Delhi Medical Council",
    registrationYear: 2008,
    languages: ["english", "hindi", "punjabi"],
    consultationTypes: ["in_person"],
    bio: "Fellowship-trained general surgeon with extensive experience in laparoscopic and minimally invasive surgeries.",
    specialtyName: "General Surgery",
  },
  {
    name: "Dr. Ananya Nair",
    email: "ananya.nair@healthcare.in",
    phone: "9812345603",
    experience: 9,
    consultationFee: 700,
    qualification: "MBBS, MD (Obstetrics & Gynecology)",
    gender: "female",
    licenseNumber: "TMC-OBG-2017-89012",
    registrationCouncil: "Tamil Nadu Medical Council",
    registrationYear: 2017,
    languages: ["english", "tamil", "malayalam"],
    consultationTypes: ["in_person", "video"],
    bio: "Gynecologist and obstetrician specializing in high-risk pregnancies, fertility treatments, and women's wellness.",
    specialtyName: "Gynecology",
  },
  {
    name: "Dr. Rohan Deshmukh",
    email: "rohan.deshmukh@healthcare.in",
    phone: "9812345604",
    experience: 11,
    consultationFee: 850,
    qualification: "MBBS, MD (Psychiatry)",
    gender: "male",
    licenseNumber: "MMC-PSY-2015-67890",
    registrationCouncil: "Maharashtra Medical Council",
    registrationYear: 2015,
    languages: ["english", "hindi", "marathi"],
    consultationTypes: ["in_person", "video", "phone"],
    bio: "Consultant psychiatrist experienced in anxiety disorders, depression, OCD, and cognitive behavioral therapy.",
    specialtyName: "Psychiatry",
  },
  {
    name: "Dr. Fatima Sheikh",
    email: "fatima.sheikh@healthcare.in",
    phone: "9812345605",
    experience: 7,
    consultationFee: 650,
    qualification: "MBBS, MD (Ophthalmology)",
    gender: "female",
    licenseNumber: "MCI-OPH-2019-34567",
    registrationCouncil: "Medical Council of India",
    registrationYear: 2019,
    languages: ["english", "hindi", "urdu"],
    consultationTypes: ["in_person"],
    bio: "Ophthalmologist skilled in cataract surgery, LASIK, glaucoma management, and pediatric eye care.",
    specialtyName: "Ophthalmology",
  },
  {
    name: "Dr. Aditya Rao",
    email: "aditya.rao@healthcare.in",
    phone: "9812345606",
    experience: 20,
    consultationFee: 1500,
    qualification: "MBBS, MS (Orthopedics), MCh",
    gender: "male",
    licenseNumber: "KMC-ORT-2006-98765",
    registrationCouncil: "Karnataka Medical Council",
    registrationYear: 2006,
    languages: ["english", "hindi", "kannada"],
    consultationTypes: ["in_person", "video"],
    bio: "Senior orthopedic surgeon with two decades of experience in spine surgery, joint replacements, and trauma care.",
    specialtyName: "Orthopedics",
  },
  {
    name: "Dr. Meera Chatterjee",
    email: "meera.chatterjee@healthcare.in",
    phone: "9812345607",
    experience: 5,
    consultationFee: 500,
    qualification: "MBBS, MD (Dermatology, Venereology & Leprosy)",
    gender: "female",
    licenseNumber: "WBMC-DER-2021-45678",
    registrationCouncil: "West Bengal Medical Council",
    registrationYear: 2021,
    languages: ["english", "hindi", "bengali"],
    consultationTypes: ["in_person", "video", "phone"],
    bio: "Young dermatologist specializing in acne treatment, hair loss therapy, cosmetic procedures, and skin allergy management.",
    specialtyName: "Dermatology",
  },
  {
    name: "Dr. Naveen Kumar",
    email: "naveen.kumar@healthcare.in",
    phone: "9812345608",
    experience: 13,
    consultationFee: 950,
    qualification: "MBBS, DM (Cardiology), FACC",
    gender: "male",
    licenseNumber: "MCI-CAR-2013-12345",
    registrationCouncil: "Medical Council of India",
    registrationYear: 2013,
    languages: ["english", "hindi", "tamil"],
    consultationTypes: ["in_person", "video"],
    bio: "Interventional cardiologist specializing in angioplasty, pacemaker implantation, and preventive cardiology.",
    specialtyName: "Cardiology",
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
        email: doc.email,
        phone: doc.phone,
        specialtyIds: [specId],
        experience: doc.experience,
        consultationFee: doc.consultationFee,
        qualification: doc.qualification,
        gender: doc.gender,
        licenseNumber: doc.licenseNumber,
        registrationCouncil: doc.registrationCouncil,
        registrationYear: doc.registrationYear,
        languages: doc.languages,
        consultationTypes: doc.consultationTypes,
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
