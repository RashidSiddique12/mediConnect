const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const { success, created, paginated } = require("../utils/apiResponse");

// GET /api/v1/prescriptions
const getPrescriptions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};

    // Patients can only see their own prescriptions
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    }

    // Hospital admins can only see prescriptions from their hospital
    if (req.user.role === 'hospital_admin') {
      const hospital = await Hospital.findOne({ hospitalAdminId: req.user._id }).select('_id').lean();
      if (!hospital) {
        return res.status(403).json({ success: false, message: 'No hospital linked to your account.' });
      }
      const hospitalAppointments = await Appointment.find({ hospitalId: hospital._id }).select('_id').lean();
      query.appointmentId = { $in: hospitalAppointments.map((a) => a._id) };
    }

    if (search) {
      const regex = new RegExp(search, "i");
      const matchingDoctors = await Doctor.find({ name: regex })
        .select("_id")
        .lean();
      query.$or = [
        { diagnosis: regex },
        { doctorId: { $in: matchingDoctors.map((d) => d._id) } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Prescription.countDocuments(query);
    const prescriptions = await Prescription.find(query)
      .populate({ path: "appointmentId", populate: { path: "hospitalId", select: "name" } })
      .populate({ path: "doctorId", select: "name specialtyIds", populate: { path: "specialtyIds", select: "name" } })
      .populate("patientId", "name email")
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
      .populate({ path: "appointmentId", populate: { path: "hospitalId", select: "name" } })
      .populate("doctorId", "name")
      .populate("patientId", "name email")
      .populate("history.updatedBy", "name");

    if (!prescription) {
      return res
        .status(404)
        .json({ success: false, message: "Prescription not found." });
    }

    // Patients can only view their own prescriptions
    if (
      req.user.role === 'patient' &&
      String(prescription.patientId._id || prescription.patientId) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    }

    // Hospital admins can only view prescriptions from their hospital
    if (req.user.role === 'hospital_admin') {
      const hospital = await Hospital.findOne({ hospitalAdminId: req.user._id }).select('_id').lean();
      const appointment = prescription.appointmentId;
      const appointmentHospitalId = appointment?.hospitalId?._id || appointment?.hospitalId;
      if (!hospital || String(appointmentHospitalId) !== String(hospital._id)) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied." });
      }
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
      return res
        .status(400)
        .json({ success: false, message: "Prescription file is required." });
    }

    const { appointmentId, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    // Hospital admin can only upload for their hospital's appointments
    const hospital = await Hospital.findOne({ hospitalAdminId: req.user._id }).select('_id').lean();
    if (!hospital || String(appointment.hospitalId) !== String(hospital._id)) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. This appointment does not belong to your hospital." });
    }

    const fileUrl = req.file.path;

    // Check if prescription already exists for this appointment
    const existing = await Prescription.findOne({ appointmentId });

    let prescription;
    let message;

    if (existing) {
      // Push current version to history before updating
      existing.history.push({
        fileUrl: existing.fileUrl,
        notes: existing.notes,
        updatedBy: req.user?._id,
        changedAt: existing.updatedAt,
      });
      existing.fileUrl = fileUrl;
      existing.notes = notes || existing.notes;
      prescription = await existing.save();
      message = "Prescription updated successfully";
    } else {
      prescription = await Prescription.create({
        appointmentId,
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        fileUrl,
        notes,
      });
      message = "Prescription uploaded successfully";
    }

    const populated = await Prescription.findById(prescription._id)
      .populate({ path: "appointmentId", populate: { path: "hospitalId", select: "name" } })
      .populate("doctorId", "name")
      .populate("patientId", "name email");

    created(res, populated, message);
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/appointments/:appointmentId/prescription
const getPrescriptionByAppointment = async (req, res, next) => {
  try {
    const prescription = await Prescription.findOne({
      appointmentId: req.params.appointmentId,
    })
      .populate("doctorId", "name")
      .populate("patientId", "name email")
      .populate("history.updatedBy", "name");

    if (!prescription) {
      return res
        .status(404)
        .json({ success: false, message: "Prescription not found." });
    }

    // Patients can only view their own prescriptions
    if (
      req.user.role === 'patient' &&
      String(prescription.patientId._id || prescription.patientId) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    }

    // Hospital admins can only view prescriptions from their hospital
    if (req.user.role === 'hospital_admin') {
      const hospital = await Hospital.findOne({ hospitalAdminId: req.user._id }).select('_id').lean();
      const appt = await Appointment.findById(req.params.appointmentId).select('hospitalId').lean();
      if (!hospital || !appt || String(appt.hospitalId) !== String(hospital._id)) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied." });
      }
    }

    success(res, prescription);
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/patients/:patientId/prescriptions
const getPrescriptionsByPatient = async (req, res, next) => {
  try {
    // Patients can only access their own prescriptions
    if (
      req.user.role === 'patient' &&
      String(req.params.patientId) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    }

    const { page = 1, limit = 10, search } = req.query;
    const query = { patientId: req.params.patientId };

    // Hospital admins can only see prescriptions from their hospital
    if (req.user.role === 'hospital_admin') {
      const hospital = await Hospital.findOne({ hospitalAdminId: req.user._id }).select('_id').lean();
      if (!hospital) {
        return res.status(403).json({ success: false, message: 'No hospital linked to your account.' });
      }
      const hospitalAppointments = await Appointment.find({ hospitalId: hospital._id }).select('_id').lean();
      query.appointmentId = { $in: hospitalAppointments.map((a) => a._id) };
    }

    if (search) {
      const regex = new RegExp(search, "i");
      const matchingDoctors = await Doctor.find({ name: regex })
        .select("_id")
        .lean();
      query.$or = [
        { diagnosis: regex },
        { doctorId: { $in: matchingDoctors.map((d) => d._id) } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Prescription.countDocuments(query);
    const prescriptions = await Prescription.find(query)
      .populate("appointmentId")
      .populate("doctorId", "name")
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

module.exports = {
  getPrescriptions,
  getPrescriptionById,
  uploadPrescription,
  getPrescriptionByAppointment,
  getPrescriptionsByPatient,
};
