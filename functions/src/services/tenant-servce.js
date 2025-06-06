const tenantModel = require('../models/TenantModel');
const { auth } = require('../../firebaseSetup');
const { logger } = require('firebase-functions');
const AuthorizationRepository = require("../repositories/authorization-repository")


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
                password: "Dhishakti@123",
                displayName: tenantDetails.adminEmail,
            });
        }

        // Assigning the user to tenant.
        await tenantModel.assignUserToTenant(tenantCode, userRecord.uid, userRecord.email);

        // assigining the roles to the users.
        var userInfo = {
            userId: userRecord.uid,
            email: userRecord.email,
            tenants: [tenantCode],
            roles: ["tenant-user"],
            permissions: ["all"],
        }

        var authRepository = new AuthorizationRepository();
        var result = await authRepository.isValid(userInfo);
        if (result.isValid) {
            if (await authRepository.getUserByEmail(userRecord.email) == null) {
                await authRepository.addUser(result.value);
            }
            else {
                await authRepository.addTenant(userRecord.email, tenantCode);
            }
            logger.debug("assigned the user to the tenant and added role 'tenant-user'")
        }
        else {
            logger.debug("validation result:", result);
            throw new Error("Error in assigning the roles and tenants to the user.");
        }

        // assigning the claims to tenant Admin.
        await tenantModel.setCustomClaimByName(userRecord.uid, "tenantCode", [tenantCode]);
        await tenantModel.setCustomClaimByName(userRecord.uid, "roles", ["tenant-user"]);

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

exports.getTenantUsers = async (tenantCode) => {
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


