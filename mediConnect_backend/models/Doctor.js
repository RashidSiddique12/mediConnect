const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'Hospital is required'],
    },
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
      maxlength: 100,
    },
    specialtyIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty',
      },
    ],
    experience: {
      type: Number,
      default: 0,
    },
    consultationFee: {
      type: Number,
      default: 0,
    },
    qualification: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    bio: {
      type: String,
      maxlength: 1000,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
