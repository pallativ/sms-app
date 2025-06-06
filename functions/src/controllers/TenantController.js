const tenantModel = require('../models/TenantModel');
const tenantService = require("../services/tenant-servce")
const { auth } = require('../../firebaseSetup');

exports.createTenant = async (req, res) => {
    try {
        const { code, name, adminEmail } = req.body;
        if (await tenantModel.checkTenantExists(code)) {
            res.status(409).json({ message: `Tenant already exists`, tenant: { code: code, name: name } });
        }
        else {
            const tenantDetails = await tenantService.createTenant({ code, name, adminEmail: adminEmail });
            res.status(201).json({ message: 'Tenant created successfully.', id: tenantDetails.tenantId });
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
        console.log("Adding Claims to admin user");
        tenantModel.setCustomClaimRole(req.user.uid, "tenant-admin");
        res.status(200).json({ message: 'current logged in user set as tenant admin', email: req.user.email });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

exports.getTenantUsers = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const users = await tenantService.getTenantUsers(tenantId);
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}


