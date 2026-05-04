const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const upload = require("../middleware/upload");
const {
  getPrescriptions,
  getPrescriptionById,
  uploadPrescription,
} = require("../controllers/prescriptionController");

/**
 * @swagger
 * /prescriptions:
 *   get:
 *     tags: [Prescriptions]
 *     summary: List prescriptions
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
 *     responses:
 *       200:
 *         description: Paginated list of prescriptions
 */
router.get("/", auth, getPrescriptions);

/**
 * @swagger
 * /prescriptions/{id}:
 *   get:
 *     tags: [Prescriptions]
 *     summary: Get prescription by ID
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
 *         description: Prescription details
 *       404:
 *         description: Prescription not found
 */
router.get("/:id", auth, getPrescriptionById);

/**
 * @swagger
 * /prescriptions/upload:
 *   post:
 *     tags: [Prescriptions]
 *     summary: Upload a prescription file (Hospital Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, appointmentId]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: JPEG, PNG, or PDF (max 5MB)
 *               appointmentId:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Prescription uploaded
 *       400:
 *         description: File required or invalid format
 *       404:
 *         description: Appointment not found
 */
router.post(
  "/upload",
  auth,
  roleCheck("hospital_admin"),
  upload.single("file"),
  uploadPrescription,
);

module.exports = router;
