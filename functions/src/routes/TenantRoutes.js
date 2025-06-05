const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/VerifyTokenMiddleware');
const TenantController = require('../controllers/TenantController');


router.post('/', verifyToken, requireRole("tenant-admin"), TenantController.createTenant);
router.get('/', verifyToken, requireRole("tenant-admin"), TenantController.getAllTenants);
router.post('/set-tenant-admin', verifyToken, requireRole("tenant-admin"), TenantController.addSuperAdmin);



module.exports = router;
