const tenantModel = require('../models/TenantModel');
const { auth } = require('../../firebaseSetup');
const { logger } = require('firebase-functions');

exports.createTenant = async (tenantDetails) => {
    try {

        // Creating the tenant.
        const tenantId = await tenantModel.createTenant(tenantDetails);

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

        return { tenantId, uid: userRecord.uid };
    }
    catch (error) {
        logger.error('Error in creating the tenant', error);
        throw new Error("Error in creating the tenant");
    }
}


async function isUserExists(email) {
    try {
        const userRecord = await auth.getUserByEmail(email);
        return true;
    }
    catch (error) {
        return false;
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
