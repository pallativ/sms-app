const admin = require('firebase-admin');
const serviceAccount = require('./secrets.json');
const { logger } = require('firebase-functions');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://electron-dev-398915.firebaseio.com"
    });
}

const db = admin.firestore();
const auth = admin.auth();
logger.info('Database Id:', db.databaseId);

module.exports = { db, auth, };
