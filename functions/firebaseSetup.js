const admin = require('firebase-admin');
const serviceAccount = require('./secrets.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://electron-dev-398915.firebaseio.com"
    });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };