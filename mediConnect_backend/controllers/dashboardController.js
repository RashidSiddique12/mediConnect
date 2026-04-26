const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { success } = require('../utils/apiResponse');

// GET /api/v1/dashboard/stats
const getStats = async (req, res, next) => {
  try {
    const [totalHospitals, totalDoctors, totalPatients, totalAppointments, activeHospitals] =
      await Promise.all([
        Hospital.countDocuments(),
        Doctor.countDocuments(),
        User.countDocuments({ role: 'patient' }),
        Appointment.countDocuments(),
        Hospital.countDocuments({ status: 'active' }),
      ]);

    const recentAppointments = await Appointment.find()
      .populate('patientId', 'name')
      .populate('doctorId', 'name')
      .populate('hospitalId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const hospitalDocs = await Hospital.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const hospitals = await Promise.all(
      hospitalDocs.map(async (h) => {
        const totalDocs = await Doctor.countDocuments({ hospitalId: h._id });
        return {
          id: h._id,
          name: h.name,
          city: h.address?.city || '',
          totalDoctors: totalDocs,
          rating: 0,
        };
      })
    );

    const formatted = recentAppointments.map((a) => ({
      id: a._id,
      patientName: a.patientId?.name || 'N/A',
      doctorName: a.doctorId?.name || 'N/A',
      date: a.appointmentDate,
      status: a.status,
    }));

    success(res, {
      stats: {
        totalHospitals,
        totalDoctors,
        totalPatients,
        totalAppointments,
        activeHospitals,
      },
      recentAppointments: formatted,
      hospitals,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/dashboard/users
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.name = { $regex: search, $options: 'i' };

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const { paginated } = require('../utils/apiResponse');
    paginated(res, users, {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/dashboard/hospital
const getHospitalStats = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ hospitalAdminId: req.user._id });
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found for this admin.' });
    }

    const hospitalId = hospital._id;

    const [totalDoctors, totalAppointments, todayAppointments, pendingAppointments, completedAppointments] =
      await Promise.all([
        Doctor.countDocuments({ hospitalId, status: 'active' }),
        Appointment.countDocuments({ hospitalId }),
        Appointment.countDocuments({
          hospitalId,
          appointmentDate: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        }),
        Appointment.countDocuments({ hospitalId, status: 'booked' }),
        Appointment.countDocuments({ hospitalId, status: 'completed' }),
      ]);

    const totalPatients = await Appointment.distinct('patientId', { hospitalId });

    const recentAppointments = await Appointment.find({ hospitalId })
      .populate('patientId', 'name')
      .populate('doctorId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const doctors = await Doctor.find({ hospitalId, status: 'active' })
      .populate('specialtyIds', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    success(res, {
      hospital: { _id: hospital._id, name: hospital.name },
      stats: {
        totalDoctors,
        totalAppointments,
        todayAppointments,
        pendingAppointments,
        completedAppointments,
        totalPatients: totalPatients.length,
      },
      recentAppointments: recentAppointments.map((a) => ({
        id: a._id,
        patientName: a.patientId?.name || 'N/A',
        doctorName: a.doctorId?.name || 'N/A',
        date: a.appointmentDate,
        time: a.timeSlot,
        status: a.status,
      })),
      doctors: doctors.map((d) => ({
        id: d._id,
        name: d.name,
        specialty: d.specialtyIds?.[0]?.name || 'General',
        fee: d.consultationFee || 0,
        experience: d.experience || 0,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/dashboard/patient
const getPatientStats = async (req, res, next) => {
  try {
    const patientId = req.user._id

    const [upcomingAppointments, completedAppointments, totalPrescriptions, totalReviews] =
      await Promise.all([
        Appointment.countDocuments({ patientId, status: 'booked' }),
        Appointment.countDocuments({ patientId, status: 'completed' }),
        require('../models/Prescription').countDocuments({ patientId }),
        require('../models/Review').countDocuments({ patientId }),
      ])

    const recentAppointments = await Appointment.find({
      patientId,
      status: 'booked',
      appointmentDate: { $gte: new Date() },
    })
      .populate('doctorId', 'name specialtyIds')
      .populate('hospitalId', 'name')
      .sort({ appointmentDate: 1 })
      .limit(5)
      .lean()

    // Populate specialty names for each appointment's doctor
    const Specialty = require('../models/Specialty')
    const appointments = await Promise.all(
      recentAppointments.map(async (a) => {
        let specialty = 'General'
        if (a.doctorId?.specialtyIds?.length) {
          const spec = await Specialty.findById(a.doctorId.specialtyIds[0]).lean()
          if (spec) specialty = spec.name
        }
        return {
          id: a._id,
          doctorName: a.doctorId?.name || 'N/A',
          hospitalName: a.hospitalId?.name || 'N/A',
          specialty,
          date: a.appointmentDate,
          time: a.timeSlot,
          status: a.status,
        }
      }),
    )

    success(res, {
      stats: {
        upcomingAppointments,
        completedAppointments,
        prescriptions: totalPrescriptions,
        reviews: totalReviews,
      },
      appointments,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getStats, getUsers, getHospitalStats, getPatientStats };
