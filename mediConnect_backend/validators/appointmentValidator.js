const { body } = require("express-validator");

const appointmentValidator = [
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
  body("appointmentDate")
    .notEmpty()
    .withMessage("Appointment date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("timeSlot").notEmpty().withMessage("Time slot is required"),
  body("reason").optional().trim().isLength({ max: 500 }),
];

module.exports = { appointmentValidator };
