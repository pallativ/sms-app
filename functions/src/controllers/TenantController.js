const tenantModel = require('../models/TenantModel');
const tenantService = require("../services/tenantService")
const { auth } = require('../../firebaseSetup');

exports.createTenant = async (req, res) => {
    try {
        const { code, name, adminEmail } = req.body;
        if (req.user.role === "super-admin") {
            if (await tenantModel.checkTenantExists(code)) {
                res.status(409).json({ message: `Tenant already exists`, tenant: { code: code, name: name } });
            }
            else {
                const tenantDetails = await tenantService.createTenant({ code, name, adminEmail: adminEmail });
                res.status(201).json({ message: 'Tenant created successfully.', id: tenantDetails.tenantId });
            }
        }
        else {
            res.status(403).json({ message: 'Your are not authorized to create the tenant' });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

exports.addSuperAdmin = async (req, res) => {
    try {
        if (req.user.email === "admin@msgrouter.in") {
            console.log("Adding Claims to admin user");
            tenantModel.setCustomClaimRole(req.user.uid, "super-admin");
            res.status(200).json({ message: 'current logged in user set as tenant admin', email: req.user.email });
        }
        else
            res.status(400).json({ message: "Tenant Admin is not allowed for this user.", email: req.user.email });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

exports.getTenantUsers = async (req, res) => {
    try {
        const { tenantId } = req.params;
        if (req.user.role === "super-admin" || req.user.tenantCode === tenantCode) {
            const users = await tenantService.getTenantUsers(tenantId);
            res.status(200).json({ users });
        } else {
            res.status(403).json({ message: 'You are not authorized to view the users of this tenant' });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
}


