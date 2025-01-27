const smsModel = require('../models/smsModel');
const Joi = require('joi');

exports.sendSms = async (smsRequest) => {
    try {
        const result = await smsModel.sendSms(smsRequest);
        return result;
    } catch (error) {
        throw new Error('Error sending SMS: ' + error);
    }
}

exports.queueSms = async (smsRequest) => {
    try {
        const result = await smsModel.queueSms(smsRequest);
        return result;
    } catch (error) {
        throw new Error('Error queuing SMS: ' + error);
    }
}

exports.readMessageLogs = async () => {
    try {
        const messages = await smsModel.readSmsLogs();
        return messages;
    } catch (error) {
        throw new Error('Error reading message logs: ' + error);
    }
}
