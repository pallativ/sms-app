const twilioSmsModel = require('../models/twilioSmsModel');
const Joi = require('joi');
const messageLogModel = require('../models/messageLogModel');

exports.sendSms = async (smsRequest) => {
    try {
        const result = await twilioSmsModel.sendSms(smsRequest);
        return result;
    } catch (error) {
        throw new Error('Error sending SMS: ' + error);
    }
}

exports.queueSms = async (smsRequest) => {
    try {
        const result = await twilioSmsModel.queueSms(smsRequest);
        return result;
    } catch (error) {
        throw new Error('Error queuing SMS: ' + error);
    }
}

exports.readMessageLogs = async (startDate, endDate) => {
    try {
        const messages = await twilioSmsModel.readMessageLogs(startDate, endDate);
        return messages;
    } catch (error) {
        throw new Error('Error reading message logs: ' + error);
    }
}

exports.importMessageLogs = async (startDate, endDate) => {
    try {
        const messages = await this.readMessageLogs(startDate, endDate);
        const requiredMessages = messages.map(log => ({
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
        var importedMessageId = await messageLogModel.importMessageLogs(requiredMessages);
        return importedMessageId;
    } catch (error) {
        throw new Error('Error importing message logs: ' + error);
    }
}

exports.readMessageLogsFromDb = async () => {
    try {
        const messageLogs = await messageLogModel.readMessageLogs();
        return messageLogs;
    } catch (error) {
        throw new Error('Error reading message logs from db: ' + error);
    }
}
