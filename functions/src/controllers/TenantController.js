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
                console.log(tenantDetails)
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
            setCustomClaim(req.user.uid, "super-admin");
            res.status(200).json({ message: 'current logged in user set as tenant admin', email: req.user.email });
        }
        else
            res.status(400).json({ message: "Tenant Admin is not allowed for this user.", email: req.user.email });
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
