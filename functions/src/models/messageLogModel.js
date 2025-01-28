const { db } = require('../../firebaseSetup');
const { logger } = require('firebase-functions');

exports.importMessageLogs = async function importMessageLogs(messageLogs) {
    try {
        logger.debug('fetching message logs.');
        var messageIds = [];
        for (const messageLog of messageLogs) {
            const docRef = db.collection("messageLog").doc(messageLog.sid);
            var createdAt = new Date();
            await docRef.set({ ...messageLog, createdAt: createdAt, updatedAt: createdAt });
            messageIds.push(docRef.id);
        }
        return messageIds;
    } catch (error) {
        throw new Error('Error importing message logs: ' + error);
    }
}
