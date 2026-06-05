const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator"); 


const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
};
//////add new user to the database
const register = async (req, res) => {
  ///handle errors
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const { username, email, password } = req.body; //yjo min html lol

  try {
    const useralreadyExist = await user.findOne({
      $or: [{ email }, { username }],
    });
    if (useralreadyExist) {
      return res
        .status(400)
        .json({ message: "User or email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassWord = await bcrypt.hash(password, salt);

    //// after hashing the password we add the user intl the ddatabase
    const newUser = await user.create({
      username,
      email,
      password: hashedPassWord,
    });
    await newUser.save();

    //generate new user token for each session
    const token = generateToken(newUser._id);
    // ////6. Send token via HTTP-only cookie (Secure choice for production)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on Vercel production
      sameSite: "none", // Critical if frontend and backend are on different domains
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days matching token expiration
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2. Compare hashed passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. Generate Token
        const token = generateToken(user._id);

        // 4. Send token via cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: 'Login successful',
            user: { id: user._id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @desc    Logout user / Clear Cookie
// @route   POST /api/auth/logout
const logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none'
    });
    res.json({ message: 'Logged out successfully' });
};


module.exports = {
    register , 
    login , 
    logout
}