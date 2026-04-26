const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const { success, created, paginated } = require('../utils/apiResponse');

// GET /api/v1/prescriptions
const getPrescriptions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Prescription.countDocuments();
    const prescriptions = await Prescription.find()
      .populate('appointmentId')
      .populate('doctorId', 'name')
      .populate('patientId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    paginated(res, prescriptions, {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/prescriptions/:id
const getPrescriptionById = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('appointmentId')
      .populate('doctorId', 'name')
      .populate('patientId', 'name email');

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found.' });
    }
    success(res, prescription);
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/prescriptions/upload
const uploadPrescription = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Prescription file is required.' });
    }

    const { appointmentId, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    const fileUrl = `/uploads/prescriptions/${req.file.filename}`;

    const prescription = await Prescription.create({
      appointmentId,
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      fileUrl,
      notes,
    });

    const populated = await Prescription.findById(prescription._id)
      .populate('appointmentId')
      .populate('doctorId', 'name')
      .populate('patientId', 'name email');

    created(res, populated, 'Prescription uploaded successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/appointments/:appointmentId/prescription
const getPrescriptionByAppointment = async (req, res, next) => {
  try {
    const prescription = await Prescription.findOne({ appointmentId: req.params.appointmentId })
      .populate('doctorId', 'name')
      .populate('patientId', 'name email');

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found.' });
    }
    success(res, prescription);
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/patients/:patientId/prescriptions
const getPrescriptionsByPatient = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.params.patientId })
      .populate('appointmentId')
      .populate('doctorId', 'name')
      .sort({ createdAt: -1 });

    success(res, prescriptions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPrescriptions,
  getPrescriptionById,
  uploadPrescription,
  getPrescriptionByAppointment,
  getPrescriptionsByPatient,
};
