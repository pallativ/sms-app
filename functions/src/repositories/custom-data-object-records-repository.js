const { db } = require('../../firebaseSetup');
const { buildObjectFromDoc } = require('../utils/object-extensions');
const fields = ["id", "data", "createdBy", "updatedBy", "createdAt", "updatedAt"];

class CustomDataObjectRecordsRepository {
    constructor() {
    }

    getCollection(custom_data_object_id) {
        return db.collection('custom-data-objects').doc(custom_data_object_id).collection('records');
    }

    async getById(custom_data_object_id, id) {
        const doc = await this.getCollection(custom_data_object_id).doc(id).get();
        if (!doc.exists) return null;
        return buildObjectFromDoc(doc, fields);
    }

    async getAll(custom_data_object_id) {
        const snapshot = await this.getCollection(custom_data_object_id).get();
        if (snapshot.empty) return null;
        return snapshot.docs.map(doc => buildObjectFromDoc(doc, fields));
    }

    async createOne(custom_data_object_id, record) {
        const collectionRef = this.getCollection(custom_data_object_id);
        const docRef = await collectionRef.add(record);
        const doc = await docRef.get();
        return buildObjectFromDoc(doc, fields);
    }

    async createMultiple(custom_data_object_id, records) {
        const batch = db.batch();
        const refs = [];
        records.forEach(rec => {
            const docRef = this.getCollection(custom_data_object_id).doc();
            batch.set(docRef, rec);
            refs.push(docRef);
        });
        await batch.commit();
        const docs = await Promise.all(refs.map(ref => ref.get()));
        return docs.map(doc => buildObjectFromDoc(doc, fields));
    }

    async updateOne(custom_data_object_id, id, data) {
        const docRef = this.getCollection(custom_data_object_id).doc(id);
        await docRef.update(data);
        const doc = await docRef.get();
        return buildObjectFromDoc(doc, fields);
    }

    async deleteOne(custom_data_object_id, id) {
        await this.getCollection(custom_data_object_id).doc(id).delete();
        return { id };
    }

    async deleteMany(custom_data_object_id, ids) {
        const batch = db.batch();
        const deleted_ids = [];
        ids.forEach(id => {
            const docRef = this.getCollection(custom_data_object_id).doc(id);
            deleted_ids.push(docRef.id);
            batch.delete(docRef);
        });
        await batch.commit();
        return deleted_ids;
    }
}

module.exports = new CustomDataObjectRecordsRepository();
