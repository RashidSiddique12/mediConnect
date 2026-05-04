const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAppointmentsByPatient,
} = require("../controllers/appointmentController");
const {
  getPrescriptionsByPatient,
} = require("../controllers/prescriptionController");

/**
 * @swagger
 * /patients/{patientId}/appointments:
 *   get:
 *     tags: [Patients]
 *     summary: List appointments of a patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Paginated patient appointments
 */
router.get("/:patientId/appointments", auth, getAppointmentsByPatient);

/**
 * @swagger
 * /patients/{patientId}/prescriptions:
 *   get:
 *     tags: [Patients]
 *     summary: List prescriptions of a patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of patient prescriptions
 */
router.get("/:patientId/prescriptions", auth, getPrescriptionsByPatient);

module.exports = router;
