const Appointment = require("../models/Appointment");
const Hospital = require("../models/Hospital");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const { success, created, paginated } = require("../utils/apiResponse");

// GET /api/v1/appointments
const getAppointments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const query = {};
    if (status) {
      const statuses = status.split(",");
      query.status = statuses.length > 1 ? { $in: statuses } : status;
    }

    // Auto-filter by hospital for hospital_admin
    if (req.user.role === "hospital_admin") {
      const hospital = await Hospital.findOne({
        hospitalAdminId: req.user._id,
      });
      if (hospital) query.hospitalId = hospital._id;
    }

    // Auto-filter by patient for patient role
    if (req.user.role === "patient") {
      query.patientId = req.user._id;
    }

    // Text search on patient/doctor names
    if (search) {
      const regex = new RegExp(search, "i");
      const [matchingPatients, matchingDoctors] = await Promise.all([
        User.find({ name: regex }).select("_id").lean(),
        Doctor.find({ name: regex }).select("_id").lean(),
      ]);
      query.$or = [
        { patientId: { $in: matchingPatients.map((p) => p._id) } },
        { doctorId: { $in: matchingDoctors.map((d) => d._id) } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate("patientId", "name email phone")
      .populate("hospitalId", "name")
      .populate("doctorId", "name specialtyId")
      .sort({ appointmentDate: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    paginated(res, appointments, {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/appointments/:id
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "name email phone")
      .populate("hospitalId", "name address phone")
      .populate("doctorId", "name specialtyIds consultationFee");

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    success(res, appointment);
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/appointments
const createAppointment = async (req, res, next) => {
  try {
    const { doctorId, hospitalId, appointmentDate, timeSlot, reason } =
      req.body;

    // Check for double booking
    const existing = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      status: { $ne: "cancelled" },
    });

    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "This time slot is already booked." });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      hospitalId,
      appointmentDate,
      timeSlot,
      reason,
    });

    const populated = await Appointment.findById(appointment._id)
      .populate("patientId", "name email phone")
      .populate("hospitalId", "name")
      .populate("doctorId", "name");

    created(res, populated, "Appointment booked successfully");
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/appointments/:id
const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    const { status, notes } = req.body;
    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;
    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate("patientId", "name email phone")
      .populate("hospitalId", "name")
      .populate("doctorId", "name");

    success(res, updated, "Appointment updated successfully");
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/appointments/:id/cancel
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    if (appointment.status === "cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Appointment already cancelled." });
    }

    if (appointment.status === "completed") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot cancel a completed appointment.",
        });
    }

    // Patient can only cancel their own appointments
    if (
      req.user.role === "patient" &&
      String(appointment.patientId) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    }

    appointment.status = "cancelled";
    await appointment.save();

    success(res, appointment, "Appointment cancelled successfully");
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/patients/:patientId/appointments
const getAppointmentsByPatient = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const query = { patientId: req.params.patientId };
    if (status) {
      const statuses = status.split(",");
      query.status = statuses.length > 1 ? { $in: statuses } : status;
    }

    // Text search on doctor/hospital names
    if (search) {
      const regex = new RegExp(search, "i");
      const [matchingDoctors, matchingHospitals] = await Promise.all([
        Doctor.find({ name: regex }).select("_id").lean(),
        Hospital.find({ name: regex }).select("_id").lean(),
      ]);
      query.$or = [
        { doctorId: { $in: matchingDoctors.map((d) => d._id) } },
        { hospitalId: { $in: matchingHospitals.map((h) => h._id) } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate("hospitalId", "name")
      .populate("doctorId", "name specialtyId")
      .sort({ appointmentDate: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    paginated(res, appointments, {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/doctors/:doctorId/appointments
const getAppointmentsByDoctor = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { doctorId: req.params.doctorId };
    if (status) query.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate("patientId", "name email phone")
      .populate("hospitalId", "name")
      .sort({ appointmentDate: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    paginated(res, appointments, {
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
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
};
