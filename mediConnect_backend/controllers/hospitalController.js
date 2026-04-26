const Hospital = require('../models/Hospital');
const User = require('../models/User');
const { success, created, paginated } = require('../utils/apiResponse');

// GET /api/v1/hospitals
const getHospitals = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Hospital.countDocuments(query);
    const hospitals = await Hospital.find(query)
      .populate('specialties', 'name')
      .populate('hospitalAdminId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    paginated(res, hospitals, {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/hospitals/:id
const getHospitalById = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id)
      .populate('specialties', 'name')
      .populate('hospitalAdminId', 'name email');

    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found.' });
    }

    success(res, hospital);
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/hospitals
const createHospital = async (req, res, next) => {
  try {
    const {
      name, type, address, phone, email, website, emergencyContact,
      registrationNumber, description, specialties, hospitalAdminId,
      operatingHours, facilities, insurancePanels,
      admin,
    } = req.body;

    let assignedAdminId = hospitalAdminId || null;

    // Inline admin creation: create a hospital_admin user if admin block is provided
    if (admin && admin.email) {
      const existingUser = await User.findOne({ email: admin.email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Admin email already in use.' });
      }
      const adminUser = await User.create({
        name: admin.name,
        email: admin.email,
        password: admin.password,
        phone: admin.phone || '',
        role: 'hospital_admin',
      });
      assignedAdminId = adminUser._id;
    }

    // If hospitalAdminId provided directly, validate it's a hospital_admin
    if (hospitalAdminId && !admin) {
      const adminUser = await User.findById(hospitalAdminId);
      if (!adminUser || adminUser.role !== 'hospital_admin') {
        return res.status(400).json({ success: false, message: 'Invalid hospital admin user.' });
      }
    }

    const hospital = await Hospital.create({
      name, type, address, phone, email, website, emergencyContact,
      registrationNumber, description, specialties,
      hospitalAdminId: assignedAdminId,
      operatingHours, facilities, insurancePanels,
    });

    const populated = await Hospital.findById(hospital._id)
      .populate('specialties', 'name')
      .populate('hospitalAdminId', 'name email');

    created(res, populated, 'Hospital created successfully');
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/hospitals/:id
const updateHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found.' });
    }

    // Hospital admin can only update their own hospital
    if (req.user.role === 'hospital_admin' && String(hospital.hospitalAdminId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const updated = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('specialties', 'name')
      .populate('hospitalAdminId', 'name email');

    success(res, updated, 'Hospital updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/hospitals/:id
const deleteHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found.' });
    }

    success(res, null, 'Hospital deleted successfully');
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/hospitals/:id/status
const toggleHospitalStatus = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found.' });
    }

    hospital.status = hospital.status === 'active' ? 'inactive' : 'active';
    await hospital.save();

    success(res, hospital, `Hospital ${hospital.status === 'active' ? 'activated' : 'deactivated'} successfully`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital,
  toggleHospitalStatus,
};
