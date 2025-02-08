const { db } = require('../../firebaseSetup');
const { logger } = require('firebase-functions');

const queueMessage = async (userMail, message) => {
    try {
        console.log('Adding message to queue', message);
        var currentDate = new Date();
        const docRef = await db.collection('messageQueue').add({ userEmail: userMail, ...message, createdAt: currentDate, updatedAt: currentDate });
        logger.info('Message added to queue with ID: ', docRef.id);
        return docRef.id;
    } catch (error) {
        logger.error('Error adding message to queue: ', error);
        throw new Error('Unable to add message to queue');
    }
};

// Whatsup Mesasge Queue should contain - tonumber, templateId, templateData.
const queueWhatsUpMessage = async (userMail, whatsupMessage) => {
    try {
        console.log('Adding message to queue', whatsupMessage);
        var currentDate = new Date();
        const docRef = await db.collection('whatsUpMessageQueue').add({ userEmail: userMail, ...whatsupMessage, createdAt: currentDate, updatedAt: currentDate });
        logger.info('Message added to queue with ID: ', docRef.id);
        return docRef.id;
    } catch (error) {
        logger.error('Error adding message to queue: ', error);
        throw new Error('Unable to add message to queue');
    }
}

module.exports = { queueMessage };
