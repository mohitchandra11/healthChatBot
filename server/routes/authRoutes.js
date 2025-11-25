const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerUser, loginUser } = require('../controllers/authController');

// Standard Email & Password Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// "Smart Login" Helper Route
router.post('/check-method', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ method: 'password' });
    }
    if (user.googleId && !user.password) {
      return res.json({ method: 'google' });
    } else {
      return res.json({ method: 'password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Google OAuth 2.0 Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    // This is the crucial redirect to the frontend's dedicated callback handler page.
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/callback?token=${token}`);
  }
);

module.exports = router;