const contactService = require('../services/contactService');

exports.createContact = async (req, res) => {
    try {
        const contactId = await contactService.createContact({ userId:req.user.uid, email: req.user.email }, req.body);
        res.status(201).json({ message: 'Contact created successfully.', id: contactId });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await contactService.getAllContacts(req.user.email);
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
