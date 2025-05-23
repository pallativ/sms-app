const tenantModel = require('../models/TenantModel');
const { auth } = require('../../firebaseSetup');
const { logger } = require('firebase-functions');

exports.createTenant = async (tenantDetails) => {
    try {

        // Creating the tenant.
        const tenantCode = await tenantModel.createTenant(tenantDetails);

        // fetch user by email address.
        let userRecord = await getUserByEmail(tenantDetails.adminEmail)

        // Check if the user already exists.
        if (userRecord == null) {
            // Creating the admin record for the tenant.
            userRecord = await auth.createUser({
                email: tenantDetails.adminEmail,
                password: "msgrouter@123",
                displayName: tenantDetails.adminEmail,
            });
        }

        // Assigning the user to tenant.
        await tenantModel.assignUserToTenant(tenantCode, userRecord.uid, userRecord.email);

        // assigning the claims to tenant Admin.
        await tenantModel.setCustomClaimByName(userRecord.uid, "tenantCode", [tenantCode]);
        await tenantModel.setCustomClaimByName(userRecord.uid, "role", ["tenant-admin"]);

        return { tenantCode, uid: userRecord.uid };
    }
    catch (error) {
        logger.error('Error in creating the tenant', error);
        throw new Error("Error in creating the tenant");
    }
}

exports.getAllTenants = async () => {
    try {
        const tenants = await tenantModel.getAllTenants();
        return tenants;
    } catch (error) {
        logger.error('Error in retrieving all tenants', error);
        throw new Error("Error in retrieving all tenants");
    }
}

exports.getUsersByTenant = async (tenantCode) => {
    try {
        const users = await tenantModel.getTenantUsers(tenantCode);
        return users;
    } catch (error) {
        logger.error('Error in retrieving users by tenant', error);
        throw new Error("Error in retrieving users by tenant");
    }
}

exports.impersonateSuperAdmin = async (userInfo, tenantCode) => {
    try {
        // Assigning the claims to impersonate tenant Admin.
        await tenantModel.setCustomClaimByName(userInfo.uid, "tenantCode", [tenantCode]);
        return { message: "Impersonation successful", uid: userRecord.uid };
    } catch (error) {
        logger.error('Error in impersonating tenant admin', error);
        throw new Error("Error in impersonating tenant admin");
    }
}

async function getUserByEmail(email) {
    try {
        const userRecord = await auth.getUserByEmail(email);
        return userRecord;
    }
    catch (error) {
        logger.error("Error in retrieving the user by email", error);
        return null;
    }
}


