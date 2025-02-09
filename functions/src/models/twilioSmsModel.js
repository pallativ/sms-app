const { logger, functions } = require('firebase-functions');
const twilio = require('twilio');
require("dotenv").config();

const twilioAccountId = process.env.TWILIO_ACCOUNT_ID || functions.config().api?.url;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || functions.config().api?.key;
const twilioFrom = process.env.TWILIO_FROM || functions.config().api?.from;

exports.sendSms = async (sendSmsModel) => {
    try {
        logger.debug('Sending SMS');
        const client = new twilio(twilioAccountId, twilioAuthToken);
        const message = await client.messages.create({
            body: sendSmsModel.body,
            to: sendSmsModel.to,
            from: twilioFrom
        });

        logger.debug('SMS sent successfully: ', message.sid);
        return true;
    } catch (error) {
        logger.error('Error sending SMS: ', error);
        throw new Error('Error sending SMS: ' + error);
    }
}

exports.sendWhatsapp = async (sendWhatsappModel) => {
    try {
        logger.debug('Sending WhatsApp');
        const client = new twilio(twilioAccountId, twilioAuthToken);
        const message = await client.messages.create({
            body: "Hello from Twilio with content variables",
            to: "whatsapp:+919000180459",
            contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
            contentVariables: '{"1":"12/1","2":"3pm"}',
            from: "whatsapp:+14155238886"
        });

        logger.debug('WhatsApp sent successfully and status: ', message);
        logger.debug('WhatsApp sent successfully: ', message.sid);
        return true;
    } catch (error) {
        logger.error('Error sending WhatsApp: ', error);
        throw new Error('Error sending WhatsApp: ' + error);
    }
};

exports.queueSms = async () => {
    try {
        logger.debug('Queuing SMS');
        return true;
    } catch (error) {
        logger.error('Error queuing SMS: ', error);
        throw new Error('Error queuing SMS: ' + error);
    }
}

exports.readMessageLogs = async (startDate, endDate) => {
    try {
        logger.debug('Reading SMS logs');
        const client = new twilio(twilioAccountId, twilioAuthToken);
        const messages = await client.messages.list({
            dateSentAfter: new Date(startDate), // Messages sent after this date
            dateSentBefore: new Date(endDate),  // Messages sent before this date
        });

        // messages.forEach(message => {
        //     logger.debug(`From: ${message.from}, To: ${message.to}, Body: ${message.body}, Status: ${message.status}`);
        // });
        return messages;
    } catch (error) {
        logger.error('Error reading SMS logs: ', error);
        throw new Error('Error reading SMS logs: ' + error);
    }
}


