const CustomDataObjectService = require('../services/custom-data-object-service');
const { logger } = require('firebase-functions');

exports.getAllCustomDataObjects = async (req, res) => {
    try {
        const service = new CustomDataObjectService(req.tenantContext);
        const objects = await service.getAll();
        res.status(200).json(objects);
    } catch (error) {
        logger.error("Error in getting all custom data objects", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getCustomDataObjectByName = async (req, res) => {
    try {
        const { name } = req.params;
        const includeAttributes = req.query.includeAttributes === 'true';
        const service = new CustomDataObjectService(req.tenantContext);
        const object = await service.getByName(name, includeAttributes);
        if (!object) {
            return res.status(404).json({ error: 'Custom data object not found.' });
        }
        res.status(200).json(object);
    } catch (error) {
        logger.error("Error in getting custom data object by name", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getCustomDataObjectAttributes = async (req, res) => {
    try {
        const { id } = req.params;
        const service = new CustomDataObjectService(req.tenantContext);
        const attributes = await service.getAttributes(id);
        res.status(200).json(attributes);
    } catch (error) {
        logger.error("Error in getting custom data object attributes", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getCustomDataObjectRecords = async (req, res) => {
    try {
        const { id } = req.params;
        const service = new CustomDataObjectService(req.tenantContext);
        const records = await service.getRecords(id);
        res.status(200).json(records);
    } catch (error) {
        logger.error("Error in getting custom data object records", error);
        res.status(500).json({ error: error.message });
    }
};

exports.importCustomDataObjectRecords = async (req, res) => {
    try {
        const service = new CustomDataObjectService(req.tenantContext);
        await service.importRecords(req.body.records);
        res.status(201).json({ message: 'Records imported successfully.' });
    } catch (error) {
        logger.error("Error in importing custom data object records", error);
        res.status(500).json({ error: error.message });
    }
};

exports.validateCustomDataObjectRecords = async (req, res) => {
    try {
        const { schema, records } = req.body;
        const service = new CustomDataObjectService(req.tenantContext);
        const result = await service.validateRecords(schema, records);
        res.status(200).json(result);
    } catch (error) {
        logger.error("Error in validating custom data object records", error);
        res.status(500).json({ error: error.message });
    }
};

exports.validateAgainstCustomDataObjectSchema = async (req, res) => {
    try {
        const { name } = req.params;
        const { records } = req.body;
        const service = new CustomDataObjectService(req.tenantContext);
        await service.validateAgainstCustomDataObjectSchema(name, records);
        res.status(200).json({ message: 'Validation and import (if valid) completed.' });
    } catch (error) {
        logger.error("Error in validating against custom data object schema", error);
        res.status(500).json({ error: error.message });
    }
};

exports.searchCustomDataObjectsByName = async (req, res) => {
    try {
        const { name } = req.query;
        const service = new CustomDataObjectService(req.tenantContext);
        const results = await service.searchByName(name);
        res.status(200).json(results);
    } catch (error) {
        logger.error("Error in searching custom data objects by name", error);
        res.status(500).json({ error: error.message });
    }
};

exports.createCustomDataObject = async (req, res) => {
    try {
        const service = new CustomDataObjectService(req.tenantContext);
        const newObject = await service.create(req.body);
        res.status(201).json({ message: 'Custom data object created successfully.', object: newObject });
    } catch (error) {
        logger.error("Error in creating custom data object", error);
        res.status(500).json({ error: error.details || error.message });
    }
};

exports.deleteCustomDataObject = async (req, res) => {
    try {
        const { id } = req.params;
        const service = new CustomDataObjectService(req.tenantContext);
        await service.delete(id);
        res.status(200).json({ message: 'Custom data object deleted successfully.' });
    } catch (error) {
        logger.error("Error in deleting custom data object", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAllCustomDataObjectAttributes = async (req, res) => {
    try {
        const { id } = req.params;
        const service = new CustomDataObjectService(req.tenantContext);
        await service.deleteAllAttributes(id);
        res.status(200).json({ message: 'All attributes deleted successfully.' });
    } catch (error) {
        logger.error("Error in deleting all custom data object attributes", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCustomDataObjectAttributes = async (req, res) => {
    try {
        const { id } = req.params;
        const { attributeNames } = req.body;
        const service = new CustomDataObjectService(req.tenantContext);
        await service.deleteAttributes(id, attributeNames);
        res.status(200).json({ message: 'Selected attributes deleted successfully.' });
    } catch (error) {
        logger.error("Error in deleting custom data object attributes", error);
        res.status(500).json({ error: error.message });
    }
};

exports.editCustomDataObject = async (req, res) => {
    try {
        const { id } = req.params;
        const service = new CustomDataObjectService(req.tenantContext);
        await service.edit(id, req.body);
        res.status(200).json({ message: 'Custom data object updated successfully.' });
    } catch (error) {
        logger.error("Error in editing custom data object", error);
        res.status(500).json({ error: error.details || error.message });
    }
};
