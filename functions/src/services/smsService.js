const twilioSmsModel = require('../models/twilioSmsModel');
const Joi = require('joi');
const messageLogModel = require('../models/messageLogModel');
const messageQueueModel = require('../models/messageQueueModel');

exports.sendSms = async (userEmail, smsRequest) => {
    try {
        const result = await twilioSmsModel.sendSms(smsRequest);
        return result;
    } catch (error) {
        throw new Error('Error sending SMS: ' + error);
    }
}

exports.queueMessage = async (userEmail, smsRequest) => {
    try {
        const result = await messageQueueModel.queueMessage(userEmail, smsRequest);
        return result;
    } catch (error) {
        throw new Error('Error queuing SMS: ' + error);
    }
}

exports.readMessageLogs = async (userEmail, startDate, endDate) => {
    try {
        const messages = await twilioSmsModel.readMessageLogs(startDate, endDate);
        return messages;
    } catch (error) {
        throw new Error('Error reading message logs: ' + error);
    }
}

exports.importMessageLogs = async (userEmail, startDate, endDate) => {
    try {
        console.log(`Importing message logs${startDate} to ${endDate}`);
        const messages = await this.readMessageLogs(userEmail, startDate, endDate);
        const requiredMessages = messages.map(log => ({
            userEmail: userEmail,
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

exports.readMessageLogsFromDb = async (userEmail) => {
    try {
        const messageLogs = await messageLogModel.readMessageLogs(userEmail);
        return messageLogs;
    } catch (error) {
        throw new Error('Error reading message logs from db: ' + error);
    }
}
