const repository = require('../../src/repositories/custom-data-object-records-repository');
const { db } = require('../../firebaseSetup');
const { ValidAttributes } = require('../data-providers/attributes-provider');

const TEST_COLLECTION_ID = 'records';
let createdRecordId;

describe('CustomDataObjectRecordsRepository', () => {
    const testRecord = {
        data: { foo: 'bar' },
        createdBy: 'user1',
        updatedBy: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attributes: [ValidAttributes.FirstNameAttribute, ValidAttributes.LastNameAttribute]
    };

    beforeAll(async () => {

    });
    afterAll(async () => {
        // Clean up test data
        const snapshot = await repository.getCollection(TEST_COLLECTION_ID).get();
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
    });

    test('createOne should add a record and return it', async () => {
        const result = await repository.createOne(TEST_COLLECTION_ID, testRecord);
        expect(result).toMatchObject({
            data: testRecord.data,
            createdBy: testRecord.createdBy,
            updatedBy: testRecord.updatedBy
        });
        expect(result.id).toBeDefined();
        createdRecordId = result.id;
    });

    test('getById should return the created record', async () => {
        const result = await repository.getById(TEST_COLLECTION_ID, createdRecordId);
        expect(result).not.toBeNull();
        expect(result.id).toBe(createdRecordId);
        expect(result.data).toEqual(testRecord.data);
    });

    test('getAll should return all records', async () => {
        const results = await repository.getAll(TEST_COLLECTION_ID);
        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeGreaterThan(0);
    });

    test('updateOne should update a record', async () => {
        const updatedData = { data: { foo: 'baz' }, updatedBy: 'user2', updatedAt: new Date().toISOString() };
        const result = await repository.updateOne(TEST_COLLECTION_ID, createdRecordId, updatedData);
        expect(result.data).toEqual(updatedData.data);
        expect(result.updatedBy).toBe('user2');
    });

    test('deleteOne should remove a record', async () => {
        const delResult = await repository.deleteOne(TEST_COLLECTION_ID, createdRecordId);
        expect(delResult).toEqual({ id: createdRecordId });
        const result = await repository.getById(TEST_COLLECTION_ID, createdRecordId);
        expect(result).toBeNull();
    });

    test('createMultiple should add multiple records', async () => {
        const records = [
            { data: { a: 1 }, createdBy: 'u', updatedBy: 'u', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { data: { b: 2 }, createdBy: 'u', updatedBy: 'u', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { data: { b: 3 }, createdBy: 'u', updatedBy: 'u', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        ];
        const results = await repository.createMultiple(TEST_COLLECTION_ID, records);
        expect(results.length).toBe(3);
        expect(results[0].data).toEqual(records[0].data);
        expect(results[1].data).toEqual(records[1].data);
        expect(results[2].data).toEqual(records[2].data);
    });

    test('deleteMany should remove multiple records', async () => {
        const all = await repository.getAll(TEST_COLLECTION_ID);
        const ids = all.map(r => r.id);
        const deleted = await repository.deleteMany(TEST_COLLECTION_ID, ids);
        expect(deleted.sort()).toEqual(ids.sort());
        const after = await repository.getAll(TEST_COLLECTION_ID);
        expect(after).toBeNull();
    });
});
