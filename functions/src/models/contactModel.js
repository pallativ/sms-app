const { db } = require('../../firebaseSetup');
const { logger } = require('firebase-functions');

/// Get all contacts
exports.getAllContacts = async function getAllContacts(userInfo) {
    try {
        logger.debug('fetching contacts from contacts collection.');
        var tenantDocRef = await db.collection("tenants").doc(userInfo.tenantCode);
        const snapshot = await tenantDocRef.collection('contacts').get();
        const contacts = [];
        snapshot.forEach(doc => {
            contacts.push({ id: doc.id, ...doc.data() });
        });
        return contacts;
    } catch (error) {
        logger.error('Error getting contacts: ', error);
        throw new Error('Error getting contacts: ' + error);
    }
}

/// Check if a contact exists
exports.isExists = async function isExists(userInfo, contactEmail) {
    const doc = await db.collection('tenants').doc(userInfo.tenantCode)
        .collection("contacts").doc(contactEmail).get();
    return doc.exists;
}

/// Create a contact
exports.createContact = async function createContact(userInfo, contact) {
    try {

        var tenantDocRef = await db.collection("tenants").doc(userInfo.tenantCode);
        var contactDocRef = await tenantDocRef.collection('contacts').doc(contact.email);

        await contactDocRef.set({
            ...contact,
            createdByUserId: userInfo.uid,
            createdByEmail: userInfo.email,
        });


        // Storing the tags.
        var tags = contact.tags;
        if (tags !== null) {
            tags.forEach(async tag => {
                await tenantDocRef.collection('tags').doc(tag).set({ tag: tag });
            });
        }

        // Storing Custom Fields.
        // Extract key names and their types
        if (contact.customFields !== null) {
            const customFields = [];
            for (const key in contact.customFields) {
                customFields.push({ name: key, type: typeof contact.customFields[key] })
            }
            customFields.forEach(async field => {
                await tenantDocRef.collection('customFields').doc(field.name).set({ ...field });
            });
        }
        return contactDocRef.id;
    } catch (error) {
        throw new Error('Error creating contact: ' + error.message);
    }
}

/// Get a contact by id
exports.getContactById = async function getContactById(userInfo, contactId) {
    try {
        var tenantDocRef = await db.collection("tenants").doc(userInfo.tenantCode);
        const doc = await tenantDocRef.collection('contacts').doc(contactId).get();
        if (!doc.exists) {
            throw new Error('No such contact!');
        }
        return doc.data();
    } catch (error) {
        throw new Error('Error getting contact: ' + error.message);
    }
}

/// Update a contact
exports.updateContact = async function updateContact(userInfo, contactId, contact) {
    try {
        var tenantDocRef = await db.collection("tenants").doc(userInfo.tenantCode);
        await tenantDocRef.collection('contacts').doc(contactId).update(contact);
        return true;
    } catch (error) {
        throw new Error('Error updating contact: ' + error.message);
    }
}

// Delete a contact
exports.deleteContact = async function deleteContact(userEmail, contactId) {
    try {
        await db.collection('users').doc(userEmail).collection('contacts').doc(contactId).delete();
        return true;
    } catch (error) {
        throw new Error('Error deleting contact: ' + error.message);
    }
}


/// Get tags for a user
exports.getTags = async function getTags(userEmail) {
    try {
        const snapshot = await db.collection('users').doc(userEmail).collection('tags').get();
        const tags = [];
        snapshot.forEach(doc => {
            tags.push(doc.data().tag);
        });
        return tags;
    } catch (error) {
        throw new Error('Error getting tags: ' + error.message);
    }
}

// Get custom fields from user
exports.getCustomFields = async function getCustomFields(userEmail) {
    try {
        const snapshot = await db.collection('users').doc(userEmail).collection('customFields').get();
        const customFields = [];
        snapshot.forEach(doc => {
            customFields.push(doc.data());
        });
        return customFields;
    } catch (error) {
        throw new Error('Error getting custom fields: ' + error.message);
    }
}
