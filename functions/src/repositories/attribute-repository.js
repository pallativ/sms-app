const { db } = require('../../firebaseSetup');

class AttributeRepository {
    constructor(custom_data_object_id) {
        this.collection = db.collection('custom-data-objects').get(custom_data_object_id).collection('attributes');
    }

    async getByName(name) {
        const snapshot = await this.collection.where('name', '==', name).get();
        if (snapshot.empty) return null;
        return snapshot.docs.map(doc => ({ id: doc.id, name: doc.name, }))[0];
    }

    async getAll() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async createOne(attribute) {
        const docRef = await this.collection.add(attribute);
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() };
    }

    async createMultiple(attributes) {
        const batch = this.db.batch();
        const refs = [];
        attributes.forEach(attr => {
            const docRef = this.collection.doc();
            batch.set(docRef, attr);
            refs.push(docRef);
        });
        await batch.commit();
        const docs = await Promise.all(refs.map(ref => ref.get()));
        return docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async deleteOne(id) {
        await this.collection.doc(id).delete();
        return { id };
    }

    async DeleteMany(ids) {
        const batch = this.db.batch();
        ids.forEach(id => {
            const docRef = this.collection.doc(id);
            batch.delete(docRef);
        });
        await batch.commit();
        return ids;
    }
}

module.exports = AttributeRepository;
