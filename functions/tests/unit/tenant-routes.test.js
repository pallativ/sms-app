const request = require('supertest');
const express = require('express');
jest.mock('../../src/middleware/VerifyTokenMiddleware', () => ({
    requirePlatformAdmin: jest.fn((req, res, next) => next()),
    Authenticate: jest.fn((req, res, next) => next()),
}));


jest.mock('../../firebaseSetup', () => ({
    auth: {
        getUserByEmail: jest.fn(),
        createUser: jest.fn(),
        verifyIdToken: jest.fn()
    },
}));

jest.spyOn(console, 'log').mockImplementation(() => { });
jest.spyOn(console, 'info').mockImplementation(() => { });
jest.spyOn(console, 'debug').mockImplementation(() => { });

const { auth } = require('../../firebaseSetup');
const { logger } = require('firebase-functions');
const { requirePlatformAdmin, Authenticate } = require('../../src/middleware/VerifyTokenMiddleware');

let TenantRoutes = require('../../src/routes/TenantRoutes');
const TenantController = require('../../src/controllers/TenantController');

jest.mock('../../src/controllers/TenantController', () => ({
    createTenant: jest.fn((req, res) => res.status(201).send({ message: 'Tenant created' })),
    getAllTenants: jest.fn((req, res) => res.status(200).send([{ id: 1, name: 'Tenant1' }])),
    addSuperAdmin: jest.fn((req, res) => res.status(200).send({ message: 'Super admin added' })),
    addUserToTenant: jest.fn((req, res) => res.status(200).send({ message: 'Super admin added' })),
    getTenantUsers: jest.fn((req, res) => res.status(200).send({ message: 'Super admin added' })),
    getTenantsByUserEmail: jest.fn((req, res) => res.status(200).send({ message: 'Super admin added' })),
}));

const app = express();
app.use(express.json());
app.use('/tenants', TenantRoutes);

describe('Verifying TenantRoutes', () => {
    it('should call createTenant when POST /tenants is hit', async () => {
        const response = await request(app).post('/tenants').send({ name: 'New Tenant' });

        expect(requirePlatformAdmin).toHaveBeenCalled();
        expect(TenantController.createTenant).toHaveBeenCalled();
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Tenant created');
    });

    it('should call getAllTenants when GET /tenants is hit', async () => {
        const response = await request(app).get('/tenants');

        expect(requirePlatformAdmin).toHaveBeenCalled();
        expect(TenantController.getAllTenants).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, name: 'Tenant1' }]);
    });

    it('should call addSuperAdmin when POST /tenants/set-tenant-admin is hit', async () => {
        const response = await request(app).post('/tenants/set-tenant-admin').send({ userId: 123 });

        expect(requirePlatformAdmin).toHaveBeenCalled();
        expect(TenantController.addSuperAdmin).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Super admin added');

    });

    it('should handle verifyToken failure for POST /tenants', async () => {
        // Override verifyToken for this test case
        requirePlatformAdmin.mockImplementationOnce((req, res, next) => {
            res.status(401).send({ message: 'Unauthorized' });
        });

        const response = await request(app).post('/tenants').send({ name: 'New Tenant' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized');
    });

    it('should handle requireRole failure for GET /tenants', async () => {
        logger.debug("should handle requireRole failure for GET /tenants");
        requirePlatformAdmin.mockImplementationOnce((req, res, next) => {
            res.status(403).send({ message: 'Unauthorized' });
        });
        const response = await request(app).get('/tenants');
        expect(requirePlatformAdmin).toHaveBeenCalled();
        logger.debug('Response:', response.body);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Unauthorized');
    });
});
