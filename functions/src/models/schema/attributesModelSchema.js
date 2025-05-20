// filepath: /c:/Dev/comm-grid/functions/src/models/schema/attributesModelSchema.js
const Joi = require('joi');

// Define a validation schema using Joi
const attributeModelSchema = Joi.object({
    name: Joi.string().required().max(30).messages({
        'string.base': 'Name must be a string',
        'string.max': 'Name must be less than or equal to 30 characters',
        'any.required': 'Name is required',
    }),
    code: Joi.string().alphanum().required(),
    type: Joi.string().valid('string', 'number', 'boolean', 'date', 'value-set').required(),
    is_required: Joi.boolean().required(),
    values : Joi.array().items(Joi.string()).when(Joi.object({ type: Joi.string().valid('value-set') }).unknown(), {
        then: Joi.required(),
        otherwise: Joi.optional()
    }).messages({
        'array.base': 'Values must be an array',
        'any.required': 'Values are required when type is value-set',
    }),
    id_columns : Joi.array().items(Joi.string()).required().messages({
        'array.base': 'Attributes must be an array',
    })
});

module.exports = attributeModelSchema;
