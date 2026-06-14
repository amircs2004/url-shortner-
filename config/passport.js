const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user"); // Your lowercase-safe model file
const connectDB = require('../connection/connectDB')
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      proxy: true // Crucial for Vercel deployment HTTPS handling
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
          //1 CONNECT W THE DAMN DATABASE FIRST !!
     
          await connectDB();
          // 2. Check if user already exists by Google ID
          let foundUser = await User.findOne({ googleId: profile.id });

        if (foundUser) {
          return done(null, foundUser);
        }

        // 3. Fallback: Check if an account exists with the same email address
        const emailAddress = profile.emails[0].value;
        foundUser = await User.findOne({ email: emailAddress });

        if (foundUser) {
          // Link Google ID to existing password account
          foundUser.googleId = profile.id;
          await foundUser.save();
          return done(null, foundUser);
        }

        // 4. If completely new, provision a fresh profile document record
        const newUser = await User.create({
          username: profile.displayName.replace(/\s+/g, "").toLowerCase() + Math.floor(1000 + Math.random() * 9000),
          email: emailAddress,
          googleId: profile.id,
          role: "customer" // Default role assignment
          // Note: password remains undefined since they authenticate via Google provider
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);