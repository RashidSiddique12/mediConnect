const { body } = require("express-validator");

const prescriptionValidator = [
  body("appointmentId")
    .notEmpty()
    .withMessage("Appointment is required")
    .isMongoId()
    .withMessage("Invalid appointment ID"),
  body("notes").optional().trim().isLength({ max: 1000 }),
];

module.exports = { prescriptionValidator };
