const express = require('express');
const router = express.Router();
const movementController = require('../controllers/movementController');
const { protect } = require('../middleware/auth');

router.post('/', protect, movementController.record);
router.get('/', protect, movementController.list);

module.exports = router;
