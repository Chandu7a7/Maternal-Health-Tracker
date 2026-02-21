const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');

router.post('/predict-nutrition', protect, nutritionController.predictNutrition);

module.exports = router;
