const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Simple rule-based chatbot (no auth required)
router.post('/', chatbotController.chat);

module.exports = router;

