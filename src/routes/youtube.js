const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.post('/shorts', youtubeController.searchShorts);

module.exports = router;
