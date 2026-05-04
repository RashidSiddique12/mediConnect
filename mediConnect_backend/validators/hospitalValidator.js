const { body } = require("express-validator");

const hospitalValidator = [
  body("name").trim().notEmpty().withMessage("Hospital name is required"),
  body("type")
    .optional()
    .isIn(["general", "specialty", "clinic", "diagnostic_center"])
    .withMessage("Invalid hospital type"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ min: 7 })
    .withMessage("Phone must be at least 7 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("website")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Invalid website URL"),
  body("emergencyContact").optional({ values: "falsy" }).trim(),
  body("registrationNumber").optional({ values: "falsy" }).trim(),
  body("address.street").optional().trim(),
  body("address.city").trim().notEmpty().withMessage("City is required"),
  body("address.state").optional().trim(),
  body("address.zipCode").optional().trim(),
  body("description").optional().trim().isLength({ max: 1000 }),
  body("specialties").optional().isArray(),
  body("specialties.*")
    .optional()
    .isMongoId()
    .withMessage("Invalid specialty ID"),
  body("operatingHours.open").optional().trim(),
  body("operatingHours.close").optional().trim(),
  body("operatingHours.is24x7").optional().isBoolean(),
  body("facilities").optional().isArray(),
  body("facilities.*").optional().trim(),
  body("insurancePanels").optional().isArray(),
  body("insurancePanels.*").optional().trim(),
  // Inline admin creation fields
  body("admin.name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Admin name must be at least 2 characters"),
  body("admin.email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Valid admin email is required")
    .normalizeEmail(),
  body("admin.password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Admin password must be at least 6 characters"),
  body("admin.phone").optional().trim(),
];

module.exports = { hospitalValidator };
