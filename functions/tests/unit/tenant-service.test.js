jest.mock('../../src/models/TenantModel', () => ({
    createTenant: jest.fn(),
    getAllTenants: jest.fn(),
    getTenantUsers: jest.fn(),
    assignUserToTenant: jest.fn(),
    setCustomClaimByName: jest.fn(),
    checkTenantExists: jest.fn(() => Promise.resolve(false)),
    getUserByEmail: jest.fn(() => Promise.resolve(null)),
    enableOrDisableUser: jest.fn(),
}));

jest.mock('../../firebaseSetup', () => ({
    auth: {
        getUserByEmail: jest.fn(),
        createUser: jest.fn(),
    },
}));
jest.mock('firebase-functions', () => ({
    logger: {
        debug: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('../../src/repositories/authorization-repository');

const { logger } = require('firebase-functions');
const { auth } = require('../../firebaseSetup');
const AuthorizationRepository = require('../../src/repositories/authorization-repository');
const tenantModel = require('../../src/models/TenantModel');

const tenantService = require('../../src/services/tenant-servce');

describe('Tenant Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createTenant', () => {
        it('should create a tenant and assign roles successfully - (New User)', async () => {
            expect("helloworld").toEqual("helloworld");
            const tenantDetails = { adminEmail: 'admin@example.com' };
            const tenantCode = 'tenant123';
            const userRecord = { uid: 'user123', email: 'admin@example.com' };
            const userInfo = {
                userId: userRecord.uid,
                email: userRecord.email,
                tenants: [tenantCode],
                roles: ['tenant-user'],
                permissions: ['all'],
            };

            tenantModel.createTenant.mockResolvedValue(tenantCode);
            auth.getUserByEmail.mockResolvedValue(null);
            auth.createUser.mockResolvedValue(userRecord);
            tenantModel.assignUserToTenant.mockResolvedValue();
            AuthorizationRepository.prototype.isValid.mockResolvedValue({ isValid: true, value: userInfo });
            AuthorizationRepository.prototype.addUser.mockResolvedValue();
            tenantModel.setCustomClaimByName.mockResolvedValue();

            const result = await tenantService.createTenant(tenantDetails);
            console.log("result:", result);
            expect(result).toEqual({ tenantCode, uid: userRecord.uid });
            expect(tenantModel.createTenant).toHaveBeenCalledWith(tenantDetails);
            expect(auth.createUser).toHaveBeenCalledWith({
                email: tenantDetails.adminEmail,
                password: 'Dhishakti@123',
                displayName: tenantDetails.adminEmail,
            });
            expect(tenantModel.assignUserToTenant).toHaveBeenCalledWith(tenantCode, userRecord.uid, userRecord.email);
            expect(AuthorizationRepository.prototype.isValid).toHaveBeenCalledWith(userInfo);
            expect(AuthorizationRepository.prototype.addUser).toHaveBeenCalledWith(userInfo);
            expect(tenantModel.setCustomClaimByName).toHaveBeenCalledWith(userRecord.uid, 'tenantCode', [tenantCode]);
            expect(tenantModel.setCustomClaimByName).toHaveBeenCalledWith(userRecord.uid, 'roles', ['tenant-user']);
        });

        it('should create a tenant and assign roles successfully - (Existing User)', async () => {
            expect("helloworld").toEqual("helloworld");
            const tenantDetails = { adminEmail: 'admin@example.com' };
            const tenantCode = 'tenant123';
            const userRecord = { uid: 'user123', email: 'admin@example.com' };
            const userInfo = {
                userId: userRecord.uid,
                email: userRecord.email,
                tenants: [tenantCode],
                roles: ['tenant-user'],
                permissions: ['all'],
            };

            tenantModel.createTenant.mockResolvedValue(tenantCode);
            tenantModel.getUserByEmail.mockResolvedValue(userRecord);
            auth.createUser.mockResolvedValue(userRecord);
            tenantModel.assignUserToTenant.mockResolvedValue();
            AuthorizationRepository.prototype.isValid.mockResolvedValue({ isValid: true, value: userInfo });
            AuthorizationRepository.prototype.addUser.mockResolvedValue();
            tenantModel.setCustomClaimByName.mockResolvedValue();

            const result = await tenantService.createTenant(tenantDetails);
            //console.log("result:", result);
            expect(result).toEqual({ tenantCode, uid: userRecord.uid });
            expect(tenantModel.createTenant).toHaveBeenCalledWith(tenantDetails);
            expect(tenantModel.assignUserToTenant).toHaveBeenCalledWith(tenantCode, userRecord.uid, userRecord.email);
            expect(AuthorizationRepository.prototype.isValid).toHaveBeenCalledWith(userInfo);
            expect(AuthorizationRepository.prototype.addUser).toHaveBeenCalledWith(userInfo);
            expect(auth.createUser).not.toHaveBeenCalled()
            expect(tenantModel.setCustomClaimByName).toHaveBeenCalledWith(userRecord.uid, 'tenantCode', [tenantCode]);
            expect(tenantModel.setCustomClaimByName).toHaveBeenCalledWith(userRecord.uid, 'roles', ['tenant-user']);
        });

        it('should create a tenant and assign roles successfully - (Existing User)', async () => {
            expect("helloworld").toEqual("helloworld");
            const tenantDetails = { adminEmail: 'admin@example.com' };
            const tenantCode = 'tenant123';
            const userRecord = { uid: 'user123', email: 'admin@example.com' };
            const userInfo = {
                userId: userRecord.uid,
                email: userRecord.email,
                tenants: [tenantCode],
                roles: ['tenant-user'],
                permissions: ['all'],
            };

            tenantModel.createTenant.mockResolvedValue(tenantCode);
            auth.getUserByEmail.mockResolvedValue(userRecord);
            auth.createUser.mockResolvedValue(userRecord);
            tenantModel.assignUserToTenant.mockResolvedValue();
            AuthorizationRepository.prototype.isValid.mockResolvedValue({ isValid: true, value: userInfo });
            AuthorizationRepository.prototype.addUser.mockResolvedValue();
            tenantModel.setCustomClaimByName.mockResolvedValue();

            const result = await tenantService.createTenant(tenantDetails);
            console.log("result:", result);
            expect(result).toEqual({ tenantCode, uid: userRecord.uid });
            expect(tenantModel.createTenant).toHaveBeenCalledWith(tenantDetails);
            expect(tenantModel.assignUserToTenant).toHaveBeenCalledWith(tenantCode, userRecord.uid, userRecord.email);
            expect(AuthorizationRepository.prototype.isValid).toHaveBeenCalledWith(userInfo);
            expect(AuthorizationRepository.prototype.addUser).toHaveBeenCalledWith(userInfo);
            expect(auth.createUser).not.toHaveBeenCalled()
            expect(tenantModel.setCustomClaimByName).toHaveBeenCalledWith(userRecord.uid, 'tenantCode', [tenantCode]);
            expect(tenantModel.setCustomClaimByName).toHaveBeenCalledWith(userRecord.uid, 'roles', ['tenant-user']);
        });


        it('should throw an error if tenant creation fails', async () => {
            const tenantDetails = { adminEmail: 'admin@example.com' };
            tenantModel.createTenant.mockRejectedValue(new Error('Database error'));

            await expect(tenantService.createTenant(tenantDetails)).rejects.toThrow('Error in creating the tenant');
            expect(logger.error).toHaveBeenCalledWith('Error in creating the tenant', expect.any(Error));
        });

    });

    describe('getAllTenants', () => {
        it('should retrieve all tenants successfully', async () => {
            const tenants = [{ tenantCode: 'tenant1' }, { tenantCode: 'tenant2' }];
            tenantModel.getAllTenants.mockResolvedValue(tenants);

            const result = await tenantService.getAllTenants();

            expect(result).toEqual(tenants);
            expect(tenantModel.getAllTenants).toHaveBeenCalled();
        });

        it('should throw an error if retrieving tenants fails', async () => {
            tenantModel.getAllTenants.mockRejectedValue(new Error('Database error'));

            await expect(tenantService.getAllTenants()).rejects.toThrow('Error in retrieving all tenants');
            expect(logger.error).toHaveBeenCalledWith('Error in retrieving all tenants', expect.any(Error));
        });
    });

    describe('getUsersByTenant', () => {
        it('should retrieve users by tenant successfully', async () => {
            const tenantCode = 'tenant123';
            const users = [{ uid: 'user1' }, { uid: 'user2' }];
            tenantModel.getTenantUsers.mockResolvedValue(users);

            const result = await tenantService.getTenantUsers(tenantCode);

            expect(result).toEqual(users);
            expect(tenantModel.getTenantUsers).toHaveBeenCalledWith(tenantCode);
        });

        it('should throw an error if retrieving users fails', async () => {
            const tenantCode = 'tenant123';
            tenantModel.getTenantUsers.mockRejectedValue(new Error('Database error'));

            await expect(tenantService.getTenantUsers(tenantCode)).rejects.toThrow('Error in retrieving users by tenant');
            expect(logger.error).toHaveBeenCalledWith('Error in retrieving users by tenant', expect.any(Error));
        });
    });

    //describe('impersonateSuperAdmin', () => {
    //    it('should impersonate super admin successfully', async () => {
    //        const userInfo = { uid: 'user123' };
    //        const tenantCode = 'tenant123';
    //        tenantModel.setCustomClaimByName.mockResolvedValue();

    //        const result = await tenantService.impersonateSuperAdmin(userInfo, tenantCode);

    //        expect(result).toEqual({ message: 'Impersonation successful', uid: userInfo.uid });
    //        expect(tenantModel.setCustomClaimByName).toHaveBeenCalledWith(userInfo.uid, 'tenantCode', [tenantCode]);
    //    });

    //    it('should throw an error if impersonation fails', async () => {
    //        const userInfo = { uid: 'user123' };
    //        const tenantCode = 'tenant123';
    //        tenantModel.setCustomClaimByName.mockRejectedValue(new Error('Database error'));

    //        await expect(tenantService.impersonateSuperAdmin(userInfo, tenantCode)).rejects.toThrow('Error in impersonating tenant admin');
    //        expect(logger.error).toHaveBeenCalledWith('Error in impersonating tenant admin', expect.any(Error));
    //    });
    //});
});
