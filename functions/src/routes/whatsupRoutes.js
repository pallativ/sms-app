const whatsupController = require('../controllers/whatsupController');
const express = require('express');
const { verifyToken } = require('../middleware/VerifyToken');

const router = express.Router();

router.post('/send', whatsupController.sendWhatsappMessage);

module.exports = router;
