const { db } = require('../../firebaseSetup');
const { logger } = require('firebase-functions');


exports.saveSettings = async function saveSettings(userEmail, settings) {
    try {
        logger.debug('Saving user settings.');
        const docRef = db.collection("userSecurity").doc(userEmail);
        var createdAt = new Date();
        await docRef.set({ ...settings, createdAt: createdAt, updatedAt: createdAt });
        return docRef.id;
    } catch (error) {
        throw new Error('Error saving user settings: ' + error);
    }
}

exports.getSettings = async function getSettings(userEmail) {
    try {
        logger.debug('fetching user settings.');
        const doc = await db.collection('userSecurity').doc(userEmail).get();
        if (!doc.exists) {
            throw new Error('No such settings!');
        }
        return doc.data();
    } catch (error) {
        throw new Error('Error getting user settings: ' + error);
    }
}
