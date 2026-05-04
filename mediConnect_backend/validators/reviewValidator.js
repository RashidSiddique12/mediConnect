const { body } = require("express-validator");

const reviewValidator = [
  body("doctorId")
    .notEmpty()
    .withMessage("Doctor is required")
    .isMongoId()
    .withMessage("Invalid doctor ID"),
  body("hospitalId")
    .notEmpty()
    .withMessage("Hospital is required")
    .isMongoId()
    .withMessage("Invalid hospital ID"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment").optional().trim().isLength({ max: 1000 }),
];

module.exports = { reviewValidator };
