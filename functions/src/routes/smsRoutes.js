const smsController = require('../controllers/smsController');
const express = require('express');

const router = express.Router();

router.post('/send', smsController.sendSms);
router.post('/queue', smsController.queueSms);

module.exports = router;
