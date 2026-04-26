const { body } = require('express-validator');

const doctorValidator = [
  body('name').trim().notEmpty().withMessage('Doctor name is required'),
  body('specialtyIds').isArray({ min: 1 }).withMessage('At least one specialty is required'),
  body('specialtyIds.*').isMongoId().withMessage('Invalid specialty ID'),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('consultationFee').optional().isFloat({ min: 0 }).withMessage('Fee must be a positive number'),
  body('qualification').optional().trim(),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('bio').optional().trim().isLength({ max: 1000 }),
];

module.exports = { doctorValidator };
