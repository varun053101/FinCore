const express = require("express");
const { authenticate } = require("../middleware/auth");
const { validateRegister, validateLogin } = require("../middleware/validation");

const { registerUser, loginUser, getMe } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/me", authenticate, getMe);

module.exports = { router };
