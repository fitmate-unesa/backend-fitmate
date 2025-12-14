const express = require('express');
const router = express.Router();
const gymController = require('../controllers/gymController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.post('/nearby', gymController.getNearbyGyms);

module.exports = router;
