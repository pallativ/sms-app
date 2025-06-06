const Joi = require('joi');

const UserSecuritySchema = Joi.object({
    tenants: Joi.array().required(),
    userId: Joi.string().required(),
    email: Joi.string().email().required(),
    roles: Joi.array().min(1).required(),
    permissions: Joi.array().min(1).required(),
    isBlocked: Joi.boolean().default(false),
    isVerified: Joi.boolean().default(false),
});

module.exports = { UserSecuritySchema };
