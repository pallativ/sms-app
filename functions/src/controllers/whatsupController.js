const whatsupMessageService = require('../services/whatsupMessageService');
const { logger } = require('firebase-functions');

exports.sendWhatsappMessage = async (req, res) => {
    try {
        logger.info('Sending WhatsApp inside controller');
        const result = await whatsupMessageService.sendWhatsupMessage(req.body);
        logger.info('Sending WhatsApp inside controller', result);
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
