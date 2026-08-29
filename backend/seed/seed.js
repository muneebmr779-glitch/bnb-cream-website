require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Service = require('../models/Service');
const servicesData = require('./servicesData');

const destroy = process.argv.includes('--destroy');

const run = async () => {
  await connectDB();

  if (destroy) {
    await Service.deleteMany();
    console.log('All services removed.');
    await mongoose.disconnect();
    process.exit(0);
  }

  // Seed default services (skip if already present)
  const existingCount = await Service.countDocuments();
  if (existingCount === 0) {
    await Service.insertMany(servicesData);
    console.log(`Seeded ${servicesData.length} services.`);
  } else {
    console.log(`Services already exist (${existingCount}), skipping service seed.`);
  }

  // Seed default admin account
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    await User.create({
      name: process.env.ADMIN_NAME || 'Workshop Admin',
      email: adminEmail,
      phone: '+1-555-0100',
      password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
      role: 'admin',
    });
    console.log(`Admin account created: ${adminEmail}`);
  } else {
    console.log('Admin account already exists, skipping.');
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
