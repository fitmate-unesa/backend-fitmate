const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const authenticate = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.post('/log', foodController.saveFoodLog);
router.get('/history', foodController.getFoodHistory);
router.post('/estimate', foodController.estimateNutrition);

module.exports = router;
