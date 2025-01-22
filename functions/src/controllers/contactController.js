const contactService = require('../services/contactService');

exports.createContact = async (req, res) => {
    try {
        // const contact = req.body;
        // const contactId = await contactService.createContact(contact);
        // res.json({ id: contactId });
        res.status(500).send("Create Contact not implemented");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await contactService.getAllContacts();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getContactById = async (req, res) => {
    try {
        const contactId = req.params.id;
        const contact = await contactService.getContactById(contactId);
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}