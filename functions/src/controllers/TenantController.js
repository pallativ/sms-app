const tenantModel = require('../models/TenantModel');
const tenantService = require("../services/tenantService")
const { auth } = require('../../firebaseSetup');


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

exports.addTenantAdmin = async (req, res) => {
    try {
        if (req.user.email === "admin@msgrouter.in") {
            console.log("Adding Claims to admin user");
            setCustomClaim(req.user.uid, "tenant-admin");
            res.status(200).json({ message: 'current logged in user set as tenant admin' });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

async function setCustomClaim(userId, role) {
    try {
        await auth.setCustomUserClaims(userId, { role });
        console.log(`✅ Custom claim set: User ${userId} -> Role ${role}`);
    } catch (error) {
        console.error("❌ Error setting custom claim:", error);
    }
}
