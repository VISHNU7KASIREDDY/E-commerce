const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Step 1: Redirect user to Google consent screen
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Step 2: Google redirects here after consent
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${FRONTEND_URL}/login?error=oauth_failed`,
    session: true,
  }),
  (req, res) => {
    const user = req.user;

    // Generate JWT
    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: '48h' }
    );

    // Pass token and user data to frontend via URL params
    const userData = encodeURIComponent(
      JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    );

    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&user=${userData}`);
  }
);

module.exports = router;
