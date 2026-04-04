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

router.use(authenticate);

router.get(
  "/",
  authorize("ADMIN", "ANALYST", "VIEWER"),
  validateTransactionQuery,
  listTransactions
);
router.post("/", authorize("ADMIN"), validateTransactionCreate, createTransaction);
router.patch(
  "/:id",
  authorize("ADMIN"),
  validateNumericIdParam(),
  validateTransactionUpdate,
  updateTransaction
);
router.delete("/:id", authorize("ADMIN"), validateNumericIdParam(), deleteTransaction);

module.exports = { router };
