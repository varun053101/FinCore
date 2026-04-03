const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/response");
const userService = require("../services/user.service");

const listUsers = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.role) filters.role = req.query.role;
  if (req.query.status !== undefined) {
    filters.status = req.query.status === "true";
  }

  const data = await userService.listUsers(filters);
  return successResponse(res, 200, "Users fetched successfully", data);
});

const updateRole = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { role } = req.body;

  const data = await userService.updateUserRole(id, role);
  return successResponse(res, 200, "User role updated successfully", data);
});

const updateStatus = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const data = await userService.updateUserStatus(id, status);
  return successResponse(res, 200, "User status updated successfully", data);
});

module.exports = {
  listUsers,
  updateRole,
  updateStatus,
};
