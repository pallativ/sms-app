const { db } = require('../../firebaseSetup');
const { buildObjectFromDoc } = require('../utils/object-extensions');
const fields = ["id", "name", "code", "description"];
class CustomDataObjectRepository {
    constructor() {
        this.collection = db.collection("custom-data-objects");
    }

    async getAll() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => buildObjectFromDoc(doc, fields));
    }

    async create(data) {
        const docRef = await this.collection.add(data);
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

module.exports = new CustomDataObjectRepository();
