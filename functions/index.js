/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require('express');
const contactController = require('./src/controllers/contactController');
const contactRoutes = require('./src/routes/contactRoutes');
const smsRoutes = require('./src/routes/smsRoutes');
const whatsupRoutes = require('./src/routes/whatsupRoutes');
const firebaseSetup = require('./firebaseSetup');
const cors = require('cors');
const bodyParser = require("body-parser");
const { firestoreTriggers } = require("./src/triggers/fireStoreTriggers");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const app = express();
app.use(express.json());
// Enable CORS for cross-origin requests
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello from communication backend service!');
});

app.use('/api/contacts', contactRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/whatsup', whatsupRoutes);


exports.backend_service = onRequest(app);
// Deploy Firestore Triggers
exports.onNewMesasgeSubmit = firestoreTriggers.onNewMesasgeSubmit;


