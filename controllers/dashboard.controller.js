const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/response");
const dashboardService = require("../services/dashboard.service");

const getSummary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSummary();
  return successResponse(res, 200, "Dashboard summary fetched successfully", data);
});

module.exports = {
  getSummary,
};
