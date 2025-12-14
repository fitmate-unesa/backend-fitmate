const express = require('express');
const router = express.Router();
const sportsController = require('../controllers/sportsController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.post('/generate', sportsController.generatePlan);
router.get('/history', sportsController.getPlans);

module.exports = router;
