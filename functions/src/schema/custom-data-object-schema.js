const Joi = require('joi');
const attributeModelSchema = require('../../src/schema/attributes-schema');

const customDataObjectSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().max(100).required(),
    internalName: Joi.string().max(100).required(),
    code: Joi.string().alphanum().max(100).required(),
    description: Joi.string().max(1000).required(),
    attributes: Joi.array().items(attributeModelSchema).min(1).required(), // Contains the attributes of the custom data object.
    records: Joi.array().items(Joi.object()).default([]), // Actual records of the custom data object.
    auditLog: Joi.object().default([]), // Audit log for the custom data object.
    createdAt: Joi.string().isoDate().required(),
    updatedAt: Joi.string().isoDate().required(),
    createdBy : Joi.string().required(),
    updatedBy: Joi.string().required(),
});

module.exports = customDataObjectSchema;
