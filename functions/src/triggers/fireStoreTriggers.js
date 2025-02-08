const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const firebaseSetup = require('../../firebaseSetup');
console.log("Registering new document trigger");

const onNewSmsSubmit = onDocumentCreated("messageQueue/{docId}", async (event) => {
    console.log("--------------------New Document Triggered------------------------------------------");
    const newData = event.data?.data(); // Get document data
    if (!newData) return;

    console.log("New sms message is added to queue.", newData);
});

const onNewWhatsupMessageSubmit = onDocumentCreated("whatsUpMessageQueue/{docId}", async (event) => {
    console.log("--------------------New whats up Document Triggered------------------------------------------");
    const newData = event.data?.data(); // Get document data
    if (!newData) return;

    console.log("New whats up document sent to queue:", newData);
})

console.log("Completing new document trigger");
module.exports = { firestoreTriggers: { onNewSmsSubmit, onNewWhatsupMessageSubmit } };
