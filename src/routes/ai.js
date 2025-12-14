const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authenticate = require('../middleware/auth');

// Require authentication for chat to prevent abuse
router.use(authenticate);

router.post('/chat', aiController.chatWithAI);

module.exports = router;
