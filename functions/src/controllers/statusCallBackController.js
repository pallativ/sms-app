const { logger } = require('firebase-functions');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

exports.smsStatusCallback = async (req, res) => {
    try {
        logger.info('sms status call back url');
        const messageSid = req.body.MessageSid;
        const messageStatus = req.body.MessageStatus;

        logger.info(`Message SID: ${messageSid}, Status: ${messageStatus}`);

        // You can add additional logic here to handle the status update, such as updating a database

        const twiml = new MessagingResponse();
        twiml.message('Status received');

        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// ✅ Step 1: Webhook Verification (Meta Challenge)
exports.verifyWebhook = async (req, res) => {
    const VERIFY_TOKEN = "your_verify_token"; // Set your verification token

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        console.log("Webhook Verified Successfully!");
        res.status(200).send(challenge); // Respond with challenge token
    } else {
        res.status(403).send('Verification Failed');
    }
};

// ✅ Step 2: Handle Incoming WhatsApp Messages
exports.incomingWhatsupMessage = (req, res) => {
    const body = req.body;

    // Ensure this is a WhatsApp message event
    if (body.object === 'whatsapp_business_account') {
        body.entry.forEach(entry => {
            const changes = entry.changes;
            changes.forEach(change => {
                if (change.field === 'messages') {
                    const messageData = change.value;

                    // Extract message details
                    const phoneNumber = messageData.contacts[0]?.wa_id;
                    const messageText = messageData.messages[0]?.text?.body;
                    const messageId = messageData.messages[0]?.id;

                    console.log(`📩 Incoming Message from ${phoneNumber}: ${messageText}`);

                    // TODO: Implement AI-based response (e.g., OpenAI API)

                    // Acknowledge the webhook event
                    res.sendStatus(200);
                }
            });
        });
    } else {
        res.sendStatus(404);
    }
};


// ✅ Step 1: Handle Incoming SMS
exports.twilioSmsCallback = async (req, res) => {
    const { From, Body } = req.body;  // Extract sender and message

    console.log(`📩 SMS from ${From}: ${Body}`);

    // Twilio Messaging Response
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(`Hello! You said: "${Body}"`);

    res.type('text/xml').send(twiml.toString());
};
