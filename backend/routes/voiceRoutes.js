const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth');
const voiceController = require('../controllers/voiceController');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

router.post('/analyze', protect, upload.single('audio'), voiceController.analyze);

module.exports = router;

