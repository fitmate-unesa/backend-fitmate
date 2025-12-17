const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authenticate = require('../middleware/auth');

// Get subscription status (authenticated)
router.get('/status', authenticate, subscriptionController.getSubscriptionStatus);

// Get transaction history (authenticated)
router.get('/transactions', authenticate, subscriptionController.getTransactionHistory);

module.exports = router;
