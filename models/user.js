// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function() {
        //  The missing puzzle piece: Only require password if NOT signing up with Google!
        return !this.googleId;
      },
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["customer", "employee", "Manager"],
      required: [true, "dear Manager , please provide the user`s role "],
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Crucial: prevents unique collisions when googleId is missing
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);