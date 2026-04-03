const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/response");
const authService = require("../services/auth.service");

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);

  return successResponse(
    res,
    201,
    "User registered successfully",
    data
  );
});

// Login an existing user
const loginUser = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);

  return successResponse(
    res,
    200,
    "User logged in successfully",
    data
  );
});

const getMe = asyncHandler(async (req, res) => {
  const data = await authService.getProfile(req.user.id);
  return successResponse(res, 200, "Profile fetched successfully", data);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};