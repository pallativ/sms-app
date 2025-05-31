const { db } = require('../../firebaseSetup');
const _ = require('lodash');
const { buildObjectFromDoc } = require('../utils/object-extensions');
const TenantBaseRepository = require('./tenant-base-repository');
const fields = ["id", "name", "code", "description", "attributes", "createdAt", "updatedAt", "createdBy", "updatedBy" ];
class CustomDataObjectRepository extends TenantBaseRepository {
    constructor(tenantContext) {
        super(tenantContext); // Call the parent constructor if needed
        this.collection = db.collection("custom-data-objects");
    }

    async getAll() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => buildObjectFromDoc(doc, fields));
    }

    async getByName(name) {
        const snapshot = await this.collection.where("name", "==", name).get();
        return snapshot.docs.map(doc => buildObjectFromDoc(doc, fields));
    }

    async create(data) {
        var parentDoc = _.omit(data, ['attributes', 'records', 'auditLog']); // Ensure no unwanted fields are included)
        const docRef = await this.collection.add(parentDoc);
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() };
    }

    async delete(id) {
        await this.collection.doc(id).delete();
        return { id };
    }

    async edit(id, data) {
        await this.collection.doc(id).update(data);
        const doc = await this.collection.doc(id).get();
        return { id: doc.id, ...doc.data() };
    }
}

module.exports = CustomDataObjectRepository;
