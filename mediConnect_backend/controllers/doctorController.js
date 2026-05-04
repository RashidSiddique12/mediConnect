const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const { success, created, paginated } = require("../utils/apiResponse");

// GET /api/v1/doctors
const getDoctors = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      specialtyId,
      hospitalId,
      gender,
    } = req.query;
    const query = { status: "active" };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (specialtyId) query.specialtyIds = specialtyId;
    if (hospitalId) query.hospitalId = hospitalId;
    if (gender) query.gender = gender;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Doctor.countDocuments(query);
    const doctors = await Doctor.find(query)
      .populate("hospitalId", "name address phone")
      .populate("specialtyIds", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    paginated(res, doctors, {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/doctors/my-hospital
const getMyHospitalDoctors = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ hospitalAdminId: req.user._id });
    if (!hospital) {
      return res
        .status(404)
        .json({ success: false, message: "No hospital found for this admin." });
    }

    const { page = 1, limit = 12, search, status, specialtyId } = req.query;
    const query = { hospitalId: hospital._id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { qualification: { $regex: search, $options: "i" } },
      ];
    }
    if (status) query.status = status;
    if (specialtyId) query.specialtyIds = specialtyId;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Doctor.countDocuments(query);
    const doctors = await Doctor.find(query)
      .populate("hospitalId", "name address phone")
      .populate("specialtyIds", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    paginated(res, doctors, {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/doctors/:id
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("hospitalId")
      .populate("specialtyIds");

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found." });
    }

    success(res, doctor);
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/doctors
const createDoctor = async (req, res, next) => {
  try {
    // Hospital admin can only add doctors to their own hospital
    if (req.user.role === "hospital_admin") {
      const hospital = await Hospital.findOne({
        hospitalAdminId: req.user._id,
      });
      if (!hospital) {
        return res
          .status(403)
          .json({
            success: false,
            message: "No hospital associated with your account.",
          });
      }
      req.body.hospitalId = hospital._id;
    }

    const doctor = await Doctor.create(req.body);

    const populated = await Doctor.findById(doctor._id)
      .populate(
        "hospitalId",
        "name type address phone email website operatingHours description logo",
      )
      .populate("specialtyIds", "name description");

    created(res, populated, "Doctor created successfully");
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/doctors/:id
const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found." });
    }

    // Hospital admin can only update their own hospital's doctors
    if (req.user.role === "hospital_admin") {
      const hospital = await Hospital.findOne({
        hospitalAdminId: req.user._id,
      });
      if (!hospital || String(doctor.hospitalId) !== String(hospital._id)) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied." });
      }
    }

    // Regenerate slug if name changed
    if (req.body.name && req.body.name !== doctor.name) {
      const base = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      req.body.slug = `${base}-${doctor._id.toString().slice(-6)}`;
    }

    const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate(
        "hospitalId",
        "name type address phone email website operatingHours description logo",
      )
      .populate("specialtyIds", "name description");

    success(res, updated, "Doctor updated successfully");
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/doctors/:id
const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found." });
    }

    // Hospital admin can only delete their own hospital's doctors
    if (req.user.role === "hospital_admin") {
      const hospital = await Hospital.findOne({
        hospitalAdminId: req.user._id,
      });
      if (!hospital || String(doctor.hospitalId) !== String(hospital._id)) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied." });
      }
    }

    await Doctor.findByIdAndDelete(req.params.id);
    success(res, null, "Doctor deleted successfully");
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/hospitals/:hospitalId/doctors
const getDoctorsByHospital = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({
      hospitalId: req.params.hospitalId,
      status: "active",
    }).populate("specialtyIds", "name");

    success(res, doctors);
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/specialties/:specialtyId/doctors
const getDoctorsBySpecialty = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({
      specialtyIds: req.params.specialtyId,
      status: "active",
    })
      .populate("hospitalId", "name address")
      .populate("specialtyIds", "name");

    success(res, doctors);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  getMyHospitalDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsByHospital,
  getDoctorsBySpecialty,
};
