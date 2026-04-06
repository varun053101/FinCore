const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const { getSummary } = require("../controllers/dashboard.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Summary analytics
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get financial summary (Admin, Analyst, Viewer)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Financial summary data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalIncome:
 *                   type: number
 *                   example: 15000.00
 *                 totalExpense:
 *                   type: number
 *                   example: 8200.00
 *                 netBalance:
 *                   type: number
 *                   example: 6800.00
 *                 transactionCount:
 *                   type: integer
 *                   example: 42
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/summary",
  authenticate,
  authorize("ADMIN", "ANALYST", "VIEWER"),
  getSummary
);

module.exports = { router };
