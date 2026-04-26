const Specialty = require('../models/Specialty');
const { success, created } = require('../utils/apiResponse');

// GET /api/v1/specialties
const getSpecialties = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const specialties = await Specialty.find(query).sort({ name: 1 });
    success(res, specialties);
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/specialties/:id
const getSpecialtyById = async (req, res, next) => {
  try {
    const specialty = await Specialty.findById(req.params.id);
    if (!specialty) {
      return res.status(404).json({ success: false, message: 'Specialty not found.' });
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
    created(res, specialty, 'Specialty created successfully');
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/specialties/:id
const updateSpecialty = async (req, res, next) => {
  try {
    const specialty = await Specialty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!specialty) {
      return res.status(404).json({ success: false, message: 'Specialty not found.' });
    }
    success(res, specialty, 'Specialty updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/specialties/:id
const deleteSpecialty = async (req, res, next) => {
  try {
    const specialty = await Specialty.findByIdAndDelete(req.params.id);
    if (!specialty) {
      return res.status(404).json({ success: false, message: 'Specialty not found.' });
    }
    success(res, null, 'Specialty deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getSpecialties, getSpecialtyById, createSpecialty, updateSpecialty, deleteSpecialty };
