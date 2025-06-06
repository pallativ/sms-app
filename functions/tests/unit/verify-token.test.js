const { verifyToken, requireRole, requirePersmission } = require('../../src/middleware/VerifyTokenMiddleware');
const AuthorizationRespository = require('../../src/repositories/authorization-repository');
const { auth } = require('../../firebaseSetup');
const { logger } = require('firebase-functions');

jest.mock('../../firebaseSetup', () => ({
    auth: {
        verifyIdToken: jest.fn(),
    },
}));

jest.mock('../../src/repositories/authorization-repository');

describe('VerifyTokenMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {
                authorization: 'Bearer testToken',
                'x-tenant-id': 'testTenantId',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('verifyToken', () => {
        it('should return 403 if no token is provided', async () => {
            req.headers.authorization = null;

            await verifyToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        });

        it('should return 403 if no tenant ID is provided', async () => {
            req.headers['x-tenant-id'] = null;

            auth.verifyIdToken.mockResolvedValue({ email: 'test@example.com' });

            await verifyToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Tenant ID is required' });
        });

        it('should set user and tenant information if token and tenant ID are valid', async () => {
            const decodedToken = {
                email: 'test@example.com',
                uid: 'testUid',
                isPlatformAdmin: true,
            };
            auth.verifyIdToken.mockResolvedValue(decodedToken);

            AuthorizationRespository.prototype.getUserByEmail.mockResolvedValue({
                roles: ['admin'],
                permissions: ['read', 'write'],
                tenants: ['testTenantId'],
            });


            //console.log('request:', req);
            await verifyToken(req, res, next);

            expect(auth.verifyIdToken).toHaveBeenCalledWith('testToken');
            expect(req.user).toEqual({
                isPlatformAdmin: true,
                isTenantAdmin: false,
                uid: 'testUid',
                email: 'test@example.com',
                roles: ['admin'],
                permissions: ['read', 'write'],
                tenantId: 'testTenantId',
            });
            expect(next).toHaveBeenCalled();
        });

        it('should return 403 if the user doenst have access to given tenant', async () => {
            const decodedToken = {
                email: 'test@example.com',
                uid: 'testUid',
                isPlatformAdmin: true,
            };
            auth.verifyIdToken.mockResolvedValue(decodedToken);

            AuthorizationRespository.prototype.getUserByEmail.mockResolvedValue({
                roles: ['admin'],
                permissions: ['read', 'write'],
                tenants: ['testTenantId'],
            });

            req.headers['x-tenant-id'] = 'noaccess';
            //console.log('request:', req);
            await verifyToken(req, res, next);

            expect(auth.verifyIdToken).toHaveBeenCalledWith('testToken');
            expect(res.status).toHaveBeenCalledWith(403);
         
        });

        it('should return 403 if the user doesnt exists', async () => {
            const decodedToken = {
                email: 'test@example.com',
                uid: 'testUid',
                isPlatformAdmin: true,
            };
            auth.verifyIdToken.mockResolvedValue(decodedToken);

            AuthorizationRespository.prototype.getUserByEmail.mockResolvedValue(null);

            req.headers['x-tenant-id'] = 'testTenantId';
            await verifyToken(req, res, next);

            expect(auth.verifyIdToken).toHaveBeenCalledWith('testToken');
            expect(res.status).toHaveBeenCalledWith(403);

        });

        it('should return 403 if the user exists, but no tenants', async () => {
            const decodedToken = {
                email: 'test@example.com',
                uid: 'testUid',
                isPlatformAdmin: true,
            };
            auth.verifyIdToken.mockResolvedValue(decodedToken);

            AuthorizationRespository.prototype.getUserByEmail.mockResolvedValue({
                roles: ['admin'],
                permissions: ['read', 'write'],
            });

            req.headers['x-tenant-id'] = 'testTenantId';
            await verifyToken(req, res, next);

            expect(auth.verifyIdToken).toHaveBeenCalledWith('testToken');
            expect(res.status).toHaveBeenCalledWith(403);

        });


        it('should return 401 if token verification fails', async () => {
            auth.verifyIdToken.mockRejectedValue(new Error('Invalid token'));

            await verifyToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: new Error('Invalid token') });
        });
    });

    describe('requireRole', () => {
        it('should call next if user has the required role', () => {
            req.user = { roles: ['editor'] };

            const middleware = requireRole('editor');
            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return 403 if user does not have the required role', () => {
            req.user = { roles: ['viewer'] };

            const middleware = requireRole('editor');
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: "Role 'editor' required" });
        });
    });

    describe('requirePersmission', () => {
        it('should call next if user has the required permission', () => {
            req.user = { permissions: ['read'] };

            const middleware = requirePersmission('read');
            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return 403 if user does not have the required permission', () => {
            req.user = { permissions: ['write'] };

            const middleware = requirePersmission('read');
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: "permission 'read' required" });
        });
    });
});
