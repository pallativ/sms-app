const { db } = require('../../firebaseSetup');
const { logger } = require('firebase-functions');

/// Get all contacts
exports.getAllContacts = async function getAllContacts(userEmail) {
    try {
        logger.debug('fetching contacts from contacts collection.');
        const snapshot = await db.collection('users').doc(userEmail).collection('contacts').get();
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
exports.isExists = async function isExists(userEmail, contactEmail) {
    const doc = await db.collection("users").doc(userEmail).collection("contacts").doc(contactEmail).get();
    return doc.exists;
}

/// Create a contact
exports.createContact = async function createContact(owner, contact) {
    try {

        var userDocRef = db.collection('users').doc(owner.email);
        await userDocRef.set({
            userId: owner.userId,
            email: owner.email,
        });


        // Storing the tags.
        var tags = contact.tags;
        if (tags !== null) {
            tags.forEach(async tag => {
                await userDocRef.collection('tags').doc(tag).set({ tag: tag });
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
                await userDocRef.collection('customFields').doc(field.name).set({ ...field });
            });
        }

        const docRef = userDocRef.collection("contacts").doc(contact.email);
        var createdAt = new Date();
        await docRef.set({ ...contact, createdAt: createdAt, updatedAt: createdAt });
        //const res = await db.collection('contacts').add(contact);
        return docRef.id;
    } catch (error) {
        throw new Error('Error creating contact: ' + error.message);
    }
}

/// Get a contact by id
exports.getContactById = async function getContactById(userEmail, contactId) {
    try {
        const doc = await db.collection('users').doc(userEmail).collection('contacts').doc(contactId).get();
        if (!doc.exists) {
            throw new Error('No such contact!');
        }
        return doc.data();
    } catch (error) {
        throw new Error('Error getting contact: ' + error.message);
    }
}

/// Update a contact
exports.updateContact = async function updateContact(userEmail, contactId, contact) {
    try {
        await db.collection('users').doc(userEmail).collection('contacts').doc(contactId).update(contact);
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
