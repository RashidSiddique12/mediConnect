const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const validate = require("../middleware/validate");
const {
  scheduleValidator,
  bulkScheduleValidator,
} = require("../validators/scheduleValidator");
const {
  getSchedules,
  createSchedule,
  createBulkSchedules,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");

/**
 * @swagger
 * /schedules:
 *   get:
 *     tags: [Schedules]
 *     summary: List all schedules (Hospital Admin / Super Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
 *         description: Filter by doctor ID
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of schedules
 */
router.get("/", auth, roleCheck("hospital_admin", "super_admin"), getSchedules);

/**
 * @swagger
 * /schedules:
 *   post:
 *     tags: [Schedules]
 *     summary: Create a doctor schedule for a specific date (Hospital Admin / Super Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctorId, date, startTime, endTime]
 *             properties:
 *               doctorId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Schedule date (YYYY-MM-DD)
 *               startTime:
 *                 type: string
 *                 example: '09:00'
 *               endTime:
 *                 type: string
 *                 example: '17:00'
 *               slotDuration:
 *                 type: integer
 *                 example: 30
 *                 description: Duration in minutes (5-120)
 *     responses:
 *       201:
 *         description: Schedule created
 *       409:
 *         description: Schedule already exists for this doctor on this date
 */
router.post(
  "/",
  auth,
  roleCheck("hospital_admin", "super_admin"),
  scheduleValidator,
  validate,
  createSchedule,
);

/**
 * @swagger
 * /schedules/bulk:
 *   post:
 *     tags: [Schedules]
 *     summary: Create schedules for multiple dates at once (Hospital Admin / Super Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctorId, dates, startTime, endTime]
 *             properties:
 *               doctorId:
 *                 type: string
 *               dates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date
 *               startTime:
 *                 type: string
 *                 example: '09:00'
 *               endTime:
 *                 type: string
 *                 example: '17:00'
 *               slotDuration:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: Bulk schedules created
 */
router.post(
  "/bulk",
  auth,
  roleCheck("hospital_admin", "super_admin"),
  bulkScheduleValidator,
  validate,
  createBulkSchedules,
);

/**
 * @swagger
 * /schedules/{id}:
 *   put:
 *     tags: [Schedules]
 *     summary: Update a schedule (Hospital Admin / Super Admin)
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
 *         description: Schedule updated
 *       404:
 *         description: Schedule not found
 */
router.put(
  "/:id",
  auth,
  roleCheck("hospital_admin", "super_admin"),
  scheduleValidator,
  validate,
  updateSchedule,
);

/**
 * @swagger
 * /schedules/{id}:
 *   delete:
 *     tags: [Schedules]
 *     summary: Delete a schedule (Hospital Admin / Super Admin)
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
 *         description: Schedule deleted
 *       404:
 *         description: Schedule not found
 */
router.delete(
  "/:id",
  auth,
  roleCheck("hospital_admin", "super_admin"),
  deleteSchedule,
);

module.exports = router;
