const customDataObjectRepository = require('../repositories/custom-data-object-repository');
const customDataObjectSchema = require('../schema/custom-data-object-schema');

class CustomDataObjectService {
    async getAll() {
        return await customDataObjectRepository.getAll();
    }

    async getByName(name) {
        if (!name) {
            throw new Error('Name is required.');
        }
        return await customDataObjectRepository.getByName(name);
    }

    async getAttributes(id) {
        if (!id) {
            throw new Error('ID is required to get attributes.');
        }
        return await customDataObjectRepository.getAttributes(id);
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
        const { error, value } = customDataObjectSchema.validate(data, { abortEarly: false });
        if (error) {
            throw new Error(`Validation failed: ${error.details.map(x => x.message).join(', ')}`);
        }
        return await customDataObjectRepository.create(value);
    }

    async delete(id) {
        if (!id) {
            throw new Error('ID is required for deletion.');
        }
        return await customDataObjectRepository.delete(id);
    }

    async edit(id, data) {
        if (!id) {
            throw new Error('ID is required for editing.');
        }
        const { error, value } = customDataObjectSchema.validate({ ...data, id }, { abortEarly: false });
        if (error) {
            throw new Error(`Validation failed: ${error.details.map(x => x.message).join(', ')}`);
        }
        return await customDataObjectRepository.edit(id, value);
    }
}

module.exports = new CustomDataObjectService();
