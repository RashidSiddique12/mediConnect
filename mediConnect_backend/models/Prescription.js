const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: [true, 'Appointment is required'],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor is required'],
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient is required'],
    },
    fileUrl: {
      type: String,
      required: [true, 'Prescription file is required'],
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
