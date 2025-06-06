const express = require('express');
const router = express.Router();
const { requirePlatformAdmin } = require('../middleware/VerifyTokenMiddleware');
const TenantController = require('../controllers/TenantController');

// To create the tenant, we need platform admin role for the below activites.
router.post('/', requirePlatformAdmin, TenantController.createTenant);
router.get('/', requirePlatformAdmin, TenantController.getAllTenants);
router.post('/assign-user', requirePlatformAdmin, TenantController.addUserToTenant);
router.get('/:tenantId/users', requirePlatformAdmin, TenantController.getTenantUsers);
router.post('/set-tenant-admin', requirePlatformAdmin, TenantController.addSuperAdmin);



module.exports = router;
