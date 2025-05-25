const admin = require('firebase-admin');
const serviceAccount = require('./secrets.json');
const { logger } = require('firebase-functions');
require("dotenv").config();

const useEmulator = process.env.USE_FIRESTORE_EMULATOR === 'true';
if (!admin.apps.length) {
    if (!useEmulator) {
        //logger.info('Using production Firebase configuration.');
        //console.log('Using production Firebase configuration.');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://electron-dev-398915.firebaseio.com"
        });
    }
    else {
        //logger.info("Runner under local simulator");
        //console.log("Runner under local simulator");
        admin.initializeApp({
            projectId: 'electron-dev-398915',
            databaseURL: 'http://localhost:8080'
        });
     }
}

const db = admin.firestore();
const auth = admin.auth();
logger.info('Database Id:', db.databaseId);
logger.info(`Firestore initialized [Environment: ${useEmulator ? 'LOCAL' : 'PRODUCTION'}]`);

module.exports = { db, auth, };
