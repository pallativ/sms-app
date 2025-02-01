const smsController = require('../controllers/smsController');
const express = require('express');
const { verifyToken } = require('../middleware/VerifyToken');

const router = express.Router();

router.post('/send', smsController.sendSms);
router.post('/queue', smsController.queueSms);
router.get('/logs', smsController.readMessageLogs);
router.post('/importMessageLogs', smsController.importMessageLogs);
router.get('/messageLogs', verifyToken , smsController.readMessageLogsFromDb);

module.exports = router;
