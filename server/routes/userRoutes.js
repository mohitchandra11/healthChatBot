const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// This route is protected. It requires a valid token.
router.get('/me', protect, getMe);

module.exports = router;