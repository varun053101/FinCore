const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const { sanitizeUser } = require("../utils/sanitize");

const listUsers = async ({ role, status }) => {
  const where = {};

  if (role) {
    if (!["ADMIN", "ANALYST", "VIEWER"].includes(role)) {
      throw new AppError("Unrecognised role filter value.", 400);
    }
    where.role = role;
  }

  // Only filter by status when it has been explicitly supplied
  if (typeof status === "boolean") where.status = status;

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return users.map(sanitizeUser);
};

const updateUserRole = async (id, role) => {
  if (!["ADMIN", "ANALYST", "VIEWER"].includes(role)) {
    throw new AppError("Unrecognised role value.", 400);
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role },
  });

  return sanitizeUser(user);
};

const updateUserStatus = async (id, status) => {
  const user = await prisma.user.update({
    where: { id },
    data: { status },
  });

  return sanitizeUser(user);
};

module.exports = {
  listUsers,
  updateUserRole,
  updateUserStatus,
};
