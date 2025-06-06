const Joi = require('joi');

const TenantSchema = Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required(),
    adminEmail: Joi.string().email().required(),
});

const AssignTenantUserSchema = Joi.object({
    tenantCode: Joi.string().required(),
    userEmail: Joi.string().email().required(),
})

module.exports = { TenantSchema, AssignTenantUserSchema };
