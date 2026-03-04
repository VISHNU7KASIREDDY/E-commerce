const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const name = profile.displayName;

        // Find by googleId or matching email
        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (user && !user.googleId) {
          // Existing local account — link Google to it
          user.googleId = googleId;
          user.authProvider = 'google';
          await user.save();
        }

        if (!user) {
          // New user — create account
          user = new User({
            name,
            email,
            googleId,
            authProvider: 'google',
            role: 'customer',
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

module.exports = passport;
