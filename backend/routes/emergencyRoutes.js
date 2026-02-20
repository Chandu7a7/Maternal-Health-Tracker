const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');
const { protect } = require('../middleware/auth');

router.post('/', protect, emergencyController.trigger);

module.exports = router;
