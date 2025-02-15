const contactService = require('../services/contactService');
const contactModel = require('../models/contactModel');
const { logger } = require('firebase-functions');
exports.createContact = async (req, res) => {
    try {
        const contactId = await contactService.createContact(req.userInfo, req.body);
        res.status(201).json({ message: 'Contact created successfully.', id: contactId });
    } catch (error) {
        logger.error("Error in creating contact", error);
        res.status(500).json({ error: error });
    }
}

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await contactService.getAllContacts(req.userInfo);
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

exports.getTags = async (req, res) => {
    try {
        var tags = await contactModel.getTags(req.user.email);
        res.json(tags).status(200);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getCustomFields = async (req, res) => {
    try {
        var tags = await contactModel.getCustomFields(req.user.email);
        res.json(tags).status(200);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
