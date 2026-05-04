const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const User = require("../models/User");
const Hospital = require("../models/Hospital");

const DEMO_USERS = [
  {
    name: "Super Admin",
    email: "admin@mediconnect.com",
    password: "Admin@123",
    role: "super_admin",
    phone: "9876543210",
    status: "active",
  },
  {
    name: "Demo Patient",
    email: "patient@mediconnect.com",
    password: "Patient@123",
    role: "patient",
    phone: "9988776655",
    status: "active",
  },
];

const seedDemoUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding...\n");

    const emails = DEMO_USERS.map((u) => u.email);

    // Delete existing demo users
    const deleted = await User.deleteMany({ email: { $in: emails } });
    console.log(`Deleted ${deleted.deletedCount} existing demo user(s)\n`);

    for (const userData of DEMO_USERS) {
      const user = await User.create(userData);
      console.log(
        `[CREATED] ${userData.role} — Email: ${user.email}, Password: ${userData.password}`,
      );

      // Assign hospital admin to the first available hospital
      if (userData.role === "hospital_admin") {
        const hospital = await Hospital.findOne({ status: "active" }).sort({
          createdAt: 1,
        });
        if (hospital) {
          hospital.hospitalAdminId = user._id;
          await hospital.save();
          console.log(`         Assigned to hospital: ${hospital.name}`);
        } else {
          console.log("         ⚠ No active hospital found to assign");
        }
      }
    }

    console.log("\nSeeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDemoUsers();
