const Schedule = require('../models/Schedule');
const Appointment = require('../models/Appointment');
const { success, created } = require('../utils/apiResponse');

// GET /api/v1/schedules
const getSchedules = async (req, res, next) => {
  try {
    const schedules = await Schedule.find().populate('doctorId', 'name');
    success(res, schedules);
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/schedules
const createSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.create(req.body);
    const populated = await Schedule.findById(schedule._id).populate('doctorId', 'name');
    created(res, populated, 'Schedule created successfully');
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/schedules/:id
const updateSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('doctorId', 'name');

    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found.' });
    }
    success(res, schedule, 'Schedule updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/schedules/:id
const deleteSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found.' });
    }
    success(res, null, 'Schedule deleted successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/doctors/:doctorId/schedules
const getSchedulesByDoctor = async (req, res, next) => {
  try {
    const schedules = await Schedule.find({ doctorId: req.params.doctorId, isActive: true })
      .sort({ dayOfWeek: 1 });
    success(res, schedules);
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/doctors/:doctorId/slots?date=YYYY-MM-DD
const getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date query parameter is required.' });
    }

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    // Get schedule for that day
    const schedule = await Schedule.findOne({ doctorId, dayOfWeek, isActive: true });
    if (!schedule) {
      return success(res, [], 'No schedule available for this day.');
    }

    // Generate all slots
    const allSlots = generateTimeSlots(schedule.startTime, schedule.endTime, schedule.slotDuration);

    // Get booked slots for that date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelled' },
    });

    const bookedSlots = bookedAppointments.map((a) => a.timeSlot);

    // Mark slots as available or booked
    const slots = allSlots.map((slot) => ({
      time: slot,
      isAvailable: !bookedSlots.includes(slot),
    }));

    success(res, slots);
  } catch (error) {
    next(error);
  }
};

// Helper: Generate time slots from start to end
function generateTimeSlots(startTime, endTime, durationMinutes) {
  const slots = [];
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  let current = startH * 60 + startM;
  const end = endH * 60 + endM;

  while (current + durationMinutes <= end) {
    const slotStart = `${String(Math.floor(current / 60)).padStart(2, '0')}:${String(current % 60).padStart(2, '0')}`;
    const slotEnd = `${String(Math.floor((current + durationMinutes) / 60)).padStart(2, '0')}:${String((current + durationMinutes) % 60).padStart(2, '0')}`;
    slots.push(`${slotStart}-${slotEnd}`);
    current += durationMinutes;
  }

  return slots;
}

module.exports = {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedulesByDoctor,
  getAvailableSlots,
};
