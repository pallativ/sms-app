const attributeRepository = require('../../src/repositories/attribute-repository');
const customDataObjectRepository = require('../../src/repositories/custom-data-object-repository');


jest.setTimeout(10000);
describe('Verify Attributes Repository', () => {
    const validAttribute = {
        code: "firstName",
        order: 1,
        name: 'First Name',
        type: 'string',
        multiselect: false,
        id_columns: ["id"],
        required: true,
    };
    const newCdo = {
        name: 'test-cdo-id', code: 'test-cdo-id', description: "Description", attributes: [validAttribute],
        records: [{ firstName: 'Veera', type: "string", isRequired: true }]
    };

    // Clean up before and after
    beforeAll(async () => {
        // Ensure test collection exists
        await customDataObjectRepository.delete(newCdo.name);
        await customDataObjectRepository.create(newCdo);
        await attributeRepository.createOne(newCdo.name, validAttribute);
    });

    afterAll(async () => {
        // Delete all attributes in test collection
        const attrs = await attributeRepository.getAll(newCdo.name);
        for (const attr of attrs) {
            await attributeRepository.deleteOne(newCdo.name, attr.id);
        }
        await customDataObjectRepository.delete(newCdo.name);
    });

    test('createOne should add an attribute', async () => {
        const attr = { name: 'color', value: 'red' };
        const created = await attributeRepository.createOne(newCdo.name, attr);
        expect(created).toHaveProperty('id');
        expect(created.name).toBe('color');
    });

    test('getByName should retrieve the attribute by name', async () => {
        const found = await attributeRepository.getByName(newCdo.name, 'color');
        console.log(found);
        expect(found).not.toBeNull();
        expect(found.name).toBe('color');
    });

    test('getAll should return all attributes', async () => {
        const all = await attributeRepository.getAll(newCdo.name);
        expect(Array.isArray(all)).toBe(true);
        expect(all.length).toBeGreaterThan(0);
    });

    test('createMultiple should add multiple attributes', async () => {
        const attrs = [
            { name: 'size', code: 'large' },
            { name: 'shape', code: 'circle' }
        ];
        const created = await attributeRepository.createMultiple(newCdo.name, attrs);
        expect(created.length).toBe(2);
        expect(created[0]).toHaveProperty('id');
        expect(['size', 'shape']).toContain(created[0].name);
    });

    test('deleteOne should remove an attribute', async () => {
        const attr = await attributeRepository.createOne(newCdo.name, { name: 'temp', value: 'delete' });
        const deleted = await attributeRepository.deleteOne(newCdo.name, attr.id);
        expect(deleted.id).toBe(attr.id);
        const found = await attributeRepository.getByName(newCdo.name, 'temp');
        expect(found).toBeNull();
    });
            
    test('DeleteMany should remove multiple attributes', async () => {
        const attrs = [
            { name: 'bulk1', code: 'v1' },
            { name: 'bulk2', code: 'v2' }
        ];
        const created = await attributeRepository.createMultiple(newCdo.name, attrs);
        const ids = created.map(a => a.id);
        const deletedIds = await attributeRepository.deleteMany(newCdo.name, ids);
        expect(deletedIds).toEqual(ids);
        const all = await attributeRepository.getAll(newCdo.name);
        expect(all.some(a => ids.includes(a.id))).toBe(false);
    });
});
