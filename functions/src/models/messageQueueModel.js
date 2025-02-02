const { db } = require('../../firebaseSetup');
const { logger } = require('firebase-functions');

const queueMessage = async (userMail, message) => {
    try {
        console.log('Adding message to queue', message  );
        const docRef = await db.collection('messageQueue').add({ userEmail: userMail, ...message });
        logger.info('Message added to queue with ID: ', docRef.id);
        return docRef.id;
    } catch (error) {
        logger.error('Error adding message to queue: ', error);
        throw new Error('Unable to add message to queue');
    }
};

module.exports = { queueMessage };
