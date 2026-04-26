const { body } = require('express-validator');

const specialtyValidator = [
  body('name').trim().notEmpty().withMessage('Specialty name is required').isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
];

module.exports = { specialtyValidator };
