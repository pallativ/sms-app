const { db } = require('../../firebaseSetup');
const { UserSecuritySchema } = require("../schema/user-security-schema")
class AuthorizationRepository {
    constructor() {
        this.collection = db.collection('users');
    }

    async addUser(userInfo) {
        await this.collection.doc(userInfo.email).set(userInfo);
        return userInfo;
    }

    async isValid(userInfo) {
        const { error, value } = UserSecuritySchema.validate(userInfo);
        return {
            isValid: error === undefined,
            error,
            value
        };
    }

    async getUserById(userId) {
        const snapshot = await this.collection.where("userId", '==', userId).get();
        return snapshot.empty ? null : snapshot.docs[0].data();
    }

    async getUserByEmail(email) {
        const doc = await this.collection.doc(email).get();
        return doc.exists ? doc.data() : null;
    }

    async getUserByEmail(email) {
        const doc = await this.collection.doc(email).get();
        return doc.exists ? doc.data() : null;
    }

    async updateRoles(email, roles) {
        const userRef = this.collection.doc(email);
        const doc = await userRef.get();
        if (doc.exists) {
            const existingRoles = doc.data().roles || [];
            const updatedRoles = Array.from(new Set([...existingRoles, ...roles])); // Merge and remove duplicates
            await userRef.update({ roles: updatedRoles });
            return { ...doc.data(), roles: updatedRoles };
        }
        return null;
    }

    async addTenant(email, tenant) {
        const userRef = this.collection.doc(email);
        const doc = await userRef.get();
        if (doc.exists) {
            const existingTenants = doc.data().tenants || [];
            const updatedTenants = Array.from(new Set([...existingTenants, tenant])); // Merge and remove duplicates
            await userRef.update({ tenants: updatedTenants });
            return { ...doc.data(), tenants: updatedTenants };
        }
        return null;
    }

    async removeTenant(email, tenant) {
        const userRef = this.collection.doc(email);
        const doc = await userRef.get();
        if (doc.exists) {
            const existingTenants = doc.data().tenants || [];
            const updatedTenants = existingTenants.filter(t => t !== tenant); // Remove the specified tenant
            await userRef.update({ tenants: updatedTenants });
            return { ...doc.data(), tenants: updatedTenants };
        }
        return null;
    }

    async updatePermissions(email, permissions) {
        const userRef = this.collection.doc(email);
        const doc = await userRef.get();
        if (doc.exists) {
            const existing = doc.data().permissions || [];
            const new_persmissions = Array.from(new Set([...existing, ...permissions])); // Merge and remove duplicates
            await userRef.update({ permissions: new_persmissions });
            return { ...doc.data(), permissions: new_persmissions };
        }
        return null;
    }

    async removeUser(email) {
        const userRef = this.collection.doc(email);
        const doc = await userRef.get();
        if (doc.exists) {
            await userRef.delete();
            return doc.data();
        }
        return null;
    }

    async blockUser(email) {
        const userRef = this.collection.doc(email);
        const doc = await userRef.get();
        if (doc.exists)
            return userRef.update({ isBlocked: true });
        return null;
    }

    async unblockUser(email) {
        const userRef = this.collection.doc(email);
        const doc = await userRef.get();
        if (doc.exists)
            return userRef.update({ isBlocked: false });
        return null;
    }

    async getAllUsers() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => doc.data());
    }

    async getUsersByTenant(tenant) {
        return this.collection.where("tenants", "array-contains", tenant).get().then(snapshot => {
            if (snapshot.empty) return [];
            return snapshot.docs.map(doc => doc.data());
        });
    }

}

module.exports = AuthorizationRepository;
