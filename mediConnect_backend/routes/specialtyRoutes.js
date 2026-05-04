const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const validate = require("../middleware/validate");
const { specialtyValidator } = require("../validators/specialtyValidator");
const {
  getSpecialties,
  getSpecialtyById,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
} = require("../controllers/specialtyController");
const { getDoctorsBySpecialty } = require("../controllers/doctorController");

/**
 * @swagger
 * /specialties:
 *   get:
 *     tags: [Specialties]
 *     summary: List all specialties
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *     responses:
 *       200:
 *         description: List of specialties
 */
router.get("/", getSpecialties);

/**
 * @swagger
 * /specialties/{id}:
 *   get:
 *     tags: [Specialties]
 *     summary: Get specialty by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Specialty details
 *       404:
 *         description: Specialty not found
 */
router.get("/:id", getSpecialtyById);

/**
 * @swagger
 * /specialties/{specialtyId}/doctors:
 *   get:
 *     tags: [Specialties]
 *     summary: List doctors by specialty
 *     parameters:
 *       - in: path
 *         name: specialtyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of doctors
 */
router.get("/:specialtyId/doctors", getDoctorsBySpecialty);

/**
 * @swagger
 * /specialties:
 *   post:
 *     tags: [Specialties]
 *     summary: Create a specialty (Super Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cardiology
 *               description:
 *                 type: string
 *                 example: Heart and cardiovascular system
 *     responses:
 *       201:
 *         description: Specialty created
 *       409:
 *         description: Specialty name already exists
 */
router.post(
  "/",
  auth,
  roleCheck("super_admin"),
  specialtyValidator,
  validate,
  createSpecialty,
);

/**
 * @swagger
 * /specialties/{id}:
 *   put:
 *     tags: [Specialties]
 *     summary: Update a specialty (Super Admin)
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Specialty updated
 *       404:
 *         description: Specialty not found
 */
router.put(
  "/:id",
  auth,
  roleCheck("super_admin"),
  specialtyValidator,
  validate,
  updateSpecialty,
);

/**
 * @swagger
 * /specialties/{id}:
 *   delete:
 *     tags: [Specialties]
 *     summary: Delete a specialty (Super Admin)
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
 *         description: Specialty deleted
 *       404:
 *         description: Specialty not found
 */
router.delete("/:id", auth, roleCheck("super_admin"), deleteSpecialty);

module.exports = router;
