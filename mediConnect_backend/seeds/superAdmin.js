const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const DEMO_USERS = [
  {
    name: 'Super Admin',
    email: 'admin@healthcare.com',
    password: 'Admin@123',
    role: 'super_admin',
    phone: '9999999999',
    status: 'active',
  },
  {
    name: 'Hospital Admin',
    email: 'hospital@healthcare.com',
    password: 'Hospital@123',
    role: 'hospital_admin',
    phone: '8888888888',
    status: 'active',
  },
  {
    name: 'Demo Patient',
    email: 'patient@healthcare.com',
    password: 'Patient@123',
    role: 'patient',
    phone: '7777777777',
    status: 'active',
  },
];

const seedDemoUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    for (const userData of DEMO_USERS) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`${userData.role} already exists: ${existing.email}`);
        continue;
      }

      const user = await User.create(userData);
      console.log(`${userData.role} created — Email: ${user.email}, Password: ${userData.password}`);
    }

    console.log('\nSeeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDemoUsers();
