/**
 * AppError — operational errors that should be surfaced to the client.
 *
 * Marking errors as operational (isOperational = true) lets the global
 * error handler distinguish between expected failures (e.g. wrong password,
 * resource not found) and programmer mistakes that should be hidden behind
 * a generic 500 message.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
