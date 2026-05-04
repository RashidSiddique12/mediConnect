const Specialty = require("../models/Specialty");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const { success, created, paginated } = require("../utils/apiResponse");

// GET /api/v1/specialties
const getSpecialties = async (req, res, next) => {
  try {
    const { status, search, page, limit } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const usePagination = page || limit;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [total, specialties, doctorCounts, hospitalCounts] =
      await Promise.all([
        usePagination ? Specialty.countDocuments(query) : Promise.resolve(0),
        usePagination
          ? Specialty.find(query)
              .sort({ name: 1 })
              .skip(skip)
              .limit(limitNum)
              .lean()
          : Specialty.find(query).sort({ name: 1 }).lean(),
        Doctor.aggregate([
          { $unwind: "$specialtyIds" },
          { $group: { _id: "$specialtyIds", count: { $sum: 1 } } },
        ]),
        Hospital.aggregate([
          { $unwind: "$specialties" },
          { $group: { _id: "$specialties", count: { $sum: 1 } } },
        ]),
      ]);

    const doctorMap = {};
    doctorCounts.forEach((d) => {
      doctorMap[d._id.toString()] = d.count;
    });

    const hospitalMap = {};
    hospitalCounts.forEach((h) => {
      hospitalMap[h._id.toString()] = h.count;
    });

    const result = specialties.map((s) => ({
      ...s,
      totalDoctors: doctorMap[s._id.toString()] || 0,
      totalHospitals: hospitalMap[s._id.toString()] || 0,
    }));

    if (usePagination) {
      paginated(res, result, {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      });
    } else {
      success(res, result);
    }
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/specialties/:id
const getSpecialtyById = async (req, res, next) => {
  try {
    const specialty = await Specialty.findById(req.params.id);
    if (!specialty) {
      return res
        .status(404)
        .json({ success: false, message: "Specialty not found." });
    }
    success(res, specialty);
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/specialties
const createSpecialty = async (req, res, next) => {
  try {
    const specialty = await Specialty.create(req.body);
    created(res, specialty, "Specialty created successfully");
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/specialties/:id
const updateSpecialty = async (req, res, next) => {
  try {
    const specialty = await Specialty.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!specialty) {
      return res
        .status(404)
        .json({ success: false, message: "Specialty not found." });
    }
    success(res, specialty, "Specialty updated successfully");
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/specialties/:id
const deleteSpecialty = async (req, res, next) => {
  try {
    const specialty = await Specialty.findByIdAndDelete(req.params.id);
    if (!specialty) {
      return res
        .status(404)
        .json({ success: false, message: "Specialty not found." });
    }
    success(res, null, "Specialty deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSpecialties,
  getSpecialtyById,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
};
