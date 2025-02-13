const admin = require("firebase-admin");
const db = admin.firestore();

exports.createTenant = async (code, name, ownerUserId, subscriptionPlan) => {
    const tenantRef = db.collection("tenants").doc(`${name}`);
    if (!await this.checkTenantExists(code)) {
        throw new Error("Tenant with the given name exists.")
    }

    await tenantRef.set({
        code,
        name,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        ownerUserId,
        subscriptionPlan,
        users: [ownerUserId], // Owner is the first user
    });

    return tenantRef.id; // Return the new tenant's ID
}

exports.checkTenantExists = async (code) => {
    const tenantsRef = db.collection("tenants");
    const querySnapshot = await tenantsRef.where("code", "==", code).get();

    if (querySnapshot.empty) {
        console.log(`❌ Tenant with name "${tname}" does not exist.`);
        return false; // Tenant does not exist
    }

    const tenantId = querySnapshot.docs[0].id;
    console.log(`✅ Tenant found! ID: ${tenantId}, Name: ${tname}`);
    return true; // Return the tenant's ID
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
