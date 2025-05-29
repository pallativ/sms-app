// filepath: /c:/Dev/comm-grid/functions/src/models/schema/attributesModelSchema.js
const Joi = require('joi');

const optionSchema = Joi.object({
    label: Joi.string().required(),
    value: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean()).required()
});

// Define a validation schema using Joi
const attributesSchema = Joi.object({
    name: Joi.string().required().max(30),
    code: Joi.string().alphanum().required().max(100),
    type: Joi.string().valid('string', 'number', 'boolean', 'date', 'enum').required(),
    required: Joi.boolean().default(false).required(),
    order: Joi.number().integer().min(0).required(),
    default: Joi.any(),
    multiselect: Joi.boolean().default(false).required(),
    options: Joi.alternatives()
        .conditional('type', {
            is: 'enum',
            then: Joi.array().items(optionSchema).min(1).required(),
            otherwise: Joi.forbidden()
        })
});

// Dynamic rendering of the UI based on the attribute type
// Control trpe
// Tooltip.
// Custom validation function.
// Visible If condition is met.



module.exports = attributesSchema;
