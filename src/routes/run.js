const express = require('express');
const router = express.Router();
const runController = require('../controllers/runController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.post('/', runController.saveRun);
router.get('/', runController.getRuns);

module.exports = router;
