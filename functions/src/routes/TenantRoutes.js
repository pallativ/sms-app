const TenantController = require('../controllers/TenantController');
const express = require('express');
const { verifyToken } = require('../middleware/VerifyTokenMiddleware');
const router = express.Router();

router.post('/', verifyToken, TenantController.createTenant);
router.post('/set-tenant-admin', verifyToken, TenantController.addSuperAdmin);



module.exports = router;
