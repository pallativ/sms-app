const CustomDataObjectService = require('../../src/services/custom-data-object-service');
jest.mock('../../src/repositories/custom-data-object-records-repository');
const CustomDataObjectRecordsRepository = require('../../src/repositories/custom-data-object-records-repository');
const Joi = require('joi');
const { ValidAttributes } = require('../data-providers/attributes-provider');



describe('CustomDataObjectService.importRecords', () => {
    beforeEach(() => {
        jest.clearAllMocks();  
        
    });

    it('should call createMultiple once if records length is less than MAX_BATCH_SIZE', async () => {
        var mockCreateMultiple = jest.fn().mockReturnValue(['user1']);
        var mockCustomDataObjectRecordsRepository = {
            createMultiple: mockCreateMultiple
        };

        let customDataObjectService = new CustomDataObjectService({ tenantCode: 'Home Tutions' },
            mockCustomDataObjectRecordsRepository);
        const records = Array.from({ length: 100 }, (_, i) => ({ id: i }));
        await customDataObjectService.importRecords(records);
        expect(mockCreateMultiple).toHaveBeenCalledTimes(1);
        expect(mockCreateMultiple).toHaveBeenCalledWith(records);
    });

    //it('should call createMultiple multiple times if records length exceeds MAX_BATCH_SIZE', async () => {
    //    const records = Array.from({ length: 1200 }, (_, i) => ({ id: i }));
    //    await customDataObjectService.importRecords(records);
    //    // 1200 / 500 = 2 full batches + 1 partial batch
    //    expect(customDataObjectRecordsRepository.createMultiple).toHaveBeenCalledTimes(3);
    //    expect(customDataObjectRecordsRepository.createMultiple).toHaveBeenNthCalledWith(1, records.slice(0, 500));
    //    expect(customDataObjectRecordsRepository.createMultiple).toHaveBeenNthCalledWith(2, records.slice(500, 1000));
    //    expect(customDataObjectRecordsRepository.createMultiple).toHaveBeenNthCalledWith(3, records.slice(1000, 1200));
    //});

    //it('should not call createMultiple if records array is empty', async () => {
    //    await customDataObjectService.importRecords([]);
    //    expect(customDataObjectRecordsRepository.createMultiple).not.toHaveBeenCalled();
    //});
});


//describe('CustomDataObjectService.validateRecords', () => {
//    const validRecord = { name: 'Test', description: 'desc' }; // Adjust fields to match schema
//    const invalidRecord = { name: 123 }; // Intentionally invalid

//    beforeEach(() => {
//        jest.clearAllMocks();
//    });

//    it('should return is_valid true and no errors for all valid records', async () => {
//        const records = [validRecord, validRecord];
//        // Mock schema to always validate successfully
//        var schema = Joi.object({
//            name: Joi.string().max(100).required(),
//            description: Joi.string().max(1000).required()
//        });
//        const result = await customDataObjectService.validateRecords(schema, records);
//        expect(result.is_valid).toBe(true);
//        expect(result.errors.length).toBe(2);
//        expect(result.errors.every(e => e.is_valid === true && e.errors === undefined)).toBe(true);
//    });

//    it('should return is_valid false and errors for invalid records', async () => {
//        const fakeError = {
//            details: [{
//                "context": {
//                    "key": "name",
//                    "label": "name",
//                    "value": 123,
//                },
//                "message": "\"name\" must be a string",
//                "path": [
//                    "name",
//                ],
//                "type": "string.base"
//            }]
//        };
//        var schema = Joi.object({
//            name: Joi.string().max(100).required(),
//            description: Joi.string().max(1000).required()
//        });
//        const records = [validRecord, invalidRecord];
//        const result = await customDataObjectService.validateRecords(schema, records);
//        expect(result.is_valid).toBe(false);
//        expect(result.errors.length).toBe(2);
//        expect(result.errors[0].is_valid).toBe(true);
//        expect(result.errors[1].is_valid).toBe(false);
//        expect(result.errors[1].errors).toEqual(fakeError.details);
//    });

//    it('should return is_valid true and empty errors for empty input', async () => {
//        var schema = Joi.object({
//            name: Joi.string().max(100).required(),
//            description: Joi.string().max(1000).required()
//        });
//        const result = await customDataObjectService.validateRecords(schema, []);
//        expect(result.is_valid).toBe(true);
//        expect(result.errors).toEqual([]);
//    });

//    it('should return invalid on validate', async () => {
//        var schema = Joi.object({
//            name: Joi.string().max(100).required(),
//            description: Joi.string().max(1000).required()
//        });
//        const result = await customDataObjectService.validateRecords(schema, [validRecord]);
//        expect(result.is_valid).toBe(true);
//        expect(result.errors).toEqual([{ is_valid: true, record_num: 0 }]);
//    });
//});

//describe('CustomDataObjectService.validateAgainstCutomDataObject', () => {
//    const customDataObjectService = require('../../src/services/custom-data-object-service');

//    const schema = require('joi').object({
//        name: Joi.string().max(100).required(),
//        description: Joi.string().max(1000).required()
//    });

//    const validCustomDataObjectRecord = {
//        id: '1', // Assuming id is required for the record
//        name: 'Test',
//        code: 'Sample',
//        description: 'desc',
//        attributes: [
//            ValidAttributes.FirstNameAttribute,
//            ValidAttributes.LastNameAttribute,
//            ValidAttributes.EmailAttribute,
//            ValidAttributes.MobileAttribute
//        ]
//    };
//    const valid_record = {
//        "First Name": "Veera",
//        "Last Name": "Pallati",
//        "Email": "pkondalu@gmail.com",
//        "Mobile": "9000180459",
//    };
//    const invalid_record = {
//        "First Name": "Veera",
//        "Email": "pkondalu@gmail.com",
//        "Mobile": "9000180459",
//    };
//    const records = [valid_record];
//    let validateRecordSpy = {};
//    let importRecordsSpy = {};

//    beforeEach(() => {
//        jest.clearAllMocks();
//    });


//    it('should call getByName with the correct object name', async () => {
//        jest.spyOn(customDataObjectService, 'getByName').mockImplementation(() => validCustomDataObjectRecord);
//        validateRecordSpy = jest.spyOn(customDataObjectService, 'validateRecords').mockImplementation((schema, records) => {
//            return { is_valid: true }
//        });
//        importRecordsSpy = jest.spyOn(customDataObjectService, 'importRecords').mockImplementation((records) => {
//            //console.log('Importing records:', records);
//            return true;
//        });
//        await customDataObjectService.validateAgainstCustomDataObjectSchema('TestObject', records);
//        expect(customDataObjectService.getByName).toHaveBeenCalledWith('TestObject', true);
//        expect(customDataObjectService.validateRecords).toHaveBeenCalledWith(expect.anything(), records);
//        expect(customDataObjectService.importRecords).toHaveBeenCalledWith(records);
//    });

//    it('should return is_valid false and errors for invalid records', async () => {
//        validateRecordSpy.mockRestore();
//        importRecordsSpy.mockRestore();
//        const records = [valid_record, invalid_record];
//        jest.spyOn(customDataObjectService, 'getByName').mockImplementation((name, attribute) => validCustomDataObjectRecord);
//        jest.spyOn(customDataObjectService, 'importRecords').mockImplementation((records) => {
//            //console.log('Importing records:', records);
//            return;
//        });

//        await customDataObjectService.validateAgainstCustomDataObjectSchema('TestObject', records);
//        expect(customDataObjectService.getByName).toHaveBeenCalledWith('TestObject', true);
//        expect(customDataObjectService.importRecords).not.toHaveBeenCalled();
//    });
//});
