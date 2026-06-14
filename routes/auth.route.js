require("../config/passport");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

const jwt = require("jsonwebtoken");
const { register, login, logout } = require("../controllers/authentification");

//elper function matching your core authentication file token engine
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Import logic from Controller
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    // Generate access token signature for the authorized user instance
    const token = generateToken(req.user._id);

    // Bake token into HTTP-Only session client cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect user back to your client-side web application interface
    const frontendUrl = process.env.NODE_ENV === "production" 
      ? "https://your-frontend-domain.vercel.app" 
      : "http://localhost:3000";

    return res.redirect(`${frontendUrl}/dashboard`);
  }
);
// Import validation from Middleware
const {
  registerValidation,
  loginValidation,
} = require("../middleware/authmiddleware");

// Routes - much cleaner now!
router.post("/register", registerValidation, register);
/*router.post("/login", loginValidation, login);*/
router.post("/login", loginValidation ,async (req, res) => {
  try {
    await connectDB();
    
   //this calls login function from the controller and returns the response
   return await login(req, res);
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }

});
router.post("/logout", logout);

module.exports = router;
