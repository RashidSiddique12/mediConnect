const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { success, created, paginated } = require("../utils/apiResponse");

// GET /api/v1/prescriptions
const getPrescriptions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};

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
      .populate("doctorId", "name")
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
      .populate("patientId", "name email");

    if (!prescription) {
      return res
        .status(404)
        .json({ success: false, message: "Prescription not found." });
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
      .populate("patientId", "name email");

    if (!prescription) {
      return res
        .status(404)
        .json({ success: false, message: "Prescription not found." });
    }
    success(res, prescription);
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/patients/:patientId/prescriptions
const getPrescriptionsByPatient = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = { patientId: req.params.patientId };

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
