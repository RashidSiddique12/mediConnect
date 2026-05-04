const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const Specialty = require("../models/Specialty");
const Hospital = require("../models/Hospital");
const Doctor = require("../models/Doctor");

const seedLinks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for linking specialties...\n");

    const specialties = await Specialty.find({ status: "active" });
    if (specialties.length === 0) {
      console.error("No specialties found. Run seedSpecialties first.");
      process.exit(1);
    }

    const specIds = specialties.map((s) => s._id);

    // --- Link specialties to hospitals ---
    const hospitals = await Hospital.find({});
    let hospitalUpdated = 0;
    for (const hospital of hospitals) {
      if (hospital.specialties && hospital.specialties.length > 0) {
        console.log(`[SKIP] ${hospital.name} already has specialties`);
        continue;
      }
      // Assign 3–6 random specialties
      const count = 3 + Math.floor(Math.random() * 4);
      const shuffled = [...specIds].sort(() => 0.5 - Math.random());
      hospital.specialties = shuffled.slice(0, count);
      await hospital.save();
      console.log(`[UPDATED] ${hospital.name} → ${count} specialties`);
      hospitalUpdated++;
    }

    // --- Link specialties to doctors ---
    const doctors = await Doctor.find({});
    let doctorUpdated = 0;
    for (const doctor of doctors) {
      if (doctor.specialtyIds && doctor.specialtyIds.length > 0) {
        console.log(`[SKIP] ${doctor.name} already has specialties`);
        continue;
      }
      // Assign 1–2 random specialties from their hospital's specialties
      const hospital = hospitals.find(
        (h) => h._id.toString() === doctor.hospitalId.toString(),
      );
      const pool =
        hospital?.specialties?.length > 0 ? hospital.specialties : specIds;
      const count = 1 + Math.floor(Math.random() * 2);
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      doctor.specialtyIds = shuffled.slice(0, count);
      await doctor.save();
      console.log(`[UPDATED] ${doctor.name} → ${count} specialties`);
      doctorUpdated++;
    }

    console.log(`\n=== Specialty linking complete! ===`);
    console.log(
      `Hospitals updated: ${hospitalUpdated} | Doctors updated: ${doctorUpdated}`,
    );
    process.exit(0);
  } catch (error) {
    console.error("Linking failed:", error.message);
    process.exit(1);
  }
};

seedLinks();
