const express = require("express");
const router = express.Router();

// Import logic from Controller
const { register, login, logout } = require("../controllers/authentification");

// Import validation from Middleware
const {
  registerValidation,
  loginValidation,
} = require("../middleware/authmiddleware");

// Routes - much cleaner now!
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", logout);

module.exports = router;
