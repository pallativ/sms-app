const tenantModel = require('../models/TenantModel');
const tenantService = require("../services/tenant-servce")
const { TenantSchema } = require('../schema/small-schema');
exports.createTenant = async (req, res) => {
    try {
        const { error, value } = TenantSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(500).json({ validations : error.details });
        }
        const { code, name, adminEmail } = value;
        if (await tenantModel.checkTenantExists(code)) {
            return res.status(409).json({ message: `Tenant already exists`, tenant: { code: code, name: name } });
        }
        else {
            const tenantDetails = await tenantService.createTenant({ code, name, adminEmail: adminEmail });
            return res.status(201).json({ message: 'Tenant created successfully.', id: tenantDetails.tenantId });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

exports.getAllTenants = async (req, res) => {
    try {
        const tenants = await tenantService.getAllTenants();
        res.status(200).json({ tenants });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

exports.addSuperAdmin = async (req, res) => {
    try {
        //console.log("Adding Claims to admin user");
        tenantModel.setCustomClaimRole(req.user.uid, "tenant-admin");
        return res.status(200).json({ message: 'current logged in user set as tenant admin', email: req.user.email });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

exports.getTenantUsers = async (req, res) => {
    try {
        const { tenantId } = req.params;
        console.log("Fetching users for tenant:", tenantId);
        const users = await tenantService.getTenantUsers(tenantId);
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}


