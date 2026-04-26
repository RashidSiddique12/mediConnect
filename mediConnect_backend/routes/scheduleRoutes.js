const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const validate = require('../middleware/validate');
const { scheduleValidator } = require('../validators/scheduleValidator');
const {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require('../controllers/scheduleController');

/**
 * @swagger
 * /schedules:
 *   get:
 *     tags: [Schedules]
 *     summary: List all schedules (Hospital Admin / Super Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of schedules
 */
router.get('/', auth, roleCheck('hospital_admin', 'super_admin'), getSchedules);

/**
 * @swagger
 * /schedules:
 *   post:
 *     tags: [Schedules]
 *     summary: Create a doctor schedule (Hospital Admin / Super Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctorId, dayOfWeek, startTime, endTime]
 *             properties:
 *               doctorId:
 *                 type: string
 *               dayOfWeek:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *                 description: 0=Sunday, 6=Saturday
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
 *         description: Schedule already exists for this doctor on this day
 */
router.post('/', auth, roleCheck('hospital_admin', 'super_admin'), scheduleValidator, validate, createSchedule);

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       200:
 *         description: Schedule updated
 *       404:
 *         description: Schedule not found
 */
router.put('/:id', auth, roleCheck('hospital_admin', 'super_admin'), scheduleValidator, validate, updateSchedule);

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
router.delete('/:id', auth, roleCheck('hospital_admin', 'super_admin'), deleteSchedule);

module.exports = router;
