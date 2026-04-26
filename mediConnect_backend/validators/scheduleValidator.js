const { body } = require('express-validator');

const scheduleValidator = [
  body('doctorId').notEmpty().withMessage('Doctor is required').isMongoId().withMessage('Invalid doctor ID'),
  body('dayOfWeek').isInt({ min: 0, max: 6 }).withMessage('Day of week must be 0-6'),
  body('startTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Start time must be in HH:mm format'),
  body('endTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('End time must be in HH:mm format'),
  body('slotDuration').optional().isInt({ min: 5, max: 120 }).withMessage('Slot duration must be 5-120 minutes'),
];

module.exports = { scheduleValidator };
