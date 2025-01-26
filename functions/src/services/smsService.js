const contactModel = require('../models/smsModel');

exports.sendSms = async (smsRequest) => {
    try {
        const result = await contactModel.sendSms(smsRequest);
        return result;
    } catch (error) {
        throw new Error('Error sending SMS: ' + error);
    }
}

exports.queueSms = async (smsRequest) => {
    try {
        const result = await contactModel.queueSms(smsRequest);
        return result;
    } catch (error) {
        throw new Error('Error queuing SMS: ' + error);
    }
}
