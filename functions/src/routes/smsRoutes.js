const smsController = require('../controllers/smsController');
const express = require('express');
const { verifyToken } = require('../middleware/VerifyTokenMiddleware');

const router = express.Router();

router.post('/send', verifyToken, smsController.sendSms);
router.post('/queue', verifyToken, smsController.queueMessage);
router.get('/logs', verifyToken, smsController.readMessageLogs);
router.post('/importMessageLogs', verifyToken, smsController.importMessageLogs);
router.get('/messageLogs', verifyToken, smsController.readMessageLogsFromDb);

module.exports = router;
