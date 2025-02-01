const contactController = require('../controllers/contactController');
const express = require('express');
const { verifyToken } = require('../middleware/VerifyToken');

const router = express.Router();

router.get('/', verifyToken, contactController.getAllContacts);
router.post('/', verifyToken, contactController.createContact);

module.exports = router;
