const { body } = require('express-validator')

const appointmentValidator = [
  body('doctorId')
    .notEmpty()
    .withMessage('Doctor is required')
    .isMongoId()
    .withMessage('Invalid doctor ID'),
  body('hospitalId')
    .notEmpty()
    .withMessage('Hospital is required')
    .isMongoId()
    .withMessage('Invalid hospital ID'),
  body('appointmentDate')
    .notEmpty()
    .withMessage('Appointment date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (new Date(value) < today) {
        throw new Error('Appointment date cannot be in the past')
      }
      return true
    }),
  body('timeSlot')
    .notEmpty()
    .withMessage('Time slot is required')
    .matches(/^\d{2}:\d{2}-\d{2}:\d{2}$/)
    .withMessage('Time slot must be in HH:MM-HH:MM format'),
  body('reason').optional().trim().isLength({ max: 500 }),
]

module.exports = { appointmentValidator };
