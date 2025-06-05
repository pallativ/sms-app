const request = require('supertest');
const express = require('express');
jest.mock('../../src/middleware/VerifyTokenMiddleware', () => ({
    verifyToken: jest.fn((req, res, next) => next()),
    requireRole: jest.fn((role) => (req, res, next) => {
        res.status(403).json({ message: 'Forbidden' });
    })
}));

const { verifyToken, requireRole } = require('../../src/middleware/VerifyTokenMiddleware');

let TenantRoutes = require('../../src/routes/TenantRoutes');
const TenantController = require('../../src/controllers/TenantController');

jest.mock('../../src/controllers/TenantController', () => ({
    createTenant: jest.fn((req, res) => res.status(201).send({ message: 'Tenant created' })),
    getAllTenants: jest.fn((req, res) => res.status(200).send([{ id: 1, name: 'Tenant1' }])),
    addSuperAdmin: jest.fn((req, res) => res.status(200).send({ message: 'Super admin added' }))
}));

const app = express();
app.use(express.json());
app.use('/tenants', TenantRoutes);

describe('Verifying TenantRoutes', () => {


    it('should handle requireRole failure for GET /tenants', async () => {
        requireRole.mockImplementationOnce((role) => async (req, res, next) => {
            console.log('requireRole mock called');
            res.status(403).send({ message: 'Unauthorized' });
        });
        const response = await request(app).get('/tenants');
        expect(verifyToken).toHaveBeenCalled();
        expect(requireRole).toHaveBeenCalledWith('tenant-admin');
        console.log('Response:', response.body);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden');

    });
});
