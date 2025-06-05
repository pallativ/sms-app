const { db } = require('../../firebaseSetup');
const AuthorizationRepository = require('../../src/repositories/authorization-repository');

describe('AuthorizationRepository Integration Tests', () => {
    const repository = new AuthorizationRepository();
    const testEmail = 'testuser@example.com';
    const testUserId = 'testUserId123';
    const testUser = {
        email: testEmail,
        userId: testUserId,
        roles: ['user'],
        tenants: ['tenant1'],
        permissions: ['read']
    };

    beforeAll(async () => {
        // Clean up any existing test data
        await repository.removeUser(testEmail);
    });

    afterAll(async () => {
        // Clean up test data after tests
        await repository.removeUser(testEmail);
    });

    test('addUser should add a user to the database', async () => {
        const addedUser = await repository.addUser(testUser);
        const fetchedUser = await repository.getUserByEmail(testEmail);

        expect(fetchedUser).toEqual(testUser);
    });

    test('getUserById should retrieve a user by userId', async () => {
        await repository.addUser(testUser);
        const fetchedUser = await repository.getUserById(testUserId);

        expect(fetchedUser).toEqual(testUser);
    });

    test('updateRoles should update user roles', async () => {
        await repository.addUser(testUser);
        const updatedRoles = ['user', 'admin'];
        const updatedUser = await repository.updateRoles(testEmail, ['admin']);

        expect(updatedUser.roles).toEqual(updatedRoles);
    });

    test('addTenant should add a tenant to the user', async () => {
        await repository.addUser(testUser);
        const updatedTenants = ['tenant1', 'tenant2'];
        const updatedUser = await repository.addTenant(testEmail, 'tenant2');

        expect(updatedUser.tenants).toEqual(updatedTenants);
    });

    test('removeTenant should remove a tenant from the user', async () => {
        await repository.addUser(testUser);
        await repository.addTenant(testEmail, 'tenant2');
        const updatedTenants = ['tenant1'];
        const updatedUser = await repository.removeTenant(testEmail, 'tenant2');

        expect(updatedUser.tenants).toEqual(updatedTenants);
    });

    test('updatePermissions should update user permissions', async () => {
        await repository.addUser(testUser);
        const updatedPermissions = ['read', 'write'];
        const updatedUser = await repository.updatePermissions(testEmail, ['write']);

        expect(updatedUser.permissions).toEqual(updatedPermissions);
    });

    test('removeUser should delete a user from the database', async () => {
        await repository.addUser(testUser);
        const removedUser = await repository.removeUser(testEmail);
        const fetchedUser = await repository.getUserByEmail(testEmail);

        expect(removedUser).toEqual(testUser);
        expect(fetchedUser).toBeNull();
    });

    test('getUserByEmail should return null for non-existent user', async () => {
        const fetchedUser = await repository.getUserByEmail('acd');
        expect(fetchedUser).toBeNull();
    });


    test('blockUser should block a user', async () => {
        await repository.addUser(testUser);
        await repository.blockUser(testEmail);
        const fetchedUser = await repository.getUserByEmail(testEmail);

        expect(fetchedUser.isBlocked).toBe(true);
    });

    test('unblockUser should unblock a user', async () => {
        await repository.addUser(testUser);
        await repository.blockUser(testEmail);
        let fetchedUser = await repository.getUserByEmail(testEmail);
        expect(fetchedUser.isBlocked).toBe(true);
        await repository.unblockUser(testEmail);
        fetchedUser = await repository.getUserByEmail(testEmail);

        expect(fetchedUser.isBlocked).toBe(false);
    });


    test('getAllUsers should retrieve all users from the database', async () => {
        const user1 = {
            email: 'user1@example.com',
            userId: 'userId1',
            roles: ['user'],
            tenants: ['tenant1'],
            permissions: ['read']
        };

        const user2 = {
            email: 'user2@example.com',
            userId: 'userId2',
            roles: ['admin'],
            tenants: ['tenant2'],
            permissions: ['write']
        };

        // Add test users
        await repository.addUser(user1);
        await repository.addUser(user2);

        const allUsers = await repository.getAllUsers();

        // Verify that both users are retrieved
        expect(allUsers).toEqual(
            expect.arrayContaining([
                expect.objectContaining(user1),
                expect.objectContaining(user2)
            ])
        );

        // Clean up test users
        await repository.removeUser(user1.email);
        await repository.removeUser(user2.email);
    });


    test('getUsersByTenant should retrieve users associated with a specific tenant', async () => {
        function generateRandomTenantId() {
            return `tenant_${Math.random().toString(36).substr(2, 9)}`;
        }

        const tenant = generateRandomTenantId();
        const tenant2 = generateRandomTenantId();

        const user1 = {
            email: 'user1@example.com',
            userId: 'userId1',
            roles: ['user'],
            tenants: [tenant],
            permissions: ['read']
        };

        const user2 = {
            email: 'user2@example.com',
            userId: 'userId2',
            roles: ['admin'],
            tenants: [tenant],
            permissions: ['write']
        };

        const user3 = {
            email: 'user3@example.com',
            userId: 'userId3',
            roles: ['user'],
            tenants: [tenant2], // Different tenant
            permissions: ['read']
        };

        // Clean up test users
        await repository.removeUser(user1.email);
        await repository.removeUser(user2.email);
        await repository.removeUser(user3.email);

        // Add test users
        await repository.addUser(user1);
        await repository.addUser(user2);
        await repository.addUser(user3);

        const usersByTenant = await repository.getUsersByTenant(tenant);
        //console.log(usersByTenant);

        // Verify that only users associated with the specified tenant are retrieved
        expect(usersByTenant).toEqual(
            expect.arrayContaining([
                expect.objectContaining(user1),
                expect.objectContaining(user2)
            ])
        );

        expect(usersByTenant).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining(user3)
            ])
        );

        // Verify that the count of users retrieved matches the expected count
        expect(usersByTenant.length).toBe(2);

        const usersByTenant2 = await repository.getUsersByTenant(tenant2);

        // Verify that only users associated with the specified tenant are retrieved
        expect(usersByTenant2).toEqual(
            expect.arrayContaining([
                expect.objectContaining(user3)
            ])
        );

        expect(usersByTenant2).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining(user1),
                expect.objectContaining(user2)
            ])
        );

        // Clean up test users
        await repository.removeUser(user1.email);
        await repository.removeUser(user2.email);
        await repository.removeUser(user3.email);
    });
});
