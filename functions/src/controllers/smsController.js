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


exports.queueMessage = async (req, res) => {
    try {
        const result = await smsService.queueMessage(req.user.email, req.body);
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.readMessageLogs = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const logs = await smsService.readMessageLogs(req.user.email, tartDate, endDate);
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
        const logs = await smsService.importMessageLogs(req.user.email, startDate, endDate);
        res.status(200).json({ success: true, logs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.readMessageLogsFromDb = async (req, res) => {
    try {
        const logs = await smsService.readMessageLogsFromDb(req.user.email);
        res.status(200).json({ success: true, logs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
