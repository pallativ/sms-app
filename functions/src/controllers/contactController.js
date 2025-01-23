const contactService = require('../services/contactService');

exports.createContact = async (req, res) => {
    try {
        const contact = { Id: 1, name: 'John Doe', email: 'john@gmail.com', phone: '1234567890' };
        const contactId = await contactService.createContact(contact);
        res.json({ id: contactId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await contactService.getAllContacts();
        return res.status(200).send(contacts);
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