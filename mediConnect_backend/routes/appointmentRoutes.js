const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const validate = require('../middleware/validate');
const { appointmentValidator } = require('../validators/appointmentValidator');
const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { getPrescriptionByAppointment } = require('../controllers/prescriptionController');

/**
 * @swagger
 * /appointments:
 *   get:
 *     tags: [Appointments]
 *     summary: List appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [booked, completed, cancelled]
 *     responses:
 *       200:
 *         description: Paginated list of appointments
 */
router.get('/', auth, getAppointments);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     tags: [Appointments]
 *     summary: Get appointment by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment details
 *       404:
 *         description: Appointment not found
 */
router.get('/:id', auth, getAppointmentById);

/**
 * @swagger
 * /appointments:
 *   post:
 *     tags: [Appointments]
 *     summary: Book an appointment (Patient)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctorId, hospitalId, appointmentDate, timeSlot]
 *             properties:
 *               doctorId:
 *                 type: string
 *               hospitalId:
 *                 type: string
 *               appointmentDate:
 *                 type: string
 *                 format: date
 *                 example: '2026-04-30'
 *               timeSlot:
 *                 type: string
 *                 example: '09:00-09:30'
 *               reason:
 *                 type: string
 *                 example: Regular checkup
 *     responses:
 *       201:
 *         description: Appointment booked
 *       409:
 *         description: Time slot already booked
 */
router.post('/', auth, roleCheck('patient'), appointmentValidator, validate, createAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     tags: [Appointments]
 *     summary: Update appointment status (Hospital Admin / Super Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [booked, completed, cancelled]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated
 *       404:
 *         description: Appointment not found
 */
router.put('/:id', auth, roleCheck('hospital_admin', 'super_admin'), updateAppointment);

/**
 * @swagger
 * /appointments/{id}/cancel:
 *   patch:
 *     tags: [Appointments]
 *     summary: Cancel an appointment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment cancelled
 *       400:
 *         description: Cannot cancel (already cancelled or completed)
 *       403:
 *         description: Patients can only cancel own appointments
 */
router.patch('/:id/cancel', auth, cancelAppointment);

/**
 * @swagger
 * /appointments/{appointmentId}/prescription:
 *   get:
 *     tags: [Appointments]
 *     summary: Get prescription for an appointment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prescription details
 *       404:
 *         description: Prescription not found
 */
router.get('/:appointmentId/prescription', auth, getPrescriptionByAppointment);

module.exports = router;
