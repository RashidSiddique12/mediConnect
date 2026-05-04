const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const User = require("../models/User");
const Hospital = require("../models/Hospital");
const Doctor = require("../models/Doctor");
const Review = require("../models/Review");

const PATIENT_NAMES = [
  "Aarav Sharma",
  "Priya Patel",
  "Rohan Gupta",
  "Sneha Reddy",
  "Vikram Singh",
  "Ananya Iyer",
  "Karan Malhotra",
  "Divya Nair",
];

const COMMENTS = [
  "Excellent hospital with very professional staff. The doctors took their time to explain everything clearly.",
  "Very clean and well-maintained facility. Wait times were reasonable and the treatment was effective.",
  "Great experience overall. The nursing staff was attentive and caring. Highly recommend this hospital.",
  "Good hospital but the waiting area could be improved. The doctor was knowledgeable and thorough.",
  "World-class facilities and experienced doctors. The billing process was smooth and transparent.",
  "Friendly and helpful staff from reception to discharge. The doctor listened patiently to all concerns.",
  "Decent hospital with modern equipment. Had a minor issue with appointment scheduling but care was top-notch.",
  "The doctor was incredibly skilled and compassionate. Follow-up care was also very well organized.",
  "Clean environment and polite staff. Treatment was effective and recovery was quick.",
  "Very impressed with the level of care. The hospital follows strict hygiene protocols.",
  "The emergency department was efficient and handled our case promptly. Grateful for the quick response.",
  "Good diagnostic facilities and timely reports. The doctor explained the results in detail.",
  "Affordable treatment without compromising on quality. Would definitely visit again if needed.",
  "Modern infrastructure and well-equipped operation theaters. Post-surgery care was excellent.",
  "Staff could be more responsive at times, but overall the treatment quality was very good.",
  "One of the best hospitals in the area. The specialists are highly experienced and approachable.",
  "Smooth admission process and comfortable rooms. Food quality in the canteen was also good.",
  "The physiotherapy department is outstanding. Recovered much faster than expected.",
  "Helpful billing department and cashless insurance process was hassle-free.",
  "Night shift nurses were extremely caring and checked on the patient regularly.",
];

const seedReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for review seeding...\n");

    // Fetch all hospitals
    const hospitals = await Hospital.find({});
    if (hospitals.length === 0) {
      console.error("No hospitals found. Run the hospital seed first.");
      process.exit(1);
    }

    // Ensure dummy patient accounts exist
    const patients = [];
    for (let i = 0; i < PATIENT_NAMES.length; i++) {
      const email = `patient${i + 1}@mediconnect.com`;
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: PATIENT_NAMES[i],
          email,
          password: "test@123",
          role: "patient",
          phone: `97000000${String(i + 1).padStart(2, "0")}`,
          status: "active",
        });
        console.log(`[CREATED] Patient — ${user.email}`);
      }
      patients.push(user);
    }

    let totalCreated = 0;
    let totalSkipped = 0;

    for (const hospital of hospitals) {
      // Check existing reviews for this hospital
      const existingCount = await Review.countDocuments({
        hospitalId: hospital._id,
      });
      if (existingCount >= 2) {
        console.log(
          `[SKIP] ${hospital.name} already has ${existingCount} reviews`,
        );
        totalSkipped++;
        continue;
      }

      // Find doctors in this hospital; create a fallback if none exist
      let doctors = await Doctor.find({ hospitalId: hospital._id });
      if (doctors.length === 0) {
        const fallbackDoctor = await Doctor.create({
          hospitalId: hospital._id,
          name: `Dr. ${hospital.name.split(" ")[0]} Consult`,
          experience: 5,
          consultationFee: 500,
          qualification: "MBBS",
          gender: "male",
          status: "active",
          bio: "General consultant at the hospital.",
        });
        doctors = [fallbackDoctor];
        console.log(`  [CREATED] Fallback doctor for ${hospital.name}`);
      }

      // Create 2–3 reviews per hospital
      const reviewCount = 2 + Math.floor(Math.random() * 2); // 2 or 3
      const reviewsNeeded = reviewCount - existingCount;

      for (let r = 0; r < reviewsNeeded; r++) {
        const patient = patients[(totalCreated + r) % patients.length];
        const doctor = doctors[r % doctors.length];
        const rating = 3 + Math.floor(Math.random() * 3); // 3, 4, or 5
        const comment = COMMENTS[(totalCreated + r) % COMMENTS.length];
        const statuses = ["approved", "approved", "pending"]; // bias towards approved
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        await Review.create({
          patientId: patient._id,
          doctorId: doctor._id,
          hospitalId: hospital._id,
          rating,
          comment,
          status,
        });
      }

      console.log(`[CREATED] ${reviewsNeeded} reviews for ${hospital.name}`);
      totalCreated += reviewsNeeded;
    }

    console.log(`\n=== Review seeding complete! ===`);
    console.log(
      `Created: ${totalCreated} reviews | Skipped: ${totalSkipped} hospitals`,
    );
    console.log(`Patient accounts password: test@123`);
    process.exit(0);
  } catch (error) {
    console.error("Review seeding failed:", error.message);
    process.exit(1);
  }
};

seedReviews();
