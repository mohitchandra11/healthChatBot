const express = require('express');
const router = express.Router();
const { getChats, createChat, addMessage, deleteChat, updateChat, virtualDoctorStream } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Virtual Doctor streaming endpoint
router.post('/virtual-doctor/stream', virtualDoctorStream);

// GET /api/chat/ -> Get all chats
// POST /api/chat/ -> Create a new chat
router.route('/').get(getChats).post(createChat);

// DELETE /api/chat/:id -> Delete a chat
// PUT /api/chat/:id -> Update a chat (for renaming)
router.route('/:id').delete(deleteChat).put(updateChat);

// POST /api/chat/:id/messages -> Add a message to a chat
router.route('/:id/messages').post(addMessage);

module.exports = router;