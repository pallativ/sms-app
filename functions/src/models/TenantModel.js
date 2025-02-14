const admin = require("firebase-admin");
const db = admin.firestore();
const { logger } = require('firebase-functions');

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
            adminEmail,
            users: [adminEmail], // Owner is the first user
        });
        return tenantRef.id; // Return the new tenant's ID
    } catch (error) {
        logger.error("Error", error);
        throw new Error("Error in creating the tenant");
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


exports.addUserToTenant = async (tenantCode, userId, email, displayName, role) => {
    const userRef = db.collection(tenants).get(tenantCode).collection("users").doc(userId);
    await userRef.set({
        tenantId,
        email,
        displayName,
        role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection("tenants").doc(tenantId).update({
        users: admin.firestore.FieldValue.arrayUnion(userId),
    });

    console.log(`User ${displayName} (${email}) added to Tenant ${tenantId} with Role: ${role}`);
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
