const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor is required'],
    },
    dayOfWeek: {
      type: Number,
      required: [true, 'Day of week is required'],
      min: 0,
      max: 6, // 0 = Sunday, 6 = Saturday
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'], // "09:00"
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'], // "17:00"
    },
    slotDuration: {
      type: Number,
      required: [true, 'Slot duration is required'],
      default: 30, // minutes
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate schedule for same doctor on same day
scheduleSchema.index({ doctorId: 1, dayOfWeek: 1 }, { unique: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
