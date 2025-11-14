const User = require('../models/User');

// @desc    Get current user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  // The 'protect' middleware has already found the user and attached it to req.user
  const user = await User.findById(req.user.id).select('-password');
  res.status(200).json(user);
};

module.exports = { getMe };