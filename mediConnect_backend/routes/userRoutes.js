const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { updateProfile } = require("../controllers/authController");

// PATCH /api/v1/users/profile
router.patch("/profile", auth, updateProfile);

module.exports = router;
