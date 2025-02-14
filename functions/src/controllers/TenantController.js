const tenantModel = require('../models/TenantModel');
const tenantService = require("../services/tenantService")

exports.createTenant = async (req, res) => {
    try {
        const { code, name, adminEmail } = req.body;
        if (await tenantModel.checkTenantExists(code)) {
            res.status(400).json({ message: `Tenant already exists`, tenantCode: code, name: name });
        }
        else {
            const tenantId = await tenantService.createTenant({ code, name, adminUserEmail: adminEmail });
            res.status(201).json({ message: 'Tenant created successfully.', id: tenantId });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
}
