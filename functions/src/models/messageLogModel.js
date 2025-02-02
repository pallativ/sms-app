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

exports.readMessageLogs = async function readMessageLogs(userEmail) {
    try {
        logger.debug('fetching message logs from messageLog collection.');
        const snapshot = await db.collection('messageLog').get();
        const messageLogs = [];
        snapshot.forEach(doc => {
            messageLogs.push({ id: doc.id, ...doc.data() });
        });
        return messageLogs;
    } catch (error) {
        logger.error('Error getting message logs: ', error);
        throw new Error('Error getting message logs: ' + error);
    }
}
