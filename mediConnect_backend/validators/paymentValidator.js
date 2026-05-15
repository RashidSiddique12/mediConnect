const { body } = require('express-validator')

const createOrderValidator = [
  body('doctorId').notEmpty().withMessage('Doctor is required').isMongoId(),
  body('hospitalId').notEmpty().withMessage('Hospital is required').isMongoId(),
  body('appointmentDate')
    .notEmpty()
    .withMessage('Appointment date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('timeSlot')
    .notEmpty()
    .withMessage('Time slot is required')
    .matches(/^\d{2}:\d{2}-\d{2}:\d{2}$/)
    .withMessage('Time slot must be in HH:MM-HH:MM format'),
  body('reason')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Reason must be at most 500 characters'),
]

const verifyPaymentValidator = [
  body('razorpayOrderId')
    .notEmpty()
    .withMessage('Razorpay order ID is required'),
  body('razorpayPaymentId')
    .notEmpty()
    .withMessage('Razorpay payment ID is required'),
  body('razorpaySignature')
    .notEmpty()
    .withMessage('Razorpay signature is required'),
  body('appointmentId')
    .notEmpty()
    .withMessage('Appointment ID is required')
    .isMongoId(),
]

module.exports = {
  createOrderValidator,
  verifyPaymentValidator,
}
