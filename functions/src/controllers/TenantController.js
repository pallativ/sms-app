const tenantModel = require('../models/TenantModel');

exports.createTenant = async (req, res) => {
    try {
        const { code, name } = req.body;
        console.log(req.body);
        const tenantId = await tenantModel.createTenant(code, name, req.user.email);
        res.status(201).json({ message: 'Tenant created successfully.', id: tenantId });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}
