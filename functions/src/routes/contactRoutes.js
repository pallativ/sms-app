const contactController = require('../controllers/contactController');
const express = require('express');
const { verifyToken } = require('../middleware/VerifyTokenMiddleware');
const { fetchTenantDetails } = require('../middleware/FetchTenantDetailsMiddleware')

const router = express.Router();

router.get('/', verifyToken, contactController.getAllContacts);
router.post('/', verifyToken, fetchTenantDetails, contactController.createContact);
router.get('/tags', verifyToken, contactController.getTags);
router.get('/fields', verifyToken, contactController.getCustomFields);


module.exports = router;
