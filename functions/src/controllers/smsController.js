const smsService = require('../services/smsService');
const { logger } = require('firebase-functions');


exports.sendSms = async (req, res) => {
    try {
        logger.info('Sending SMS inside controller');
        const result = await smsService.sendSms(req.body);
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.queueSms = async (req, res) => {
    try {
        const { to, message } = req.body;
        const result = await smsService.queueSms(to, message);
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.readMessageLogs = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const logs = await smsService.readMessageLogs(startDate, endDate);
        const filteredLogs = logs.map(log => ({
            sid: log.sid,
            to: log.to,
            from: log.from,
            status: log.status,
            body: log.body,
            dateSent: log.dateSent,
            dateCreated: log.dateCreated,
            price: log.price,
            priceUnit: log.priceUnit,
        }));
        res.status(200).json({ success: true, filteredLogs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.importMessageLogs = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const logs = await smsService.importMessageLogs(startDate, endDate);
        res.status(200).json({ success: true, logs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
