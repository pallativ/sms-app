const request = require('supertest');
const express = require('express');
const { auth } = require('../../firebaseSetup');
const TenantRoutes = require('../../src/routes/TenantRoutes');
const TenantModel = require('../../src/models/TenantModel');
const app = express();
app.use(express.json());
app.use('/tenants', TenantRoutes);


async function getIdToken(uid, claims = {}) {
    // Create a custom token
    const customToken = await auth.createCustomToken(uid, claims);

    // Exchange custom token for ID token (simulate sign in)
    const response = await fetch('http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=fake-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            token: customToken,
            returnSecureToken: true,
        }),
    });

    const data = await response.json();
    return data.idToken; // ✅ Firebase Auth ID Token
}
function generateRandomEmail() {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `user_${randomString}@example.com`;
}
function generateRandomTenantCode() {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TENANT_${randomString}`;
}

describe('Verifying TenantRoutes', () => {
    let tenantCode, email;
    const tenantAdminEmail = 'sample@sample.com';
    let usersToDelete = [];
    let tenantsToDelete = [];
    let userRolesToDelete = [];
    const user = {
        email: email,
        password: "Dhishakti@123",
        displayName: email,
    };

    deleteUsers = async () => {
        for (const user of usersToDelete) {
            await auth.deleteUser(user.uid);
        }
    }

    deleteTenants = async () => {

    }

    beforeAll(async () => {
        // Initialize Firebase Admin SDK or any other setup required
        console.log("Setup completed before running tests.");
    });

    afterAll(async () => {
        await deleteUsers();
        await deleteTenants();
        console.log("Tear down.");
    });
    it("create a tenant using platform admin", async () => {
        // Example usage:
        tenantCode = generateRandomTenantCode();
        //console.log("Generated Tenant Code:", tenantCode);

        email = generateRandomEmail();
        let new_user = await auth.createUser(user);
        usersToDelete.push(new_user);
        //console.log("User created:", new_user);
        const idToken = await getIdToken(new_user.uid, { "isPlatformAdmin": true });
        //console.log("Custom Token:", idToken);
        const response = await request(app).post('/tenants')
            .set('Authorization', `Bearer ${idToken}`)
            .send({ name: tenantCode, code: tenantCode, "adminEmail": tenantAdminEmail });
        //console.log("Response:", response.body);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Tenant created successfully.");

        // Fetching the tenants and see if there is a record for the same.

        // Fetch tenants with a filter for the specific name
        const getResponse = await request(app).get(`/tenants`)
            .set('Authorization', `Bearer ${idToken}`);
        expect(getResponse.status).toBe(200);

        //console.log(getResponse.body);
        // Check if the response contains the tenant with the given name
        const tenants = getResponse.body.tenants;
        const tenantExists = tenants.some(tenant => tenant.code === tenantCode);
        expect(tenantExists).toBe(true);

        // Fetch users for the specific tenant
        const getUsersResponse = await request(app).get(`/tenants/${tenantCode}/users`)
            .set('Authorization', `Bearer ${idToken}`);
        expect(getUsersResponse.status).toBe(200);

        // Check if the response contains users for the tenant
        /*console.log("Users in tenant:", getUsersResponse.body.users);*/
        const users = getUsersResponse.body.users;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);

        // Optionally, verify if the admin email exists in the users list
        const adminExists = users.some(user => user.email === tenantAdminEmail);
        expect(adminExists).toBe(true);
    });

});

describe('Multiple Users to a tenant', () => {
    let idToken;
    const platformAdminEmail = generateRandomEmail();
    let usersToDelete = [];

    deleteUsers = async () => {
        for (const user of usersToDelete) {
            await auth.deleteUser(user.uid);
        }
    }

    beforeAll(async () => {
        const user = {
            email: platformAdminEmail,
            password: "Dhishakti@123",
            displayName: platformAdminEmail,
        };

        let new_user = await auth.createUser(user);
        TenantModel.setCustomClaimByName(new_user.uid, "isPlatformAdmin", true);
        //usersToDelete.push(new_user);
        //console.log("User created:", new_user);
        idToken = await getIdToken(new_user.uid, { "isPlatformAdmin": true });
    })

    afterAll(async () => {
        await deleteUsers();
    })

    it("add mutiple users to a tenant", async () => {
        const user1_email = "1@gmail.com";
        const user2_email = "2@gmail.com";
        const user3_email = "3@gmail.com";
        console.log("User Emails:", user1_email, user2_email, user3_email);
        var tenantCode = generateRandomTenantCode();
        const create_tenant_response = await request(app).post('/tenants')
            .set('Authorization', `Bearer ${idToken}`)
            .send({ name: tenantCode, code: tenantCode, "adminEmail": user1_email });

        expect(create_tenant_response.status).toBe(201);

        const assign_user2_response = await request(app).post(`/tenants/assign-user`)
            .set('Authorization', `Bearer ${idToken}`)
            .send({ tenantCode: tenantCode, "userEmail": user2_email });
        //console.log("Assign User 2 Response:", assign_user2_response.body);
        expect(assign_user2_response.status).toBe(200);

        const assign_user3_response = await request(app).post(`/tenants/assign-user`)
            .set('Authorization', `Bearer ${idToken}`)
            .send({ tenantCode: tenantCode, "userEmail": user3_email });

        //console.log("Assign User Response:", assign_user3_response.body);

        //// Fetch users for the specific tenant
        const getUsersResponse = await request(app).get(`/tenants/${tenantCode}/users`)
            .set('Authorization', `Bearer ${idToken}`);
        expect(getUsersResponse.status).toBe(200);

        //// Check if the response contains users for the tenant
        ///*console.log("Users in tenant:", getUsersResponse.body.users);*/
        const users = getUsersResponse.body.users;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toEqual(3);
    })
    it("should return all tenants that user has access", async () => {
        const user1_email = generateRandomEmail();
        var tenant1_code = generateRandomTenantCode();

        // creating a tenant with user1_email as admin.
        const create_tenant1_response = await request(app).post('/tenants')
            .set('Authorization', `Bearer ${idToken}`)
            .send({ name: tenant1_code, code: tenant1_code, "adminEmail": user1_email });

        expect(create_tenant1_response.status).toBe(201);

        // Creatg another tenant with the same user.
        var tenant2_code = generateRandomTenantCode();
        const create_tenant2_response = await request(app).post('/tenants')
            .set('Authorization', `Bearer ${idToken}`)
            .send({ name: tenant2_code, code: tenant2_code, "adminEmail": user1_email });
        expect(create_tenant2_response.status).toBe(201);

        var tenant_user = await auth.getUserByEmail(user1_email);
        var tenant_user_id_token = await getIdToken(tenant_user.uid, {});
        expect(tenant_user_id_token).toBeDefined();
        const get_tenants_assigned_to_user = await request(app).get('/tenants/get-user-tenants')
            .set('Authorization', `Bearer ${tenant_user_id_token}`);
        //console.log("Get User Tenants Response:", get_tenants_assigned_to_user.body);
        expect(get_tenants_assigned_to_user.status).toBe(200);
        const tenants = get_tenants_assigned_to_user.body.tenants;
        //console.log("Fetched Tenants:", tenants);

        expect(Array.isArray(tenants)).toBe(true);
        expect(tenants.length).toBe(2);
        expect(tenants.some(t => t.code === tenant1_code)).toBe(true);
        expect(tenants.some(t => t.code === tenant2_code)).toBe(true);
    })

});
