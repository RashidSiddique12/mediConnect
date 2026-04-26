const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { getStats, getUsers, getHospitalStats, getPatientStats } = require('../controllers/dashboardController');

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard statistics (Super Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalHospitals:
 *                       type: integer
 *                     totalDoctors:
 *                       type: integer
 *                     totalPatients:
 *                       type: integer
 *                     totalAppointments:
 *                       type: integer
 *                     activeHospitals:
 *                       type: integer
 *                     recentAppointments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Appointment'
 */
router.get('/stats', auth, roleCheck('super_admin'), getStats);

/**
 * @swagger
 * /dashboard/users:
 *   get:
 *     tags: [Dashboard]
 *     summary: List all users (Super Admin)
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
 *         name: role
 *         schema:
 *           type: string
 *           enum: [super_admin, hospital_admin, patient]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name
 *     responses:
 *       200:
 *         description: Paginated list of users
 */
router.get('/users', auth, roleCheck('super_admin'), getUsers);

/**
 * @swagger
 * /dashboard/hospital:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get hospital dashboard statistics (Hospital Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hospital dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     hospital:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     stats:
 *                       type: object
 *                       properties:
 *                         totalDoctors:
 *                           type: integer
 *                         totalAppointments:
 *                           type: integer
 *                         todayAppointments:
 *                           type: integer
 *                         pendingAppointments:
 *                           type: integer
 *                         completedAppointments:
 *                           type: integer
 *                         totalPatients:
 *                           type: integer
 *                     recentAppointments:
 *                       type: array
 *                     doctors:
 *                       type: array
 */
router.get('/hospital', auth, roleCheck('hospital_admin'), getHospitalStats);

/**
 * @swagger
 * /dashboard/patient:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get patient dashboard stats and upcoming appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         upcomingAppointments:
 *                           type: integer
 *                         completedAppointments:
 *                           type: integer
 *                         prescriptions:
 *                           type: integer
 *                         reviews:
 *                           type: integer
 *                     appointments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Appointment'
 */
router.get('/patient', auth, roleCheck('patient'), getPatientStats);

module.exports = router;
