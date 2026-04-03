const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const { sanitizeUser } = require("../utils/sanitize");

// Signs a JWT containing the user ID; expiry is read from env (defaults to 1 day)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

const register = async ({ name, email, password, role, adminSecretKey }) => {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new AppError("An account with that email already exists.", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Determine role: defaults to VIEWER; ADMIN requires the server-side secret
  let resolvedRole = "VIEWER";
  if (role === "ADMIN") {
    if (!process.env.ADMIN_SECRET_KEY) {
      throw new AppError("Admin registration has not been configured on this server.", 500);
    }
    if (!adminSecretKey || adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
      throw new AppError("The admin secret key provided is incorrect.", 403);
    }
    resolvedRole = "ADMIN";
  } else if (role === "ANALYST" || role === "VIEWER") {
    resolvedRole = role;
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: resolvedRole,
    },
  });

  const token = generateToken(user.id);

  return { user: sanitizeUser(user), token };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Treat "not found" and "inactive account" the same to prevent user enumeration
  if (!user || !user.status) {
    throw new AppError("Invalid credentials or account is inactive.", 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError("Invalid credentials.", 401);
  }

  const token = generateToken(user.id);

  return { user: sanitizeUser(user), token };
};

const getProfile = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || !user.status) {
    throw new AppError("User not found or account is inactive.", 404);
  }
  return sanitizeUser(user);
};

module.exports = {
  register,
  login,
  getProfile,
};