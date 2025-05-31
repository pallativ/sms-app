const { db } = require('../../firebaseSetup');
const { buildObjectFromDoc } = require('../utils/object-extensions');
const TenantBaseRepository = require('./tenant-base-repository'); // Assuming this is the base repository class
const fields = ["id", "name", "code", "type", "required", "order", "default", "multiselect", "updatedBy"];

class AttributeRepository extends TenantBaseRepository {
    constructor(tenantContext) {
        super(tenantContext); // Call the parent constructor if needed
        this.tenantContext = tenantContext; // Store tenant context if needed
    }


    getCollection(custom_data_object_id) {
        return this.getTenant().collection('custom-data-objects').doc(custom_data_object_id).collection('attributes');
    }

    async getByName(custom_data_object_id, name) {
        const snapshot = await this.getCollection(custom_data_object_id).where('name', '==', name).get();
        if (snapshot.empty) return null;
        return snapshot.docs.map(doc => buildObjectFromDoc(doc, fields))[0];
    }

    async getAll(custom_data_object_id) {
        const snapshot = await this.getCollection(custom_data_object_id).get();
        if (snapshot.empty) return null;
        return snapshot.docs.map(doc => {
            /*console.log('Attribute:', doc.id, doc.data());*/
            return buildObjectFromDoc(doc, fields);
        });
    }

    async createOne(custom_data_object_id, attribute) {
        var collectionRef =  this.getCollection(custom_data_object_id);
        const docRef = await collectionRef.add(attribute);
        const doc = await docRef.get();
        return buildObjectFromDoc(doc, fields);
    }

    async createMultiple(custom_data_object_id, attributes) {
        const batch = db.batch();
        const refs = [];
        attributes.forEach(attr => {
            const docRef = this.getCollection(custom_data_object_id).doc();
            batch.set(docRef, attr);
            refs.push(docRef);
        });
        await batch.commit();
        const docs = await Promise.all(refs.map(ref => ref.get()));
        return docs.map(doc => buildObjectFromDoc(doc, fields));
    }

    async deleteOne(custom_data_object_id, id) {
        await this.getCollection(custom_data_object_id).doc(id).delete();
        return { id };
    }

    async deleteMany(custom_data_object_id, ids) {
        const batch = db.batch();
        var deleted_ids = [];
        ids.forEach(id => {
            const docRef = this.getCollection(custom_data_object_id).doc(id);
            deleted_ids.push(docRef.id);
            batch.delete(docRef);
        });
        await batch.commit();
        return deleted_ids;
    }
}

module.exports = AttributeRepository;
