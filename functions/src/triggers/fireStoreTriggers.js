const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const firebaseSetup = require('../../firebaseSetup');
console.log("Registering new document trigger");
const onNewMesasgeSubmit = onDocumentCreated("messageQueue/{docId}", async (event) => {
    console.log("--------------------New Document Triggered------------------------------------------");
    const newData = event.data?.data(); // Get document data
    if (!newData) return;

    console.log("New document added:", newData);
});
console.log("Completing new document trigger");
module.exports = { firestoreTriggers: { onNewMesasgeSubmit } };
