const controller = require('../controllers/custom-data-object-controller');
const express = require('express');
const { verifyToken } = require('../middleware/VerifyTokenMiddleware');
const { fetchTenantDetails } = require('../middleware/FetchTenantDetailsMiddleware')

const router = express.Router();

router.get('/', verifyToken, controller.getAllCustomDataObjects);
//router.post('/', verifyToken, controller.createContact);
//router.put('/', verifyToken, controller.updateContact);
//router.get('/tags', verifyToken, controller.getTags);
//router.get('/fields', verifyToken, controller.getCustomFields);


module.exports = router;
