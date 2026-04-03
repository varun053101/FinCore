const AppError = require("../utils/AppError");

const allowedRoles = ["ADMIN", "ANALYST", "VIEWER"];
const allowedTransactionTypes = ["INCOME", "EXPENSE"];

const isValidDateString = (value) => {
  if (typeof value !== "string") return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
};

const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return next(new AppError("name, email and password are required", 400));
  }

  if (role && !allowedRoles.includes(role)) {
    return next(new AppError("role must be ADMIN, ANALYST or VIEWER", 400));
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("email and password are required", 400));
  }
  next();
};

const validateRoleUpdate = (req, res, next) => {
  const { role } = req.body;
  if (!role || !allowedRoles.includes(role)) {
    return next(new AppError("role must be ADMIN, ANALYST or VIEWER", 400));
  }
  next();
};

const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  if (typeof status !== "boolean") {
    return next(new AppError("status must be boolean", 400));
  }
  next();
};

const validateNumericIdParam = (paramName = "id") => {
  return (req, res, next) => {
    const value = Number(req.params[paramName]);
    if (!Number.isInteger(value) || value < 1) {
      return next(new AppError(`Invalid ${paramName}`, 400));
    }
    next();
  };
};

const validateTransactionCreate = (req, res, next) => {
  const { amount, type, category, date } = req.body;
  if (amount === undefined || !type || !category || !date) {
    return next(new AppError("amount, type, category and date are required", 400));
  }
  if (Number.isNaN(Number(amount))) {
    return next(new AppError("amount must be a valid number", 400));
  }
  if (!allowedTransactionTypes.includes(type)) {
    return next(new AppError("type must be INCOME or EXPENSE", 400));
  }
  if (!isValidDateString(date)) {
    return next(new AppError("date must be a valid ISO date string", 400));
  }
  next();
};

const validateTransactionUpdate = (req, res, next) => {
  const { amount, type, date } = req.body;

  if (amount !== undefined && Number.isNaN(Number(amount))) {
    return next(new AppError("amount must be a valid number", 400));
  }
  if (type !== undefined && !allowedTransactionTypes.includes(type)) {
    return next(new AppError("type must be INCOME or EXPENSE", 400));
  }
  if (date !== undefined && !isValidDateString(date)) {
    return next(new AppError("date must be a valid ISO date string", 400));
  }
  next();
};

const validateTransactionQuery = (req, res, next) => {
  const { type, from, to, page, limit } = req.query;

  if (type && !allowedTransactionTypes.includes(type)) {
    return next(new AppError("type filter must be INCOME or EXPENSE", 400));
  }
  if (from && !isValidDateString(from)) {
    return next(new AppError("from must be a valid ISO date string", 400));
  }
  if (to && !isValidDateString(to)) {
    return next(new AppError("to must be a valid ISO date string", 400));
  }
  if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
    return next(new AppError("page must be a positive integer", 400));
  }
  if (limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1)) {
    return next(new AppError("limit must be a positive integer", 400));
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateRoleUpdate,
  validateStatusUpdate,
  validateNumericIdParam,
  validateTransactionCreate,
  validateTransactionUpdate,
  validateTransactionQuery,
};
