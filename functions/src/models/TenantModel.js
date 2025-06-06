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

exports.getTenantByUserEmail = async (email) => {
    const tenantsRef = db.collection("tenants");
    const querySnapshot = await tenantsRef.where("users", "array-contains", email).get();

    if (querySnapshot.empty) {
        throw new Error(`❌ No tenant found for user with email "${email}".`);
    }

    const tenantData = querySnapshot.docs[0].data();
    return { code: tenantData.code, name: tenantData.name };
}

exports.setCustomClaimByName = async (uid, claimName, claimValue) => {
    try {
        const user = await auth.getUser(uid);
        const currentClaims = user.customClaims || {}; // Default to empty object
        currentClaims[claimName] = claimValue;
        logger.info("Auth Custom Claims:",user.customClaims)
        logger.info(currentClaims);
        await auth.setCustomUserClaims(uid, currentClaims);
        logger.info(`✅ Custom claim set: User ${uid} -> ${claimName}: ${claimValue}`);
    } catch (error) {
        logger.error("❌ Error setting custom claim:", error);
        throw new Error("Error in setting custom claim");
    }
}
exports.setCustomClaimRole = async (userId,  role) => {
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
            tenants.push(doc.data());
        });
        return tenants;
    } catch (error) {
        logger.error("Error fetching tenants", error);
        throw new Error("Error in fetching tenants");
    }
}
