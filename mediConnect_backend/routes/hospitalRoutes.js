const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const validate = require('../middleware/validate');
const { hospitalValidator } = require('../validators/hospitalValidator');
const {
  getHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital,
  toggleHospitalStatus,
} = require('../controllers/hospitalController');
const { getDoctorsByHospital } = require('../controllers/doctorController');
const { getReviewsByHospital } = require('../controllers/reviewController');

/**
 * @swagger
 * /hospitals:
 *   get:
 *     tags: [Hospitals]
 *     summary: List all hospitals
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
 *         description: Search by hospital name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Paginated list of hospitals
 */
router.get('/', getHospitals);

/**
 * @swagger
 * /hospitals/{id}:
 *   get:
 *     tags: [Hospitals]
 *     summary: Get hospital by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hospital details
 *       404:
 *         description: Hospital not found
 */
router.get('/:id', getHospitalById);

/**
 * @swagger
 * /hospitals/{hospitalId}/doctors:
 *   get:
 *     tags: [Hospitals]
 *     summary: List doctors of a hospital
 *     parameters:
 *       - in: path
 *         name: hospitalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of doctors
 */
router.get('/:hospitalId/doctors', getDoctorsByHospital);

/**
 * @swagger
 * /hospitals/{hospitalId}/reviews:
 *   get:
 *     tags: [Hospitals]
 *     summary: List approved reviews of a hospital
 *     parameters:
 *       - in: path
 *         name: hospitalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of approved reviews
 */
router.get('/:hospitalId/reviews', getReviewsByHospital);

/**
 * @swagger
 * /hospitals:
 *   post:
 *     tags: [Hospitals]
 *     summary: Create a hospital (Super Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, email]
 *             properties:
 *               name:
 *                 type: string
 *                 example: City Hospital
 *               phone:
 *                 type: string
 *                 example: '1234567890'
 *               email:
 *                 type: string
 *                 format: email
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *               description:
 *                 type: string
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *               hospitalAdminId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hospital created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', auth, roleCheck('super_admin'), hospitalValidator, validate, createHospital);

/**
 * @swagger
 * /hospitals/{id}:
 *   delete:
 *     tags: [Hospitals]
 *     summary: Delete a hospital (Super Admin)
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
 *         description: Hospital deleted
 *       404:
 *         description: Hospital not found
 */
router.delete('/:id', auth, roleCheck('super_admin'), deleteHospital);

/**
 * @swagger
 * /hospitals/{id}/status:
 *   patch:
 *     tags: [Hospitals]
 *     summary: Toggle hospital active/inactive status (Super Admin)
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
 *         description: Status toggled
 *       404:
 *         description: Hospital not found
 */
router.patch('/:id/status', auth, roleCheck('super_admin'), toggleHospitalStatus);

/**
 * @swagger
 * /hospitals/{id}:
 *   put:
 *     tags: [Hospitals]
 *     summary: Update a hospital (Super Admin or Hospital Admin)
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
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: object
 *               description:
 *                 type: string
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Hospital updated
 *       403:
 *         description: Access denied
 *       404:
 *         description: Hospital not found
 */
router.put('/:id', auth, roleCheck('super_admin', 'hospital_admin'), hospitalValidator, validate, updateHospital);

module.exports = router;
