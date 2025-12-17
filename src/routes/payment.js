const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticate = require('../middleware/auth');

// Get pricing plans (public)
router.get('/pricing', paymentController.getPricing);

// Create payment transaction (authenticated)
router.post('/create', authenticate, paymentController.createTransaction);

// Midtrans webhook notification (no auth - called by Midtrans)
router.post('/notification', paymentController.handleNotification);

module.exports = router;
