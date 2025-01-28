const smsController = require('../controllers/smsController');
const express = require('express');

const router = express.Router();

router.post('/send', smsController.sendSms);
router.post('/queue', smsController.queueSms);
router.get('/logs', smsController.readMessageLogs);
router.post('/importMessageLogs', smsController.importMessageLogs);

module.exports = router;
