const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const {
  getStats,
  getUsers,
  getUserById,
  getHospitalStats,
  getPatientStats,
  toggleUserStatus,
} = require("../controllers/dashboardController");

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
router.get("/stats", auth, roleCheck("super_admin"), getStats);

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
router.get("/users", auth, roleCheck("super_admin"), getUsers);

/**
 * @swagger
 * /dashboard/users/{id}:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get user details by ID (Super Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details with role-specific data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [super_admin, hospital_admin, patient]
 *                     phone:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [active, inactive]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     hospital:
 *                       type: object
 *                       description: Included for hospital_admin users
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         city:
 *                           type: string
 *                         status:
 *                           type: string
 *                         totalDoctors:
 *                           type: integer
 *                     activity:
 *                       type: object
 *                       description: Included for patient users
 *                       properties:
 *                         totalAppointments:
 *                           type: integer
 *                         completedAppointments:
 *                           type: integer
 *                         upcomingAppointments:
 *                           type: integer
 *                         totalPrescriptions:
 *                           type: integer
 *                         totalReviews:
 *                           type: integer
 *       404:
 *         description: User not found
 */
router.get("/users/:id", auth, roleCheck("super_admin"), getUserById);
router.patch(
  "/users/:id/status",
  auth,
  roleCheck("super_admin"),
  toggleUserStatus,
);

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
router.get("/hospital", auth, roleCheck("hospital_admin"), getHospitalStats);

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
router.get("/patient", auth, roleCheck("patient"), getPatientStats);

module.exports = router;
