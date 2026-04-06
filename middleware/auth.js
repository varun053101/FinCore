const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authentication required. Please log in.", 401);
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Your session has expired. Please log in again.", 401);
    }
    throw new AppError("Invalid token. Please log in again.", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new AppError("User no longer exists.", 401);
  }
  if (!user.status) {
    throw new AppError("User account is inactive.", 403);
  }

  req.user = user;

  next();
});

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError("Authentication required. Please log in.", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("You do not have permission to perform this action.", 403);
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};