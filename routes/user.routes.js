const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
  validateRoleUpdate,
  validateStatusUpdate,
  validateNumericIdParam,
} = require("../middleware/validation");
const {
  listUsers,
  updateRole,
  updateStatus,
} = require("../controllers/user.controller");

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));
router.get("/", listUsers);
router.patch("/:id/role", validateNumericIdParam(), validateRoleUpdate, updateRole);
router.patch("/:id/status", validateNumericIdParam(), validateStatusUpdate, updateStatus);

module.exports = { router };
