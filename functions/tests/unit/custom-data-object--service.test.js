const customDataObjectService = require('../../src/services/custom-data-object-service');
const customDataObjectRecordsRepository = require('../../src/repositories/custom-data-object-records-repository');
const Joi = require('joi');
jest.mock('../../src/repositories/custom-data-object-records-repository', () => ({
    createMultiple: jest.fn()
}));

describe('CustomDataObjectService.importRecords', () => {
    const MAX_BATCH_SIZE = 500; // You may need to adjust this if it's defined elsewhere

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call createMultiple once if records length is less than MAX_BATCH_SIZE', async () => {
        const records = Array.from({ length: 100 }, (_, i) => ({ id: i }));
        await customDataObjectService.importRecords(records);
        expect(customDataObjectRecordsRepository.createMultiple).toHaveBeenCalledTimes(1);
        expect(customDataObjectRecordsRepository.createMultiple).toHaveBeenCalledWith(records);
    });

    it('should call createMultiple multiple times if records length exceeds MAX_BATCH_SIZE', async () => {
        const records = Array.from({ length: 1200 }, (_, i) => ({ id: i }));
        await customDataObjectService.importRecords(records);
        // 1200 / 500 = 2 full batches + 1 partial batch
        expect(customDataObjectRecordsRepository.createMultiple).toHaveBeenCalledTimes(3);
        expect(customDataObjectRecordsRepository.createMultiple).toHaveBeenNthCalledWith(1, records.slice(0, 500));
        expect(customDataObjectRecordsRepository.createMultiple).toHaveBeenNthCalledWith(2, records.slice(500, 1000));
        expect(customDataObjectRecordsRepository.createMultiple).toHaveBeenNthCalledWith(3, records.slice(1000, 1200));
    });

    it('should not call createMultiple if records array is empty', async () => {
        await customDataObjectService.importRecords([]);
        expect(customDataObjectRecordsRepository.createMultiple).not.toHaveBeenCalled();
    });
});


describe('CustomDataObjectService.validateRecords', () => {
    const validRecord = { name: 'Test', description: 'desc' }; // Adjust fields to match schema
    const invalidRecord = { name: 123 }; // Intentionally invalid

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return is_valid true and no errors for all valid records', async () => {
        const records = [validRecord, validRecord];
        // Mock schema to always validate successfully
        var schema = Joi.object({
            name: Joi.string().max(100).required(),
            description: Joi.string().max(1000).required()
        });
        const result = await customDataObjectService.validateRecords(schema, records);
        expect(result.is_valid).toBe(true);
        expect(result.errors.length).toBe(2);
        expect(result.errors.every(e => e.is_valid === true && e.errors === undefined)).toBe(true);
    });

    it('should return is_valid false and errors for invalid records', async () => {
        const fakeError = {
            details: [{
                "context": {
                    "key": "name",
                    "label": "name",
                    "value": 123,
                },
                "message": "\"name\" must be a string",
                "path": [
                    "name",
                ],
                "type": "string.base"
            }]
        };
        var schema = Joi.object({
            name: Joi.string().max(100).required(),
            description: Joi.string().max(1000).required()
        });
        const records = [validRecord, invalidRecord];
        const result = await customDataObjectService.validateRecords(schema, records);
        expect(result.is_valid).toBe(false);
        expect(result.errors.length).toBe(2);
        expect(result.errors[0].is_valid).toBe(true);
        expect(result.errors[1].is_valid).toBe(false);
        expect(result.errors[1].errors).toEqual(fakeError.details);
    });

    it('should return is_valid true and empty errors for empty input', async () => {
        var schema = Joi.object({
            name: Joi.string().max(100).required(),
            description: Joi.string().max(1000).required()
        });
        const result = await customDataObjectService.validateRecords(schema, []);
        expect(result.is_valid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it('should return invalid on validate', async () => {
        var schema = Joi.object({
            name: Joi.string().max(100).required(),
            description: Joi.string().max(1000).required()
        });
        const result = await customDataObjectService.validateRecords(schema, [validRecord]);
        expect(result.is_valid).toBe(true);
        expect(result.errors).toEqual([{is_valid: true, record_num: 0}]);
    });
});
