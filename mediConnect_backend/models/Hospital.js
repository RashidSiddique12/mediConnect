const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
      maxlength: 200,
    },
    type: {
      type: String,
      enum: ['general', 'specialty', 'clinic', 'diagnostic_center'],
      default: 'general',
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, required: [true, 'City is required'], trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      unique: true,
    },
    website: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      type: String,
      trim: true,
    },
    registrationNumber: {
      type: String,
      trim: true,
    },
    hospitalAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    specialties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty',
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    logo: {
      type: String,
    },
    operatingHours: {
      open: { type: String, trim: true },
      close: { type: String, trim: true },
      is24x7: { type: Boolean, default: false },
    },
    facilities: [{
      type: String,
      trim: true,
    }],
    insurancePanels: [{
      type: String,
      trim: true,
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hospital', hospitalSchema);
