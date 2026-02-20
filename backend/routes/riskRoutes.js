const express = require('express');
const router = express.Router();
const riskController = require('../controllers/riskController');
const { protect } = require('../middleware/auth');

router.get('/level', protect, riskController.level);

module.exports = router;
