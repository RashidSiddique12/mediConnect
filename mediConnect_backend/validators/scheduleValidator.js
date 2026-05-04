const { body } = require("express-validator");

const scheduleValidator = [
  body("doctorId")
    .notEmpty()
    .withMessage("Doctor is required")
    .isMongoId()
    .withMessage("Invalid doctor ID"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid date (YYYY-MM-DD)"),
  body("startTime")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Start time must be in HH:mm format"),
  body("endTime")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("End time must be in HH:mm format"),
  body("slotDuration")
    .optional()
    .isInt({ min: 5, max: 120 })
    .withMessage("Slot duration must be 5-120 minutes"),
];

const bulkScheduleValidator = [
  body("doctorId")
    .notEmpty()
    .withMessage("Doctor is required")
    .isMongoId()
    .withMessage("Invalid doctor ID"),
  body("dates")
    .isArray({ min: 1 })
    .withMessage("Dates must be a non-empty array"),
  body("dates.*")
    .isISO8601()
    .withMessage("Each date must be a valid date (YYYY-MM-DD)"),
  body("startTime")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Start time must be in HH:mm format"),
  body("endTime")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("End time must be in HH:mm format"),
  body("slotDuration")
    .optional()
    .isInt({ min: 5, max: 120 })
    .withMessage("Slot duration must be 5-120 minutes"),
];

module.exports = { scheduleValidator, bulkScheduleValidator };
