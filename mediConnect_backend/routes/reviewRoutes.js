const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const validate = require("../middleware/validate");
const { reviewValidator } = require("../validators/reviewValidator");
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  approveReview,
  rejectReview,
} = require("../controllers/reviewController");

/**
 * @swagger
 * /reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: List reviews
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
 *           enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Paginated list of reviews
 */
router.get("/", getReviews);

/**
 * @swagger
 * /reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Submit a review (Patient)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctorId, hospitalId, rating]
 *             properties:
 *               doctorId:
 *                 type: string
 *               hospitalId:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Excellent doctor!
 *     responses:
 *       201:
 *         description: Review submitted (status = pending)
 */
router.post(
  "/",
  auth,
  roleCheck("patient"),
  reviewValidator,
  validate,
  createReview,
);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     tags: [Reviews]
 *     summary: Update a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated
 *       403:
 *         description: Patients can only update own reviews
 *       404:
 *         description: Review not found
 */
router.put("/:id", auth, updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a review
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
 *         description: Review deleted
 *       404:
 *         description: Review not found
 */
router.delete("/:id", auth, deleteReview);

/**
 * @swagger
 * /reviews/{id}/approve:
 *   patch:
 *     tags: [Reviews]
 *     summary: Approve a review (Super Admin)
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
 *         description: Review approved
 *       404:
 *         description: Review not found
 */
router.patch("/:id/approve", auth, roleCheck("super_admin"), approveReview);

/**
 * @swagger
 * /reviews/{id}/reject:
 *   patch:
 *     tags: [Reviews]
 *     summary: Reject a review (Super Admin)
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
 *         description: Review rejected
 *       404:
 *         description: Review not found
 */
router.patch("/:id/reject", auth, roleCheck("super_admin"), rejectReview);

module.exports = router;
