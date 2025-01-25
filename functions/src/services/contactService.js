const contactModel = require('../models/contactModel');
const Joi = require('joi');

// Define a validation schema using Joi
const contactSchema = Joi.object({
    firstName: Joi.string().min(3).max(30).required().messages({
        'string.base': 'First Name must be a string',
        'string.min': 'First Name must be at least 3 characters long',
        'string.max': 'First Name must be less than or equal to 30 characters',
        'any.required': 'First Name is required',
    }),
    lastName: Joi.string().min(3).max(30).messages({
        'string.base': 'Last Name must be a string',
        'string.min': 'Last Name must be at least 3 characters long',
        'string.max': 'Name must be less than or equal to 30 characters',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),
    phoneNumber: Joi.string().min(10).required().messages({
        'string.base': 'Phone number must be a string',
        'string.min': 'Phone number must be at least 10',
        'any.required': 'Phone number is required',
    }),
});


exports.getAllContacts = async () => {
    try {
        const contacts = await contactModel.getAllContacts();
        return contacts;
    } catch (error) {
        throw new Error('Error fetching contacts: ' + error.message);
    }
}

exports.createContact = async (contact) => {
    const { error, value } = contactSchema.validate(contact, { abortEarly: false });
    if (error) {
        const validationError = new Error('Validation Error');
        validationError.details = error.details.map((err) => ({ message: err.message, path: err.path, }));
        validationError.statusCode = 400; // Bad Request
        throw validationError;;
    }
    if (await contactModel.isExists(value.email)) {
        const validationError = new Error('Validation Error');
        validationError.details = [{ message: 'Contact already exists', path: ['email'] }];
        validationError.statusCode = 400; // Bad Request
        throw validationError;;
    }

    const contactId = await contactModel.createContact(value);
    return contactId;
}

