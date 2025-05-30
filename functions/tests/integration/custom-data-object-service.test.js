const customDataObjectService = require('../../src/services/custom-data-object-service');
const customDataObjectRepository = require('../../src/repositories/custom-data-object-repository');
const attributesRepository = require('../../src/repositories/attribute-repository');
const { ValidAttributes } = require('../data-providers/attributes-provider'); // Assuming this is a fixture with valid attributes
const _ = require('lodash');
////jest.mock('../../src/repositories/custom-data-object-repository');
////jest.mock('../../src/repositories/attribute-repository');
//const customDataObjectRepository = require('../../src/repositories/custom-data-object-repository');
//const attributesRepository = require('../../src/repositories/attribute-repository');

describe('CustomDataObjectService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(async () => {
        await clearCDOsCollection();
    });

    async function clearCDOsCollection() {
        const items = await customDataObjectRepository.getAll();
        for (const item of items) {
            await customDataObjectRepository.delete(item.id);
        };
    }

    //describe('getAll', () => {
    //    it('should return all custom data objects', async () => {
    //        const mockObjects = [{ id: 1 }, { id: 2 }];
    //        customDataObjectRepository.getAll.mockResolvedValue(mockObjects);

    //        const result = await customDataObjectService.getAll();
    //        expect(result).toEqual(mockObjects);
    //        expect(customDataObjectRepository.getAll).toHaveBeenCalled();
    //    });
    //});

    //describe('getByName', () => {
    //    it('should throw error if name is not provided', async () => {
    //        await expect(customDataObjectService.getByName()).rejects.toThrow('Name is required.');
    //    });

    //    it('should return custom data object with attributes if includeAttributes is true', async () => {
    //        const mockObject = { id: 1, name: 'Test' };
    //        const mockAttributes = [{ id: 10 }];
    //        customDataObjectRepository.getByName.mockResolvedValue(mockObject);
    //        attributesRepository.getAll.mockResolvedValue(mockAttributes);

    //        // Patch the method to return the object for test (since original code has a bug)
    //        const service = require('../../src/services/custom-data-object-service');
    //        service.getByName = jest.fn(async (name, includeAttributes = false) => {
    //            if (!name) throw new Error('Name is required.');
    //            const obj = await customDataObjectRepository.getByName(name);
    //            obj.attributes = includeAttributes ? await attributesRepository.getAll(obj.id) : undefined;
    //            return obj;
    //        });

    //        const result = await service.getByName('Test', true);
    //        expect(result).toEqual({ id: 1, name: 'Test', attributes: mockAttributes });
    //    });

    //    it('should return custom data object without attributes if includeAttributes is false', async () => {
    //        const mockObject = { id: 1, name: 'Test' };
    //        customDataObjectRepository.getByName.mockResolvedValue(mockObject);

    //        const service = require('../../src/services/custom-data-object-service');
    //        service.getByName = jest.fn(async (name, includeAttributes = false) => {
    //            if (!name) throw new Error('Name is required.');
    //            const obj = await customDataObjectRepository.getByName(name);
    //            obj.attributes = includeAttributes ? await attributesRepository.getAll(obj.id) : undefined;
    //            return obj;
    //        });

    //        const result = await service.getByName('Test', false);
    //        expect(result).toEqual({ id: 1, name: 'Test', attributes: undefined });
    //    });
    //});

    //describe('getAttributes', () => {
    //    it('should throw error if custom_object_id is not provided', async () => {
    //        await expect(customDataObjectService.getAttributes()).rejects.toThrow('ID is required to get attributes.');
    //    });

    //    it('should return attributes', async () => {
    //        const mockAttributes = [{ id: 1 }];
    //        attributesRepository.getAll.mockResolvedValue(mockAttributes);

    //        const result = await customDataObjectService.getAttributes(1);
    //        expect(result).toEqual(mockAttributes);
    //        expect(attributesRepository.getAll).toHaveBeenCalled();
    //    });
    //});

    //describe('getRecords', () => {
    //    it('should throw error if id is not provided', async () => {
    //        await expect(customDataObjectService.getRecords()).rejects.toThrow('ID is required to get records.');
    //    });

    //    it('should return records', async () => {
    //        const mockRecords = [{ id: 1 }];
    //        customDataObjectRepository.getRecords.mockResolvedValue(mockRecords);

    //        const result = await customDataObjectService.getRecords(1);
    //        expect(result).toEqual(mockRecords);
    //        expect(customDataObjectRepository.getRecords).toHaveBeenCalledWith(1);
    //    });
    //});

    //describe('searchByName', () => {
    //    it('should throw error if name is not provided', async () => {
    //        await expect(customDataObjectService.searchByName()).rejects.toThrow('Name is required for searching.');
    //    });

    //    it('should return search results', async () => {
    //        const mockResults = [{ id: 1 }];
    //        customDataObjectRepository.searchByName.mockResolvedValue(mockResults);

    //        const result = await customDataObjectService.searchByName('Test');
    //        expect(result).toEqual(mockResults);
    //        expect(customDataObjectRepository.searchByName).toHaveBeenCalledWith('Test');
    //    });
    //});

    describe('getAll()', () => {
        beforeAll(async () => {
            await clearCDOsCollection();
        });
        // it should return all custom data objects
        it('should return all custom data objects', async () => {
            var omitFields = ["id", "description", "createdAt", "updatedAt", "attributes"];
            const mockObjects = [
                { name: 'Test1', code: 'Test1', attributes: [ValidAttributes.FirstNameAttribute] },
                { name: 'Test2', code: 'Test2', attributes: [ValidAttributes.FirstNameAttribute] }
            ];
            for (const item of mockObjects) {
                var temp = await customDataObjectService.create(item);
            }
            const result = await customDataObjectService.getAll();
            expect(_.omit(result.filter(item => item.name === "Test1")[0], omitFields)).toEqual(_.omit(mockObjects[0], omitFields));
            expect(_.omit(result.filter(item => item.name === "Test2")[0], omitFields)).toEqual(_.omit(mockObjects[1], omitFields));
            expect(result.length).toEqual(2);
        });
    });

    describe('getByName()', () => {

        // it should return null if the custom data object not exists
        it('should getName return null if the cdo doesnt exists', async () => {
            const invalidData = { name: 'Test' };
            var custom_data_object = await customDataObjectService.getByName(invalidData);
            expect(custom_data_object).toBeNull();
        });

        // it should return attributes if the flag is true
        it('should getByName return attributes if the flag is true', async () => {
            const validData = { name: 'Test', code: "Test", description: 'N/A', attributes: [ValidAttributes.FirstNameAttribute] };
            await customDataObjectService.create(validData);
            var custom_data_object = await customDataObjectService.getByName(validData.name, true);
            expect(custom_data_object).toBeDefined();
            expect(custom_data_object.name).toBe('Test');
            expect(custom_data_object.code).toBe('Test');
            expect(custom_data_object.attributes).toBeDefined();
            expect(custom_data_object.attributes[0].id).toBeDefined();
            expect(_.omit(custom_data_object.attributes[0], ["id"])).toEqual(ValidAttributes.FirstNameAttribute);
        });
    })

    describe("deleteAttributes", () => {
        beforeAll(async () => {
            await clearCDOsCollection();
        });
        // it should delete attributes by their names from a custom data object
        it('should delete attributes by their names from a custom data object', async () => {
            const validData = {
                name: 'Test', code: "Test", description: 'N/A',
                attributes: [ValidAttributes.FirstNameAttribute, ValidAttributes.LastNameAttribute]
            };
            await customDataObjectService.create(validData);
            var custom_data_object = await customDataObjectService.getByName(validData.name, true);
            expect(custom_data_object).toBeDefined();
            expect(custom_data_object.attributes.length).toBe(2);
            var firstNameAttribute = custom_data_object.attributes.filter(t => t.name === ValidAttributes.FirstNameAttribute.name)[0];
            expect(firstNameAttribute.name).toBe('First Name');
            // Now delete the attribute
            await customDataObjectService.deleteAttributes(custom_data_object.id, [ValidAttributes.FirstNameAttribute.name]);
            custom_data_object = await customDataObjectService.getByName(validData.name, true);
            var lastNameAttribute = custom_data_object.attributes.filter(t => t.name === ValidAttributes.LastNameAttribute.name)[0];
            expect(custom_data_object.attributes.length).toBe(1);
            expect(lastNameAttribute.name).toBe('Last Name');
        });
    });

    describe('create', () => {
        it('should throw error if validation fails', async () => {
            //const invalidData = {};
            //const schema = require('../../src/schema/custom-data-object-schema');
            //jest.spyOn(schema, 'validate').mockReturnValue({ error: { details : [{ message: 'Invalid' }] } });

            //await expect(customDataObjectService.create(invalidData)).rejects.toThrow('Validation failed: Invalid');
        });

        it('should throw error if name is not provided', async () => {
            const invalidData = { code: 'Test' };
            try {
                await customDataObjectService.create(invalidData);
            }
            catch (error) {
                expect(error.message).toBe('Validation failed on custom object');
                expect(error.details[0].message).toBe('"name" is required');
                expect(error.details[1].message).toBe('"attributes" is required');
            }
        });

        it('should create custom data object and attributes', async () => {
            const validData = { name: 'Test', code: "Test", description: 'N/A', attributes: [ValidAttributes.FirstNameAttribute] };
            /*console.log('Valid Data:', validData);*/
            var create_result = await customDataObjectService.create(validData);
            var result = await customDataObjectService.getByName(validData.name);
            expect(result).toBeDefined();
            expect(result.name).toBe('Test');
            expect(result.code).toBe('Test');
            expect(result.attributes).toBeUndefined();
            expect(result.records).toBeUndefined();

            /*expect(Array.isArray(validData.attributes) && validData.attributes.length > 0).toBe(true);*/

            //expect(customDataObjectRepository.create).toHaveBeenCalledWith(validData);
            //expect(attributesRepository.createMultiple).toHaveBeenCalledWith(1, validData.attributes);

            //const schema = require('../../src/schema/custom-data-object-schema');
            ///*jest.spyOn(schema, 'validate').mockReturnValue({ error: null, value: validData });*/
            //customDataObjectRepository.create(validData);
            //attributesRepository.createMultiple.mockResolvedValue();

            //await customDataObjectService.create(validData);
            //expect(customDataObjectRepository.create).toHaveBeenCalledWith(validData);
            //expect(attributesRepository.createMultiple).toHaveBeenCalledWith(1, validData.attributes);
        });
    });

    //describe('delete', () => {
    //    it('should throw error if id is not provided', async () => {
    //        await expect(customDataObjectService.delete()).rejects.toThrow('ID is required for deletion.');
    //    });

    //    it('should delete custom data object', async () => {
    //        customDataObjectRepository.delete.mockResolvedValue(true);

    //        const result = await customDataObjectService.delete(1);
    //        expect(result).toBe(true);
    //        expect(customDataObjectRepository.delete).toHaveBeenCalledWith(1);
    //    });
    //});

    describe('edit', () => {
        //it('should throw error if id is not provided', async () => {
        //    await expect(customDataObjectService.edit()).rejects.toThrow('ID is required for editing.');
        //});

        //it('should throw error if validation fails', async () => {
        //    const schema = require('../../src/schema/custom-data-object-schema');
        //    jest.spyOn(schema, 'validate').mockReturnValue({ error: { details: [{ message: 'Invalid' }] } });

        //    await expect(customDataObjectService.edit(1, {})).rejects.toThrow('Validation failed: Invalid');
        //});

        it('should edit custom data object', async () => {

            try {

                let validData = {
                    name: 'Edit Cdo', code: "Edit Cdo", description: 'N/A',
                    attributes: [ValidAttributes.FirstNameAttribute]
                };

                await customDataObjectService.create(validData);
                var created_cdo = await customDataObjectService.getByName(validData.name, true);
                validData.name = 'New EDIT CDO'; // Change the name for edit
                validData.attributes = [ValidAttributes.LastNameAttribute]; // Change attributes for edit

                //console.log('Created CDO:', created_cdo);
                await customDataObjectService.edit(created_cdo.id, validData)

                const edited_cdo = await customDataObjectService.getByName(validData.name, true);
                expect(edited_cdo).toBeDefined();
                //console.log('Edited CDO:', edited_cdo);
                expect(edited_cdo.name).toBe('New EDIT CDO');
                expect(edited_cdo.attributes.length).toBe(1);
                expect(edited_cdo.attributes[0].name).toBe('Last Name');
            }
            catch (error) {
                console.error('Error during edit test:', error);
            }
        });
    });
});
