const customDataObjectRepository = require('../repositories/custom-data-object-repository');
const attributesRepository = require('../repositories/attribute-repository');
const customDataObjectRecordsRepository = require("../repositories/custom-data-object-records-repository")
const customDataObjectSchema = require('../schema/custom-data-object-schema');
const { logger } = require('firebase-functions');
const MAX_BATCH_SIZE = 500;
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

    async importRecords(records) {
        for (let i = 0; i < records.length; i += MAX_BATCH_SIZE) {
            const chunk = records.slice(i, i + MAX_BATCH_SIZE);
            customDataObjectRecordsRepository.createMultiple(chunk);
        }
    }

    async validateRecords(schema, records) {
        var validation_result = { is_valid: true, errors: [] };
        for (let i = 0; i < records.length; i++) {
            const { error } = schema.validate(records[i]);
            if (error !== undefined)
                validation_result.is_valid = false;
            var record_error = {
                record_num: i,
                is_valid: error === undefined,
            };
            if (error !== undefined)
                record_error.errors = error.details;
            validation_result.errors.push(record_error);
        }
        return validation_result;
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
        var attributeIds = await attributesRepository.getAll(id).then(attrs => attrs.map(attr => attr.id))
        await attributesRepository.deleteMany(id, attributeIds);
        return await customDataObjectRepository.delete(id);
    }

    async deleteAllAttributes(custom_data_object_id) {
        if (!custom_data_object_id) {
            throw new Error('custom_data_object_id is required for deleting all attributes.');
        }
        var attribute_ids = await attributesRepository.getAll(custom_data_object_id)
            .then(attrs => attrs.map(attr => attr.id));
        if (attribute_ids.length > 0) {
            await attributesRepository.deleteMany(custom_data_object_id, attribute_ids);
        }
    }

    async deleteAttributes(custom_data_object_id, attribute_names) {
        if (!custom_data_object_id) {
            throw new Error('custom_data_object_id is required for deleting attributes.');
        }
        var filtered_attributes = await attributesRepository.getAll(custom_data_object_id)
            .then(attrs => attrs.filter(attr =>
                attribute_names.some(name => name.trim().toLowerCase() === attr.name.trim().toLowerCase())));
        var attribute_ids = filtered_attributes.map(t => t.id);
        await attributesRepository.deleteMany(custom_data_object_id, attribute_ids);
    }

    async edit(custom_data_object_id, data) {
        if (!custom_data_object_id) {
            throw new Error('custom_data_object_id is required for editing.');
        }
        const { error, value } = customDataObjectSchema.validate(data, { abortEarly: false });
        if (error) {
            var validation_error = new Error('Validation failed on custom object');
            validation_error.details = error.details;
            throw validation_error;
        }
        await customDataObjectRepository.edit(custom_data_object_id, value);
        if (value.attributes && value.attributes.length > 0) {
            await this.deleteAllAttributes(custom_data_object_id);
            await attributesRepository.createMultiple(custom_data_object_id, value.attributes);
        }
    }
}

module.exports = new CustomDataObjectService();
