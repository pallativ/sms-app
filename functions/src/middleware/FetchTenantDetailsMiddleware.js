const TenantModel = require('../models/TenantModel');
const { auth } = require('../../firebaseSetup');

exports.fetchTenantDetails = async (req, res, next) => {
    try {
        const tenant = await TenantModel.getTenantByUserEmail(req.user.email);
        if (!tenant) {
            return res.status(404).send({ error: 'Tenant not found' });
        }
        req.tenant = tenant;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Unauthorized' });
    }
};
