const mongoose = require('mongoose');

const specialtySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Specialty name is required'],
      unique: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Specialty', specialtySchema);
