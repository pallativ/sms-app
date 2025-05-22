const Joi = require('joi');
const attributeModelSchema = require('./attributesSchema');

const customDataObjectSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().max(100).required(),
    internalName: Joi.string().max(100).required(),
    code: Joi.string().alphanum().max(100).required(),
    description: Joi.string().required(),
    attributes: Joi.array().items(attributeModelSchema).min(1).required(),
    createdAt: Joi.string().isoDate().required(),
    updatedAt: Joi.string().isoDate().required(),
    createdBy : Joi.string().required(),
    updatedBy : Joi.string().required()
});

module.exports = customDataObjectSchema;
