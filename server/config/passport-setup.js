const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      // These options must match your Google Cloud Console setup
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // This relative path is used internally and corresponds to the full URI you set in the console
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if a user with this Google ID already exists
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          // If they exist, pass the user to the next step
          return done(null, existingUser);
        } else {
          // If it's a new user, create them in our database
          const newUser = await new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            country: 'Not Specified', // Default country for Google sign-ups
          }).save();
          
          // Pass the newly created user to the next step
          return done(null, newUser);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);