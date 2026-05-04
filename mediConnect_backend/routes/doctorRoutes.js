const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const validate = require("../middleware/validate");
const { doctorValidator } = require("../validators/doctorValidator");
const {
  getDoctors,
  getDoctorById,
  getMyHospitalDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const {
  getSchedulesByDoctor,
  getAvailableSlots,
} = require("../controllers/scheduleController");
const {
  getAppointmentsByDoctor,
} = require("../controllers/appointmentController");
const { getReviewsByDoctor } = require("../controllers/reviewController");

/**
 * @swagger
 * /doctors:
 *   get:
 *     tags: [Doctors]
 *     summary: List all active doctors
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by doctor name
 *       - in: query
 *         name: specialtyId
 *         schema:
 *           type: string
 *         description: Filter by specialty ObjectId
 *       - in: query
 *         name: hospitalId
 *         schema:
 *           type: string
 *         description: Filter by hospital ObjectId
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [male, female, other]
 *     responses:
 *       200:
 *         description: Paginated list of doctors
 */
router.get("/", getDoctors);

/**
 * @swagger
 * /doctors/my-hospital:
 *   get:
 *     tags: [Doctors]
 *     summary: List doctors of the authenticated hospital admin's hospital
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of doctors
 *       404:
 *         description: No hospital found for this admin
 */
router.get(
  "/my-hospital",
  auth,
  roleCheck("hospital_admin"),
  getMyHospitalDoctors,
);

/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     tags: [Doctors]
 *     summary: Get doctor by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor details
 *       404:
 *         description: Doctor not found
 */
router.get("/:id", getDoctorById);

/**
 * @swagger
 * /doctors/{doctorId}/schedules:
 *   get:
 *     tags: [Doctors]
 *     summary: List schedules of a doctor
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of active schedules
 */
router.get("/:doctorId/schedules", getSchedulesByDoctor);

/**
 * @swagger
 * /doctors/{doctorId}/slots:
 *   get:
 *     tags: [Doctors]
 *     summary: Get available time slots for a specific date
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: List of time slots with availability
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       time:
 *                         type: string
 *                         example: '09:00-09:30'
 *                       isAvailable:
 *                         type: boolean
 */
router.get("/:doctorId/slots", getAvailableSlots);

/**
 * @swagger
 * /doctors/{doctorId}/reviews:
 *   get:
 *     tags: [Doctors]
 *     summary: List approved reviews of a doctor
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of approved reviews
 */
router.get("/:doctorId/reviews", getReviewsByDoctor);

/**
 * @swagger
 * /doctors/{doctorId}/appointments:
 *   get:
 *     tags: [Doctors]
 *     summary: List appointments of a doctor (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [booked, completed, cancelled]
 *     responses:
 *       200:
 *         description: Paginated appointments
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/:doctorId/appointments",
  auth,
  roleCheck("super_admin", "hospital_admin"),
  getAppointmentsByDoctor,
);

/**
 * @swagger
 * /doctors:
 *   post:
 *     tags: [Doctors]
 *     summary: Create a doctor (Hospital Admin / Super Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, specialtyIds]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dr. Smith
 *               specialtyIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['specialtyId1', 'specialtyId2']
 *               experience:
 *                 type: number
 *                 example: 10
 *               consultationFee:
 *                 type: number
 *                 example: 500
 *               qualification:
 *                 type: string
 *                 example: MBBS, MD
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor created
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  auth,
  roleCheck("hospital_admin", "super_admin"),
  doctorValidator,
  validate,
  createDoctor,
);

/**
 * @swagger
 * /doctors/{id}:
 *   put:
 *     tags: [Doctors]
 *     summary: Update a doctor (Hospital Admin / Super Admin)
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
 *               name:
 *                 type: string
 *               specialtyIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               experience:
 *                 type: number
 *               consultationFee:
 *                 type: number
 *               qualification:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor updated
 *       403:
 *         description: Access denied
 *       404:
 *         description: Doctor not found
 */
router.put(
  "/:id",
  auth,
  roleCheck("hospital_admin", "super_admin"),
  doctorValidator,
  validate,
  updateDoctor,
);

/**
 * @swagger
 * /doctors/{id}:
 *   delete:
 *     tags: [Doctors]
 *     summary: Delete a doctor (Hospital Admin / Super Admin)
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
 *         description: Doctor deleted
 *       403:
 *         description: Access denied
 *       404:
 *         description: Doctor not found
 */
router.delete(
  "/:id",
  auth,
  roleCheck("hospital_admin", "super_admin"),
  deleteDoctor,
);

module.exports = router;
