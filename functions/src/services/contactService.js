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
    tags: Joi.array().items(Joi.string()).default([]),
    // Dynamic customFields validation
    customFields: Joi.object().pattern(
        Joi.string(),  // Any key is allowed
        Joi.alternatives().try(
            Joi.string(),     // Can be a string
            Joi.number(),     // Can be a number
            Joi.boolean(),    // Can be a boolean
            Joi.date().iso()  // Can be a valid ISO date string
        )
    ).default({})
});


exports.getAllContacts = async (userEmail) => {
    try {
        const contacts = await contactModel.getAllContacts(userEmail);
        return contacts;
    } catch (error) {
        throw new Error('Error fetching contacts: ' + error.message);
    }
}

exports.createContact = async (userInfo, contact) => {
    const { error, value } = contactSchema.validate(contact, { abortEarly: false });
    if (error) {
        const validationError = new Error('Validation Error');
        validationError.details = error.details.map((err) => ({ message: err.message, path: err.path, }));
        validationError.statusCode = 400; // Bad Request
        throw validationError;;
    }
    if (await contactModel.isExists(userInfo, value.email)) {
        const validationError = new Error('Validation Error');
        validationError.details = [{ message: 'Contact already exists', path: ['email'] }];
        validationError.statusCode = 409; // Conflict
        throw validationError;;
    }

    const contactId = await contactModel.createContact(userInfo, value);
    return contactId;
}

exports.updateContact = async (userInfo, contact) => {
    const { error, value } = contactSchema.validate(contact, { abortEarly: false });
    if (error) {
        const validationError = new Error('Validation Error');
        validationError.details = error.details.map((err) => ({ message: err.message, path: err.path, }));
        validationError.statusCode = 400; // Bad Request
        throw validationError;
    }

    const existingContact = await contactModel.isExists(userInfo, value.email);
    if (!existingContact) {
        const notFoundError = new Error('Contact not found');
        notFoundError.statusCode = 404; // Not Found
        throw notFoundError;
    }

    await contactModel.createContact(userInfo, value);
    return { message: 'Contact updated successfully' };
}
