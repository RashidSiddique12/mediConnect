const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const roleCheck = require('../middleware/roleCheck')
const validate = require('../middleware/validate')
const {
  createOrderValidator,
  verifyPaymentValidator,
} = require('../validators/paymentValidator')
const {
  createOrder,
  verifyPayment,
  refundPayment,
  getPaymentByAppointment,
} = require('../controllers/paymentController')

// Patient creates a payment order (replaces direct appointment booking)
router.post(
  '/create-order',
  auth,
  roleCheck('patient'),
  createOrderValidator,
  validate,
  createOrder,
)

// Patient verifies payment after Razorpay checkout
router.post(
  '/verify',
  auth,
  roleCheck('patient'),
  verifyPaymentValidator,
  validate,
  verifyPayment,
)

// Refund — accessible by admin or the patient themselves
router.post(
  '/refund',
  auth,
  roleCheck('patient', 'hospital_admin', 'super_admin'),
  refundPayment,
)

// Get payment info for an appointment
router.get('/:appointmentId', auth, getPaymentByAppointment)

module.exports = router
