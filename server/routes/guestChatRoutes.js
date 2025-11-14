const express = require('express');
const router = express.Router();
const { processGuestMessage } = require('../controllers/guestChatController');

// This route is public and does NOT require an authentication token.
// POST /api/guest-chat
router.post('/', processGuestMessage);

module.exports = router;
