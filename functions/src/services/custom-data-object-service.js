const customDataObjectRepository = require('../repositories/custom-data-object-repository');
const attributesRepository = require('../repositories/attribute-repository');
const customDataObjectSchema = require('../schema/custom-data-object-schema');
const { logger } = require('firebase-functions');

class CustomDataObjectService {
    async getAll() {
        return await customDataObjectRepository.getAll();
    }
 
    async getByName(name, includeAttributes = false) {
        if (!name) {
            throw new Error('Name is required.');
        }
        var custom_data_object = await customDataObjectRepository.getByName(name);
        if (custom_data_object.length > 0) {
            custom_data_object = { ...custom_data_object[0] }
            custom_data_object.attributes = includeAttributes ? await attributesRepository.getAll(custom_data_object.id) : undefined;
            return custom_data_object;
        }
        //console.log('Custom Data Object:', custom_data_object);
        return null;
    }

    async getAttributes(custom_object_id) {
        if (!custom_object_id) {
            throw new Error('ID is required to get attributes.');
        }
        return await attributesRepository.getAll(custom_object_id);
    }

    async getRecords(id) {
        if (!id) {
            throw new Error('ID is required to get records.');
        }
        return await customDataObjectRepository.getRecords(id);
    }

    async searchByName(name) {
        if (!name) {
            throw new Error('Name is required for searching.');
        }
        return await customDataObjectRepository.searchByName(name);
    }

    async create(data) {
        data.createdAt = new Date();
        data.updatedAt = new Date();
        data.createdBy = 'system'; // TODO: Replace with actual user ID if available
        data.updatedBy = 'system'; // TODO: Replace with actual user ID if available
        const { error, value } = customDataObjectSchema.validate(data, { abortEarly: false });
        if (error) {
            var validation_error = new Error('Validation failed on custom object');
            validation_error.details = error.details;
            throw validation_error;
        }
        var new_cdo = await customDataObjectRepository.create(value);
        if (value.attributes && value.attributes.length > 0) {
            await attributesRepository.createMultiple(new_cdo.id, value.attributes);
        }
        return new_cdo;
    }

    async delete(id) {
        if (!id) {
            throw new Error('ID is required for deletion.');
        }
        return await customDataObjectRepository.delete(id);
    }

    async edit(custom_data_object_id, data) {
        if (!id) {
            throw new Error('custom_data_object_id is required for editing.');
        }
        const { error, value } = customDataObjectSchema.validate(data, { abortEarly: false });
        if (error) {
            throw new Error(`Validation failed: ${error.details.map(x => x.message).join(', ')}`);
        }
        return await customDataObjectRepository.edit(custom_data_object_id, value);
    }
}

module.exports = new CustomDataObjectService();
