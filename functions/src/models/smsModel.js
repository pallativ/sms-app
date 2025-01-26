const { db } = require('../../firebaseSetup');
const { logger } = require('firebase-functions');

exports.sendSms = async () => {
    try {
        logger.debug('Sending SMS');
        return true;
    } catch (error) {
        logger.error('Error sending SMS: ', error);
        throw new Error('Error sending SMS: ' + error);
    }
}

exports.queueSms = async () => {
    try {
        logger.debug('Queuing SMS');
        return true;
    } catch (error) {
        logger.error('Error queuing SMS: ', error);
        throw new Error('Error queuing SMS: ' + error);
    }
}
