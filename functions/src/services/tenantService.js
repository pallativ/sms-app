const tenantModel = require('../models/TenantModel');

exports.createTenant = async (tenantDetails) => {
    try {
        const tenantId = await tenantModel.createTenant(tenantDetails);
        return tenantId;
    }
    catch (error) {
        throw Error("Error in creating the tenant")
    }
}
