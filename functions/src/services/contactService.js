const contactModel = require('../models/contactModel');	

exports.getAllContacts = async () => {
    try {
        const contacts = await contactModel.getAllContacts();
        return contacts;
    } catch (error) {
        throw new Error('Error fetching contacts: ' + error.message);
    }
}

exports.createContact = async (contact) => {
    try {
        const contactId = await contactModel.createContact(contact);
        return contactId;
    } catch (error) {
        throw new Error('Error creating contact: ' + error.message);
    }
}