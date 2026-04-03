const { errorResponse } = require("./response");

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error("[ERROR]", err.stack);

  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, 401, "Invalid authentication token");
  }
  if (err.name === "TokenExpiredError") {
    return errorResponse(res, 401, "Authentication token has expired");
  }
  if (err.code === "P2025") {
    return errorResponse(res, 404, "Resource not found");
  }
  if (err.code === "P2002") {
    return errorResponse(res, 409, "Duplicate value violates unique constraint");
  }

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";

  errorResponse(res, statusCode, message);
};

module.exports = errorHandler;
