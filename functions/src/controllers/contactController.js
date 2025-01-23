const contactService = require('../services/contactService');

exports.createContact = async (req, res) => {
    try {
        // const contact = req.body;
        // const contactId = await contactService.createContact(contact);
        // res.json({ id: contactId });

        console.log("************ Create Contact not implemented ************");
        console.log("************ Create Contact not implemented ************");
        console.log("************ Create Contact not implemented ************");
        res.status(500).send("Create Contact not implemented");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await contactService.getAllContacts();
        console.log("************ Get All Contacts ************");
        console.log("************ Get All Contacts ************");
        console.log("************ Get All Contacts ************");
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