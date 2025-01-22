const { db } = require('../../firebaseSetup');
const { logger } = require('firebase-functions');

exports.getAllContacts = async function getAllContacts() {
    try {
        logger.info('Fetching all contacts');
        const snapshot = await db.collection('contacts').get();
        const contacts = [];
        snapshot.forEach(doc => {
            contacts.push({ id: doc.id, ...doc.data() });
        });
        return contacts;
    } catch (error) {
        throw new Error('Error getting contacts: ' + error.message);
    }
}

exports.createContact = async function createContact(contact) {
    try {
        const res = await db.collection('contacts').add(contact);
        return res.id;
    } catch (error) {
        throw new Error('Error creating contact: ' + error.message);
    }
}

exports.getContactById = async function getContactById(contactId) {
    try {
        const doc = await db.collection('contacts').doc(contactId).get();
        if (!doc.exists) {
            throw new Error('No such contact!');
        }
        return doc.data();
    } catch (error) {
        throw new Error('Error getting contact: ' + error.message);
    }
}

exports.updateContact = async function updateContact(contactId, contact) {
    try {
        await db.collection('contacts').doc(contactId).update(contact);
        return true;
    } catch (error) {
        throw new Error('Error updating contact: ' + error.message);
    }
}

exports.deleteContact =  async function deleteContact(contactId) {
    try {
        await db.collection('contacts').doc(contactId).delete();
        return true;
    } catch (error) {
        throw new Error('Error deleting contact: ' + error.message);
    }
}

