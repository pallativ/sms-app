const admin = require("firebase-admin");
const db = admin.firestore();
const { logger } = require('firebase-functions');
const { auth } = require('../../firebaseSetup');

exports.createTenant = async ({ code, name, adminEmail }) => {
    try {
        const tenantRef = await db.collection("tenants").doc(code);
        if (await this.checkTenantExists(code)) {
            throw new Error("Tenant with the given name exists.")
        }
        const result = await tenantRef.set({
            code,
            name,
            createdAt: new Date(),
            adminEmail
        });
        return tenantRef.id; // Return the new tenant's ID
    } catch (error) {
        logger.error("Error", error);
        throw new Error("Error in creating the tenant");
    }
}

exports.getTenantUsers = async (tenantCode) => {
    try {
        const usersRef = db.collection("tenants").doc(tenantCode).collection("users");
        const snapshot = await usersRef.get();
        if (snapshot.empty) {
            logger.info(`No users found for tenant with code "${tenantCode}".`);
            return [];
        }
        const users = [];
        snapshot.forEach(doc => {
            users.push(doc.data());
        });
        return users;
    } catch (error) {
        logger.error("Error fetching tenant users", error);
        throw new Error("Error in fetching tenant users");
    }
}

exports.checkTenantExists = async (code) => {
    const tenantsRef = await db.collection("tenants").doc(code).get();
    if (tenantsRef.exists) {
        logger.info(`Tenant with name "${code}" does not exist.`);
        return true;
    }
    return false;
}

exports.assignUserToTenant = async (tenantCode, uid, email) => {
    const userRef = await db.collection("tenants").doc(tenantCode).collection("users").doc(email);
    const result = await userRef.set({
        uid,
        email
    });
    logger.info("Assigned user to tenant", { uid, email })
}

exports.getTenantsByUserEmail = async (email) => {
    const docRef = db.collection("users").doc(email)
    const doc = await docRef.get();
    if (doc.exists) {
        const tenants = [];
        for (const tenant of doc.data().tenants) {
            var tenantDoc = await db.collection("tenants").doc(tenant).get();
            tenants.push({ "id": tenantDoc.id, ...tenantDoc.data() });
        }
        return tenants;
    }
    else {
        logger.info(`No tenants found for user with email "${email}".`);
        return [];
    }
}


exports.setCustomClaimByName = async (uid, claimName, claimValue) => {
    try {
        const user = await auth.getUser(uid);
        const currentClaims = user.customClaims || {}; // Default to empty object
        currentClaims[claimName] = claimValue;
        //logger.info("Auth Custom Claims:",user.customClaims)
        logger.info(currentClaims);
        await auth.setCustomUserClaims(uid, currentClaims);
        //logger.info(`✅ Custom claim set: User ${uid} -> ${claimName}: ${claimValue}`);
    } catch (error) {
        //logger.error("❌ Error setting custom claim:", error);
        throw new Error("Error in setting custom claim");
    }
}

exports.setCustomClaimRole = async (userId, role) => {
    try {
        await auth.setCustomUserClaims(userId, { role: role });
        //console.log(`✅ Custom claim set: User ${userId} -> Role ${role}`);
    } catch (error) {
        console.error("❌ Error setting custom claim:", error);
    }
}

exports.getAllTenants = async () => {
    try {
        const tenantsRef = db.collection("tenants");
        const snapshot = await tenantsRef.get();
        if (snapshot.empty) {
            logger.info("No tenants found.");
            return [];
        }
        const tenants = [];
        snapshot.forEach(doc => {
            tenants.push({ id: doc.id, ...doc.data() });
        });
        return tenants;
    } catch (error) {
        logger.error("Error fetching tenants", error);
        throw new Error("Error in fetching tenants");
    }
}

exports.getUserByEmail = async (email) => {
    try {
        const userRecord = await auth.getUserByEmail(email);
        return userRecord;
    }
    catch (error) {
        logger.debug(`unable to find the user with email: ${email}`, error);
        return null;
    }
}


// create a method to disable the user using auth
exports.enableOrDisableUser = async (email, isEnabled) => {
    try {
        const userRecord = await this.getUserByEmail(email);
        if (!userRecord) {
            throw new Error(`User with email ${email} not found`);
        }
        await auth.updateUser(userRecord.uid, { disabled: !isEnabled });
        const action = isEnabled ? "enabled" : "disabled";
        logger.info(`User ${email} has been ${action}.`);
    } catch (error) {
        logger.error("Error updating user status", error);
        throw new Error("Error in updating user status");
    }
}

