const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/response");
const transactionService = require("../services/transaction.service");

const createTransaction = asyncHandler(async (req, res) => {
  const data = await transactionService.createTransaction(req.body, req.user.id);
  return successResponse(res, 201, "Transaction created successfully", data);
});

const listTransactions = asyncHandler(async (req, res) => {
  const data = await transactionService.listTransactions(req.query);
  return successResponse(res, 200, "Transactions fetched successfully", data);
});

const updateTransaction = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const data = await transactionService.updateTransaction(id, req.body);
  return successResponse(res, 200, "Transaction updated successfully", data);
});

const deleteTransaction = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  await transactionService.softDeleteTransaction(id);
  return successResponse(res, 200, "Transaction deleted successfully");
});

module.exports = {
  createTransaction,
  listTransactions,
  updateTransaction,
  deleteTransaction,
};
