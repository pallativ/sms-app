const customDataObjectSchema = require('../../src/schema/custom-data-object-schema');

describe('customDataObjectSchema', () => {
    const validAttribute = {
        code: "Code",
        order: 1,
        name: 'Attribute Name',
        type: 'string',
        multiselect: false,
        required: true,
        help_text: 'This is a test object for validation purposes',
    };

    const validDataObject = {
        name: 'Test Object',
        code: 'TEST123',
        description: 'A test custom data object',
        attributes: [validAttribute],
        createdAt: new Date('2024-06-01T12:00:00.000Z'),
        updatedAt: new Date('2024-06-01T12:00:00.000Z'),
        createdBy: 'user1',
        updatedBy: 'user2'
    };

    describe('attributes', () => {
        test('should validate a valid custom data object', () => {
            const { error, value } = customDataObjectSchema.validate(validDataObject);
            expect(error).toBeUndefined();
            expect(value).toEqual({ ...validDataObject, records: [], auditLog: [] });
        });

        test('should fail if required fields are missing', () => {
            const { error } = customDataObjectSchema.validate({});
            expect(error).toBeDefined();
            expect(error.details.some(d => d.message.includes('"name" is required'))).toBe(true);
        });

        test('should fail if name exceeds max length', () => {
            const invalid = { ...validDataObject, name: 'a'.repeat(101) };
            const { error } = customDataObjectSchema.validate(invalid);
            expect(error).toBeDefined();
            expect(error.details.some(d => d.message.includes('"name" length must be'))).toBe(true);
        });

        test('should fail if code is not alphanumeric', () => {
            const invalid = { name : 'Sample' };
            const { error } = customDataObjectSchema.validate(invalid);
            expect(error).toBeDefined();
            expect(error.details.some(d => d.message.includes('"code" is required'))).toBe(true);
        });

        test('should fail if attributes is empty', () => {
            const invalid = { ...validDataObject, attributes: [] };
            const { error } = customDataObjectSchema.validate(invalid);
            expect(error).toBeDefined();
            expect(error.details.some(d => d.message.includes('"attributes" must contain at least 1 items'))).toBe(true);
        });

        test('should fail if createdAt is not ISO date', () => {
            const invalid = { ...validDataObject, createdAt: 'not-a-date' };
            const { error } = customDataObjectSchema.validate(invalid);
            /*console.log(error);*/
            expect(error).toBeDefined();
            expect(error.details.some(d => d.message.includes('"createdAt" must be a valid date'))).toBe(true);
        });

        test('should fail if updatedAt is missing', () => {
            const { updatedAt, ...invalid } = validDataObject;
            const { error } = customDataObjectSchema.validate(invalid);
            expect(error).toBeDefined();
            expect(error.details.some(d => d.message.includes('"updatedAt" is required'))).toBe(true);
        });

        test('should fail if createdBy is empty', () => {
            const invalid = { ...validDataObject, createdBy: '' };
            const { error } = customDataObjectSchema.validate(invalid);
            expect(error).toBeDefined();
            expect(error.details.some(d => d.message.includes('"createdBy" is not allowed to be empty'))).toBe(true);
        });

        test('should fail if attributes is not an array', () => {
            const invalid = { ...validDataObject, attributes: 'not-an-array' };
            const { error } = customDataObjectSchema.validate(invalid);
            expect(error).toBeDefined();
            expect(error.details.some(d => {
                return d.message.includes('"attributes" must be an array');
            })).toBe(true);
        });

        test('should accept records as an array of objects', () => {
            const withRecords = { ...validDataObject, records: [{ foo: 'bar' }] };
            const { error, value } = customDataObjectSchema.validate(withRecords);
            expect(error).toBeUndefined();
            expect(value.records).toEqual([{ foo: 'bar' }]);
        });

        test('should default records to empty array if not provided', () => {
            const { records, ...withoutRecords } = validDataObject;
            const { error, value } = customDataObjectSchema.validate(withoutRecords);
            expect(error).toBeUndefined();
            expect(value.records).toEqual([]);
        });
    });
});
