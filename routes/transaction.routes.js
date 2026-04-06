const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
  validateNumericIdParam,
  validateTransactionCreate,
  validateTransactionUpdate,
  validateTransactionQuery,
} = require("../middleware/validation");
const {
  createTransaction,
  listTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transaction.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Financial transaction management
 */

router.use(authenticate);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: List transactions (Admin, Analyst, Viewer)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *         description: Filter by transaction type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: Paginated list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/",
  authorize("ADMIN", "ANALYST", "VIEWER"),
  validateTransactionQuery,
  listTransactions
);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a transaction (Admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 2500.00
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *                 example: INCOME
 *               category:
 *                 type: string
 *                 example: Salary
 *               description:
 *                 type: string
 *                 example: Monthly salary deposit
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-04-01"
 *     responses:
 *       201:
 *         description: Transaction created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       422:
 *         description: Validation error
 */
router.post("/", authorize("ADMIN"), validateTransactionCreate, createTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   patch:
 *     summary: Update a transaction (Admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Transaction updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Transaction not found
 *       422:
 *         description: Validation error
 */
router.patch(
  "/:id",
  authorize("ADMIN"),
  validateNumericIdParam(),
  validateTransactionUpdate,
  updateTransaction
);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction (Admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Transaction ID
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Transaction not found
 */
router.delete("/:id", authorize("ADMIN"), validateNumericIdParam(), deleteTransaction);

module.exports = { router };
