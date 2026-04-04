const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const { getSummary } = require("../controllers/dashboard.controller");

const router = express.Router();

router.get(
  "/summary",
  authenticate,
  authorize("ADMIN", "ANALYST", "VIEWER"),
  getSummary
);

module.exports = { router };
