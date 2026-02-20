const express = require('express');
const router = express.Router();
const symptomController = require('../controllers/symptomController');
const { protect } = require('../middleware/auth');

router.post('/', protect, symptomController.add);
router.get('/', protect, symptomController.list);

module.exports = router;
