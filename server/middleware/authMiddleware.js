const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  console.log('--- "protect" middleware triggered ---'); // New log

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found:', token); // New log

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      console.log('Token verified successfully. User:', req.user.email); // New log
      next();
    } catch (error) {
      console.error('!!! TOKEN VERIFICATION FAILED !!!'); // New log
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.error('!!! NO TOKEN FOUND IN HEADER !!!'); // New log
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };